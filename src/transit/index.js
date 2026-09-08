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
import { getTenGod } from '../core/constants/ten-gods-data.js';
import { getNayin } from '../core/constants/nayin-data.js';
import { getTwelveStage } from '../core/constants/twelve-stages-data.js';

export function calculateTransit(chartPillars, options = {}) {
  // 解析目標時間
  let dtStr = options.datetime || new Date().toISOString();
  // 支援格式如 "2026-09-08T12:00:00+08:00" 或 "2026-09-08 12:00"
  let datePart = '2026-09-08';
  let timePart = '12:00';
  let timezoneOffsetHours = 8;

  if (dtStr.includes('T')) {
    const parts = dtStr.split('T');
    datePart = parts[0];
    const timeMatch = parts[1].match(/^(\d{2}:\d{2})/);
    if (timeMatch) timePart = timeMatch[1];
    if (parts[1].includes('+')) {
      const tzPart = parts[1].split('+')[1];
      timezoneOffsetHours = Number(tzPart.split(':')[0]);
    }
  } else {
    const parts = dtStr.split(' ');
    datePart = parts[0];
    if (parts[1]) timePart = parts[1].slice(0, 5);
  }

  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm] = timePart.split(':').map(Number);

  // 以核心排盤計算目標時間點的四柱（即該時刻的流年、流月、流日、流時）
  const transitPillars = calculateFourPillars({
    year: y,
    month: m,
    day: d,
    hour: hh,
    minute: mm,
    birthTimeMode: 'exact',
    timezoneOffsetHours,
    yearBoundary: 'lichun',
    monthBoundary: 'jie',
    dayBoundary: '23:00'
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
        transitBranch: yearTransit.branch,
        natalBranch: natal.branch,
        description: `流年支【${yearTransit.branch}】沖原局${natal.pillar}支【${natal.branch}】`
      });
    }
    if (HE_MAP[yearTransit.branch] === natal.branch) {
      interactions.push({
        type: 'transit_combine',
        target: 'year',
        natalPillar: natal.pillar,
        transitBranch: yearTransit.branch,
        natalBranch: natal.branch,
        description: `流年支【${yearTransit.branch}】合原局${natal.pillar}支【${natal.branch}】`
      });
    }
  }

  return {
    targetDatetime: `${datePart} ${timePart}`,
    year: yearTransit,
    month: monthTransit,
    day: dayTransit,
    hour: hourTransit,
    interactions
  };
}
