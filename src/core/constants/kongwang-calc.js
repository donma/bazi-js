// 空亡計算模組
// 計算日柱旬空（最主要）與年柱旬空

import { getKongWang } from './kongwang-data.js';

export function calculateChartKongWang(pillars) {
  const dayKong = getKongWang(pillars.day.sexagenaryIndex);
  const yearKong = getKongWang(pillars.year.sexagenaryIndex);

  // 檢查四柱中哪些地支落入空亡
  const checkHits = (kongList) => ({
    year: kongList.includes(pillars.year.branch),
    month: kongList.includes(pillars.month.branch),
    day: kongList.includes(pillars.day.branch),
    hour: pillars.hour.available ? kongList.includes(pillars.hour.branch) : false
  });

  return {
    byDay: {
      branches: dayKong,
      hits: checkHits(dayKong)
    },
    byYear: {
      branches: yearKong,
      hits: checkHits(yearKong)
    }
  };
}
