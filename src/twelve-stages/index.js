// 十二長生歷程計算模組
// 計算：
// 1. 各柱天干坐自身地支之長生狀態（坐支長生）
// 2. 日主對應四柱地支之長生狀態（日主長生運）

import { getTwelveStage } from '../core/constants/twelve-stages-data.js';

export function calculateChartTwelveStages(pillars) {
  const dayMaster = pillars.day.stem;

  // 日主對應各柱地支長生
  const byDayMaster = {
    year: getTwelveStage(dayMaster, pillars.year.branch),
    month: getTwelveStage(dayMaster, pillars.month.branch),
    day: getTwelveStage(dayMaster, pillars.day.branch),
    hour: pillars.hour.available ? getTwelveStage(dayMaster, pillars.hour.branch) : null
  };

  // 各柱天干坐地支之自坐長生
  const selfSeated = {
    year: getTwelveStage(pillars.year.stem, pillars.year.branch),
    month: getTwelveStage(pillars.month.stem, pillars.month.branch),
    day: getTwelveStage(pillars.day.stem, pillars.day.branch),
    hour: pillars.hour.available ? getTwelveStage(pillars.hour.stem, pillars.hour.branch) : null
  };

  return {
    byDayMaster,
    selfSeated
  };
}
