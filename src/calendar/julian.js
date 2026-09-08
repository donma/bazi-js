// 儒略日轉換（Julian Day）
// 參考：Jean Meeus, Astronomical Algorithms, 2nd ed., ch.7
// 時標：統一使用 Julian Day（浮點）。輸入/輸出採用 UT，內部計算太陽位置使用 TT。

// 公曆日期 → 儒略日（UT）
// year/month 為整數，day 可含小數（如 15.5 = 15日12時）
export function gregorianToJulianDay(year, month, day) {
  const y = Math.trunc(year);
  const m = Math.trunc(month);
  const d = day;

  let Y = y;
  let M = m;
  if (M <= 2) {
    Y = y - 1;
    M = m + 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const JD = Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    d + B - 1524.5;
  return JD;
}

// 儒略日 → 公曆日期（回傳物件，含小數日）
export function julianDayToGregorian(jd) {
  const Z = Math.floor(jd + 0.5);
  const F = jd + 0.5 - Z;

  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const dayFraction = B - D - Math.floor(30.6001 * E) + F;
  const day = Math.floor(dayFraction);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  const fraction = dayFraction - day;

  return {
    year,
    month,
    day,
    fraction,
    hour: fraction * 24,
    jd
  };
}

// 儒略日 → 星期（0=日 ... 6=六）
export function dayOfWeek(jd) {
  const jdn = Math.floor(jd + 0.5);
  return ((jdn + 1) % 7 + 7) % 7;
}

// ΔT（TT - UT），單位秒。
// 分段多項式來源：Espenak & Meeus, "Five Millennium Canon of Solar Eclipses" (NASA)
// 適用 1900~2150。1900-1920 係數僅適用該區間，不可外推（早期實作誤用之）。
export function deltaTSeconds(year) {
  const y = year;
  if (y < 1900 || y > 2150) {
    // 超出區間使用簡式（本 SDK 保證範圍 1900-2100，此分支僅防呆）
    const u = (y - 1820) / 100;
    return -20 + 32 * u * u - 0.5628 * (2150 - y);
  }
  if (y < 1920) {
    const t = y - 1900;
    return -2.79 + 1.494119 * t - 0.0598939 * t * t + 0.0061966 * t * t * t - 0.000197 * t * t * t * t;
  }
  if (y < 1941) {
    const t = y - 1920;
    return 21.20 + 0.84493 * t - 0.076100 * t * t + 0.0020936 * t * t * t;
  }
  if (y < 1961) {
    const t = y - 1950;
    return 29.07 + 0.407 * t - (t * t) / 233 + (t * t * t) / 2547;
  }
  if (y < 1986) {
    const t = y - 1975;
    return 45.45 + 1.067 * t - (t * t) / 260 - (t * t * t) / 718;
  }
  if (y < 2005) {
    const t = y - 2000;
    return 63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t * t * t +
      0.000651814 * t * t * t * t + 0.00002373599 * t * t * t * t * t;
  }
  if (y < 2050) {
    const t = y - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  }
  // 2050~2150
  const u = (y - 1820) / 100;
  return -20 + 32 * u * u - 0.5628 * (2150 - y);
}

// TT → UT（減去 ΔT）
export function ttToUt(jdTT, yearRef) {
  const dt = deltaTSeconds(yearRef) / 86400;
  return jdTT - dt;
}

// UT → TT
export function utToTt(jdUT, yearRef) {
  const dt = deltaTSeconds(yearRef) / 86400;
  return jdUT + dt;
}

// 由 JD(UT) + 時區偏移（小時）轉為「時區當地公曆時刻」
export function jdToLocalParts(jdUT, timezoneOffsetHours) {
  const local = jdUT + timezoneOffsetHours / 24;
  const g = julianDayToGregorian(local);
  const totalMinutes = g.fraction * 1440;
  let hour = Math.floor(totalMinutes / 60) % 24;
  let minute = Math.round(totalMinutes % 60);
  let day = g.day;
  if (minute >= 60) {
    hour = (hour + 1) % 24;
    minute = 0;
  }
  if (hour === 0 && Math.round(totalMinutes) >= 1440) {
    const after = julianDayToGregorian(local + 1e-6);
    day = after.day;
  }
  return {
    year: g.year,
    month: g.month,
    day,
    hour,
    minute,
    jdUT
  };
}