// 納音計算模組

import { getNayin } from '../core/constants/nayin-data.js';

export function calculateChartNayin(pillars) {
  return {
    year: getNayin(pillars.year.sexagenaryIndex),
    month: getNayin(pillars.month.sexagenaryIndex),
    day: getNayin(pillars.day.sexagenaryIndex),
    hour: pillars.hour.available ? getNayin(pillars.hour.sexagenaryIndex) : null
  };
}
