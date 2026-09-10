// 時間運勢引擎（Transit Engine - 流年、流月、流日、流時）
// 統一 API：
// Transit.calculate(chart, { datetime: "2026-09-08T12:00:00+08:00" })
// 輸出：
// - year (流年)
// - month (流月)
// - day (流日)
// - hour (流時)
// - interactions (流運與原局四柱之刑沖會合)
// - shenSha (流運觸發之神煞)

import { calculateFourPillars } from '../chart/chart.js';
import { parseTimezoneOffset } from '../core/utils/validation.js';
import { BaziValidationError } from '../core/errors/index.js';
import { solarToLunar } from '../calendar/lunar.js';
import { getTenGod } from '../core/constants/ten-gods-data.js';
import { getNayin } from '../core/constants/nayin-data.js';
import { getTwelveStage } from '../core/constants/twelve-stages-data.js';
import { TRANSIT_GRAPH_VERSION as VERSIONED_TRANSIT_GRAPH_VERSION } from '../rules/versions.js';

const PILLAR_LABELS = Object.freeze({
  year: '年',
  month: '月',
  day: '日',
  hour: '時'
});

export const TRANSIT_GRAPH_VERSION = VERSIONED_TRANSIT_GRAPH_VERSION;

function formatPillarLabel(pillar) {
  return PILLAR_LABELS[pillar] || pillar || '—';
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function parseTransitDatetime(value) {
  if (value instanceof Date && Number.isNaN(value.getTime())) {
    throw new BaziValidationError('Transit datetime 的 Date 無效', 'datetime');
  }
  const dtStr = value instanceof Date ? value.toISOString() : (value || new Date().toISOString());
  if (typeof dtStr !== 'string') {
    throw new BaziValidationError('Transit datetime 必須是 ISO 日期字串或 Date', 'datetime');
  }

  const match = dtStr.match(/^(\d{4})-(\d{2})-(\d{2})(?:T|\s)(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{1,2}(?::?\d{2})?)?$/);
  if (!match) {
    throw new BaziValidationError('Transit datetime 格式不正確，請使用 YYYY-MM-DDTHH:mm[:ss](Z 或 ±HH:mm)', 'datetime');
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month) || hour > 23 || minute > 59) {
    throw new BaziValidationError('Transit datetime 包含無效日期或時間', 'datetime');
  }

  const suffix = match[6];
  const timezoneOffsetHours = suffix === 'Z' ? 0 : (suffix ? parseTimezoneOffset(suffix) : 8);
  return {
    datePart: `${match[1]}-${match[2]}-${match[3]}`,
    timePart: `${match[4]}:${match[5]}`,
    year,
    month,
    day,
    hour,
    minute,
    timezoneOffsetHours,
    input: dtStr
  };
}

