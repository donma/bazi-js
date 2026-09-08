// 日柱計算模組
// 支援日柱換日流派：
// 1. "23:00"（canonical 預設）：子初換日。夜間 23:00 之後歸屬次日干支。
// 2. "00:00"：民用午夜換日。23:00~23:59 仍歸屬當日（夜子時歸當日，早子時歸次日）。
//
// 基準校核點（已由三個獨立萬年曆來源交叉驗證）：
// 2000-01-01 = 戊午日（干支序 54）；1900-01-01 = 甲戌日（序 10）；2024-01-01 = 甲子日（序 0）。
// JDN 取法：jdn = Math.floor(jdMidnight + 0.5)，其中 jdMidnight 為當日 0h(UT) 的 JD。
// 2000-01-01：jdMidnight = 2451544.5，jdn = 2451545，2451545 % 60 = 5。
// 要使 (5 + X) % 60 = 54 => X = 49。
// 驗算：(2451545 + 49) % 60 = 2451594 % 60 = 54 (戊午) -> 正確！
// 驗算：1900-01-01 jdn = 2415021，2415021 % 60 = 21，(21 + 49) % 60 = 10 (甲戌) -> 正確！
// 驗算：2024-01-01 jdn = 2460311，2460311 % 60 = 11，(11 + 49) % 60 = 0 (甲子) -> 正確！

import { stemAt, sexagenaryStemBranch, sexagenaryIndex } from '../core/constants/stems.js';
import { branchAt } from '../core/constants/branches.js';
import { gregorianToJulianDay, julianDayToGregorian } from '../calendar/julian.js';

export function calculateDayPillar({
  year,
  month,
  day,
  hour = 12,
  minute = 0,
  dayBoundary = '23:00' // '23:00' | '00:00'
}) {
  const trace = [];

  // 計算是否因 23:00 換日跨至次日
  let adjustedDay = day;
  let adjustedMonth = month;
  let adjustedYear = year;
  let switchedNextDay = false;

  if (dayBoundary === '23:00' && hour >= 23) {
    switchedNextDay = true;
    trace.push(`當前時間為 ${hour}:${String(minute).padStart(2, '0')}，已達 23:00 子初，依 canonical 規則推進至次日計算日柱`);
    // 透過 JD + 1 處理跨月、跨年
    const jdBase = gregorianToJulianDay(year, month, day);
    const nextDayGreg = julianDayToGregorian(jdBase + 1);
    adjustedYear = nextDayGreg.year;
    adjustedMonth = nextDayGreg.month;
    adjustedDay = nextDayGreg.day;
  } else {
    trace.push(`日換日切換點採 ${dayBoundary}，當前時數 ${hour}，日柱歸屬公曆日 ${year}-${month}-${day}`);
  }

  // 取得該日中午 12:00 的 JDN
  const jdNoon = gregorianToJulianDay(adjustedYear, adjustedMonth, adjustedDay);
  const jdn = Math.floor(jdNoon + 0.5);

  // 六十甲子日柱序數（0=甲子 ... 54=戊午 ... 59=癸亥）
  const dayGanzhiIndex = ((jdn + 49) % 60 + 60) % 60;
  const { stemIdx, branchIdx } = sexagenaryStemBranch(dayGanzhiIndex);

  const stem = stemAt(stemIdx);
  const branch = branchAt(branchIdx);

  return {
    stem: stem.char,
    branch: branch.char,
    stemData: stem,
    branchData: branch,
    ganzhi: `${stem.char}${branch.char}`,
    sexagenaryIndex: dayGanzhiIndex,
    dayBoundary,
    switchedNextDay,
    effectiveDate: {
      year: adjustedYear,
      month: adjustedMonth,
      day: adjustedDay
    },
    trace
  };
}
