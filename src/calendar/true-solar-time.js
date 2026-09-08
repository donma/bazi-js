// 真太陽時計算模組（True Solar Time / Local Apparent Solar Time）
// 原理：
// 1. 經度修正：每經度差 1 度 = 4 分鐘 (4 * (longitude - standardMeridian))
//    其中 standardMeridian = timezoneOffsetHours * 15 度
// 2. 均時差修正（Equation of Time, EoT）：因地球公轉軌道偏心率及赤道黃道夾角引起的真平太陽時差
//    EOT (分鐘) = 9.87 * sin(2B) - 7.53 * cos(B) - 1.5 * sin(B)
//    其中 B = 360 * (N - 81) / 365 （度）
//    真太陽時 = 平太陽時（當地標準時間） + 經度差修正 + 均時差修正 (EoT)

import { gregorianToJulianDay, julianDayToGregorian } from './julian.js';

// 計算一年中的第幾天 N (1..366)
export function dayOfYear(year, month, day) {
  const jdCurr = gregorianToJulianDay(year, month, day);
  const jdStart = gregorianToJulianDay(year, 1, 1);
  return Math.floor(jdCurr - jdStart) + 1;
}

// 精確均時差（Equation of Time），以分鐘為單位（Spencer 1971 / NOAA 算法）
export function equationOfTime(year, month, day, hour = 12) {
  // 分數年（弧度）
  const N = dayOfYear(year, month, day);
  const gamma = (2 * Math.PI / 365) * (N - 1 + (hour - 12) / 24);

  // Spencer 多項式（分鐘）
  const eot = 229.18 * (
    0.000075 +
    0.001868 * Math.cos(gamma) -
    0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2 * gamma) -
    0.040849 * Math.sin(2 * gamma)
  );

  return eot;
}

// 計算真太陽時
// input:
//   year, month, day, hour, minute (當地標準時間)
//   longitude: 當地經度 (例如台北 121.5654, 正值為東經)
//   timezoneOffsetHours: 時區偏移量 (例如 +8)
export function calculateTrueSolarTime({
  year,
  month,
  day,
  hour,
  minute,
  longitude,
  timezoneOffsetHours = 8
}) {
  // 標準子午線 (度)
  const standardMeridian = timezoneOffsetHours * 15;

  // 1. 經度差修正（分鐘）
  const longitudeCorrection = (longitude - standardMeridian) * 4;

  // 2. 均時差修正（分鐘）
  const eotCorrection = equationOfTime(year, month, day, hour + minute / 60);

  // 總修正時間（分鐘）
  const totalCorrectionMinutes = longitudeCorrection + eotCorrection;

  // 原始時間（自當天 00:00 起算的分鐘數）
  const civilTotalMinutes = hour * 60 + minute;
  const trueSolarTotalMinutes = civilTotalMinutes + totalCorrectionMinutes;

  // 換算成跨日/日時分
  let adjustedDayOffset = 0;
  let normalizedMinutes = trueSolarTotalMinutes;

  while (normalizedMinutes < 0) {
    normalizedMinutes += 1440;
    adjustedDayOffset -= 1;
  }
  while (normalizedMinutes >= 1440) {
    normalizedMinutes -= 1440;
    adjustedDayOffset += 1;
  }

  const trueHour = Math.floor(normalizedMinutes / 60);
  const trueMinute = Math.round(normalizedMinutes % 60);

  // 依日位移調整日期
  const jdBase = gregorianToJulianDay(year, month, day);
  const jdAdjusted = jdBase + adjustedDayOffset;
  const adjGreg = julianDayToGregorian(jdAdjusted);

  const pad = (n) => String(n).padStart(2, '0');
  const civilTimeStr = `${pad(hour)}:${pad(minute)}`;
  const trueSolarTimeStr = `${pad(trueHour)}:${pad(trueMinute)}`;

  return {
    civilDate: `${year}-${pad(month)}-${pad(day)}`,
    civilTime: civilTimeStr,
    trueSolarDate: `${adjGreg.year}-${pad(adjGreg.month)}-${pad(adjGreg.day)}`,
    trueSolarTime: trueSolarTimeStr,
    trueYear: adjGreg.year,
    trueMonth: adjGreg.month,
    trueDay: adjGreg.day,
    trueHour,
    trueMinute,
    dayOffset: adjustedDayOffset,
    corrections: {
      longitudeCorrectionMinutes: Number(longitudeCorrection.toFixed(2)),
      equationOfTimeMinutes: Number(eotCorrection.toFixed(2)),
      totalCorrectionMinutes: Number(totalCorrectionMinutes.toFixed(2))
    },
    usedTrueSolarTime: true
  };
}