export function calculateTransit(chartPillars, options = {}) {
  const parsed = parseTransitDatetime(options.datetime);
  const { datePart, timePart, year: y, month: m, day: d, hour: hh, minute: mm, timezoneOffsetHours } = parsed;
  const yearBoundary = options.yearBoundary || 'lichun';
  const monthBoundary = options.monthBoundary || 'jie';
  const dayBoundary = options.dayBoundary || '23:00';
  const needsLunarBoundary = yearBoundary === 'lunar_new_year' || monthBoundary === 'lunar_month';
  // 大運逐年資料會固定取每年的年中時刻。呼叫端若已知該年必在
  // 農曆正月初一之後，可傳入 lunarYear，避免為超出農曆資料範圍的
  // 年份重新做 solarToLunar（例如 2101 年的年中流年）。
  const lunarInfo = needsLunarBoundary
    ? (Number.isInteger(options.lunarYear)
      ? {
          year: options.lunarYear,
          month: Number.isInteger(options.lunarMonth) ? options.lunarMonth : null
        }
      : solarToLunar(y, m, d))
    : null;

  // 以核心排盤計算目標時間點的四柱（即該時刻的流年、流月、流日、流時）
  const transitPillars = calculateFourPillars({
    year: y,
    month: m,
    day: d,
    hour: hh,
    minute: mm,
    birthTimeMode: 'exact',
    timezoneOffsetHours,
    yearBoundary,
    monthBoundary,
    lunarYear: lunarInfo ? lunarInfo.year : null,
    lunarMonth: lunarInfo ? lunarInfo.month : null,
    dayBoundary
  });

  const dayMaster = chartPillars.day.stem;

  const enrichTransitPillar = (p) => ({
    ganzhi: p.ganzhi,
    stem: p.stem,
    branch: p.branch,
    sexagenaryIndex: p.sexagenaryIndex,
    tenGod: getTenGod(dayMaster, p.stem),
    stage: getTwelveStage(dayMaster, p.branch),
    nayin: getNayin(p.sexagenaryIndex)
  });

  const yearTransit = enrichTransitPillar(transitPillars.year);
  const monthTransit = enrichTransitPillar(transitPillars.month);
  const dayTransit = enrichTransitPillar(transitPillars.day);
  const hourTransit = enrichTransitPillar(transitPillars.hour);

  // 跨盤互動：流年地支與原局四柱地支的合、沖
  const interactions = [];
  const natalBranches = [
    { pillar: 'year', branch: chartPillars.year.branch },
    { pillar: 'month', branch: chartPillars.month.branch },
    { pillar: 'day', branch: chartPillars.day.branch },
    ...(chartPillars.hour.available ? [{ pillar: 'hour', branch: chartPillars.hour.branch }] : [])
  ];

  const CLASH_MAP = {
    '子': '午', '午': '子', '丑': '未', '未': '丑',
    '寅': '申', '申': '寅', '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳'
  };

  const HE_MAP = {
    '子': '丑', '丑': '子', '寅': '亥', '亥': '寅',
    '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰',
    '巳': '申', '申': '巳', '午': '未', '未': '午'
  };

  for (const natal of natalBranches) {
    if (CLASH_MAP[yearTransit.branch] === natal.branch) {
      interactions.push({
        type: 'transit_clash',
        target: 'year',
        natalPillar: natal.pillar,
        natalPillarLabel: `${formatPillarLabel(natal.pillar)}柱`,
        transitBranch: yearTransit.branch,
        natalBranch: natal.branch,
        description: `流年支【${yearTransit.branch}】沖原局${formatPillarLabel(natal.pillar)}支【${natal.branch}】`
      });
    }
    if (HE_MAP[yearTransit.branch] === natal.branch) {
      interactions.push({
        type: 'transit_combine',
        target: 'year',
        natalPillar: natal.pillar,
        natalPillarLabel: `${formatPillarLabel(natal.pillar)}柱`,
        transitBranch: yearTransit.branch,
        natalBranch: natal.branch,
        description: `流年支【${yearTransit.branch}】合原局${formatPillarLabel(natal.pillar)}支【${natal.branch}】`
      });
    }
  }

  return {
    targetDatetime: `${datePart} ${timePart}`,
    timezoneOffsetHours,
    ruleBasis: { yearBoundary, monthBoundary, dayBoundary },
    year: yearTransit,
    month: monthTransit,
    day: dayTransit,
    hour: hourTransit,
    interactions
  };
}

/**
 * 建立原局、 大運與流年／月／日／時的關係圖資料。
 * 目前只把已觀測到的跨層互動寫成 edge；沒有互動不補上推測性吉凶。
 */
