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

const PILLAR_LABELS = Object.freeze({
  year: '年',
  month: '月',
  day: '日',
  hour: '時'
});

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
