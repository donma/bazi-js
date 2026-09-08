// 藏干解析模組

import { getHiddenStems } from '../core/constants/hidden-stems-data.js';

export function calculateChartHiddenStems(pillars) {
  return {
    year: getHiddenStems(pillars.year.branch),
    month: getHiddenStems(pillars.month.branch),
    day: getHiddenStems(pillars.day.branch),
    hour: pillars.hour.available ? getHiddenStems(pillars.hour.branch) : []
  };
}
