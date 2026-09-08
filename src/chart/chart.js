// 四柱排盤匯流引擎
// 彙整年、月、日、時四柱，並產出完整四柱基礎物件

import { calculateYearPillar } from './year-pillar.js';
import { calculateMonthPillar } from './month-pillar.js';
import { calculateDayPillar } from './day-pillar.js';
import { calculateHourPillar } from './hour-pillar.js';

export function calculateFourPillars({
  year,
  month,
  day,
  hour,
  minute = 0,
  birthTimeMode = 'exact',
  birthHourBranch = null,
  timezoneOffsetHours = 8,
  yearBoundary = 'lichun',
  monthBoundary = 'jie',
  lunarYear = null,
  lunarMonth = null,
  dayBoundary = '23:00'
}) {
  const debug = {
    yearPillarTrace: [],
    monthPillarTrace: [],
    dayPillarTrace: [],
    hourPillarTrace: []
  };

  // 1. 年柱
  const yearPillar = calculateYearPillar({
    year,
    month,
    day,
    hour: birthTimeMode === 'exact' ? (hour ?? 12) : 12,
    minute: birthTimeMode === 'exact' ? minute : 0,
    timezoneOffsetHours,
    yearBoundary,
    lunarYear
  });
  debug.yearPillarTrace = yearPillar.trace;

  // 2. 月柱（依年干五虎遁 + 節氣切月）
  const monthPillar = calculateMonthPillar({
    year,
    month,
    day,
    hour: birthTimeMode === 'exact' ? (hour ?? 12) : 12,
    minute: birthTimeMode === 'exact' ? minute : 0,
    timezoneOffsetHours,
    yearStemChar: yearPillar.stem,
    monthBoundary,
    lunarMonth
  });
  debug.monthPillarTrace = monthPillar.trace;

  // 3. 日柱（考慮 23:00 換日）
  const dayPillar = calculateDayPillar({
    year,
    month,
    day,
    hour: birthTimeMode === 'exact' ? (hour ?? 12) : 12,
    minute: birthTimeMode === 'exact' ? minute : 0,
    dayBoundary
  });
  debug.dayPillarTrace = dayPillar.trace;

  // 4. 時柱（依日干五鼠遁）
  const hourPillar = calculateHourPillar({
    mode: birthTimeMode,
    hour,
    minute,
    branchChar: birthHourBranch,
    dayStemChar: dayPillar.stem
  });
  debug.hourPillarTrace = hourPillar.trace;

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    debug
  };
}