export function buildTransitGraph({ pillars = null, luckCycles = null, transits = null } = {}) {
  const nodes = [];
  const edges = [];
  const events = [];
  const addNode = (id, layer, value, extra = {}) => {
    if (!value) return;
    nodes.push({ id, layer, ...value, ...extra });
  };

  for (const key of ['year', 'month', 'day', 'hour']) {
    const pillar = pillars?.[key];
    if (pillar?.available === false || !pillar?.ganzhi) continue;
    addNode(`natal-${key}`, 'natal', {
      pillar: key,
      ganzhi: pillar.ganzhi,
      stem: pillar.stem,
      branch: pillar.branch
    });
  }

  const targetYear = Number(String(transits?.targetDatetime || '').slice(0, 4));
  const activeLuck = Number.isInteger(targetYear)
    ? (luckCycles?.cycles || []).find((cycle) => targetYear >= cycle.fromYear && targetYear <= cycle.toYear) || null
    : null;
  if (activeLuck) {
    edges.push({
      id: `edge-${edges.length + 1}`,
      source: `luck-${activeLuck.step}`,
      target: 'transit-year',
      type: 'active-luck-cycle',
      status: 'observed',
      description: `目標年份 ${targetYear} 落在第 ${activeLuck.step} 步大運（${activeLuck.ganzhi}）`,
      evidence: {
        matched: true,
        targetYear,
        fromYear: activeLuck.fromYear,
        toYear: activeLuck.toYear
      }
    });
  }

  const timelinePairs = [['year', 'month'], ['month', 'day'], ['day', 'hour']];
  for (const [parent, child] of timelinePairs) {
    if (!transits?.[parent]?.ganzhi || !transits?.[child]?.ganzhi) continue;
    edges.push({
      id: `edge-${edges.length + 1}`,
      source: `transit-${parent}`,
      target: `transit-${child}`,
      type: 'transit-time-containment',
      status: 'structural',
      description: `${formatPillarLabel(parent)}運包含${formatPillarLabel(child)}運`,
      evidence: { matched: true, targetDatetime: transits.targetDatetime }
    });
  }
  for (const cycle of luckCycles?.cycles || []) {
    addNode(`luck-${cycle.step}`, 'luck', {
      step: cycle.step,
      ganzhi: cycle.ganzhi,
      stem: cycle.stem,
      branch: cycle.branch,
      fromYear: cycle.fromYear,
      toYear: cycle.toYear
    });
  }
  for (const key of ['year', 'month', 'day', 'hour']) {
    const transit = transits?.[key];
    if (!transit?.ganzhi) continue;
    addNode(`transit-${key}`, key === 'year' ? 'transit-year' : `transit-${key}`, {
      pillar: key,
      ganzhi: transit.ganzhi,
      stem: transit.stem,
      branch: transit.branch
    });
  }

  for (const interaction of transits?.interactions || []) {
    const targetId = interaction.natalPillar ? `natal-${interaction.natalPillar}` : null;
    const sourceId = interaction.target ? `transit-${interaction.target}` : null;
    if (!sourceId || !targetId) continue;
    edges.push({
      id: `edge-${edges.length + 1}`,
      source: sourceId,
      target: targetId,
      type: interaction.type,
      status: 'observed',
      description: interaction.description,
      evidence: {
        matched: true,
        source: 'transits.interactions',
        transitBranch: interaction.transitBranch,
        natalBranch: interaction.natalBranch
      }
    });
  }

  const STEM_CLASH_MAP = {
    甲: '庚', 乙: '辛', 丙: '壬', 丁: '癸',
    庚: '甲', 辛: '乙', 壬: '丙', 癸: '丁'
  };
  const BRANCH_CLASH_MAP = {
    子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅',
    卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳'
  };
  const inspectStructuralEvents = (sourceId, targetId, source, target, scope) => {
    if (!source || !target) return;
    if (source.ganzhi === target.ganzhi) {
      events.push({
        id: `event-${events.length + 1}`,
        type: scope === 'luck-transit-year' ? '歲運並臨' : '伏吟',
        status: 'observed',
        source: sourceId,
        target: targetId,
        evidence: {
          matched: true,
          sourceGanzhi: source.ganzhi,
          targetGanzhi: target.ganzhi,
          scope
        }
      });
    }
    if (STEM_CLASH_MAP[source.stem] === target.stem && BRANCH_CLASH_MAP[source.branch] === target.branch) {
      events.push({
        id: `event-${events.length + 1}`,
        type: '天剋地沖',
        status: 'observed',
        source: sourceId,
        target: targetId,
        evidence: {
          matched: true,
          sourceStem: source.stem,
          targetStem: target.stem,
          sourceBranch: source.branch,
          targetBranch: target.branch,
          scope
        }
      });
    }
  };

  for (const key of ['year', 'month', 'day', 'hour']) {
    inspectStructuralEvents(`transit-${key}`, `natal-${key}`, transits?.[key], pillars?.[key], `transit-natal-${key}`);
  }
  if (activeLuck) inspectStructuralEvents(`luck-${activeLuck.step}`, 'transit-year', activeLuck, transits?.year, 'luck-transit-year');

  return {
    modelId: 'transit-multi-layer-graph',
    version: TRANSIT_GRAPH_VERSION,
    layers: ['natal', 'luck', 'transit-year', 'transit-month', 'transit-day', 'transit-hour'],
    activeLuck: activeLuck ? { step: activeLuck.step, ganzhi: activeLuck.ganzhi, fromYear: activeLuck.fromYear, toYear: activeLuck.toYear } : null,
    nodes,
    edges,
    events,
    evidence: {
      matched: true,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      eventCount: events.length,
      note: '圖只收錄已計算的柱位、時間層連線與結構事件；未將事件自動解讀為吉凶。'
    }
  };
}
