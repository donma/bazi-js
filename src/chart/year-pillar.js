// 年柱計算模組
// canonical 預設：以「立春」（LiChun）作為切年交界，而非農曆正月初一。
// 立春前屬於上一年天干地支；立春交節後屬於當年。
// 甲子年基準：1984年為甲子年（干支序 0）。
// 干支序：yearIndex = (year - 4) % 60

import { stemAt } from '../core/constants/stems.js';
import { branchAt } from '../core/constants/branches.js';
import { sexagenaryIndex } from '../core/constants/stems.js';
import { getLichunMoment } from '../calendar/solar-terms.js';
import { gregorianToJulianDay } from '../calendar/julian.js';

export function calculateYearPillar({
  year,
  month,
  day,
  hour = 12,
  minute = 0,
  timezoneOffsetHours = 8,
  yearBoundary = 'lichun', // 'lichun' | 'lunar_new_year'
  lunarYear = null
}) {
  // 注意：輸入為時區當地民用時刻，須先換算為 UT 的 JD，才能與節氣 JD(UT) 比較。
  // （未換算會造成整整時區偏移量的邊界誤判，例如 UTC+8 差 8 小時。）
  const currentJD = gregorianToJulianDay(year, month, day + (hour + minute / 60) / 24) - timezoneOffsetHours / 24;

  let baziYear = year;
  let lichunUsed = null;
  let trace = [];

  if (yearBoundary === 'lichun') {
    // 當年的立春時刻
    const thisYearLichun = getLichunMoment(year, timezoneOffsetHours);
    lichunUsed = thisYearLichun;

    if (currentJD < thisYearLichun.jdUT) {
      // 尚未交立春，屬於上一年
      baziYear = year - 1;
      trace.push(`當前時刻早於 ${year} 年立春 (${thisYearLichun.local.year}-${thisYearLichun.local.month}-${thisYearLichun.local.day} ${thisYearLichun.local.hour}:${thisYearLichun.local.minute})，年柱歸屬 ${year - 1} 年`);
    } else {
      trace.push(`當前時刻已過 ${year} 年立春，年柱歸屬 ${year} 年`);
    }
  } else if (yearBoundary === 'lunar_new_year') {
    if (!Number.isInteger(lunarYear)) {
      throw new Error('yearBoundary 為 lunar_new_year 時必須提供 lunarYear');
    }
    baziYear = lunarYear;
    trace.push(`使用農曆正月初一切年，當日農曆年為 ${lunarYear} 年`);
  } else {
    throw new Error(`不支援的年柱切界規則: ${yearBoundary}`);
  }

  // 1984 年為甲子年 (stem=0, branch=0)
  // (year - 1984) % 60
  // 1900 年: (1900 - 1984) % 60 = -84 % 60 = 36 -> 庚子 (stem=(1900-4)%10=6:庚, branch=(1900-4)%12=0:子)
  const stemIdx = ((baziYear - 4) % 10 + 10) % 10;
  const branchIdx = ((baziYear - 4) % 12 + 12) % 12;

  const stem = stemAt(stemIdx);
  const branch = branchAt(branchIdx);
  const ganzhiIndex = sexagenaryIndex(stemIdx, branchIdx);

  return {
    baziYear,
    stem: stem.char,
    branch: branch.char,
    stemData: stem,
    branchData: branch,
    ganzhi: `${stem.char}${branch.char}`,
    sexagenaryIndex: ganzhiIndex,
    boundaryRule: yearBoundary,
    lunarYear: Number.isInteger(lunarYear) ? lunarYear : null,
    lichunMoment: lichunUsed,
    trace
  };
}
