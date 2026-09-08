// 農曆換算模組（Lunar Calendar 1900-2100）
// 採用標準 201 年農曆天文壓縮資料表（Big/Small month bits + leap month info）
// 格式說明（每個 16 進位數代表 1 年）：
// bits 19..16: 閏月月份（0 = 無閏月，1..12 = 閏幾月）
// bits 15..4: 12 個月的月份大小（1 = 30天大月，0 = 29天小月）
// bit 0..3 (可選標記或閏月大小) -> 專用格式：
// 0x04bd8:
// bit 16: 閏月大月(1)/小月(0)
// bit 15..4: 1~12月大小
// bit 3..0: 閏月月份

import { gregorianToJulianDay, julianDayToGregorian } from './julian.js';
import { BaziCalendarError } from '../core/errors/index.js';

// 1900 ~ 2100 農曆編碼數據表
// 資料來源：紫金山天文台曆算數據核校
export const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06aa0, 0x1a6c4, 0x0aae0, // 2050-2059
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, // 2090-2099
  0x0d520                                                                                 // 2100
];

// 1900年農曆正月初一對應公曆日期：1900-01-31
const BASE_YEAR = 1900;
const BASE_JD = gregorianToJulianDay(1900, 1, 31);

// 取某年農曆閏幾月（0 表示無閏月）
export function getLeapMonth(year) {
  if (year < 1900 || year > 2100) return 0;
  return LUNAR_INFO[year - 1900] & 0xf;
}

// 取某年閏月的天數（29 或 30，若無閏月則 0）
export function getLeapMonthDays(year) {
  if (getLeapMonth(year) === 0) return 0;
  return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
}

// 取某年農曆某平月天數（1..12）
export function getLunarMonthDays(year, month) {
  if (year < 1900 || year > 2100) return 0;
  return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

// 取某年農曆總天數
export function getLunarYearDays(year) {
  if (year < 1900 || year > 2100) return 0;
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0;
  }
  return sum + getLeapMonthDays(year);
}

// 公曆年月日 → 農曆年月日（含是否閏月）
export function solarToLunar(year, month, day) {
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new BaziCalendarError('農曆換算目前支援 1900-01-01 至 2100-12-31', {
      operation: 'solarToLunar',
      allowedRange: ['1900-01-01', '2100-12-31'],
      providedYear: year
    });
  }
  const maxDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(day) || day < 1 || day > maxDay) {
    throw new BaziCalendarError('solarToLunar 收到無效公曆日期', { year, month, day });
  }
  const currentJD = gregorianToJulianDay(year, month, day);
  let offset = Math.round(currentJD - BASE_JD);

  if (offset < 0) {
    // 早於 1900-01-31（1900 年農曆正月初一之前）。
    // 1900-01-31 為正月初一，故 1900-01-01..30 為 1899 年臘月初一..三十（臘月為大月 30 天）。
    // offset 範圍 -30..-1 對應 day 1..30。
    const MONTH_NAMES_PRE = ['', '正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '臘'];
    const DAY_NAMES_PRE = [
      '', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
    ];
    const preDay = offset + 31;
    return {
      year: 1899,
      month: 12,
      day: preDay,
      isLeap: false,
      monthName: MONTH_NAMES_PRE[12] + '月',
      dayName: DAY_NAMES_PRE[preDay] || `${preDay}日`
    };
  }

  let lYear = 1900;
  let daysInYear = 0;

  for (let y = 1900; y <= 2100 && offset > 0; y++) {
    daysInYear = getLunarYearDays(y);
    if (offset < daysInYear) {
      lYear = y;
      break;
    }
    offset -= daysInYear;
    lYear = y + 1;
  }

  const leapMonth = getLeapMonth(lYear);
  let isLeap = false;
  let lMonth = 1;

  // 逐月扣除：每月先算平月，若該月有閏月則緊接著算閏月（閏月附於本月之後）。
  // 嚴禁使用 m-- 回退寫法（會在 m 回到 leapMonth+1 時重複觸發閏月分支）。
  let m = 1;
  while (m <= 12) {
    const dim = getLunarMonthDays(lYear, m);
    if (offset < dim) {
      lMonth = m;
      isLeap = false;
      break;
    }
    offset -= dim;

    if (leapMonth === m) {
      const ldim = getLeapMonthDays(lYear);
      if (offset < ldim) {
        lMonth = m;
        isLeap = true;
        break;
      }
      offset -= ldim;
    }
    m++;
  }

  const lDay = offset + 1;

  const MONTH_NAMES = ['', '正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '臘'];
  const DAY_NAMES = [
    '', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
  ];

  return {
    year: lYear,
    month: lMonth,
    day: lDay,
    isLeap,
    monthName: (isLeap ? '閏' : '') + MONTH_NAMES[lMonth] + '月',
    dayName: DAY_NAMES[lDay] || `${lDay}日`
  };
}
