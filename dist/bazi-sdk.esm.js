var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/core/utils/validation.js
var validation_exports = {};
__export(validation_exports, {
  DAY_BOUNDARY_VALUES: () => DAY_BOUNDARY_VALUES,
  MONTH_BOUNDARY_VALUES: () => MONTH_BOUNDARY_VALUES,
  SHENSHA_PRESET_VALUES: () => SHENSHA_PRESET_VALUES,
  YEAR_BOUNDARY_VALUES: () => YEAR_BOUNDARY_VALUES,
  parseTimezoneOffset: () => parseTimezoneOffset,
  validateInput: () => validateInput
});

// src/core/errors/index.js
var errors_exports = {};
__export(errors_exports, {
  BaziCalendarError: () => BaziCalendarError,
  BaziError: () => BaziError,
  BaziRangeError: () => BaziRangeError,
  BaziRenderError: () => BaziRenderError,
  BaziRuleError: () => BaziRuleError,
  BaziValidationError: () => BaziValidationError
});
var BaziError = class extends Error {
  constructor(message, code = "BAZI_ERROR", details = {}) {
    super(message);
    this.name = "BaziError";
    this.code = code;
    this.details = details;
  }
};
var BaziValidationError = class extends BaziError {
  constructor(message, field = null, details = {}) {
    super(message, "BAZI_VALIDATION_ERROR", { field, ...details });
    this.name = "BaziValidationError";
    this.field = field;
  }
};
var BaziRangeError = class extends BaziError {
  constructor(message, field = null, details = {}) {
    super(message, "BIRTH_DATE_OUT_OF_RANGE", { field, ...details });
    this.name = "BaziRangeError";
    this.field = field;
  }
};
var BaziCalendarError = class extends BaziError {
  constructor(message, details = {}) {
    super(message, "BAZI_CALENDAR_ERROR", details);
    this.name = "BaziCalendarError";
  }
};
var BaziRuleError = class extends BaziError {
  constructor(message, ruleId = null, details = {}) {
    super(message, "BAZI_RULE_ERROR", { ruleId, ...details });
    this.name = "BaziRuleError";
    this.ruleId = ruleId;
  }
};
var BaziRenderError = class extends BaziError {
  constructor(message, details = {}) {
    super(message, "BAZI_RENDER_ERROR", details);
    this.name = "BaziRenderError";
  }
};

// src/core/constants/branches.js
var BRANCHES = [
  { id: "zi", char: "\u5B50", pinyin: "z\u01D0", element: "\u6C34", yinYang: "yang", zodiac: "\u9F20", hidden: ["\u7678"] },
  { id: "chou", char: "\u4E11", pinyin: "ch\u01D2u", element: "\u571F", yinYang: "yin", zodiac: "\u725B", hidden: ["\u5DF1", "\u7678", "\u8F9B"] },
  { id: "yin", char: "\u5BC5", pinyin: "y\xEDn", element: "\u6728", yinYang: "yang", zodiac: "\u864E", hidden: ["\u7532", "\u4E19", "\u620A"] },
  { id: "mao", char: "\u536F", pinyin: "m\u01CEo", element: "\u6728", yinYang: "yin", zodiac: "\u5154", hidden: ["\u4E59"] },
  { id: "chen", char: "\u8FB0", pinyin: "ch\xE9n", element: "\u571F", yinYang: "yang", zodiac: "\u9F8D", hidden: ["\u620A", "\u4E59", "\u7678"] },
  { id: "si", char: "\u5DF3", pinyin: "s\xEC", element: "\u706B", yinYang: "yin", zodiac: "\u86C7", hidden: ["\u4E19", "\u5E9A", "\u620A"] },
  { id: "wu", char: "\u5348", pinyin: "w\u01D4", element: "\u706B", yinYang: "yang", zodiac: "\u99AC", hidden: ["\u4E01", "\u5DF1"] },
  { id: "wei", char: "\u672A", pinyin: "w\xE8i", element: "\u571F", yinYang: "yin", zodiac: "\u7F8A", hidden: ["\u5DF1", "\u4E01", "\u4E59"] },
  { id: "shen", char: "\u7533", pinyin: "sh\u0113n", element: "\u91D1", yinYang: "yang", zodiac: "\u7334", hidden: ["\u5E9A", "\u58EC", "\u620A"] },
  { id: "you", char: "\u9149", pinyin: "y\u01D2u", element: "\u91D1", yinYang: "yin", zodiac: "\u96DE", hidden: ["\u8F9B"] },
  { id: "xu", char: "\u620C", pinyin: "x\u016B", element: "\u571F", yinYang: "yang", zodiac: "\u72D7", hidden: ["\u620A", "\u8F9B", "\u4E01"] },
  { id: "hai", char: "\u4EA5", pinyin: "h\xE0i", element: "\u6C34", yinYang: "yin", zodiac: "\u8C6C", hidden: ["\u58EC", "\u7532"] }
];
var BRANCH_INDEX = Object.fromEntries(BRANCHES.map((b, i) => [b.char, i]));
function branchIndex(char) {
  return BRANCH_INDEX[char];
}
function branchAt(index) {
  const i = (index % 12 + 12) % 12;
  return BRANCHES[i];
}
var BRANCH_CHARS = BRANCHES.map((b) => b.char);
function hourBranchIndex(hour) {
  const idx = Math.floor((hour + 1) % 24 / 2);
  return idx % 12;
}
function branchStartHour(branchIdx) {
  return (branchIdx * 2 + 23) % 24;
}

// src/core/utils/validation.js
var YEAR_BOUNDARY_VALUES = Object.freeze(["lichun", "lunar_new_year"]);
var MONTH_BOUNDARY_VALUES = Object.freeze(["jie", "lunar_month"]);
var DAY_BOUNDARY_VALUES = Object.freeze(["23:00", "00:00"]);
var SHENSHA_PRESET_VALUES = Object.freeze(["minimal", "classical", "full"]);
function parseTimezoneOffset(timezone = "+08:00") {
  if (typeof timezone !== "string") {
    throw new BaziValidationError('timezone \u5FC5\u9808\u662F\u5B57\u4E32\uFF0C\u4F8B\u5982 "+08:00" \u6216 "-05:00"', "timezone");
  }
  const match = timezone.match(/^([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!match) {
    throw new BaziValidationError('timezone \u683C\u5F0F\u4E0D\u6B63\u78BA\uFF0C\u4F8B\u5982 "+08:00" \u6216 "-05:00"', "timezone");
  }
  const hours = Number(match[2]);
  const minutes = Number(match[3] || 0);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || minutes > 59 || hours > 14 || hours === 14 && minutes !== 0) {
    throw new BaziValidationError("timezone \u8D85\u51FA\u652F\u63F4\u7BC4\u570D\uFF0C\u5FC5\u9808\u4ECB\u65BC UTC-14:00 \u81F3 UTC+14:00", "timezone", {
      allowedRange: ["-14:00", "+14:00"]
    });
  }
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (hours + minutes / 60);
}
function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}
function validateInput(input) {
  if (!input || typeof input !== "object") {
    throw new BaziValidationError("\u8F38\u5165\u53C3\u6578\u5FC5\u9808\u70BA\u7269\u4EF6", "input");
  }
  if (!input.birthDate || typeof input.birthDate !== "string") {
    throw new BaziValidationError("birthDate \u70BA\u5FC5\u586B\u5B57\u4E32\uFF0C\u683C\u5F0F\u70BA YYYY-MM-DD", "birthDate");
  }
  const dateMatch = input.birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateMatch) {
    throw new BaziValidationError("birthDate \u683C\u5F0F\u4E0D\u6B63\u78BA\uFF0C\u61C9\u70BA YYYY-MM-DD", "birthDate");
  }
  const [_, yStr, mStr, dStr] = dateMatch;
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr, 10);
  const day = parseInt(dStr, 10);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    throw new BaziValidationError("birthDate \u5305\u542B\u7121\u6548\u7684\u6708\u4EFD\u6216\u65E5\u671F\u6578\u503C", "birthDate");
  }
  if (year < 1900 || year > 2100) {
    throw new BaziRangeError(
      `\u51FA\u751F\u65E5\u671F\u5E74\u4EFD (${year}) \u8D85\u51FA SDK \u4FDD\u8B49\u7BC4\u570D\uFF0C\u5FC5\u9808\u4ECB\u65BC 1900-01-01 \u81F3 2100-12-31`,
      "birthDate",
      { providedYear: year, allowedRange: ["1900-01-01", "2100-12-31"] }
    );
  }
  if (!input.gender || input.gender !== "male" && input.gender !== "female") {
    throw new BaziValidationError('gender \u70BA\u5FC5\u586B\u6B04\u4F4D\uFF0C\u4E14\u5FC5\u9808\u70BA "male" \u6216 "female"', "gender");
  }
  const mode = input.birthTimeMode || (input.birthTime ? "exact" : "unknown");
  if (!["exact", "branch", "unknown"].includes(mode)) {
    throw new BaziValidationError('birthTimeMode \u5FC5\u9808\u70BA "exact"\u3001"branch" \u6216 "unknown"', "birthTimeMode");
  }
  if (mode === "exact") {
    if (typeof input.birthTime !== "string" || !input.birthTime) {
      throw new BaziValidationError('birthTimeMode \u70BA "exact" \u6642\u5FC5\u9808\u63D0\u4F9B birthTime (HH:mm)', "birthTime");
    }
    const timeMatch = input.birthTime.match(/^(\d{1,2}):(\d{2})$/);
    if (!timeMatch) {
      throw new BaziValidationError("birthTime \u683C\u5F0F\u4E0D\u6B63\u78BA\uFF0C\u61C9\u70BA HH:mm", "birthTime");
    }
    const h = parseInt(timeMatch[1], 10);
    const m = parseInt(timeMatch[2], 10);
    if (h < 0 || h > 23 || m < 0 || m > 59) {
      throw new BaziValidationError("birthTime \u5305\u542B\u7121\u6548\u4E4B\u5C0F\u6642 (0-23) \u6216\u5206\u9418 (0-59)", "birthTime");
    }
  }
  if (mode === "branch") {
    if (!input.birthHourBranch || BRANCH_INDEX[input.birthHourBranch] === void 0) {
      throw new BaziValidationError('birthTimeMode \u70BA "branch" \u6642\u5FC5\u9808\u63D0\u4F9B\u6709\u6548\u7684\u5730\u652F birthHourBranch (\u5982 "\u5348")', "birthHourBranch");
    }
  }
  const timezone = input.timezone || "+08:00";
  parseTimezoneOffset(timezone);
  if (input.yearBoundary !== void 0 && !YEAR_BOUNDARY_VALUES.includes(input.yearBoundary)) {
    throw new BaziValidationError('yearBoundary \u5FC5\u9808\u70BA "lichun" \u6216 "lunar_new_year"', "yearBoundary");
  }
  if (input.monthBoundary !== void 0 && !MONTH_BOUNDARY_VALUES.includes(input.monthBoundary)) {
    throw new BaziValidationError('monthBoundary \u5FC5\u9808\u70BA "jie" \u6216 "lunar_month"', "monthBoundary");
  }
  if (input.dayBoundary !== void 0 && !DAY_BOUNDARY_VALUES.includes(input.dayBoundary)) {
    throw new BaziValidationError('dayBoundary \u5FC5\u9808\u70BA "23:00" \u6216 "00:00"', "dayBoundary");
  }
  if (input.shenshaPreset !== void 0 && !SHENSHA_PRESET_VALUES.includes(input.shenshaPreset)) {
    throw new BaziValidationError('shenshaPreset \u5FC5\u9808\u70BA "minimal"\u3001"classical" \u6216 "full"', "shenshaPreset");
  }
  if (input.shenShaPreset !== void 0 && !SHENSHA_PRESET_VALUES.includes(input.shenShaPreset)) {
    throw new BaziValidationError('shenShaPreset \u5FC5\u9808\u70BA "minimal"\u3001"classical" \u6216 "full"', "shenShaPreset");
  }
  if (input.trueSolarTime !== void 0 && typeof input.trueSolarTime !== "boolean") {
    throw new BaziValidationError("trueSolarTime \u5FC5\u9808\u662F boolean", "trueSolarTime");
  }
  if (input.location !== void 0) {
    if (!input.location || typeof input.location !== "object" || Array.isArray(input.location)) {
      throw new BaziValidationError("location \u5FC5\u9808\u662F\u7269\u4EF6", "location");
    }
    if (input.location.longitude !== void 0 && (!Number.isFinite(input.location.longitude) || input.location.longitude < -180 || input.location.longitude > 180)) {
      throw new BaziValidationError("location.longitude \u5FC5\u9808\u4ECB\u65BC -180 \u81F3 180", "location.longitude");
    }
    if (input.location.latitude !== void 0 && (!Number.isFinite(input.location.latitude) || input.location.latitude < -90 || input.location.latitude > 90)) {
      throw new BaziValidationError("location.latitude \u5FC5\u9808\u4ECB\u65BC -90 \u81F3 90", "location.latitude");
    }
  }
  return true;
}

// src/core/constants/stems.js
var stems_exports = {};
__export(stems_exports, {
  STEMS: () => STEMS,
  STEM_CHARS: () => STEM_CHARS,
  STEM_INDEX: () => STEM_INDEX,
  sexagenaryIndex: () => sexagenaryIndex,
  sexagenaryStemBranch: () => sexagenaryStemBranch,
  stemAt: () => stemAt,
  stemIndex: () => stemIndex
});
var STEMS = [
  { id: "jia", char: "\u7532", pinyin: "ji\u01CE", element: "\u6728", yinYang: "yang" },
  { id: "yi", char: "\u4E59", pinyin: "y\u01D0", element: "\u6728", yinYang: "yin" },
  { id: "bing", char: "\u4E19", pinyin: "b\u01D0ng", element: "\u706B", yinYang: "yang" },
  { id: "ding", char: "\u4E01", pinyin: "d\u012Bng", element: "\u706B", yinYang: "yin" },
  { id: "wu", char: "\u620A", pinyin: "w\xF9", element: "\u571F", yinYang: "yang" },
  { id: "ji", char: "\u5DF1", pinyin: "j\u01D0", element: "\u571F", yinYang: "yin" },
  { id: "geng", char: "\u5E9A", pinyin: "g\u0113ng", element: "\u91D1", yinYang: "yang" },
  { id: "xin", char: "\u8F9B", pinyin: "x\u012Bn", element: "\u91D1", yinYang: "yin" },
  { id: "ren", char: "\u58EC", pinyin: "r\xE9n", element: "\u6C34", yinYang: "yang" },
  { id: "gui", char: "\u7678", pinyin: "gu\u01D0", element: "\u6C34", yinYang: "yin" }
];
var STEM_INDEX = Object.fromEntries(STEMS.map((s, i) => [s.char, i]));
function stemIndex(char) {
  return STEM_INDEX[char];
}
function stemAt(index) {
  const i = (index % 10 + 10) % 10;
  return STEMS[i];
}
function sexagenaryIndex(stemIdx, branchIdx) {
  for (let n = 0; n < 60; n++) {
    if (n % 10 === stemIdx && n % 12 === branchIdx) return n;
  }
  return -1;
}
function sexagenaryStemBranch(n) {
  const i = (n % 60 + 60) % 60;
  return { stemIdx: i % 10, branchIdx: i % 12 };
}
var STEM_CHARS = STEMS.map((s) => s.char);

// src/calendar/solar-terms.js
var solar_terms_exports = {};
__export(solar_terms_exports, {
  SOLAR_TERMS: () => SOLAR_TERMS,
  calculateSolarTermJD: () => calculateSolarTermJD,
  getLichunMoment: () => getLichunMoment,
  getSurroundingJie: () => getSurroundingJie,
  getYearSolarTerms: () => getYearSolarTerms
});

// src/calendar/julian.js
var julian_exports = {};
__export(julian_exports, {
  dayOfWeek: () => dayOfWeek,
  deltaTSeconds: () => deltaTSeconds,
  gregorianToJulianDay: () => gregorianToJulianDay,
  jdToLocalParts: () => jdToLocalParts,
  julianDayToGregorian: () => julianDayToGregorian,
  ttToUt: () => ttToUt,
  utToTt: () => utToTt
});
function gregorianToJulianDay(year, month, day) {
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
  const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5;
  return JD;
}
function julianDayToGregorian(jd) {
  const Z = Math.floor(jd + 0.5);
  const F = jd + 0.5 - Z;
  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 186721625e-2) / 36524.25);
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
function dayOfWeek(jd) {
  const jdn = Math.floor(jd + 0.5);
  return ((jdn + 1) % 7 + 7) % 7;
}
function deltaTSeconds(year) {
  const y = year;
  if (y < 1900 || y > 2150) {
    const u2 = (y - 1820) / 100;
    return -20 + 32 * u2 * u2 - 0.5628 * (2150 - y);
  }
  if (y < 1920) {
    const t = y - 1900;
    return -2.79 + 1.494119 * t - 0.0598939 * t * t + 61966e-7 * t * t * t - 197e-6 * t * t * t * t;
  }
  if (y < 1941) {
    const t = y - 1920;
    return 21.2 + 0.84493 * t - 0.0761 * t * t + 20936e-7 * t * t * t;
  }
  if (y < 1961) {
    const t = y - 1950;
    return 29.07 + 0.407 * t - t * t / 233 + t * t * t / 2547;
  }
  if (y < 1986) {
    const t = y - 1975;
    return 45.45 + 1.067 * t - t * t / 260 - t * t * t / 718;
  }
  if (y < 2005) {
    const t = y - 2e3;
    return 63.86 + 0.3345 * t - 0.060374 * t * t + 17275e-7 * t * t * t + 651814e-9 * t * t * t * t + 2373599e-11 * t * t * t * t * t;
  }
  if (y < 2050) {
    const t = y - 2e3;
    return 62.92 + 0.32217 * t + 5589e-6 * t * t;
  }
  const u = (y - 1820) / 100;
  return -20 + 32 * u * u - 0.5628 * (2150 - y);
}
function ttToUt(jdTT, yearRef) {
  const dt = deltaTSeconds(yearRef) / 86400;
  return jdTT - dt;
}
function utToTt(jdUT, yearRef) {
  const dt = deltaTSeconds(yearRef) / 86400;
  return jdUT + dt;
}
function jdToLocalParts(jdUT, timezoneOffsetHours) {
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

// src/calendar/solar.js
var solar_exports = {};
__export(solar_exports, {
  findSolarLongitudeTime: () => findSolarLongitudeTime,
  solarLongitude: () => solarLongitude
});
var D2R = Math.PI / 180;
function julianCenturies(jdTT) {
  return (jdTT - 2451545) / 36525;
}
function solarLongitude(jdTT) {
  const T = julianCenturies(jdTT);
  const L0 = 280.46646 + 36000.76983 * T + 3032e-7 * T * T;
  const M = 357.52911 + 35999.05029 * T - 1537e-7 * T * T;
  const e = 0.016708634 - 42037e-9 * T - 1267e-10 * T * T;
  const Mr = M * D2R;
  const C = (1.914602 - 4817e-6 * T - 14e-6 * T * T) * Math.sin(Mr) + (0.019993 - 101e-6 * T) * Math.sin(2 * Mr) + 289e-6 * Math.sin(3 * Mr);
  const theta = L0 + C;
  const Omega = 125.04 - 1934.136 * T;
  const deltaPsi = -17.2 * Math.sin(Omega * D2R) / 3600;
  const aberration = -20.4898 / 3600;
  let lambda = theta + deltaPsi + aberration;
  lambda = (lambda % 360 + 360) % 360;
  return lambda;
}
var SOLAR_RATE = 360 / 365.2422;
function findSolarLongitudeTime(target, guessJD) {
  target = (target % 360 + 360) % 360;
  let jd = guessJD;
  for (let i = 0; i < 10; i++) {
    const lon = solarLongitude(jd);
    let diff = lon - target;
    diff = ((diff + 180) % 360 + 360) % 360 - 180;
    jd = jd - diff / SOLAR_RATE;
  }
  return jd;
}

// src/calendar/solar-terms.js
var SOLAR_TERMS = [
  { id: "chun_fen", name: "\u6625\u5206", type: "qi", longitude: 0, monthBranch: null },
  { id: "qing_ming", name: "\u6E05\u660E", type: "jie", longitude: 15, monthBranch: "\u8FB0" },
  { id: "gu_yu", name: "\u7A40\u96E8", type: "qi", longitude: 30, monthBranch: null },
  { id: "li_xia", name: "\u7ACB\u590F", type: "jie", longitude: 45, monthBranch: "\u5DF3" },
  { id: "xiao_man", name: "\u5C0F\u6EFF", type: "qi", longitude: 60, monthBranch: null },
  { id: "mang_zhong", name: "\u8292\u7A2E", type: "jie", longitude: 75, monthBranch: "\u5348" },
  { id: "xia_zhi", name: "\u590F\u81F3", type: "qi", longitude: 90, monthBranch: null },
  { id: "xiao_shu", name: "\u5C0F\u6691", type: "jie", longitude: 105, monthBranch: "\u672A" },
  { id: "da_shu", name: "\u5927\u6691", type: "qi", longitude: 120, monthBranch: null },
  { id: "li_qiu", name: "\u7ACB\u79CB", type: "jie", longitude: 135, monthBranch: "\u7533" },
  { id: "chu_shu", name: "\u8655\u6691", type: "qi", longitude: 150, monthBranch: null },
  { id: "bai_lu", name: "\u767D\u9732", type: "jie", longitude: 165, monthBranch: "\u9149" },
  { id: "qiu_fen", name: "\u79CB\u5206", type: "qi", longitude: 180, monthBranch: null },
  { id: "han_lu", name: "\u5BD2\u9732", type: "jie", longitude: 195, monthBranch: "\u620C" },
  { id: "shuang_jiang", name: "\u971C\u964D", type: "qi", longitude: 210, monthBranch: null },
  { id: "li_dong", name: "\u7ACB\u51AC", type: "jie", longitude: 225, monthBranch: "\u4EA5" },
  { id: "xiao_xue", name: "\u5C0F\u96EA", type: "qi", longitude: 240, monthBranch: null },
  { id: "da_xue", name: "\u5927\u96EA", type: "jie", longitude: 255, monthBranch: "\u5B50" },
  { id: "dong_zhi", name: "\u51AC\u81F3", type: "qi", longitude: 270, monthBranch: null },
  { id: "xiao_han", name: "\u5C0F\u5BD2", type: "jie", longitude: 285, monthBranch: "\u4E11" },
  { id: "da_han", name: "\u5927\u5BD2", type: "qi", longitude: 300, monthBranch: null },
  { id: "li_chun", name: "\u7ACB\u6625", type: "jie", longitude: 315, monthBranch: "\u5BC5" },
  { id: "yu_shui", name: "\u96E8\u6C34", type: "qi", longitude: 330, monthBranch: null },
  { id: "jing_zhe", name: "\u9A5A\u87C4", type: "jie", longitude: 345, monthBranch: "\u536F" }
];
var TERM_APPROX_DAYS = {
  "xiao_han": 5.5,
  "da_han": 19.8,
  "li_chun": 34.5,
  "yu_shui": 49.6,
  "jing_zhe": 64.3,
  "chun_fen": 79.5,
  "qing_ming": 94.6,
  "gu_yu": 109.8,
  "li_xia": 125.4,
  "xiao_man": 140.8,
  "mang_zhong": 156.6,
  "xia_zhi": 171.9,
  "xiao_shu": 187.8,
  "da_shu": 203.8,
  "li_qiu": 219.8,
  "chu_shu": 235.3,
  "bai_lu": 250.8,
  "qiu_fen": 266,
  "han_lu": 281,
  "shuang_jiang": 296,
  "li_dong": 311,
  "xiao_xue": 325.8,
  "da_xue": 340.8,
  "dong_zhi": 355.8
};
var TERM_CACHE = /* @__PURE__ */ new Map();
function calculateSolarTermJD(year, termId) {
  const cacheKey = `${year}_${termId}`;
  if (TERM_CACHE.has(cacheKey)) return TERM_CACHE.get(cacheKey);
  const term = SOLAR_TERMS.find((t) => t.id === termId);
  if (!term) throw new Error(`\u7121\u6548\u7BC0\u6C23 ID: ${termId}`);
  const baseJD = gregorianToJulianDay(year, 1, 1);
  const approxDays = TERM_APPROX_DAYS[termId];
  const guessJD = baseJD + approxDays;
  const guessTT = utToTt(guessJD, year);
  const preciseTT = findSolarLongitudeTime(term.longitude, guessTT);
  const preciseUT = ttToUt(preciseTT, year);
  TERM_CACHE.set(cacheKey, preciseUT);
  return preciseUT;
}
function getYearSolarTerms(year, timezoneOffsetHours = 8) {
  const list = [];
  for (const term of SOLAR_TERMS) {
    const jdUT = calculateSolarTermJD(year, term.id);
    const local = jdToLocalParts(jdUT, timezoneOffsetHours);
    list.push({
      id: term.id,
      name: term.name,
      type: term.type,
      longitude: term.longitude,
      monthBranch: term.monthBranch,
      jdUT,
      local
    });
  }
  list.sort((a, b) => a.jdUT - b.jdUT);
  return list;
}
function getSurroundingJie(jdUT, timezoneOffsetHours = 8) {
  const g = julianDayToGregorian(jdUT);
  const year = g.year;
  const allJie = [];
  const jieTerms = SOLAR_TERMS.filter((t) => t.type === "jie");
  for (const y of [year - 1, year, year + 1]) {
    for (const term of jieTerms) {
      const tJd = calculateSolarTermJD(y, term.id);
      allJie.push({
        id: term.id,
        name: term.name,
        monthBranch: term.monthBranch,
        longitude: term.longitude,
        jdUT: tJd,
        local: jdToLocalParts(tJd, timezoneOffsetHours)
      });
    }
  }
  allJie.sort((a, b) => a.jdUT - b.jdUT);
  let prevJie = null;
  let nextJie = null;
  for (let i = 0; i < allJie.length; i++) {
    if (allJie[i].jdUT <= jdUT) {
      prevJie = allJie[i];
      nextJie = allJie[i + 1] || null;
    } else {
      break;
    }
  }
  return { prevJie, nextJie };
}
function getLichunMoment(year, timezoneOffsetHours = 8) {
  const jdUT = calculateSolarTermJD(year, "li_chun");
  return {
    jdUT,
    local: jdToLocalParts(jdUT, timezoneOffsetHours)
  };
}

// src/chart/year-pillar.js
function calculateYearPillar({
  year,
  month,
  day,
  hour = 12,
  minute = 0,
  timezoneOffsetHours = 8,
  yearBoundary = "lichun",
  // 'lichun' | 'lunar_new_year'
  lunarYear = null
}) {
  const currentJD = gregorianToJulianDay(year, month, day + (hour + minute / 60) / 24) - timezoneOffsetHours / 24;
  let baziYear = year;
  let lichunUsed = null;
  let trace = [];
  if (yearBoundary === "lichun") {
    const thisYearLichun = getLichunMoment(year, timezoneOffsetHours);
    lichunUsed = thisYearLichun;
    if (currentJD < thisYearLichun.jdUT) {
      baziYear = year - 1;
      trace.push(`\u7576\u524D\u6642\u523B\u65E9\u65BC ${year} \u5E74\u7ACB\u6625 (${thisYearLichun.local.year}-${thisYearLichun.local.month}-${thisYearLichun.local.day} ${thisYearLichun.local.hour}:${thisYearLichun.local.minute})\uFF0C\u5E74\u67F1\u6B78\u5C6C ${year - 1} \u5E74`);
    } else {
      trace.push(`\u7576\u524D\u6642\u523B\u5DF2\u904E ${year} \u5E74\u7ACB\u6625\uFF0C\u5E74\u67F1\u6B78\u5C6C ${year} \u5E74`);
    }
  } else if (yearBoundary === "lunar_new_year") {
    if (!Number.isInteger(lunarYear)) {
      throw new Error("yearBoundary \u70BA lunar_new_year \u6642\u5FC5\u9808\u63D0\u4F9B lunarYear");
    }
    baziYear = lunarYear;
    trace.push(`\u4F7F\u7528\u8FB2\u66C6\u6B63\u6708\u521D\u4E00\u5207\u5E74\uFF0C\u7576\u65E5\u8FB2\u66C6\u5E74\u70BA ${lunarYear} \u5E74`);
  } else {
    throw new Error(`\u4E0D\u652F\u63F4\u7684\u5E74\u67F1\u5207\u754C\u898F\u5247: ${yearBoundary}`);
  }
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

// src/chart/month-pillar.js
var WU_HU_DUN = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
var YIN_BASED_BRANCH_ORDER = ["\u5BC5", "\u536F", "\u8FB0", "\u5DF3", "\u5348", "\u672A", "\u7533", "\u9149", "\u620C", "\u4EA5", "\u5B50", "\u4E11"];
var YIN_ORDER_MAP = Object.fromEntries(YIN_BASED_BRANCH_ORDER.map((b, i) => [b, i]));
function calculateMonthPillar({
  year,
  month,
  day,
  hour = 12,
  minute = 0,
  timezoneOffsetHours = 8,
  yearStemChar,
  // 由年柱計算所得之年干
  monthBoundary = "jie",
  lunarMonth = null
}) {
  const currentJD = gregorianToJulianDay(year, month, day + (hour + minute / 60) / 24) - timezoneOffsetHours / 24;
  const trace = [];
  let monthBranchChar = "\u5BC5";
  let prevJieInfo = null;
  let nextJieInfo = null;
  if (monthBoundary === "jie") {
    const surrounding = getSurroundingJie(currentJD, timezoneOffsetHours);
    prevJieInfo = surrounding.prevJie;
    nextJieInfo = surrounding.nextJie;
    if (prevJieInfo) {
      monthBranchChar = prevJieInfo.monthBranch;
      trace.push(`\u4EA4\u7BC0\u9EDE\u70BA ${prevJieInfo.name} (${prevJieInfo.local.year}-${prevJieInfo.local.month}-${prevJieInfo.local.day} ${prevJieInfo.local.hour}:${prevJieInfo.local.minute})\uFF0C\u6708\u5EFA\u5730\u652F\u70BA\u3010${monthBranchChar}\u3011`);
    } else {
      monthBranchChar = "\u5BC5";
      trace.push(`\u672A\u627E\u5230\u524D\u7F6E\u4EA4\u7BC0\u9EDE\uFF0C\u9810\u8A2D\u5BC5\u6708`);
    }
  } else if (monthBoundary === "lunar_month") {
    if (!Number.isInteger(lunarMonth) || lunarMonth < 1 || lunarMonth > 12) {
      throw new Error("monthBoundary \u70BA lunar_month \u6642\u5FC5\u9808\u63D0\u4F9B 1 \u81F3 12 \u7684 lunarMonth");
    }
    monthBranchChar = YIN_BASED_BRANCH_ORDER[lunarMonth - 1];
    trace.push(`\u4F7F\u7528\u8FB2\u66C6\u6708\u4EFD\u5207\u6708\uFF0C\u8FB2\u66C6 ${lunarMonth} \u6708\u5C0D\u61C9\u6708\u5EFA\u5730\u652F\u3010${monthBranchChar}\u3011`);
  } else {
    throw new Error(`\u4E0D\u652F\u63F4\u7684\u6708\u67F1\u5207\u754C\u898F\u5247: ${monthBoundary}`);
  }
  const yStemIdx = stemIndex(yearStemChar);
  const tigerStartStemIdx = WU_HU_DUN[yStemIdx];
  const monthStep = YIN_ORDER_MAP[monthBranchChar] || 0;
  const monthStemIdx = (tigerStartStemIdx + monthStep) % 10;
  const stem = stemAt(monthStemIdx);
  const branch = branchAt(branchIndex(monthBranchChar));
  const ganzhiIndex = sexagenaryIndex(monthStemIdx, branchIndex(monthBranchChar));
  return {
    stem: stem.char,
    branch: branch.char,
    stemData: stem,
    branchData: branch,
    ganzhi: `${stem.char}${branch.char}`,
    sexagenaryIndex: ganzhiIndex,
    boundaryRule: monthBoundary,
    lunarMonth: Number.isInteger(lunarMonth) ? lunarMonth : null,
    prevJie: prevJieInfo,
    nextJie: nextJieInfo,
    trace
  };
}

// src/chart/day-pillar.js
function calculateDayPillar({
  year,
  month,
  day,
  hour = 12,
  minute = 0,
  dayBoundary = "23:00"
  // '23:00' | '00:00'
}) {
  const trace = [];
  let adjustedDay = day;
  let adjustedMonth = month;
  let adjustedYear = year;
  let switchedNextDay = false;
  if (dayBoundary === "23:00" && hour >= 23) {
    switchedNextDay = true;
    trace.push(`\u7576\u524D\u6642\u9593\u70BA ${hour}:${String(minute).padStart(2, "0")}\uFF0C\u5DF2\u9054 23:00 \u5B50\u521D\uFF0C\u4F9D canonical \u898F\u5247\u63A8\u9032\u81F3\u6B21\u65E5\u8A08\u7B97\u65E5\u67F1`);
    const jdBase = gregorianToJulianDay(year, month, day);
    const nextDayGreg = julianDayToGregorian(jdBase + 1);
    adjustedYear = nextDayGreg.year;
    adjustedMonth = nextDayGreg.month;
    adjustedDay = nextDayGreg.day;
  } else {
    trace.push(`\u65E5\u63DB\u65E5\u5207\u63DB\u9EDE\u63A1 ${dayBoundary}\uFF0C\u7576\u524D\u6642\u6578 ${hour}\uFF0C\u65E5\u67F1\u6B78\u5C6C\u516C\u66C6\u65E5 ${year}-${month}-${day}`);
  }
  const jdNoon = gregorianToJulianDay(adjustedYear, adjustedMonth, adjustedDay);
  const jdn = Math.floor(jdNoon + 0.5);
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

// src/chart/hour-pillar.js
var WU_SHU_DUN = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];
function calculateHourPillar({
  mode = "exact",
  // 'exact' | 'branch' | 'unknown'
  hour = null,
  minute = 0,
  branchChar = null,
  dayStemChar,
  // 由日柱所得之日干
  ziShiMode = "zi_chu"
  // 'zi_chu' 23:00起算子時 | 'ye_zi' 夜子/早子分別
}) {
  const trace = [];
  if (mode === "unknown") {
    trace.push(`\u51FA\u751F\u6642\u9593\u672A\u77E5 (unknown)\uFF0C\u4F9D\u898F\u7BC4\u4E0D\u731C\u6E2C\u6642\u67F1`);
    return {
      available: false,
      mode: "unknown",
      stem: null,
      branch: null,
      ganzhi: null,
      sexagenaryIndex: null,
      trace
    };
  }
  let hBranchIdx = 0;
  let hBranchChar = "\u5B50";
  if (mode === "branch") {
    if (!branchChar) throw new Error('\u6642\u8FB0\u6A21\u5F0F\u4E0B\u5FC5\u9808\u63D0\u4F9B branchChar (\u5982 "\u5348")');
    hBranchIdx = branchIndex(branchChar);
    hBranchChar = branchChar;
    trace.push(`\u4F9D\u6307\u5B9A\u6642\u8FB0\u5730\u652F\u3010${branchChar}\u3011\u6392\u6642\u67F1`);
  } else {
    if (hour === null || hour === void 0) {
      throw new Error("\u7CBE\u78BA\u6642\u9593\u6A21\u5F0F\u4E0B\u5FC5\u9808\u63D0\u4F9B hour");
    }
    hBranchIdx = hourBranchIndex(hour);
    hBranchChar = branchAt(hBranchIdx).char;
    trace.push(`\u516C\u66C6\u5C0F\u6642 ${hour}:${String(minute).padStart(2, "0")}\uFF0C\u5C0D\u61C9\u6642\u8FB0\u5730\u652F\u3010${hBranchChar}\u3011`);
  }
  const dStemIdx = stemIndex(dayStemChar);
  const ratStartStemIdx = WU_SHU_DUN[dStemIdx];
  const hStemIdx = (ratStartStemIdx + hBranchIdx) % 10;
  const stem = stemAt(hStemIdx);
  const branch = branchAt(hBranchIdx);
  const ganzhiIndex = sexagenaryIndex(hStemIdx, hBranchIdx);
  return {
    available: true,
    mode,
    stem: stem.char,
    branch: branch.char,
    stemData: stem,
    branchData: branch,
    ganzhi: `${stem.char}${branch.char}`,
    sexagenaryIndex: ganzhiIndex,
    trace
  };
}

// src/chart/chart.js
function calculateFourPillars({
  year,
  month,
  day,
  hour,
  minute = 0,
  birthTimeMode = "exact",
  birthHourBranch = null,
  timezoneOffsetHours = 8,
  yearBoundary = "lichun",
  monthBoundary = "jie",
  lunarYear = null,
  lunarMonth = null,
  dayBoundary = "23:00"
}) {
  const debug = {
    yearPillarTrace: [],
    monthPillarTrace: [],
    dayPillarTrace: [],
    hourPillarTrace: []
  };
  const yearPillar = calculateYearPillar({
    year,
    month,
    day,
    hour: birthTimeMode === "exact" ? hour ?? 12 : 12,
    minute: birthTimeMode === "exact" ? minute : 0,
    timezoneOffsetHours,
    yearBoundary,
    lunarYear
  });
  debug.yearPillarTrace = yearPillar.trace;
  const monthPillar = calculateMonthPillar({
    year,
    month,
    day,
    hour: birthTimeMode === "exact" ? hour ?? 12 : 12,
    minute: birthTimeMode === "exact" ? minute : 0,
    timezoneOffsetHours,
    yearStemChar: yearPillar.stem,
    monthBoundary,
    lunarMonth
  });
  debug.monthPillarTrace = monthPillar.trace;
  const dayPillar = calculateDayPillar({
    year,
    month,
    day,
    hour: birthTimeMode === "exact" ? hour ?? 12 : 12,
    minute: birthTimeMode === "exact" ? minute : 0,
    dayBoundary
  });
  debug.dayPillarTrace = dayPillar.trace;
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

// src/tengods/index.js
var tengods_exports = {};
__export(tengods_exports, {
  HIDDEN_ROLE_INTERPRETATIONS: () => HIDDEN_ROLE_INTERPRETATIONS,
  TEN_GOD_INTERPRETATIONS: () => TEN_GOD_INTERPRETATIONS,
  calculateChartTenGods: () => calculateChartTenGods
});

// src/core/constants/elements.js
var ELEMENTS = [
  { id: "wood", char: "\u6728", generates: "\u706B", restricts: "\u571F", generatedBy: "\u6C34", restrictedBy: "\u91D1", color: "#2d6a4f" },
  { id: "fire", char: "\u706B", generates: "\u571F", restricts: "\u91D1", generatedBy: "\u6728", restrictedBy: "\u6C34", color: "#b23a22" },
  { id: "earth", char: "\u571F", generates: "\u91D1", restricts: "\u6C34", generatedBy: "\u706B", restrictedBy: "\u6728", color: "#9c6644" },
  { id: "metal", char: "\u91D1", generates: "\u6C34", restricts: "\u6728", generatedBy: "\u571F", restrictedBy: "\u706B", color: "#b38d38" },
  { id: "water", char: "\u6C34", generates: "\u6728", restricts: "\u706B", generatedBy: "\u91D1", restrictedBy: "\u571F", color: "#1d3557" }
];
var ELEMENT_INDEX = Object.fromEntries(ELEMENTS.map((e, i) => [e.char, i]));
function elementRelation(e1, e2) {
  if (e1 === e2) return "same";
  const data = ELEMENTS[ELEMENT_INDEX[e1]];
  if (!data) return "unknown";
  if (data.generates === e2) return "generate";
  if (data.restricts === e2) return "restrict";
  if (data.generatedBy === e2) return "drain";
  if (data.restrictedBy === e2) return "counter";
  return "unknown";
}

// src/core/constants/ten-gods-data.js
function getTenGod(baseStemChar, targetStemChar) {
  const base = STEMS[STEM_INDEX[baseStemChar]];
  const target = STEMS[STEM_INDEX[targetStemChar]];
  if (!base || !target) return null;
  const samePolarity = base.yinYang === target.yinYang;
  if (base.element === target.element) {
    return samePolarity ? { id: "friend", short: "\u6BD4", full: "\u6BD4\u80A9" } : { id: "rob_wealth", short: "\u52AB", full: "\u52AB\u8CA1" };
  }
  const rel = elementRelation(base.element, target.element);
  if (rel === "generate") {
    return samePolarity ? { id: "eating_god", short: "\u98DF", full: "\u98DF\u795E" } : { id: "hurting_officer", short: "\u50B7", full: "\u50B7\u5B98" };
  }
  if (rel === "restrict") {
    return samePolarity ? { id: "indirect_wealth", short: "\u504F\u8CA1", full: "\u504F\u8CA1" } : { id: "direct_wealth", short: "\u6B63\u8CA1", full: "\u6B63\u8CA1" };
  }
  if (rel === "counter") {
    return samePolarity ? { id: "seven_killings", short: "\u6BBA", full: "\u4E03\u6BBA" } : { id: "direct_officer", short: "\u5B98", full: "\u6B63\u5B98" };
  }
  if (rel === "drain") {
    return samePolarity ? { id: "indirect_resource", short: "\u689F", full: "\u504F\u5370" } : { id: "direct_resource", short: "\u5370", full: "\u6B63\u5370" };
  }
  return null;
}

// src/core/constants/hidden-stems-data.js
var HIDDEN_STEMS_DATA = {
  "\u5B50": [
    { stem: "\u7678", role: "primary", weight: 1, days: 30 }
  ],
  "\u4E11": [
    { stem: "\u5DF1", role: "primary", weight: 0.6, days: 18 },
    { stem: "\u7678", role: "secondary", weight: 0.25, days: 9 },
    { stem: "\u8F9B", role: "residual", weight: 0.15, days: 3 }
  ],
  "\u5BC5": [
    { stem: "\u7532", role: "primary", weight: 0.6, days: 16 },
    { stem: "\u4E19", role: "secondary", weight: 0.25, days: 7 },
    { stem: "\u620A", role: "residual", weight: 0.15, days: 7 }
  ],
  "\u536F": [
    { stem: "\u4E59", role: "primary", weight: 1, days: 30 }
  ],
  "\u8FB0": [
    { stem: "\u620A", role: "primary", weight: 0.6, days: 18 },
    { stem: "\u4E59", role: "secondary", weight: 0.25, days: 9 },
    { stem: "\u7678", role: "residual", weight: 0.15, days: 3 }
  ],
  "\u5DF3": [
    { stem: "\u4E19", role: "primary", weight: 0.6, days: 16 },
    { stem: "\u5E9A", role: "secondary", weight: 0.25, days: 9 },
    { stem: "\u620A", role: "residual", weight: 0.15, days: 5 }
  ],
  "\u5348": [
    { stem: "\u4E01", role: "primary", weight: 0.7, days: 20 },
    { stem: "\u5DF1", role: "secondary", weight: 0.3, days: 10 }
  ],
  "\u672A": [
    { stem: "\u5DF1", role: "primary", weight: 0.6, days: 18 },
    { stem: "\u4E01", role: "secondary", weight: 0.25, days: 9 },
    { stem: "\u4E59", role: "residual", weight: 0.15, days: 3 }
  ],
  "\u7533": [
    { stem: "\u5E9A", role: "primary", weight: 0.6, days: 17 },
    { stem: "\u58EC", role: "secondary", weight: 0.25, days: 7 },
    { stem: "\u620A", role: "residual", weight: 0.15, days: 6 }
  ],
  "\u9149": [
    { stem: "\u8F9B", role: "primary", weight: 1, days: 30 }
  ],
  "\u620C": [
    { stem: "\u620A", role: "primary", weight: 0.6, days: 18 },
    { stem: "\u8F9B", role: "secondary", weight: 0.25, days: 9 },
    { stem: "\u4E01", role: "residual", weight: 0.15, days: 3 }
  ],
  "\u4EA5": [
    { stem: "\u58EC", role: "primary", weight: 0.7, days: 20 },
    { stem: "\u7532", role: "secondary", weight: 0.3, days: 10 }
  ]
};
function getHiddenStems(branchChar) {
  return HIDDEN_STEMS_DATA[branchChar] || [];
}

// src/tengods/interpretations.js
var TEN_GOD_INTERPRETATIONS = Object.freeze({
  day_master: "\u65E5\u4E3B\u4EE3\u8868\u547D\u76E4\u7684\u6838\u5FC3\u7ACB\u5834\u8207\u81EA\u8EAB\u4E94\u884C\uFF0C\u5176\u4ED6\u5929\u5E72\u8207\u85CF\u5E79\u7684\u5341\u795E\u90FD\u4EE5\u65E5\u4E3B\u70BA\u57FA\u6E96\u3002",
  friend: "\u6BD4\u80A9\u4EE3\u8868\u540C\u6211\u3001\u540C\u4E94\u884C\u540C\u9670\u967D\u7684\u529B\u91CF\uFF0C\u50B3\u7D71\u4E0A\u5E38\u7528\u4F86\u89C0\u5BDF\u81EA\u7ACB\u3001\u540C\u8F29\u8207\u4E26\u884C\u7AF6\u5408\u3002",
  rob_wealth: "\u52AB\u8CA1\u4EE3\u8868\u540C\u6211\u3001\u540C\u4E94\u884C\u4F46\u9670\u967D\u4E0D\u540C\u7684\u529B\u91CF\uFF0C\u50B3\u7D71\u4E0A\u5E38\u7528\u4F86\u89C0\u5BDF\u7AF6\u5408\u3001\u5206\u914D\u8207\u8CC7\u6E90\u6D41\u52D5\u3002",
  eating_god: "\u98DF\u795E\u4EE3\u8868\u65E5\u4E3B\u6240\u751F\u3001\u9670\u967D\u76F8\u540C\u7684\u529B\u91CF\uFF0C\u50B3\u7D71\u4E0A\u5E38\u7528\u4F86\u89C0\u5BDF\u8868\u9054\u3001\u5275\u4F5C\u3001\u4EAB\u53D7\u8207\u8F38\u51FA\u3002",
  hurting_officer: "\u50B7\u5B98\u4EE3\u8868\u65E5\u4E3B\u6240\u751F\u3001\u9670\u967D\u4E0D\u540C\u7684\u529B\u91CF\uFF0C\u50B3\u7D71\u4E0A\u5E38\u7528\u4F86\u89C0\u5BDF\u624D\u83EF\u8868\u9054\u3001\u8B8A\u901A\u8207\u5C0D\u898F\u7BC4\u7684\u6311\u6230\u3002",
  indirect_wealth: "\u504F\u8CA1\u4EE3\u8868\u65E5\u4E3B\u6240\u524B\u3001\u9670\u967D\u76F8\u540C\u7684\u529B\u91CF\uFF0C\u50B3\u7D71\u4E0A\u5E38\u7528\u4F86\u89C0\u5BDF\u6D41\u52D5\u8CC7\u6E90\u3001\u6A5F\u6703\u8207\u4EBA\u969B\u5F80\u4F86\u3002",
  direct_wealth: "\u6B63\u8CA1\u4EE3\u8868\u65E5\u4E3B\u6240\u524B\u3001\u9670\u967D\u4E0D\u540C\u7684\u529B\u91CF\uFF0C\u50B3\u7D71\u4E0A\u5E38\u7528\u4F86\u89C0\u5BDF\u7A69\u5B9A\u8CC7\u6E90\u3001\u8CAC\u4EFB\u8207\u5BE6\u969B\u7BA1\u7406\u3002",
  seven_killings: "\u4E03\u6BBA\u4EE3\u8868\u524B\u5236\u65E5\u4E3B\u3001\u9670\u967D\u76F8\u540C\u7684\u529B\u91CF\uFF0C\u50B3\u7D71\u4E0A\u5E38\u7528\u4F86\u89C0\u5BDF\u58D3\u529B\u3001\u6311\u6230\u3001\u7D00\u5F8B\u8207\u6B0A\u5A01\u3002",
  direct_officer: "\u6B63\u5B98\u4EE3\u8868\u524B\u5236\u65E5\u4E3B\u3001\u9670\u967D\u4E0D\u540C\u7684\u529B\u91CF\uFF0C\u50B3\u7D71\u4E0A\u5E38\u7528\u4F86\u89C0\u5BDF\u79E9\u5E8F\u3001\u898F\u7BC4\u3001\u8077\u5206\u8207\u8CAC\u4EFB\u3002",
  indirect_resource: "\u504F\u5370\u4EE3\u8868\u751F\u52A9\u65E5\u4E3B\u3001\u9670\u967D\u76F8\u540C\u7684\u529B\u91CF\uFF0C\u50B3\u7D71\u4E0A\u5E38\u7528\u4F86\u89C0\u5BDF\u76F4\u89BA\u3001\u504F\u9580\u77E5\u8B58\u8207\u975E\u5178\u578B\u652F\u6301\u3002",
  direct_resource: "\u6B63\u5370\u4EE3\u8868\u751F\u52A9\u65E5\u4E3B\u3001\u9670\u967D\u4E0D\u540C\u7684\u529B\u91CF\uFF0C\u50B3\u7D71\u4E0A\u5E38\u7528\u4F86\u89C0\u5BDF\u5B78\u7FD2\u3001\u53D7\u52A9\u3001\u5E87\u852D\u8207\u6B63\u898F\u8CC7\u6E90\u3002"
});
var HIDDEN_ROLE_INTERPRETATIONS = Object.freeze({
  primary: "\u672C\u6C23\u662F\u5730\u652F\u6240\u85CF\u7684\u4E3B\u8981\u5929\u5E72\uFF0C\u901A\u5E38\u8996\u70BA\u8A72\u5730\u652F\u6700\u6838\u5FC3\u7684\u85CF\u6C23\u3002",
  secondary: "\u4E2D\u6C23\u662F\u5730\u652F\u6240\u85CF\u7684\u6B21\u8981\u5929\u5E72\uFF0C\u529B\u91CF\u901A\u5E38\u4F4E\u65BC\u672C\u6C23\u3002",
  residual: "\u9918\u6C23\u662F\u5730\u652F\u6240\u85CF\u7684\u6B98\u9918\u5929\u5E72\uFF0C\u529B\u91CF\u901A\u5E38\u4F4E\u65BC\u672C\u6C23\u8207\u4E2D\u6C23\u3002"
});

// src/tengods/index.js
var withTenGodInterpretation = (tenGod) => tenGod ? { ...tenGod, interpretation: tenGod.interpretation || TEN_GOD_INTERPRETATIONS[tenGod.id] || "" } : tenGod;
function calculateChartTenGods(pillars) {
  const dayMaster = pillars.day.stem;
  const stems = {
    year: withTenGodInterpretation(getTenGod(dayMaster, pillars.year.stem)),
    month: withTenGodInterpretation(getTenGod(dayMaster, pillars.month.stem)),
    day: withTenGodInterpretation({ id: "day_master", short: "\u65E5\u4E3B", full: "\u65E5\u4E3B" }),
    hour: pillars.hour.available ? withTenGodInterpretation(getTenGod(dayMaster, pillars.hour.stem)) : null
  };
  const calculateBranchTenGods = (branchChar) => {
    if (!branchChar) return [];
    const hidden2 = getHiddenStems(branchChar);
    return hidden2.map((h) => ({
      stem: h.stem,
      role: h.role,
      // 'primary' | 'secondary' | 'residual'
      weight: h.weight,
      days: h.days,
      tenGod: withTenGodInterpretation(getTenGod(dayMaster, h.stem)),
      roleInterpretation: HIDDEN_ROLE_INTERPRETATIONS[h.role] || ""
    }));
  };
  const hidden = {
    year: calculateBranchTenGods(pillars.year.branch),
    month: calculateBranchTenGods(pillars.month.branch),
    day: calculateBranchTenGods(pillars.day.branch),
    hour: pillars.hour.available ? calculateBranchTenGods(pillars.hour.branch) : []
  };
  return {
    dayMaster,
    stems,
    hidden
  };
}

// src/hidden-stems/index.js
function calculateChartHiddenStems(pillars) {
  return {
    year: getHiddenStems(pillars.year.branch),
    month: getHiddenStems(pillars.month.branch),
    day: getHiddenStems(pillars.day.branch),
    hour: pillars.hour.available ? getHiddenStems(pillars.hour.branch) : []
  };
}

// src/core/constants/nayin-data.js
var NAYIN = [
  "\u6D77\u4E2D\u91D1",
  "\u6D77\u4E2D\u91D1",
  "\u7210\u4E2D\u706B",
  "\u7210\u4E2D\u706B",
  "\u5927\u6797\u6728",
  "\u5927\u6797\u6728",
  "\u8DEF\u65C1\u571F",
  "\u8DEF\u65C1\u571F",
  "\u528D\u92D2\u91D1",
  "\u528D\u92D2\u91D1",
  "\u5C71\u982D\u706B",
  "\u5C71\u982D\u706B",
  "\u6F97\u4E0B\u6C34",
  "\u6F97\u4E0B\u6C34",
  "\u57CE\u982D\u571F",
  "\u57CE\u982D\u571F",
  "\u767D\u881F\u91D1",
  "\u767D\u881F\u91D1",
  "\u694A\u67F3\u6728",
  "\u694A\u67F3\u6728",
  "\u6CC9\u4E2D\u6C34",
  "\u6CC9\u4E2D\u6C34",
  "\u5C4B\u4E0A\u571F",
  "\u5C4B\u4E0A\u571F",
  "\u9739\u9742\u706B",
  "\u9739\u9742\u706B",
  "\u677E\u67CF\u6728",
  "\u677E\u67CF\u6728",
  "\u9577\u6D41\u6C34",
  "\u9577\u6D41\u6C34",
  "\u7802\u4E2D\u91D1",
  "\u7802\u4E2D\u91D1",
  "\u5C71\u4E0B\u706B",
  "\u5C71\u4E0B\u706B",
  "\u5E73\u5730\u6728",
  "\u5E73\u5730\u6728",
  "\u58C1\u4E0A\u571F",
  "\u58C1\u4E0A\u571F",
  "\u91D1\u7B94\u91D1",
  "\u91D1\u7B94\u91D1",
  "\u8986\u71C8\u706B",
  "\u8986\u71C8\u706B",
  "\u5929\u6CB3\u6C34",
  "\u5929\u6CB3\u6C34",
  "\u5927\u9A5B\u571F",
  "\u5927\u9A5B\u571F",
  "\u91F5\u91E7\u91D1",
  "\u91F5\u91E7\u91D1",
  "\u6851\u67D8\u6728",
  "\u6851\u67D8\u6728",
  "\u5927\u6EAA\u6C34",
  "\u5927\u6EAA\u6C34",
  "\u6C99\u4E2D\u571F",
  "\u6C99\u4E2D\u571F",
  "\u5929\u4E0A\u706B",
  "\u5929\u4E0A\u706B",
  "\u77F3\u69B4\u6728",
  "\u77F3\u69B4\u6728",
  "\u5927\u6D77\u6C34",
  "\u5927\u6D77\u6C34"
];
function getNayin(stemBranchIndex) {
  const i = (stemBranchIndex % 60 + 60) % 60;
  return NAYIN[i];
}

// src/nayin/index.js
function calculateChartNayin(pillars) {
  return {
    year: getNayin(pillars.year.sexagenaryIndex),
    month: getNayin(pillars.month.sexagenaryIndex),
    day: getNayin(pillars.day.sexagenaryIndex),
    hour: pillars.hour.available ? getNayin(pillars.hour.sexagenaryIndex) : null
  };
}

// src/core/constants/twelve-stages-data.js
var STAGES = [
  "\u9577\u751F",
  "\u6C90\u6D74",
  "\u51A0\u5E36",
  "\u81E8\u5B98",
  "\u5E1D\u65FA",
  "\u8870",
  "\u75C5",
  "\u6B7B",
  "\u5893",
  "\u7D55",
  "\u80CE",
  "\u990A"
];
var STAGE_IDS = [
  "chang_sheng",
  "mu_yu",
  "guan_dai",
  "lin_guan",
  "di_wang",
  "shuai",
  "bing",
  "si",
  "mu",
  "jue",
  "tai",
  "yang"
];
var STEM_CHANGSHENG_MAP = {
  "\u7532": { startBranch: "\u4EA5", forward: true },
  "\u4E59": { startBranch: "\u5348", forward: false },
  "\u4E19": { startBranch: "\u5BC5", forward: true },
  "\u4E01": { startBranch: "\u9149", forward: false },
  "\u620A": { startBranch: "\u5BC5", forward: true },
  "\u5DF1": { startBranch: "\u9149", forward: false },
  "\u5E9A": { startBranch: "\u5DF3", forward: true },
  "\u8F9B": { startBranch: "\u5B50", forward: false },
  "\u58EC": { startBranch: "\u7533", forward: true },
  "\u7678": { startBranch: "\u536F", forward: false }
};
function getTwelveStage(stemChar, branchChar) {
  const rule3 = STEM_CHANGSHENG_MAP[stemChar];
  if (!rule3) return null;
  const startIdx = BRANCH_INDEX[rule3.startBranch];
  const targetIdx = BRANCH_INDEX[branchChar];
  if (targetIdx === void 0) return null;
  let step;
  if (rule3.forward) {
    step = (targetIdx - startIdx + 12) % 12;
  } else {
    step = (startIdx - targetIdx + 12) % 12;
  }
  return {
    id: STAGE_IDS[step],
    name: STAGES[step],
    step
  };
}

// src/twelve-stages/index.js
function calculateChartTwelveStages(pillars) {
  const dayMaster = pillars.day.stem;
  const byDayMaster = {
    year: getTwelveStage(dayMaster, pillars.year.branch),
    month: getTwelveStage(dayMaster, pillars.month.branch),
    day: getTwelveStage(dayMaster, pillars.day.branch),
    hour: pillars.hour.available ? getTwelveStage(dayMaster, pillars.hour.branch) : null
  };
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

// src/core/constants/kongwang-data.js
var XUN_KONGWANG = [
  // 甲子旬 (0-9): 戌、亥空
  { start: 0, end: 9, name: "\u7532\u5B50\u65EC", kong: ["\u620C", "\u4EA5"] },
  // 甲戌旬 (10-19): 申、酉空
  { start: 10, end: 19, name: "\u7532\u620C\u65EC", kong: ["\u7533", "\u9149"] },
  // 甲申旬 (20-29): 午、未空
  { start: 20, end: 29, name: "\u7532\u7533\u65EC", kong: ["\u5348", "\u672A"] },
  // 甲午旬 (30-39): 辰、巳空
  { start: 30, end: 39, name: "\u7532\u5348\u65EC", kong: ["\u8FB0", "\u5DF3"] },
  // 甲辰旬 (40-49): 寅、卯空
  { start: 40, end: 49, name: "\u7532\u8FB0\u65EC", kong: ["\u5BC5", "\u536F"] },
  // 甲寅旬 (50-59): 子、丑空
  { start: 50, end: 59, name: "\u7532\u5BC5\u65EC", kong: ["\u5B50", "\u4E11"] }
];
function getKongWangInfo(sexagenaryIdx) {
  const i = (sexagenaryIdx % 60 + 60) % 60;
  const xun = XUN_KONGWANG.find((x) => i >= x.start && i <= x.end);
  return xun ? {
    xunName: xun.name,
    xunStart: xun.start,
    xunEnd: xun.end,
    branches: [...xun.kong]
  } : {
    xunName: null,
    xunStart: null,
    xunEnd: null,
    branches: []
  };
}

// src/core/constants/kongwang-calc.js
function calculateChartKongWang(pillars) {
  const dayKong = getKongWangInfo(pillars.day.sexagenaryIndex);
  const yearKong = getKongWangInfo(pillars.year.sexagenaryIndex);
  const checkHits = (kongBranches) => ({
    year: kongBranches.includes(pillars.year.branch),
    month: kongBranches.includes(pillars.month.branch),
    day: kongBranches.includes(pillars.day.branch),
    hour: pillars.hour.available ? kongBranches.includes(pillars.hour.branch) : false
  });
  const toRecord = (source, pillar) => ({
    method: "six-jia-xun-kong",
    ruleId: "AUX_KONGWANG_SIX_XUN_001",
    version: "1.0.0",
    tradition: "classical-ziping",
    conceptType: "auxiliary",
    ruleFamily: "xun-kong",
    baseOn: [pillar, `${pillar}.sexagenaryIndex`],
    scope: "pillar-xun",
    category: "void-branch",
    confidence: "classical-derived",
    pillar,
    sexagenaryIndex: pillars[pillar].sexagenaryIndex,
    xunName: source.xunName,
    xunStart: source.xunStart,
    xunEnd: source.xunEnd,
    branches: source.branches,
    hits: checkHits(source.branches),
    references: [
      {
        sourceId: "san-ming-tong-hui",
        title: "\u300A\u4E09\u547D\u901A\u6703\u300B",
        locator: "\u5377\u4E09\u3008\u8AD6\u7A7A\u4EA1\u3009",
        url: "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u4E09"
      }
    ],
    variants: [
      { id: "day-based", description: "\u65E5\u67F1\u65EC\u7A7A\u662F\u5B50\u5E73\u6392\u76E4\u6700\u5E38\u898B\u7684\u4E3B\u5224\u5B9A\u3002" },
      { id: "year-based", description: "\u5E74\u67F1\u65EC\u7A7A\u53EF\u53E6\u5217\u70BA\u5E74\u7A7A\uFF0C\u4E0D\u80FD\u8207\u65E5\u7A7A\u6DF7\u70BA\u540C\u4E00\u7D50\u679C\u3002" },
      { id: "void-branch-interpretation", description: "\u7A7A\u4EA1\u662F\u5426\u6210\u7ACB\u53CA\u5176\u5409\u51F6\uFF0C\u4ECD\u9700\u4F9D\u6D41\u6D3E\u8207\u5168\u5C40\uFF0C\u4E0D\u7531\u547D\u4E2D\u5169\u652F\u55AE\u7368\u65B7\u5B9A\u3002" }
    ],
    researchNotes: {
      conflict: false,
      note: "\u672C\u6B04\u53EA\u8A08\u7B97\u516D\u7532\u65EC\u4E2D\u672A\u914D\u51FA\u7684\u5169\u500B\u5730\u652F\uFF1B\u4E0D\u76F4\u63A5\u63A8\u5C0E\u5409\u51F6\u3002"
    },
    evidence: {
      matched: true,
      sourcePillar: pillars[pillar].ganzhi,
      xun: source.xunName,
      algorithm: "sexagenary-index-to-six-xun",
      voidBranches: source.branches,
      hits: checkHits(source.branches)
    }
  });
  return {
    byDay: {
      ...toRecord(dayKong, "day")
    },
    byYear: {
      ...toRecord(yearKong, "year")
    }
  };
}

// src/auxiliary/index.js
var auxiliary_exports = {};
__export(auxiliary_exports, {
  calculateChartAuxiliary: () => calculateChartAuxiliary,
  calculateMingGua: () => calculateMingGua
});

// src/auxiliary/ming-gua.js
var MING_GUA_METHOD = "bazhai-ming-gua-last-two-digits";
var MING_GUA_VERSION = "1.0.0";
var MING_GUA_RULE_ID = "AUX_MING_GUA_LAST_TWO_DIGITS";
var TRIGRAMS = Object.freeze({
  1: { name: "\u574E", symbol: "\u2635", element: "\u6C34", direction: "\u5317", group: "east", groupName: "\u6771\u56DB\u547D" },
  2: { name: "\u5764", symbol: "\u2637", element: "\u571F", direction: "\u897F\u5357", group: "west", groupName: "\u897F\u56DB\u547D" },
  3: { name: "\u9707", symbol: "\u2633", element: "\u6728", direction: "\u6771", group: "east", groupName: "\u6771\u56DB\u547D" },
  4: { name: "\u5DFD", symbol: "\u2634", element: "\u6728", direction: "\u6771\u5357", group: "east", groupName: "\u6771\u56DB\u547D" },
  6: { name: "\u4E7E", symbol: "\u2630", element: "\u91D1", direction: "\u897F\u5317", group: "west", groupName: "\u897F\u56DB\u547D" },
  7: { name: "\u514C", symbol: "\u2631", element: "\u91D1", direction: "\u897F", group: "west", groupName: "\u897F\u56DB\u547D" },
  8: { name: "\u826E", symbol: "\u2636", element: "\u571F", direction: "\u6771\u5317", group: "west", groupName: "\u897F\u56DB\u547D" },
  9: { name: "\u96E2", symbol: "\u2632", element: "\u706B", direction: "\u5357", group: "east", groupName: "\u6771\u56DB\u547D" }
});
var REFERENCES = Object.freeze([
  "https://www.d02.cn/tool/bazhai/",
  "https://m.k366.com/minggua/1984.htm",
  "https://guanyitang.com/tools/kua-number",
  "docs/references/special-systems.md"
]);
function reduceToNine(value) {
  const remainder = (value % 9 + 9) % 9;
  return remainder === 0 ? 9 : remainder;
}
function normalizeGender(gender) {
  if (gender === "male" || gender === "female") return gender;
  throw new Error(`\u547D\u5366\u9700\u8981 gender \u70BA male \u6216 female\uFF0C\u6536\u5230\uFF1A${gender}`);
}
function calculateMingGua({
  solarYear,
  effectiveYear,
  yearPillar = null,
  gender,
  yearBoundary = "lichun"
} = {}) {
  const normalizedGender = normalizeGender(gender);
  const selectedYear = Number.isInteger(yearPillar?.baziYear) ? yearPillar.baziYear : Number.isInteger(effectiveYear) ? effectiveYear : solarYear;
  if (!Number.isInteger(selectedYear) || selectedYear < 1) {
    throw new Error("\u547D\u5366\u9700\u8981\u6709\u6548\u7684 solarYear/effectiveYear");
  }
  const yearLastTwo = (selectedYear % 100 + 100) % 100;
  const rawNumber = normalizedGender === "male" ? 100 - yearLastTwo : yearLastTwo - 4;
  const remainder = reduceToNine(rawNumber);
  const guaNumber = remainder === 5 ? normalizedGender === "male" ? 2 : 8 : remainder;
  const trigram = TRIGRAMS[guaNumber];
  return {
    modelId: MING_GUA_METHOD,
    version: MING_GUA_VERSION,
    confidence: "modern-common",
    tradition: "bazhai",
    conceptType: "auxiliary",
    ruleFamily: "ming-gua",
    baseOn: ["effectiveSolarYear", "gender"],
    scope: "birth-year",
    category: "auxiliary",
    ruleId: MING_GUA_RULE_ID,
    method: MING_GUA_METHOD,
    yearBoundary,
    yearBasis: yearBoundary,
    effectiveYear: selectedYear,
    gender: normalizedGender,
    yearLastTwo,
    rawNumber,
    remainder,
    guaNumber,
    number: guaNumber,
    trigram: { ...trigram },
    group: trigram.group,
    groupName: trigram.groupName,
    references: REFERENCES,
    description: "\u4EE5\u672C\u547D\u76E4\u5207\u5E74\u5F8C\u7684\u5E74\u4EFD\u672B\u5169\u4F4D\u6578\u8207\u6027\u5225\u63A8\u7B97\u516B\u5B85\u547D\u5366\uFF0C\u4E26\u5206\u985E\u70BA\u6771\u56DB\u547D\u6216\u897F\u56DB\u547D\u3002",
    variants: [
      {
        id: "full-year-sum",
        description: "\u90E8\u5206\u73FE\u4EE3\u5DE5\u5177\u6539\u7528\u897F\u5143\u5B8C\u6574\u5E74\u4EFD\u6578\u5B57\u548C\u6216 2000 \u5E74\u5F8C\u53E6\u4E00\u5957\u516C\u5F0F\uFF0C\u53EF\u80FD\u9020\u6210\u547D\u5366\u4E0D\u540C\u3002"
      },
      {
        id: "five-number",
        description: "\u9918\u6578 5 \u5E38\u9700\u4F9D\u6027\u5225\u5BC4\u5366\uFF1A\u7537\u5BC4\u5764\u3001\u5973\u5BC4\u826E\uFF1B\u9019\u88E1\u660E\u78BA\u8A18\u9304\u8F49\u63DB\u3002"
      }
    ],
    researchNotes: {
      conflict: true,
      note: "\u547D\u5366\u5C6C\u516B\u5B85\u8F14\u52A9\u6CD5\uFF0C\u4E0D\u662F\u5B50\u5E73\u56DB\u67F1\u7684\u7D71\u4E00\u6838\u5FC3\u898F\u5247\uFF1B\u8DE8\u4E16\u7D00\u3001\u7ACB\u6625\u5207\u5E74\u53CA\u9918 5 \u8655\u7406\u9700\u9010 profile \u6307\u5B9A\u3002",
      selectedVariant: "last-two-digits-with-5-gender-mapping",
      comparisonNote: "\u7DB2\u8DEF\u62BD\u6A23\u8CC7\u6599\u5C0D 2020 \u5973\u6027\u547D\u5366\u6709\u4E92\u76F8\u77DB\u76FE\u7684\u8868\u683C\uFF1B\u672C SDK \u4F9D\u516C\u5F0F\u8207\u591A\u500B\u5C0D\u7167\u6848\u4F8B\u63A1 \u514C\uFF08\u897F\u56DB\u547D\uFF09\uFF0C\u4E0D\u628A\u77DB\u76FE\u4F86\u6E90\u522A\u9664\u3002"
    },
    evidence: {
      matched: true,
      yearBoundary,
      effectiveYear: selectedYear,
      formula: normalizedGender === "male" ? `\u7537\u547D\uFF1A100 - ${yearLastTwo} = ${rawNumber}\uFF1B\u53D6 1\u20139 \u9918\u6578 ${remainder}` : `\u5973\u547D\uFF1A${yearLastTwo} - 4 = ${rawNumber}\uFF1B\u53D6 1\u20139 \u9918\u6578 ${remainder}`,
      fiveHandling: remainder === 5 ? `\u9918\u6578 5 \u6309\u6027\u5225\u5BC4${normalizedGender === "male" ? "\u5764\uFF082\uFF09" : "\u826E\uFF088\uFF09"}` : "\u7121\u9918\u6578 5 \u5BC4\u5366\u8F49\u63DB",
      targetValue: `${trigram.name}\uFF08${trigram.groupName}\uFF09`
    }
  };
}

// src/auxiliary/index.js
var STEM_HE = {
  "\u7532": "\u5DF1",
  "\u5DF1": "\u7532",
  "\u4E59": "\u5E9A",
  "\u5E9A": "\u4E59",
  "\u4E19": "\u8F9B",
  "\u8F9B": "\u4E19",
  "\u4E01": "\u58EC",
  "\u58EC": "\u4E01",
  "\u620A": "\u7678",
  "\u7678": "\u620A"
};
var BRANCH_HE = {
  "\u5B50": "\u4E11",
  "\u4E11": "\u5B50",
  "\u5BC5": "\u4EA5",
  "\u4EA5": "\u5BC5",
  "\u536F": "\u620C",
  "\u620C": "\u536F",
  "\u8FB0": "\u9149",
  "\u9149": "\u8FB0",
  "\u5DF3": "\u7533",
  "\u7533": "\u5DF3",
  "\u5348": "\u672A",
  "\u672A": "\u5348"
};
var WU_HU_DUN2 = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
var YIN_BASED_BRANCH_ORDER2 = ["\u5BC5", "\u536F", "\u8FB0", "\u5DF3", "\u5348", "\u672A", "\u7533", "\u9149", "\u620C", "\u4EA5", "\u5B50", "\u4E11"];
var YIN_ORDER_MAP2 = Object.fromEntries(YIN_BASED_BRANCH_ORDER2.map((b, i) => [b, i]));
function calculateChartAuxiliary(pillars, context = {}) {
  const modelId = context.auxiliaryModel || "canonical-palm";
  const model = {
    id: modelId,
    status: modelId === "canonical-palm" ? "implemented" : "research-only",
    ruleId: modelId === "canonical-palm" ? "AUX_CANONICAL_PALM_001" : "AUX_SANMING_PALM_RESEARCH_001",
    version: modelId === "canonical-palm" ? "1.0.0" : "0.1.0",
    finalDecision: modelId === "canonical-palm",
    evidence: {
      matched: modelId === "canonical-palm",
      status: modelId === "canonical-palm" ? "implemented" : "research-only",
      reason: modelId === "canonical-palm" ? "\u63A1 BaziJS canonical \u638C\u8A23\u516C\u5F0F\u3002" : "\u5DF2\u4FDD\u7559\u7814\u7A76 Profile \u908A\u754C\uFF1B\u5C1A\u672A\u4EE5\u5B8C\u6574\u53E4\u7C4D\u8B8A\u9AD4\u53D6\u4EE3 canonical \u547D\u5BAE\uFF0F\u8EAB\u5BAE\u7D50\u679C\u3002"
    }
  };
  const mingGua = context.gender ? calculateMingGua({
    solarYear: context.solarYear,
    effectiveYear: context.effectiveYear,
    yearPillar: context.yearPillar || pillars.year,
    gender: context.gender,
    yearBoundary: context.yearBoundary || "lichun"
  }) : null;
  const mStemIdx = stemIndex(pillars.month.stem);
  const mBranchIdx = branchIndex(pillars.month.branch);
  const tyStemIdx = (mStemIdx + 1) % 10;
  const tyBranchIdx = (mBranchIdx + 3) % 12;
  const tyStem = stemAt(tyStemIdx).char;
  const tyBranch = branchAt(tyBranchIdx).char;
  const tyGanzhi = `${tyStem}${tyBranch}`;
  const tyIndex = sexagenaryIndex(tyStemIdx, tyBranchIdx);
  const taiYuan = {
    stem: tyStem,
    branch: tyBranch,
    ganzhi: tyGanzhi,
    nayin: getNayin(tyIndex)
  };
  const dStemChar = pillars.day.stem;
  const dBranchChar = pillars.day.branch;
  const txStem = STEM_HE[dStemChar];
  const txBranch = BRANCH_HE[dBranchChar];
  const txGanzhi = `${txStem}${txBranch}`;
  const txIndex = sexagenaryIndex(stemIndex(txStem), branchIndex(txBranch));
  const taiXi = {
    stem: txStem,
    branch: txBranch,
    ganzhi: txGanzhi,
    nayin: getNayin(txIndex)
  };
  if (!pillars.hour.available) {
    return {
      model,
      taiYuan,
      taiXi,
      mingGong: null,
      shenGong: null,
      mingGua
    };
  }
  const branchToMonthNum = (bChar) => {
    const idx = YIN_ORDER_MAP2[bChar];
    return idx + 1;
  };
  const branchToHourNum = (bChar) => {
    return branchIndex(bChar) + 1;
  };
  const mNum = branchToMonthNum(pillars.month.branch);
  const hNum = branchToHourNum(pillars.hour.branch);
  let mgVal = 14 - mNum - hNum;
  while (mgVal <= 0) mgVal += 12;
  while (mgVal > 12) mgVal -= 12;
  const mgBranchChar = YIN_BASED_BRANCH_ORDER2[mgVal - 1];
  let sgVal = mNum + hNum - 2;
  while (sgVal <= 0) sgVal += 12;
  while (sgVal > 12) sgVal -= 12;
  const sgBranchChar = YIN_BASED_BRANCH_ORDER2[sgVal - 1];
  const yStemIdx = stemIndex(pillars.year.stem);
  const tigerStart = WU_HU_DUN2[yStemIdx];
  const mgStep = YIN_ORDER_MAP2[mgBranchChar];
  const mgStemIdx = (tigerStart + mgStep) % 10;
  const mgStem = stemAt(mgStemIdx).char;
  const mgGanzhi = `${mgStem}${mgBranchChar}`;
  const mgIndex = sexagenaryIndex(mgStemIdx, branchIndex(mgBranchChar));
  const sgStep = YIN_ORDER_MAP2[sgBranchChar];
  const sgStemIdx = (tigerStart + sgStep) % 10;
  const sgStem = stemAt(sgStemIdx).char;
  const sgGanzhi = `${sgStem}${sgBranchChar}`;
  const sgIndex = sexagenaryIndex(sgStemIdx, branchIndex(sgBranchChar));
  const mingGong = {
    stem: mgStem,
    branch: mgBranchChar,
    ganzhi: mgGanzhi,
    nayin: getNayin(mgIndex)
  };
  const shenGong = {
    stem: sgStem,
    branch: sgBranchChar,
    ganzhi: sgGanzhi,
    nayin: getNayin(sgIndex)
  };
  return {
    model,
    taiYuan,
    taiXi,
    mingGong,
    shenGong,
    mingGua
  };
}

// src/core/constants/interactions-data.js
var SIX_COMBINATIONS = [
  { branches: ["\u5B50", "\u4E11"], generates: "\u571F", name: "\u5B50\u4E11\u5408\u571F" },
  { branches: ["\u5BC5", "\u4EA5"], generates: "\u6728", name: "\u5BC5\u4EA5\u5408\u6728" },
  { branches: ["\u536F", "\u620C"], generates: "\u706B", name: "\u536F\u620C\u5408\u706B" },
  { branches: ["\u8FB0", "\u9149"], generates: "\u91D1", name: "\u8FB0\u9149\u5408\u91D1" },
  { branches: ["\u5DF3", "\u7533"], generates: "\u6C34", name: "\u5DF3\u7533\u5408\u6C34" },
  { branches: ["\u5348", "\u672A"], generates: "\u571F", name: "\u5348\u672A\u5408\u571F" }
  // 亦有日月合化火土，canonical採火/土
];
var SIX_CLASHES = [
  { pair: ["\u5B50", "\u5348"], name: "\u5B50\u5348\u6C96" },
  { pair: ["\u4E11", "\u672A"], name: "\u4E11\u672A\u6C96" },
  { pair: ["\u5BC5", "\u7533"], name: "\u5BC5\u7533\u6C96" },
  { pair: ["\u536F", "\u9149"], name: "\u536F\u9149\u6C96" },
  { pair: ["\u8FB0", "\u620C"], name: "\u8FB0\u620C\u6C96" },
  { pair: ["\u5DF3", "\u4EA5"], name: "\u5DF3\u4EA5\u6C96" }
];
var TRIPLE_COMBINATIONS = [
  { branches: ["\u7533", "\u5B50", "\u8FB0"], element: "\u6C34", name: "\u7533\u5B50\u8FB0\u4E09\u5408\u6C34\u5C40", sheng: "\u7533", wang: "\u5B50", mu: "\u8FB0" },
  { branches: ["\u4EA5", "\u536F", "\u672A"], element: "\u6728", name: "\u4EA5\u536F\u672A\u4E09\u5408\u6728\u5C40", sheng: "\u4EA5", wang: "\u536F", mu: "\u672A" },
  { branches: ["\u5BC5", "\u5348", "\u620C"], element: "\u706B", name: "\u5BC5\u5348\u620C\u4E09\u5408\u706B\u5C40", sheng: "\u5BC5", wang: "\u5348", mu: "\u620C" },
  { branches: ["\u5DF3", "\u9149", "\u4E11"], element: "\u91D1", name: "\u5DF3\u9149\u4E11\u4E09\u5408\u91D1\u5C40", sheng: "\u5DF3", wang: "\u9149", mu: "\u4E11" }
];
var TRIPLE_MEETINGS = [
  { branches: ["\u5BC5", "\u536F", "\u8FB0"], element: "\u6728", direction: "\u6771\u65B9", name: "\u5BC5\u536F\u8FB0\u4E09\u6703\u6771\u65B9\u6728" },
  { branches: ["\u5DF3", "\u5348", "\u672A"], element: "\u706B", direction: "\u5357\u65B9", name: "\u5DF3\u5348\u672A\u4E09\u6703\u5357\u65B9\u706B" },
  { branches: ["\u7533", "\u9149", "\u620C"], element: "\u91D1", direction: "\u897F\u65B9", name: "\u7533\u9149\u620C\u4E09\u6703\u897F\u65B9\u91D1" },
  { branches: ["\u4EA5", "\u5B50", "\u4E11"], element: "\u6C34", direction: "\u5317\u65B9", name: "\u4EA5\u5B50\u4E11\u4E09\u6703\u5317\u65B9\u6C34" }
];
var SIX_HARMS = [
  { pair: ["\u5B50", "\u672A"], name: "\u5B50\u672A\u5BB3" },
  { pair: ["\u4E11", "\u5348"], name: "\u4E11\u5348\u5BB3" },
  { pair: ["\u5BC5", "\u5DF3"], name: "\u5BC5\u5DF3\u5BB3" },
  { pair: ["\u536F", "\u8FB0"], name: "\u536F\u8FB0\u5BB3" },
  { pair: ["\u7533", "\u4EA5"], name: "\u7533\u4EA5\u5BB3" },
  { pair: ["\u9149", "\u620C"], name: "\u9149\u620C\u5BB3" }
];
var SIX_DESTRUCTIONS = [
  { pair: ["\u5B50", "\u9149"], name: "\u5B50\u9149\u7834" },
  { pair: ["\u4E11", "\u8FB0"], name: "\u4E11\u8FB0\u7834" },
  { pair: ["\u5BC5", "\u4EA5"], name: "\u5BC5\u4EA5\u7834" },
  { pair: ["\u536F", "\u5348"], name: "\u536F\u5348\u7834" },
  { pair: ["\u5DF3", "\u7533"], name: "\u5DF3\u7533\u7834" },
  { pair: ["\u672A", "\u620C"], name: "\u672A\u620C\u7834" }
];
var STEM_COMBINATIONS = [
  { pair: ["\u7532", "\u5DF1"], generates: "\u571F", name: "\u7532\u5DF1\u5408\u571F" },
  { pair: ["\u4E59", "\u5E9A"], generates: "\u91D1", name: "\u4E59\u5E9A\u5408\u91D1" },
  { pair: ["\u4E19", "\u8F9B"], generates: "\u6C34", name: "\u4E19\u8F9B\u5408\u6C34" },
  { pair: ["\u4E01", "\u58EC"], generates: "\u6728", name: "\u4E01\u58EC\u5408\u6728" },
  { pair: ["\u620A", "\u7678"], generates: "\u706B", name: "\u620A\u7678\u5408\u706B" }
];
var STEM_CLASHES = [
  { pair: ["\u7532", "\u5E9A"], name: "\u7532\u5E9A\u6C96" },
  { pair: ["\u4E59", "\u8F9B"], name: "\u4E59\u8F9B\u6C96" },
  { pair: ["\u4E19", "\u58EC"], name: "\u4E19\u58EC\u6C96" },
  { pair: ["\u4E01", "\u7678"], name: "\u4E01\u7678\u6C96" }
];

// src/interactions/index.js
var TRANSFORMATION_TYPES = /* @__PURE__ */ new Set([
  "stem_combine",
  "six_combination",
  "triple_combination",
  "triple_meeting",
  "half_combination",
  "arch_combination"
]);
function enrichInteraction(interaction) {
  const isTransformationCandidate = TRANSFORMATION_TYPES.has(interaction.type);
  const formationStatus = interaction.type === "triple_combination" || interaction.type === "triple_meeting" ? "complete" : interaction.type === "half_combination" ? "partial" : interaction.type === "arch_combination" ? "virtual" : "pair";
  return {
    ...interaction,
    formation: {
      type: interaction.type,
      status: formationStatus,
      complete: formationStatus === "complete"
    },
    transformability: {
      status: isTransformationCandidate ? "candidate" : "not-applicable",
      applied: false,
      targetElement: interaction.element || interaction.generates || null,
      requires: isTransformationCandidate ? ["seasonal-support", "\u900F\u5E72\uFF0F\u5F97\u7528", "\u7121\u963B\u9694\u6216\u7834\u58DE", "profile-transformation-policy"] : [],
      reason: isTransformationCandidate ? "\u7D50\u69CB\u5DF2\u89C0\u6E2C\uFF0C\u4F46\u6210\u5316\u4ECD\u9808\u53E6\u884C\u6AA2\u67E5\u5B63\u7BC0\u3001\u900F\u5E72\u3001\u963B\u9694\u8207\u6D41\u6D3E Profile\u3002" : "\u6B64\u4E92\u52D5\u4E0D\u662F\u4E94\u884C\u6210\u5316\u5019\u9078\u3002"
    },
    evidence: {
      matched: true,
      basedOn: ["pillars", "interaction-structure"],
      chars: Array.isArray(interaction.chars) ? [...interaction.chars] : [],
      pillars: Array.isArray(interaction.pillars) ? [...interaction.pillars] : [],
      structuralType: interaction.type,
      transformationCandidate: isTransformationCandidate
    }
  };
}
function calculateInteractions(pillars) {
  const stemItems = [
    { pillar: "year", char: pillars.year.stem },
    { pillar: "month", char: pillars.month.stem },
    { pillar: "day", char: pillars.day.stem },
    ...pillars.hour.available ? [{ pillar: "hour", char: pillars.hour.stem }] : []
  ];
  const branchItems = [
    { pillar: "year", char: pillars.year.branch },
    { pillar: "month", char: pillars.month.branch },
    { pillar: "day", char: pillars.day.branch },
    ...pillars.hour.available ? [{ pillar: "hour", char: pillars.hour.branch }] : []
  ];
  const stemsInteractions = [];
  const branchesInteractions = [];
  for (let i = 0; i < stemItems.length; i++) {
    for (let j = i + 1; j < stemItems.length; j++) {
      const a = stemItems[i];
      const b = stemItems[j];
      const combo = STEM_COMBINATIONS.find(
        (c) => c.pair[0] === a.char && c.pair[1] === b.char || c.pair[0] === b.char && c.pair[1] === a.char
      );
      if (combo) {
        stemsInteractions.push({
          type: "stem_combine",
          name: combo.name,
          generates: combo.generates,
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }
      const clash = STEM_CLASHES.find(
        (c) => c.pair[0] === a.char && c.pair[1] === b.char || c.pair[0] === b.char && c.pair[1] === a.char
      );
      if (clash) {
        stemsInteractions.push({
          type: "stem_clash",
          name: clash.name,
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }
    }
  }
  const branchChars = branchItems.map((b) => b.char);
  for (const meet of TRIPLE_MEETINGS) {
    if (meet.branches.every((b) => branchChars.includes(b))) {
      const hitPillars = meet.branches.map((b) => branchItems.find((item) => item.char === b).pillar);
      branchesInteractions.push({
        type: "triple_meeting",
        name: meet.name,
        element: meet.element,
        direction: meet.direction,
        pillars: hitPillars,
        chars: meet.branches
      });
    }
  }
  for (const tri of TRIPLE_COMBINATIONS) {
    const present = tri.branches.filter((b) => branchChars.includes(b));
    if (present.length === 3) {
      const hitPillars = tri.branches.map((b) => branchItems.find((item) => item.char === b).pillar);
      branchesInteractions.push({
        type: "triple_combination",
        name: tri.name,
        element: tri.element,
        pillars: hitPillars,
        chars: tri.branches
      });
    } else if (present.length === 2) {
      const hasWang = present.includes(tri.wang);
      const hitPillars = present.map((b) => branchItems.find((item) => item.char === b).pillar);
      if (hasWang) {
        const other = present.find((b) => b !== tri.wang);
        const isShengWang = other === tri.sheng;
        const subName = isShengWang ? `${other}${tri.wang}\u751F\u5730\u534A\u5408${tri.element}` : `${tri.wang}${other}\u5893\u5730\u534A\u5408${tri.element}`;
        branchesInteractions.push({
          type: "half_combination",
          name: subName,
          element: tri.element,
          pillars: hitPillars,
          chars: present
        });
      } else {
        branchesInteractions.push({
          type: "arch_combination",
          name: `${present[0]}${present[1]}\u62F1${tri.wang}\uFF08\u62F1${tri.element}\u5C40\uFF09`,
          element: tri.element,
          archTarget: tri.wang,
          pillars: hitPillars,
          chars: present
        });
      }
    }
  }
  for (let i = 0; i < branchItems.length; i++) {
    for (let j = i + 1; j < branchItems.length; j++) {
      const a = branchItems[i];
      const b = branchItems[j];
      const sixHe = SIX_COMBINATIONS.find(
        (c) => c.branches[0] === a.char && c.branches[1] === b.char || c.branches[0] === b.char && c.branches[1] === a.char
      );
      if (sixHe) {
        branchesInteractions.push({
          type: "six_combination",
          name: sixHe.name,
          generates: sixHe.generates,
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }
      const sixChong = SIX_CLASHES.find(
        (c) => c.pair[0] === a.char && c.pair[1] === b.char || c.pair[0] === b.char && c.pair[1] === a.char
      );
      if (sixChong) {
        branchesInteractions.push({
          type: "six_clash",
          name: sixChong.name,
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }
      const harm = SIX_HARMS.find(
        (c) => c.pair[0] === a.char && c.pair[1] === b.char || c.pair[0] === b.char && c.pair[1] === a.char
      );
      if (harm) {
        branchesInteractions.push({
          type: "six_harm",
          name: harm.name,
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }
      const destr = SIX_DESTRUCTIONS.find(
        (c) => c.pair[0] === a.char && c.pair[1] === b.char || c.pair[0] === b.char && c.pair[1] === a.char
      );
      if (destr) {
        branchesInteractions.push({
          type: "six_destruction",
          name: destr.name,
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }
      if (a.char === b.char && ["\u8FB0", "\u5348", "\u9149", "\u4EA5"].includes(a.char)) {
        branchesInteractions.push({
          type: "punishment_self",
          name: `${a.char}${b.char}\u81EA\u5211`,
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }
      if (a.char === "\u5B50" && b.char === "\u536F" || a.char === "\u536F" && b.char === "\u5B50") {
        branchesInteractions.push({
          type: "punishment_uncivil",
          name: "\u5B50\u536F\u7121\u79AE\u4E4B\u5211",
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }
    }
  }
  const checkThreeXing = (targetBranches, typeName) => {
    const present = targetBranches.filter((b) => branchChars.includes(b));
    if (present.length >= 2) {
      const hitPillars = present.map((b) => branchItems.find((item) => item.char === b).pillar);
      const isComplete = present.length === 3;
      branchesInteractions.push({
        type: isComplete ? "punishment_complete" : "punishment_partial",
        name: isComplete ? `${typeName}\u5168\uFF08${targetBranches.join("")}\uFF09` : `${typeName}\u534A\u5211\uFF08\u898B ${present.join("\u3001")}\uFF09`,
        pillars: hitPillars,
        chars: present
      });
    }
  };
  checkThreeXing(["\u5BC5", "\u5DF3", "\u7533"], "\u7121\u6069\u4E4B\u5211");
  checkThreeXing(["\u4E11", "\u620C", "\u672A"], "\u6043\u52E2\u4E4B\u5211");
  return {
    stems: stemsInteractions.map(enrichInteraction),
    branches: branchesInteractions.map(enrichInteraction)
  };
}

// src/strength/index.js
var strength_exports = {};
__export(strength_exports, {
  FIVE_CATEGORY_METHOD: () => FIVE_CATEGORY_METHOD,
  MONTH_COMMAND_PHASES: () => MONTH_COMMAND_PHASES,
  SAN_MING_MONTH_COMMAND_PHASES: () => SAN_MING_MONTH_COMMAND_PHASES,
  STRENGTH_QI_LAYER_VERSION: () => STRENGTH_QI_LAYER_VERSION,
  buildEffectiveQiSnapshot: () => buildEffectiveQiSnapshot,
  buildQiSnapshot: () => buildQiSnapshot,
  buildTransformationLayer: () => buildTransformationLayer,
  calculateFiveElementCategories: () => calculateFiveElementCategories,
  calculateMonthCommander: () => calculateMonthCommander,
  calculateStrength: () => calculateStrength
});

// src/strength/five-category.js
var FIVE_CATEGORY_METHOD = "canonical-use-derived";
var FIVE_CATEGORY_RULE_ID = "STR_FIVE_CATEGORY_CANONICAL_DERIVED";
var FIVE_CATEGORY_VERSION = "1.0.0";
var CATEGORY_META = Object.freeze({
  use: { label: "\u7528\u795E", description: "\u672C\u6A21\u578B\u9078\u5B9A\u3001\u7528\u4EE5\u5E73\u8861\u547D\u5C40\u7684\u4E94\u884C\u3002" },
  joy: { label: "\u559C\u795E", description: "\u751F\u52A9\u7528\u795E\u7684\u4E94\u884C\u3002" },
  idle: { label: "\u9592\u795E", description: "\u8207\u7528\u795E\u6C92\u6709\u76F4\u63A5\u4E3B\u8981\u751F\u524B\u65B9\u5411\u7684\u5269\u9918\u4E94\u884C\u3002" },
  adversary: { label: "\u4EC7\u795E", description: "\u751F\u52A9\u5FCC\u795E\u3001\u4F7F\u5FCC\u795E\u529B\u91CF\u589E\u5F37\u7684\u4E94\u884C\u3002" },
  taboo: { label: "\u5FCC\u795E", description: "\u76F4\u63A5\u5236\u7D04\u6216\u7834\u58DE\u7528\u795E\u7684\u4E94\u884C\u3002" }
});
var REFERENCES2 = Object.freeze([
  "https://www.minglitang.com.au/learn/favourable-unfavourable",
  "docs/references/special-systems.md"
]);
function requireElement(element) {
  const data = ELEMENTS.find((item) => item.char === element);
  if (!data) throw new Error(`\u4E0D\u652F\u63F4\u7684\u4E94\u884C\uFF1A${element}`);
  return data;
}
function categoryItem(element, category, useElement) {
  const meta = CATEGORY_META[category];
  return {
    element,
    category,
    label: meta.label,
    description: meta.description,
    relationToUse: elementRelation(element, useElement)
  };
}
function calculateFiveElementCategories({
  useElement = null,
  favorableElements = [],
  method = FIVE_CATEGORY_METHOD
} = {}) {
  if (method !== FIVE_CATEGORY_METHOD) {
    throw new Error(`\u4E0D\u652F\u63F4\u7684\u4E94\u5206\u985E\u65B9\u6CD5\uFF1A${method}`);
  }
  const selectedUseElement = useElement || favorableElements[0] || null;
  if (!selectedUseElement) return null;
  const useData = requireElement(selectedUseElement);
  const joyElement = useData.generatedBy;
  const tabooElement = useData.restrictedBy;
  const tabooData = requireElement(tabooElement);
  const adversaryElement = tabooData.generatedBy;
  const idleElement = ELEMENTS.map((item) => item.char).find((element) => ![selectedUseElement, joyElement, tabooElement, adversaryElement].includes(element));
  const assignments = {
    [selectedUseElement]: categoryItem(selectedUseElement, "use", selectedUseElement),
    [joyElement]: categoryItem(joyElement, "joy", selectedUseElement),
    [idleElement]: categoryItem(idleElement, "idle", selectedUseElement),
    [adversaryElement]: categoryItem(adversaryElement, "adversary", selectedUseElement),
    [tabooElement]: categoryItem(tabooElement, "taboo", selectedUseElement)
  };
  const groups = Object.fromEntries(Object.keys(CATEGORY_META).map((category) => [
    category,
    Object.values(assignments).filter((item) => item.category === category).map((item) => item.element)
  ]));
  return {
    modelId: FIVE_CATEGORY_METHOD,
    version: FIVE_CATEGORY_VERSION,
    confidence: "model-derived",
    tradition: "classical-ziping-compatible",
    conceptType: "strength-derived",
    ruleFamily: "use-god-five-category",
    baseOn: ["wholeChart", "dayMaster", "strength.favorableElements"],
    scope: "whole-chart",
    category: "analysis",
    ruleId: FIVE_CATEGORY_RULE_ID,
    method,
    useElement: selectedUseElement,
    selection: {
      basis: "canonical-strength.favorableElements[0]",
      candidates: [...new Set(favorableElements)],
      note: "\u7528\u795E\u7684\u9078\u53D6\u4ECD\u4F9D profile \u7684\u5F37\u5F31\u6A21\u578B\uFF1B\u672C\u6B04\u4F4D\u53EA\u8A18\u9304\u672C\u6B21\u6A21\u578B\u5982\u4F55\u5C55\u958B\u4E94\u5206\u985E\u3002"
    },
    byElement: assignments,
    groups,
    references: REFERENCES2,
    description: "\u4EE5 canonical \u6276\u6291\u6A21\u578B\u7684\u7B2C\u4E00\u500B\u559C\u7528\u4E94\u884C\u4F5C\u70BA\u7528\u795E\uFF0C\u518D\u6309\u751F\u524B\u95DC\u4FC2\u5C55\u958B\u7528\u3001\u559C\u3001\u9592\u3001\u4EC7\u3001\u5FCC\u3002",
    variants: [
      {
        id: "school-selected-use",
        description: "\u5176\u4ED6\u6D41\u6D3E\u53EF\u80FD\u5148\u4EE5\u8ABF\u5019\u3001\u683C\u5C40\u3001\u901A\u95DC\u6216\u900F\u5E72\u53D6\u7528\uFF0C\u5C0E\u81F4\u4E94\u5206\u985E\u4E0D\u540C\u3002"
      }
    ],
    researchNotes: {
      conflict: true,
      note: "\u4E94\u5206\u985E\u4F9D\u8CF4\u7528\u795E\u9078\u53D6\uFF1B\u53E4\u5178\u5B50\u5E73\u4E26\u6C92\u6709\u4E00\u4EFD\u8DE8\u6D41\u6D3E\u3001\u56FA\u5B9A\u4E94\u884C\u6392\u5E8F\u53EF\u76F4\u63A5\u53D6\u4EE3\u5224\u5C40\u3002"
    },
    evidence: {
      matched: true,
      selectedUseElement,
      derivation: [
        `${selectedUseElement}\u70BA\u7528\u795E`,
        `${joyElement}\u751F${selectedUseElement}\uFF0C\u5217\u70BA\u559C\u795E`,
        `${tabooElement}\u524B${selectedUseElement}\uFF0C\u5217\u70BA\u5FCC\u795E`,
        `${adversaryElement}\u751F${tabooElement}\uFF0C\u5217\u70BA\u4EC7\u795E`,
        `${idleElement}\u70BA\u5269\u9918\u4E94\u884C\uFF0C\u5217\u70BA\u9592\u795E`
      ],
      relations: Object.fromEntries(Object.values(assignments).map((item) => [item.element, item.relationToUse]))
    }
  };
}

// src/rules/versions.js
var ENGINE_VERSION = "1.0.2";
var API_VERSION = "1.0.0";
var GOVERNANCE_VERSION = "1.0.0";
var VALIDATION_MANIFEST_VERSION = "1.0.0";
var RULE_SET_VERSION = "2026.09";
var CALENDAR_RULE_VERSION = "1.0.0";
var TEN_GOD_RULE_VERSION = "1.0.0";
var HIDDEN_STEM_RULE_VERSION = "1.0.0";
var SHENSHA_RULE_VERSION = "2.1.0";
var SPECIAL_RULE_VERSION = "1.0.0";
var PATTERN_RULE_VERSION = "0.1.0";
var REGULAR_PATTERN_RULE_VERSION = "0.2.0";
var STRENGTH_RULE_VERSION = "1.0.0";
var STRENGTH_QI_LAYER_VERSION = "1.1.0";
var FIVE_CATEGORY_RULE_VERSION = "1.0.0";
var AUXILIARY_RULE_VERSION = "1.1.0";
var CLASSICAL_SUMMARY_RULE_VERSION = "1.0.0";
var ANALYSIS_RULE_VERSION = "1.0.0";
var USE_GOD_RESOLVER_VERSION = "0.1.0";
var TRANSIT_GRAPH_VERSION = "0.1.0";
var INTERACTION_RULE_VERSION = "1.0.0";
var LUCK_RULE_VERSION = "1.1.0";
var RESULT_SCHEMA_VERSION = "2.1.0";
var REFERENCE_TAXONOMY_VERSION = "0.1.0";
var REFERENCE_INDEX_VERSION = "0.1.0";
var REFERENCE_COVERAGE_VERSION = "0.1.0";
var VERSIONS = {
  engineVersion: ENGINE_VERSION,
  apiVersion: API_VERSION,
  governanceVersion: GOVERNANCE_VERSION,
  validationManifestVersion: VALIDATION_MANIFEST_VERSION,
  ruleSetVersion: RULE_SET_VERSION,
  calendarRuleVersion: CALENDAR_RULE_VERSION,
  tenGodRuleVersion: TEN_GOD_RULE_VERSION,
  hiddenStemRuleVersion: HIDDEN_STEM_RULE_VERSION,
  shenShaRuleVersion: SHENSHA_RULE_VERSION,
  specialRuleVersion: SPECIAL_RULE_VERSION,
  patternRuleVersion: PATTERN_RULE_VERSION,
  regularPatternRuleVersion: REGULAR_PATTERN_RULE_VERSION,
  strengthRuleVersion: STRENGTH_RULE_VERSION,
  strengthQiLayerVersion: STRENGTH_QI_LAYER_VERSION,
  fiveCategoryRuleVersion: FIVE_CATEGORY_RULE_VERSION,
  auxiliaryRuleVersion: AUXILIARY_RULE_VERSION,
  classicalSummaryRuleVersion: CLASSICAL_SUMMARY_RULE_VERSION,
  analysisRuleVersion: ANALYSIS_RULE_VERSION,
  useGodResolverVersion: USE_GOD_RESOLVER_VERSION,
  transitGraphVersion: TRANSIT_GRAPH_VERSION,
  interactionRuleVersion: INTERACTION_RULE_VERSION,
  luckRuleVersion: LUCK_RULE_VERSION,
  resultSchemaVersion: RESULT_SCHEMA_VERSION,
  referenceTaxonomyVersion: REFERENCE_TAXONOMY_VERSION,
  referenceIndexVersion: REFERENCE_INDEX_VERSION,
  referenceCoverageVersion: REFERENCE_COVERAGE_VERSION
};

// src/strength/qi-layers.js
var ELEMENTS2 = Object.freeze(["\u6728", "\u706B", "\u571F", "\u91D1", "\u6C34"]);
var TRANSFORMATION_TYPES2 = /* @__PURE__ */ new Set([
  "stem_combine",
  "six_combination",
  "triple_combination",
  "triple_meeting",
  "half_combination",
  "arch_combination"
]);
var round = (value) => Number(Number(value || 0).toFixed(1));
function partitionScores(elementScores, dayMasterElement) {
  let allyScore = 0;
  let enemyScore = 0;
  for (const [element, score] of Object.entries(elementScores)) {
    const relation = elementRelation(element, dayMasterElement);
    if (relation === "same" || relation === "generate") allyScore += score;
    else enemyScore += score;
  }
  return { allyScore: round(allyScore), enemyScore: round(enemyScore) };
}
function buildQiSnapshot(elementScores, dayMasterElement) {
  const normalized = Object.fromEntries(ELEMENTS2.map((element) => [element, Number(elementScores[element] || 0)]));
  const totalScore = Object.values(normalized).reduce((sum, score) => sum + score, 0);
  const partition = partitionScores(normalized, dayMasterElement);
  return {
    modelId: "bazi-js-weighted-qi",
    version: STRENGTH_QI_LAYER_VERSION,
    distribution: Object.fromEntries(Object.entries(normalized).map(([element, score]) => [element, {
      score: round(score),
      percentage: totalScore > 0 ? round(score / totalScore * 100) : 20
    }])),
    totalScore: round(totalScore),
    allyScore: partition.allyScore,
    enemyScore: partition.enemyScore,
    evidence: {
      matched: true,
      elements: ELEMENTS2,
      calculation: "\u5929\u5E72\u900F\u51FA\u8207\u5730\u652F\u85CF\u5E72\u52A0\u6B0A\uFF1B\u6B64\u5FEB\u7167\u672A\u5957\u7528\u7279\u6B8A\u683C\u5C40\u5224\u5B9A\u3002"
    }
  };
}
function transformationReason(type, formation) {
  if (formation === "complete") return `${type} \u5DF2\u5728\u4E92\u52D5\u5C64\u5F62\u6210\u5B8C\u6574\u7D50\u69CB\uFF1B\u662F\u5426\u5316\u6C23\u4ECD\u9700 Profile \u7684\u5B63\u7BC0\u3001\u900F\u5E72\u8207\u963B\u9694\u689D\u4EF6\u3002`;
  if (formation === "partial") return `${type} \u53EA\u5F62\u6210\u90E8\u5206\u7D50\u69CB\uFF0C\u5148\u8A18\u70BA\u5019\u9078\uFF0C\u4E0D\u76F4\u63A5\u6539\u5BEB\u4E94\u884C\u6C23\u6578\u3002`;
  return `${type} \u5C6C\u865B\u62F1\u6216\u5C40\u90E8\u7D50\u69CB\uFF0C\u7F3A\u5C11\u5B8C\u6574\u6210\u5316\u689D\u4EF6\uFF0C\u4E0D\u76F4\u63A5\u6539\u5BEB\u4E94\u884C\u6C23\u6578\u3002`;
}
function buildTransformationLayer(interactions = null, context = {}) {
  const candidates = [];
  let sequence = 0;
  for (const [layer, rows] of Object.entries(interactions || {})) {
    if (!Array.isArray(rows)) continue;
    for (const interaction of rows) {
      if (!TRANSFORMATION_TYPES2.has(interaction.type)) continue;
      const targetElement = interaction.element || interaction.generates || null;
      if (!targetElement) continue;
      const formation = interaction.type === "triple_combination" || interaction.type === "triple_meeting" ? "complete" : interaction.type === "half_combination" ? "partial" : "partial";
      sequence += 1;
      candidates.push({
        id: `STR_TRANSFORMATION_${String(interaction.type).toUpperCase()}_${String(sequence).padStart(3, "0")}`,
        sourceLayer: layer,
        sourceType: interaction.type,
        name: interaction.name,
        chars: Array.isArray(interaction.chars) ? [...interaction.chars] : [],
        pillars: Array.isArray(interaction.pillars) ? [...interaction.pillars] : [],
        targetElement,
        formation,
        status: "candidate",
        applied: false,
        confidence: "structural-only",
        reason: transformationReason(interaction.name || interaction.type, formation),
        evidence: {
          matched: true,
          monthBranch: context.monthBranch || null,
          seasonalState: context.seasonalStates?.[targetElement] || null,
          completeStructure: formation === "complete",
          requires: ["seasonal-support", "\u900F\u5E72\uFF0F\u5F97\u7528", "\u7121\u963B\u9694\u6216\u7834\u58DE", "profile-transformation-policy"]
        }
      });
    }
  }
  return {
    modelId: "conservative-structural-evidence",
    version: STRENGTH_QI_LAYER_VERSION,
    status: "evidence-only",
    applied: [],
    candidates,
    evidence: {
      matched: candidates.length > 0,
      appliedCount: 0,
      candidateCount: candidates.length,
      reason: "canonical \u76EE\u524D\u53EA\u8A18\u9304\u4E92\u52D5\u8207\u6210\u5316\u5019\u9078\uFF1B\u6C92\u6709\u8DB3\u5920\u7684 Profile \u689D\u4EF6\u6642\u4E0D\u81EA\u52D5\u5316\u6C23\u3002"
    }
  };
}
function buildEffectiveQiSnapshot(elementScores, dayMasterElement, transformationLayer) {
  const snapshot = buildQiSnapshot(elementScores, dayMasterElement);
  return {
    ...snapshot,
    modelId: "bazi-js-interaction-adjusted-qi",
    status: "interaction-adjusted",
    transformationStatus: transformationLayer?.status || "evidence-only",
    appliedTransformations: transformationLayer?.applied || [],
    evidence: {
      ...snapshot.evidence,
      interactionAdjustment: "\u76EE\u524D\u50C5\u5957\u7528\u65E2\u6709\u516D\u6C96\u6839\u6C23\u6298\u640D\uFF1B\u5408\u5C40\uFF0F\u6703\u5C40\u4ECD\u4FDD\u7559\u70BA\u5019\u9078\uFF0C\u4E0D\u81EA\u52D5\u6539\u8B8A\u5206\u5E03\u3002"
    }
  };
}

// src/strength/index.js
var SEASON_STATES = {
  "\u5BC5": { "\u6728": "\u65FA", "\u706B": "\u76F8", "\u6C34": "\u4F11", "\u91D1": "\u56DA", "\u571F": "\u6B7B" },
  "\u536F": { "\u6728": "\u65FA", "\u706B": "\u76F8", "\u6C34": "\u4F11", "\u91D1": "\u56DA", "\u571F": "\u6B7B" },
  "\u8FB0": { "\u571F": "\u65FA", "\u91D1": "\u76F8", "\u706B": "\u4F11", "\u6728": "\u56DA", "\u6C34": "\u6B7B" },
  "\u5DF3": { "\u706B": "\u65FA", "\u571F": "\u76F8", "\u6728": "\u4F11", "\u6C34": "\u56DA", "\u91D1": "\u6B7B" },
  "\u5348": { "\u706B": "\u65FA", "\u571F": "\u76F8", "\u6728": "\u4F11", "\u6C34": "\u56DA", "\u91D1": "\u6B7B" },
  "\u672A": { "\u571F": "\u65FA", "\u91D1": "\u76F8", "\u706B": "\u4F11", "\u6728": "\u56DA", "\u6C34": "\u6B7B" },
  "\u7533": { "\u6C34": "\u76F8", "\u91D1": "\u65FA", "\u571F": "\u4F11", "\u706B": "\u56DA", "\u6728": "\u6B7B" },
  "\u9149": { "\u91D1": "\u65FA", "\u6C34": "\u76F8", "\u571F": "\u4F11", "\u706B": "\u56DA", "\u6728": "\u6B7B" },
  "\u620C": { "\u571F": "\u65FA", "\u91D1": "\u76F8", "\u706B": "\u4F11", "\u6728": "\u56DA", "\u6C34": "\u6B7B" },
  "\u4EA5": { "\u6C34": "\u65FA", "\u6728": "\u76F8", "\u91D1": "\u4F11", "\u571F": "\u56DA", "\u706B": "\u6B7B" },
  "\u5B50": { "\u6C34": "\u65FA", "\u6728": "\u76F8", "\u91D1": "\u4F11", "\u571F": "\u56DA", "\u706B": "\u6B7B" },
  "\u4E11": { "\u571F": "\u65FA", "\u91D1": "\u76F8", "\u706B": "\u4F11", "\u6728": "\u56DA", "\u6C34": "\u6B7B" }
};
var STATE_FACTOR = {
  "\u65FA": 1.2,
  "\u76F8": 1,
  "\u4F11": 0.6,
  "\u56DA": 0.3,
  "\u6B7B": 0.1
};
var MONTH_COMMAND_PHASES = Object.freeze({
  "\u5BC5": [{ stem: "\u620A", days: 7 }, { stem: "\u4E19", days: 7 }, { stem: "\u7532", days: 16 }],
  "\u536F": [{ stem: "\u7532", days: 10 }, { stem: "\u4E59", days: 20 }],
  "\u8FB0": [{ stem: "\u4E59", days: 9 }, { stem: "\u7678", days: 3 }, { stem: "\u620A", days: 18 }],
  "\u5DF3": [{ stem: "\u620A", days: 7 }, { stem: "\u5E9A", days: 7 }, { stem: "\u4E19", days: 16 }],
  "\u5348": [{ stem: "\u4E19", days: 10 }, { stem: "\u5DF1", days: 9 }, { stem: "\u4E01", days: 11 }],
  "\u672A": [{ stem: "\u4E01", days: 9 }, { stem: "\u4E59", days: 3 }, { stem: "\u5DF1", days: 18 }],
  "\u7533": [{ stem: "\u620A", days: 7 }, { stem: "\u58EC", days: 7 }, { stem: "\u5E9A", days: 16 }],
  "\u9149": [{ stem: "\u5E9A", days: 10 }, { stem: "\u8F9B", days: 20 }],
  "\u620C": [{ stem: "\u8F9B", days: 9 }, { stem: "\u4E01", days: 3 }, { stem: "\u620A", days: 18 }],
  "\u4EA5": [{ stem: "\u620A", days: 7 }, { stem: "\u7532", days: 5 }, { stem: "\u58EC", days: 18 }],
  "\u5B50": [{ stem: "\u58EC", days: 10 }, { stem: "\u7678", days: 20 }],
  "\u4E11": [{ stem: "\u7678", days: 9 }, { stem: "\u8F9B", days: 3 }, { stem: "\u5DF1", days: 18 }]
});
var SAN_MING_MONTH_COMMAND_PHASES = Object.freeze({
  "\u5BC5": [{ stem: "\u620A", days: 5 }, { stem: "\u4E19", days: 5 }, { stem: "\u7532", days: 20 }],
  "\u536F": [{ stem: "\u7532", days: 7 }, { stem: "\u4E59", days: 23 }],
  "\u8FB0": [{ stem: "\u4E59", days: 7 }, { stem: "\u7678", days: 5 }, { stem: "\u620A", days: 18 }],
  "\u5DF3": [{ stem: "\u620A", days: 7 }, { stem: "\u5E9A", days: 5 }, { stem: "\u4E19", days: 18 }],
  "\u5348": [{ stem: "\u4E19", days: 7 }, { stem: "\u4E01", days: 23 }],
  "\u672A": [{ stem: "\u4E01", days: 7 }, { stem: "\u7532", days: 5 }, { stem: "\u5DF1", days: 18 }],
  "\u7533": [{ stem: "\u620A", days: 5 }, { stem: "\u58EC", days: 5 }, { stem: "\u5E9A", days: 20 }],
  "\u9149": [{ stem: "\u5E9A", days: 7 }, { stem: "\u8F9B", days: 23 }],
  "\u620C": [{ stem: "\u8F9B", days: 7 }, { stem: "\u4E01", days: 5 }, { stem: "\u620A", days: 18 }],
  "\u4EA5": [{ stem: "\u620A", days: 5 }, { stem: "\u7532", days: 5 }, { stem: "\u58EC", days: 20 }],
  "\u5B50": [{ stem: "\u58EC", days: 7 }, { stem: "\u7678", days: 23 }],
  "\u4E11": [{ stem: "\u7678", days: 7 }, { stem: "\u5E9A", days: 5 }, { stem: "\u5DF1", days: 18 }]
});
function calculateMonthCommander(monthBranch, elapsedDays, options = {}) {
  const modelId = options.model || "bazi-js-human-element";
  const isSanMing = modelId === "san-ming-volume-2";
  const phases = (isSanMing ? SAN_MING_MONTH_COMMAND_PHASES : MONTH_COMMAND_PHASES)[monthBranch];
  if (!phases || !Number.isFinite(elapsedDays)) return null;
  const wholeDays = Math.max(0, Math.floor(elapsedDays));
  let cursor = 0;
  let phaseIndex = phases.length - 1;
  for (let index = 0; index < phases.length; index++) {
    cursor += phases[index].days;
    if (wholeDays < cursor) {
      phaseIndex = index;
      break;
    }
  }
  const phase = phases[phaseIndex];
  const stem = STEMS[STEM_INDEX[phase.stem]];
  return {
    method: isSanMing ? "san-ming-tong-hui-volume-2" : "human-element-month-commander",
    modelId,
    ruleId: isSanMing ? "STR_MONTH_COMMANDER_SANMING_002" : "STR_MONTH_COMMANDER_001",
    version: "1.0.0",
    tradition: "classical-ziping",
    conceptType: "seasonal-derived",
    ruleFamily: "month-commander",
    baseOn: ["monthPillar.branch", "solarTerms.prevJie", "hiddenStems.month"],
    scope: "seasonal-month",
    category: "month-command",
    confidence: isSanMing ? "classical-variant" : "school-specific",
    stem: phase.stem,
    element: stem ? stem.element : null,
    monthBranch,
    elapsedDays: wholeDays,
    phase: phaseIndex + 1,
    phaseCount: phases.length,
    phaseDays: phase.days,
    phases: phases.map((item) => ({ ...item })),
    algorithm: "jie-after-whole-days",
    references: [
      {
        sourceId: "san-ming-tong-hui",
        title: "\u300A\u4E09\u547D\u901A\u6703\u300B",
        locator: "\u5377\u4E8C\u3008\u8AD6\u4EBA\u5143\u53F8\u4E8B\u3009\u3001\u3008\u8AD6\u56DB\u6642\u7BC0\u6C23\u3009",
        url: "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u4E8C"
      },
      {
        sourceId: "di-tian-sui-yan-wei",
        title: "\u300A\u6EF4\u5929\u9AD3\u95E1\u5FAE\u300B",
        locator: "\u6708\u4EE4\uFF0F\u4EBA\u5143\u53F8\u4EE4\u76F8\u95DC\u6CE8\u89E3",
        url: "https://zh.wikisource.org/zh-hant/\u6EF4\u5929\u9AD3\u95E1\u5FAE"
      }
    ],
    variants: [
      { id: "phase-table", description: "\u4EBA\u5143\u53F8\u4EE4\u5206\u65E5\u8868\u5728\u4E0D\u540C\u50B3\u672C\u3001\u8A3B\u5BB6\u9593\u53EF\u80FD\u4E0D\u540C\u3002" },
      { id: "jie-day-rounding", description: "\u7BC0\u5F8C\u7D93\u904E\u65E5\u6578\u53EF\u63A1\u6574\u65E5\u3001\u542B\u8D77\u65E5\u6216\u7CBE\u78BA\u6642\u523B\uFF0C\u6703\u5F71\u97FF\u5206\u6BB5\u908A\u754C\u3002" },
      ...isSanMing ? [{ id: "bazi-js-human-element", description: "BaziJS canonical \u4ECD\u63A1\u65E2\u6709 MONTH_COMMAND_PHASES\uFF0C\u4F9B\u9010\u6848\u6BD4\u8F03\u3002" }] : [{ id: "san-ming-volume-2", description: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E8C\u4EBA\u5143\u53F8\u4E8B\u8868\uFF0C\u4F5C\u70BA\u6587\u737B\u6BD4\u8F03\u8B8A\u9AD4\u3002" }]
    ],
    researchNotes: {
      conflict: isSanMing,
      note: isSanMing ? "\u6B64 Profile \u6539\u7528\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E8C\u6240\u5217\u5206\u65E5\u8868\uFF1B\u8207 BaziJS canonical \u7684\u5206\u6BB5\u4E0D\u540C\uFF0C\u50C5\u4F9B\u5DEE\u7570\u7814\u7A76\u3002" : "\u672C\u7248\u672C\u56FA\u5B9A\u63A1\u7BC0\u5F8C\u7D93\u904E\u6574\u65E5\u8207 MONTH_COMMAND_PHASES\uFF1B\u9019\u662F\u53EF\u91CD\u73FE\u7684 profile \u898F\u5247\uFF0C\u4E0D\u5BA3\u7A31\u8DE8\u6D41\u6D3E\u552F\u4E00\u3002"
    },
    evidence: {
      matched: true,
      monthBranch,
      elapsedDays: wholeDays,
      phase: phaseIndex + 1,
      selectedStem: phase.stem,
      selectionRule: "\u7D2F\u52A0\u672C\u6708\u5206\u6BB5\u65E5\u6578\uFF0C\u53D6 elapsedDays \u6240\u5728\u6BB5",
      phaseTable: phases.map((item) => ({ ...item })),
      modelId,
      sourceTable: isSanMing ? "san-ming-tong-hui-volume-2" : "bazi-js-canonical"
    }
  };
}
function calculateStrength(pillars, interactions = null, calendarContext = {}) {
  const dayMasterStem = pillars.day.stem;
  const dayMasterData = STEMS[STEM_INDEX[dayMasterStem]];
  const dmElement = dayMasterData.element;
  const evidence = [];
  const elementScores = { "\u6728": 0, "\u706B": 0, "\u571F": 0, "\u91D1": 0, "\u6C34": 0 };
  const rawElementScores = { "\u6728": 0, "\u706B": 0, "\u571F": 0, "\u91D1": 0, "\u6C34": 0 };
  const stemWeights = [
    { pillar: "year", stem: pillars.year.stem, weight: 8 },
    { pillar: "month", stem: pillars.month.stem, weight: 12 },
    ...pillars.hour.available ? [{ pillar: "hour", stem: pillars.hour.stem, weight: 10 }] : []
  ];
  for (const item of stemWeights) {
    const el = STEMS[STEM_INDEX[item.stem]].element;
    rawElementScores[el] += item.weight;
    elementScores[el] += item.weight;
    evidence.push({
      ruleId: "STR_STEM_TRANSPARENCY",
      pillar: item.pillar,
      effect: item.weight,
      element: el,
      reason: `${item.pillar}\u5E72\u3010${item.stem}\u3011\u900F\u51FA\uFF0C\u589E\u5F37\u4E94\u884C\u3010${el}\u3011\u529B\u91CF ${item.weight} \u5206`
    });
  }
  const branchWeights = [
    { pillar: "month", branch: pillars.month.branch, baseWeight: 40 },
    { pillar: "day", branch: pillars.day.branch, baseWeight: 15 },
    { pillar: "year", branch: pillars.year.branch, baseWeight: 10 },
    ...pillars.hour.available ? [{ pillar: "hour", branch: pillars.hour.branch, baseWeight: 15 }] : []
  ];
  const clashedBranches = /* @__PURE__ */ new Set();
  if (interactions && interactions.branches) {
    for (const bInter of interactions.branches) {
      if (bInter.type === "six_clash") {
        bInter.chars.forEach((c) => clashedBranches.add(c));
      }
    }
  }
  for (const item of branchWeights) {
    const hiddenList = getHiddenStems(item.branch);
    let clashDamp = clashedBranches.has(item.branch) ? 0.65 : 1;
    for (const h of hiddenList) {
      const el = STEMS[STEM_INDEX[h.stem]].element;
      const rawScore = item.baseWeight * h.weight;
      rawElementScores[el] += rawScore;
      const score = item.baseWeight * h.weight * clashDamp;
      elementScores[el] += score;
      evidence.push({
        ruleId: "STR_BRANCH_ROOT",
        pillar: item.pillar,
        branch: item.branch,
        hiddenStem: h.stem,
        effect: Number(score.toFixed(1)),
        element: el,
        reason: `${item.pillar}\u652F\u3010${item.branch}\u3011\u85CF\u5E72\u3010${h.stem}\u3011(${h.role}) \u63D0\u4F9B\u4E94\u884C\u3010${el}\u3011\u6C23\u6578 ${score.toFixed(1)} \u5206${clashDamp < 1 ? "\uFF08\u53D7\u6C96\u6298\u640D\uFF09" : ""}`
      });
    }
  }
  const monthBranch = pillars.month.branch;
  const monthState = SEASON_STATES[monthBranch] && SEASON_STATES[monthBranch][dmElement] || "\u4F11";
  const monthStateFactor = STATE_FACTOR[monthState] || 0.6;
  const deLing = monthState === "\u65FA" || monthState === "\u76F8";
  const elapsedDays = Number.isFinite(calendarContext.currentJD) && calendarContext.prevJie && Number.isFinite(calendarContext.prevJie.jdUT) ? Math.max(0, calendarContext.currentJD - calendarContext.prevJie.jdUT) : null;
  const monthCommander = calculateMonthCommander(monthBranch, elapsedDays, {
    model: calendarContext.monthCommanderModel
  });
  const rawQi = buildQiSnapshot(rawElementScores, dmElement);
  const transformations = buildTransformationLayer(interactions, {
    monthBranch,
    seasonalStates: SEASON_STATES[monthBranch] || {}
  });
  const effectiveQi = buildEffectiveQiSnapshot(elementScores, dmElement, transformations);
  evidence.push({
    ruleId: "STR_DE_LING",
    effect: deLing ? 15 : -15,
    reason: `\u65E5\u4E3B\u4E94\u884C\u3010${dmElement}\u3011\u751F\u65BC\u3010${monthBranch}\u3011\u6708\uFF0C\u8655\u65BC\u3010${monthState}\u3011\u5730\uFF08\u4FC2\u6578 ${monthStateFactor}\uFF09\uFF0C\u5224\u5B9A\u70BA\u3010${deLing ? "\u5F97\u4EE4" : "\u4E0D\u5F97\u4EE4"}\u3011`
  });
  let rootCount = 0;
  let primaryRootCount = 0;
  for (const item of branchWeights) {
    const hiddenList = getHiddenStems(item.branch);
    for (const h of hiddenList) {
      const el = STEMS[STEM_INDEX[h.stem]].element;
      if (el === dmElement) {
        rootCount++;
        if (h.role === "primary") primaryRootCount++;
      }
    }
  }
  const deDi = primaryRootCount >= 1 || rootCount >= 2;
  evidence.push({
    ruleId: "STR_DE_DI",
    effect: deDi ? 12 : -10,
    reason: `\u65E5\u4E3B\u5728\u5730\u652F\u5C0B\u5F97\u672C\u6C23\u6839 ${primaryRootCount} \u8655\u3001\u5176\u9918\u6839\u6C23 ${rootCount - primaryRootCount} \u8655\uFF0C\u5224\u5B9A\u70BA\u3010${deDi ? "\u5F97\u5730\uFF08\u901A\u6839\u6709\u529B\uFF09" : "\u4E0D\u5F97\u5730\uFF08\u7121\u6839\u6216\u865B\u6D6E\uFF09"}\u3011`
  });
  let allyStemCount = 0;
  for (const item of stemWeights) {
    const el = STEMS[STEM_INDEX[item.stem]].element;
    const rel = elementRelation(el, dmElement);
    if (rel === "same" || rel === "generate") {
      allyStemCount++;
    }
  }
  const deShi = allyStemCount >= 1;
  evidence.push({
    ruleId: "STR_DE_SHI",
    effect: deShi ? 10 : -8,
    reason: `\u5929\u5E72\u900F\u51FA\u540C\u9EE8\uFF08\u6BD4\u52AB\u3001\u5370\u661F\uFF09\u751F\u52A9\u5171 ${allyStemCount} \u5E72\uFF0C\u5224\u5B9A\u70BA\u3010${deShi ? "\u5F97\u52E2" : "\u5931\u52E2"}\u3011`
  });
  let allyScore = 0;
  let enemyScore = 0;
  for (const [el, score] of Object.entries(elementScores)) {
    const rel = elementRelation(el, dmElement);
    if (rel === "same" || rel === "generate") {
      allyScore += score;
    } else {
      enemyScore += score;
    }
  }
  const totalScore = allyScore + enemyScore;
  const dayMasterStrengthPct = totalScore > 0 ? allyScore / totalScore * 100 : 50;
  const finalScore = Number(dayMasterStrengthPct.toFixed(1));
  let level = "\u4E2D\u548C";
  let levelCode = "balanced";
  if (finalScore >= 82) {
    level = "\u6975\u5F37\uFF08\u5F9E\u5F37/\u5C08\u65FA\uFF09";
    levelCode = "extremelyStrong";
  } else if (finalScore >= 55) {
    level = "\u504F\u5F37";
    levelCode = "strong";
  } else if (finalScore >= 45) {
    level = "\u4E2D\u548C";
    levelCode = "balanced";
  } else if (finalScore >= 22) {
    level = "\u504F\u5F31";
    levelCode = "weak";
  } else {
    level = "\u6975\u5F31\uFF08\u5F9E\u5F31\uFF09";
    levelCode = "extremelyWeak";
  }
  const favorableElements = [];
  const unfavorableElements = [];
  const dmObj = ELEMENTS.find((e) => e.char === dmElement);
  const resourceEl = dmObj.restrictedBy;
  const selfEl = dmElement;
  const outputEl = dmObj.generates;
  const wealthEl = dmObj.restricts;
  const officerEl = dmObj.generatedBy;
  const realResourceEl = dmObj.generatedBy;
  const realOfficerEl = dmObj.restrictedBy;
  if (levelCode === "strong") {
    favorableElements.push(outputEl, wealthEl, realOfficerEl);
    unfavorableElements.push(realResourceEl, selfEl);
  } else if (levelCode === "weak") {
    favorableElements.push(realResourceEl, selfEl);
    unfavorableElements.push(realOfficerEl, wealthEl, outputEl);
  } else if (levelCode === "extremelyStrong") {
    favorableElements.push(selfEl, realResourceEl, outputEl);
    unfavorableElements.push(realOfficerEl, wealthEl);
  } else if (levelCode === "extremelyWeak") {
    favorableElements.push(wealthEl, realOfficerEl, outputEl);
    unfavorableElements.push(realResourceEl, selfEl);
  } else {
    favorableElements.push(wealthEl, outputEl);
    unfavorableElements.push(realOfficerEl);
  }
  const fiveElementsDistribution = {};
  for (const [el, sc] of Object.entries(elementScores)) {
    fiveElementsDistribution[el] = {
      score: Number(sc.toFixed(1)),
      percentage: totalScore > 0 ? Number((sc / totalScore * 100).toFixed(1)) : 20
    };
  }
  const fiveCategoryMethod = calendarContext.fiveCategoryMethod || FIVE_CATEGORY_METHOD;
  const fiveCategory = calculateFiveElementCategories({
    favorableElements,
    method: fiveCategoryMethod
  });
  const useGodModel = calendarContext.useGodModel || "fuyi-canonical";
  const useGod = {
    modelId: useGodModel,
    ruleId: useGodModel === "fuyi-canonical" ? "STR_CANONICAL_DEFAULT" : `ANALYSIS_${useGodModel.toUpperCase().replaceAll("-", "_")}`,
    status: useGodModel === "fuyi-canonical" ? "implemented" : "research-only",
    finalDecision: useGodModel === "fuyi-canonical",
    evidence: {
      matched: useGodModel === "fuyi-canonical",
      status: useGodModel === "fuyi-canonical" ? "implemented" : "research-only",
      reason: useGodModel === "fuyi-canonical" ? "\u7531 canonical \u6276\u6291\u6A21\u578B\u7522\u51FA\u3002" : "\u7814\u7A76 Profile \u76EE\u524D\u4E0D\u8986\u5BEB canonical \u6276\u6291\u7D50\u679C\u3002"
    }
  };
  const assessment = {
    modelId: "bazi-js-weighted-ally-enemy",
    ruleId: "STR_DAY_MASTER_ASSESSMENT_001",
    version: STRENGTH_QI_LAYER_VERSION,
    status: "implemented",
    dayMaster: dmElement,
    score: finalScore,
    levelCode,
    level: levelCode === "extremelyStrong" ? "\u6975\u5F37" : levelCode === "strong" ? "\u504F\u5F37" : levelCode === "balanced" ? "\u4E2D\u548C" : levelCode === "weak" ? "\u504F\u5F31" : "\u6975\u5F31",
    deLing,
    deDi,
    deShi,
    allyScore: Number(allyScore.toFixed(1)),
    enemyScore: Number(enemyScore.toFixed(1)),
    evidence: {
      matched: true,
      source: "effectiveQi",
      note: "\u56FA\u5B9A\u95BE\u503C\u53EA\u63CF\u8FF0\u5F37\u5F31\u5E36\uFF0C\u4E0D\u76F4\u63A5\u5BA3\u544A\u5F9E\u683C\u3001\u5C08\u65FA\u6216\u5176\u4ED6\u7279\u6B8A\u683C\uFF1B\u7279\u6B8A\u683C\u9700\u7531 Patterns \u5C64\u53E6\u884C\u5224\u5B9A\u3002"
    }
  };
  const decision = {
    modelId: useGod.modelId,
    ruleId: useGod.ruleId,
    version: STRENGTH_QI_LAYER_VERSION,
    status: useGod.status,
    finalDecision: useGod.finalDecision,
    favorableElements: [...new Set(favorableElements)],
    unfavorableElements: [...new Set(unfavorableElements)],
    evidence: useGod.evidence
  };
  return {
    dayMaster: dmElement,
    score: finalScore,
    level,
    levelCode,
    deLing,
    deDi,
    deShi,
    allyScore: Number(allyScore.toFixed(1)),
    enemyScore: Number(enemyScore.toFixed(1)),
    dayMasterStem,
    monthState: {
      branch: monthBranch,
      name: monthState,
      factor: monthStateFactor,
      deLing
    },
    monthCommander,
    rawQi,
    effectiveQi,
    transformations,
    assessment,
    decision,
    layers: {
      rawQi,
      transformation: transformations,
      effectiveQi,
      dayMasterAssessment: assessment,
      decision
    },
    useGod,
    seasonalStates: Object.fromEntries(Object.entries(SEASON_STATES[monthBranch] || {}).map(([element, name]) => [element, {
      name,
      factor: STATE_FACTOR[name] || null
    }])),
    distribution: fiveElementsDistribution,
    favorableElements: [...new Set(favorableElements)],
    unfavorableElements: [...new Set(unfavorableElements)],
    fiveCategory,
    evidence
  };
}

// src/shensha/index.js
var shensha_exports = {};
__export(shensha_exports, {
  SHENSHA_CATALOG: () => SHENSHA_CATALOG,
  SHENSHA_CATEGORIES: () => SHENSHA_CATEGORIES,
  SHENSHA_CONFIDENCES: () => SHENSHA_CONFIDENCES,
  SHENSHA_INTERPRETATIONS: () => SHENSHA_INTERPRETATIONS,
  SHENSHA_PRESETS: () => SHENSHA_PRESETS,
  SHENSHA_REGISTRY: () => SHENSHA_REGISTRY,
  SHENSHA_TIERS: () => SHENSHA_TIERS,
  calculateShenSha: () => calculateShenSha,
  calculateShenShaOnPillar: () => calculateShenShaOnPillar,
  calculateTransitShenSha: () => calculateTransitShenSha,
  calculateXunKong: () => calculateXunKong,
  getShenShaCatalog: () => getShenShaCatalog,
  getShenShaPreset: () => getShenShaPreset,
  getShenShaRule: () => getShenShaRule,
  groupShenShaByPillar: () => groupShenShaByPillar,
  validateShenShaRegistry: () => validateShenShaRegistry
});

// src/shensha/constants.js
var SHENSHA_CATEGORIES = Object.freeze(["auspicious", "inauspicious", "neutral"]);
var SHENSHA_TIERS = Object.freeze(["core", "extended", "optional"]);
var SHENSHA_CONFIDENCES = Object.freeze([
  "classical",
  "traditional",
  "modern-common",
  "school-specific",
  "folk",
  "experimental"
]);
var PILLAR_KEYS = Object.freeze(["year", "month", "day", "hour"]);
var SHENSHA_PRESETS = Object.freeze({
  minimal: Object.freeze({ id: "minimal", tiers: ["core"], excludeExperimental: true }),
  classical: Object.freeze({ id: "classical", tiers: ["core", "extended"], excludeExperimental: true }),
  full: Object.freeze({ id: "full", tiers: ["core", "extended", "optional"], excludeExperimental: true })
});
function getShenShaPreset(name = "classical") {
  const preset = SHENSHA_PRESETS[name];
  if (!preset) {
    throw new BaziRuleError(`\u627E\u4E0D\u5230 ShenSha preset\uFF1A${name}`, "SHENSHA_PRESET_NOT_FOUND", {
      preset: name,
      available: Object.keys(SHENSHA_PRESETS)
    });
  }
  return preset;
}

// src/shensha/catalog.js
var SHENSHA_CATALOG = [
  // 1. 天乙貴人
  // 口訣：甲戊庚牛羊，乙己鼠猴鄉，丙丁豬雞位，壬癸兔蛇藏，六辛逢馬虎，此是貴人方。
  {
    id: "tian_yi_gui_ren",
    name: "\u5929\u4E59\u8CB4\u4EBA",
    category: "auspicious",
    baseOn: ["dayStem", "yearStem"],
    ruleId: "SS_TYGR_001",
    version: "1.0.0",
    reference: "\u300A\u6DF5\u6D77\u5B50\u5E73\u300B\u5377\u4E8C\u3001\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseStem, targetBranch }) => {
      const map = {
        "\u7532": ["\u4E11", "\u672A"],
        "\u620A": ["\u4E11", "\u672A"],
        "\u5E9A": ["\u4E11", "\u672A"],
        "\u4E59": ["\u5B50", "\u7533"],
        "\u5DF1": ["\u5B50", "\u7533"],
        "\u4E19": ["\u4EA5", "\u9149"],
        "\u4E01": ["\u4EA5", "\u9149"],
        "\u58EC": ["\u536F", "\u5DF3"],
        "\u7678": ["\u536F", "\u5DF3"],
        "\u8F9B": ["\u5348", "\u5BC5"]
      };
      return map[baseStem] ? map[baseStem].includes(targetBranch) : false;
    }
  },
  // 2. 太極貴人
  // 口訣：甲乙生人子午中，丙丁雞兔定亨通，戊己兩干臨四季，庚辛寅亥祿豐隆，壬癸巳申偏喜美
  {
    id: "tai_ji_gui_ren",
    name: "\u592A\u6975\u8CB4\u4EBA",
    category: "auspicious",
    baseOn: ["dayStem", "yearStem"],
    ruleId: "SS_TJGR_002",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseStem, targetBranch }) => {
      const map = {
        "\u7532": ["\u5B50", "\u5348"],
        "\u4E59": ["\u5B50", "\u5348"],
        "\u4E19": ["\u9149", "\u536F"],
        "\u4E01": ["\u9149", "\u536F"],
        "\u620A": ["\u8FB0", "\u620C", "\u4E11", "\u672A"],
        "\u5DF1": ["\u8FB0", "\u620C", "\u4E11", "\u672A"],
        "\u5E9A": ["\u5BC5", "\u4EA5"],
        "\u8F9B": ["\u5BC5", "\u4EA5"],
        "\u58EC": ["\u5DF3", "\u7533"],
        "\u7678": ["\u5DF3", "\u7533"]
      };
      return map[baseStem] ? map[baseStem].includes(targetBranch) : false;
    }
  },
  // 3. 天德貴人
  // 正月生者見丁，二月見申，三月見壬，四月見辛，五月見亥，六月見甲，
  // 七月見癸，八月見寅，九月見丙，十月見乙，十一月見巳，十二月見庚。
  {
    id: "tian_de_gui_ren",
    name: "\u5929\u5FB7\u8CB4\u4EBA",
    category: "auspicious",
    baseOn: ["monthBranch"],
    ruleId: "SS_TDGR_003",
    version: "1.0.0",
    reference: "\u300A\u6DF5\u6D77\u5B50\u5E73\u300B\u3001\u300A\u5B50\u5E73\u771F\u8A6E\u300B",
    match: ({ monthBranch, targetStem, targetBranch }) => {
      const map = {
        "\u5BC5": "\u4E01",
        "\u536F": "\u7533",
        "\u8FB0": "\u58EC",
        "\u5DF3": "\u8F9B",
        "\u5348": "\u4EA5",
        "\u672A": "\u7532",
        "\u7533": "\u7678",
        "\u9149": "\u5BC5",
        "\u620C": "\u4E19",
        "\u4EA5": "\u4E59",
        "\u5B50": "\u5DF3",
        "\u4E11": "\u5E9A"
      };
      const val = map[monthBranch];
      if (!val) return false;
      return targetStem === val || targetBranch === val;
    }
  },
  // 4. 月德貴人
  // 寅午戌月在丙，申子辰月在壬，亥卯未月在甲，巳酉丑月在庚。
  {
    id: "yue_de_gui_ren",
    name: "\u6708\u5FB7\u8CB4\u4EBA",
    category: "auspicious",
    baseOn: ["monthBranch"],
    ruleId: "SS_YDGR_004",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ monthBranch, targetStem }) => {
      const map = {
        "\u5BC5": "\u4E19",
        "\u5348": "\u4E19",
        "\u620C": "\u4E19",
        "\u7533": "\u58EC",
        "\u5B50": "\u58EC",
        "\u8FB0": "\u58EC",
        "\u4EA5": "\u7532",
        "\u536F": "\u7532",
        "\u672A": "\u7532",
        "\u5DF3": "\u5E9A",
        "\u9149": "\u5E9A",
        "\u4E11": "\u5E9A"
      };
      return map[monthBranch] === targetStem;
    }
  },
  // 5. 文昌貴人
  // 口訣：甲乙巳午報君知，丙戊申宮丁己雞，庚豬辛鼠壬逢虎，癸人見兔入雲梯。
  {
    id: "wen_chang_gui_ren",
    name: "\u6587\u660C\u8CB4\u4EBA",
    category: "auspicious",
    baseOn: ["dayStem", "yearStem"],
    ruleId: "SS_WCGR_005",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseStem, targetBranch }) => {
      const map = {
        "\u7532": "\u5DF3",
        "\u4E59": "\u5348",
        "\u4E19": "\u7533",
        "\u620A": "\u7533",
        "\u4E01": "\u9149",
        "\u5DF1": "\u9149",
        "\u5E9A": "\u4EA5",
        "\u8F9B": "\u5B50",
        "\u58EC": "\u5BC5",
        "\u7678": "\u536F"
      };
      return map[baseStem] === targetBranch;
    }
  },
  // 6. 祿神（建祿）
  // 甲祿在寅，乙祿在卯，丙戊祿在巳，丁己祿在午，庚祿在申，辛祿在酉，壬祿在亥，癸祿在子。
  {
    id: "lu_shen",
    name: "\u797F\u795E",
    category: "auspicious",
    baseOn: ["dayStem"],
    ruleId: "SS_LUSHEN_006",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseStem, targetBranch }) => {
      const map = {
        "\u7532": "\u5BC5",
        "\u4E59": "\u536F",
        "\u4E19": "\u5DF3",
        "\u620A": "\u5DF3",
        "\u4E01": "\u5348",
        "\u5DF1": "\u5348",
        "\u5E9A": "\u7533",
        "\u8F9B": "\u9149",
        "\u58EC": "\u4EA5",
        "\u7678": "\u5B50"
      };
      return map[baseStem] === targetBranch;
    }
  },
  // 7. 羊刃
  // 甲羊刃在卯，乙羊刃在寅，丙戊羊刃在午，丁己羊刃在巳，庚羊刃在酉，辛羊刃在申，壬羊刃在子，癸羊刃在亥。
  {
    id: "yang_ren",
    name: "\u7F8A\u5203",
    category: "inauspicious",
    baseOn: ["dayStem"],
    ruleId: "SS_YANGREN_007",
    version: "1.0.0",
    reference: "\u300A\u6DF5\u6D77\u5B50\u5E73\u300B\u3001\u300A\u4E09\u547D\u901A\u6703\u300B",
    match: ({ baseStem, targetBranch }) => {
      const map = {
        "\u7532": "\u536F",
        "\u4E59": "\u5BC5",
        "\u4E19": "\u5348",
        "\u620A": "\u5348",
        "\u4E01": "\u5DF3",
        "\u5DF1": "\u5DF3",
        "\u5E9A": "\u9149",
        "\u8F9B": "\u7533",
        "\u58EC": "\u5B50",
        "\u7678": "\u4EA5"
      };
      return map[baseStem] === targetBranch;
    }
  },
  // 8. 驛馬
  // 申子辰馬在寅，寅午戌馬在申，巳酉丑馬在亥，亥卯未馬在巳。
  {
    id: "yi_ma",
    name: "\u9A5B\u99AC",
    category: "neutral",
    baseOn: ["yearBranch", "dayBranch"],
    ruleId: "SS_YIMA_008",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        "\u7533": "\u5BC5",
        "\u5B50": "\u5BC5",
        "\u8FB0": "\u5BC5",
        "\u5BC5": "\u7533",
        "\u5348": "\u7533",
        "\u620C": "\u7533",
        "\u5DF3": "\u4EA5",
        "\u9149": "\u4EA5",
        "\u4E11": "\u4EA5",
        "\u4EA5": "\u5DF3",
        "\u536F": "\u5DF3",
        "\u672A": "\u5DF3"
      };
      return map[baseBranch] === targetBranch;
    }
  },
  // 9. 桃花（咸池）
  // 申子辰在酉，寅午戌在卯，巳酉丑在午，亥卯未在子。
  {
    id: "tao_hua",
    name: "\u6843\u82B1\uFF08\u54B8\u6C60\uFF09",
    category: "neutral",
    baseOn: ["yearBranch", "dayBranch"],
    ruleId: "SS_TAOHUA_009",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        "\u7533": "\u9149",
        "\u5B50": "\u9149",
        "\u8FB0": "\u9149",
        "\u5BC5": "\u536F",
        "\u5348": "\u536F",
        "\u620C": "\u536F",
        "\u5DF3": "\u5348",
        "\u9149": "\u5348",
        "\u4E11": "\u5348",
        "\u4EA5": "\u5B50",
        "\u536F": "\u5B50",
        "\u672A": "\u5B50"
      };
      return map[baseBranch] === targetBranch;
    }
  },
  // 10. 華蓋
  // 寅午戌見戌，巳酉丑見丑，申子辰見辰，亥卯未見未。
  {
    id: "hua_gai",
    name: "\u83EF\u84CB",
    category: "neutral",
    baseOn: ["yearBranch", "dayBranch"],
    ruleId: "SS_HUAGAI_010",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        "\u5BC5": "\u620C",
        "\u5348": "\u620C",
        "\u620C": "\u620C",
        "\u5DF3": "\u4E11",
        "\u9149": "\u4E11",
        "\u4E11": "\u4E11",
        "\u7533": "\u8FB0",
        "\u5B50": "\u8FB0",
        "\u8FB0": "\u8FB0",
        "\u4EA5": "\u672A",
        "\u536F": "\u672A",
        "\u672A": "\u672A"
      };
      return map[baseBranch] === targetBranch;
    }
  },
  // 11. 將星
  // 寅午戌見午，巳酉丑見酉，申子辰見子，亥卯未見卯。
  {
    id: "jiang_xing",
    name: "\u5C07\u661F",
    category: "auspicious",
    baseOn: ["yearBranch", "dayBranch"],
    ruleId: "SS_JIANGXING_011",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        "\u5BC5": "\u5348",
        "\u5348": "\u5348",
        "\u620C": "\u5348",
        "\u5DF3": "\u9149",
        "\u9149": "\u9149",
        "\u4E11": "\u9149",
        "\u7533": "\u5B50",
        "\u5B50": "\u5B50",
        "\u8FB0": "\u5B50",
        "\u4EA5": "\u536F",
        "\u536F": "\u536F",
        "\u672A": "\u536F"
      };
      return map[baseBranch] === targetBranch;
    }
  },
  // 12. 劫煞
  // 申子辰見巳，亥卯未見申，寅午戌見亥，巳酉丑見寅。
  {
    id: "jie_sha",
    name: "\u52AB\u715E",
    category: "inauspicious",
    baseOn: ["yearBranch", "dayBranch"],
    ruleId: "SS_JIESHA_012",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        "\u7533": "\u5DF3",
        "\u5B50": "\u5DF3",
        "\u8FB0": "\u5DF3",
        "\u4EA5": "\u7533",
        "\u536F": "\u7533",
        "\u672A": "\u7533",
        "\u5BC5": "\u4EA5",
        "\u5348": "\u4EA5",
        "\u620C": "\u4EA5",
        "\u5DF3": "\u5BC5",
        "\u9149": "\u5BC5",
        "\u4E11": "\u5BC5"
      };
      return map[baseBranch] === targetBranch;
    }
  },
  // 13. 亡神
  // 申子辰見亥，亥卯未見寅，寅午戌見巳，巳酉丑見申。
  {
    id: "wang_shen",
    name: "\u4EA1\u795E",
    category: "inauspicious",
    baseOn: ["yearBranch", "dayBranch"],
    ruleId: "SS_WANGSHEN_013",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        "\u7533": "\u4EA5",
        "\u5B50": "\u4EA5",
        "\u8FB0": "\u4EA5",
        "\u4EA5": "\u5BC5",
        "\u536F": "\u5BC5",
        "\u672A": "\u5BC5",
        "\u5BC5": "\u5DF3",
        "\u5348": "\u5DF3",
        "\u620C": "\u5DF3",
        "\u5DF3": "\u7533",
        "\u9149": "\u7533",
        "\u4E11": "\u7533"
      };
      return map[baseBranch] === targetBranch;
    }
  },
  // 14. 孤辰
  // 亥子丑人見寅，寅卯辰人見巳，巳午未人見申，申酉戌人見亥。
  {
    id: "gu_chen",
    name: "\u5B64\u8FB0",
    category: "inauspicious",
    baseOn: ["yearBranch"],
    ruleId: "SS_GUCHEN_014",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        "\u4EA5": "\u5BC5",
        "\u5B50": "\u5BC5",
        "\u4E11": "\u5BC5",
        "\u5BC5": "\u5DF3",
        "\u536F": "\u5DF3",
        "\u8FB0": "\u5DF3",
        "\u5DF3": "\u7533",
        "\u5348": "\u7533",
        "\u672A": "\u7533",
        "\u7533": "\u4EA5",
        "\u9149": "\u4EA5",
        "\u620C": "\u4EA5"
      };
      return map[baseBranch] === targetBranch;
    }
  },
  // 15. 寡宿
  // 亥子丑人見戌，寅卯辰人見丑，巳午未人見辰，申酉戌人見未。
  {
    id: "gua_su",
    name: "\u5BE1\u5BBF",
    category: "inauspicious",
    baseOn: ["yearBranch"],
    ruleId: "SS_GUASU_015",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        "\u4EA5": "\u620C",
        "\u5B50": "\u620C",
        "\u4E11": "\u620C",
        "\u5BC5": "\u4E11",
        "\u536F": "\u4E11",
        "\u8FB0": "\u4E11",
        "\u5DF3": "\u8FB0",
        "\u5348": "\u8FB0",
        "\u672A": "\u8FB0",
        "\u7533": "\u672A",
        "\u9149": "\u672A",
        "\u620C": "\u672A"
      };
      return map[baseBranch] === targetBranch;
    }
  },
  // 16. 金輿
  // 甲龍乙蛇丙戊羊，丁己猴猴庚犬傍，辛豬壬牛癸逢虎，仕人遇此祿名昌。
  {
    id: "jin_yu",
    name: "\u91D1\u8F3F",
    category: "auspicious",
    baseOn: ["dayStem"],
    ruleId: "SS_JINYU_016",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseStem, targetBranch }) => {
      const map = {
        "\u7532": "\u8FB0",
        "\u4E59": "\u5DF3",
        "\u4E19": "\u672A",
        "\u620A": "\u672A",
        "\u4E01": "\u7533",
        "\u5DF1": "\u7533",
        "\u5E9A": "\u620C",
        "\u8F9B": "\u4EA5",
        "\u58EC": "\u4E11",
        "\u7678": "\u5BC5"
      };
      return map[baseStem] === targetBranch;
    }
  },
  // 17. 紅鸞星
  // 以年支查：子見卯、丑見寅、寅見丑、卯見子、辰見亥、巳見戌、
  // 午見酉、未見申、申見未、酉見午、戌見巳、亥見辰。
  {
    id: "hong_luan",
    name: "\u7D05\u9E1E\u661F",
    category: "auspicious",
    baseOn: ["yearBranch"],
    ruleId: "SS_HONGLUAN_018",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        "\u5B50": "\u536F",
        "\u4E11": "\u5BC5",
        "\u5BC5": "\u4E11",
        "\u536F": "\u5B50",
        "\u8FB0": "\u4EA5",
        "\u5DF3": "\u620C",
        "\u5348": "\u9149",
        "\u672A": "\u7533",
        "\u7533": "\u672A",
        "\u9149": "\u5348",
        "\u620C": "\u5DF3",
        "\u4EA5": "\u8FB0"
      };
      return map[baseBranch] === targetBranch;
    }
  },
  // 18. 天喜星（紅鸞對沖位）
  // 以年支查：子見酉、丑見申、寅見未、卯見午、辰見巳、巳見辰、
  // 午見卯、未見寅、申見丑、酉見子、戌見亥、亥見戌。
  {
    id: "tian_xi",
    name: "\u5929\u559C\u661F",
    category: "auspicious",
    baseOn: ["yearBranch"],
    ruleId: "SS_TIANXI_019",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        "\u5B50": "\u9149",
        "\u4E11": "\u7533",
        "\u5BC5": "\u672A",
        "\u536F": "\u5348",
        "\u8FB0": "\u5DF3",
        "\u5DF3": "\u8FB0",
        "\u5348": "\u536F",
        "\u672A": "\u5BC5",
        "\u7533": "\u4E11",
        "\u9149": "\u5B50",
        "\u620C": "\u4EA5",
        "\u4EA5": "\u620C"
      };
      return map[baseBranch] === targetBranch;
    }
  },
  // 19. 天醫星
  // 以月支查：正月生見丑、二月見寅、三月見卯、四月見辰、五月見巳、六月見午、
  // 七月見未、八月見申、九月見酉、十月見戌、十一月見亥、十二月見子。
  {
    id: "tian_yi_star",
    name: "\u5929\u91AB\u661F",
    category: "auspicious",
    baseOn: ["monthBranch"],
    ruleId: "SS_TIANYI_020",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ monthBranch, targetBranch }) => {
      const map = {
        "\u5BC5": "\u4E11",
        "\u536F": "\u5BC5",
        "\u8FB0": "\u536F",
        "\u5DF3": "\u8FB0",
        "\u5348": "\u5DF3",
        "\u672A": "\u5348",
        "\u7533": "\u672A",
        "\u9149": "\u7533",
        "\u620C": "\u9149",
        "\u4EA5": "\u620C",
        "\u5B50": "\u4EA5",
        "\u4E11": "\u5B50"
      };
      return map[monthBranch] === targetBranch;
    }
  },
  // 20. 紅艷煞
  // 以年干或日干查：甲乙見午、丙見寅、丁見未、戊己見辰、庚見戌、辛見酉、壬見子、癸見申。
  {
    id: "hong_yan",
    name: "\u7D05\u8277\u715E",
    category: "inauspicious",
    baseOn: ["dayStem", "yearStem"],
    ruleId: "SS_HONGYAN_021",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09",
    match: ({ baseStem, targetBranch }) => {
      const map = {
        "\u7532": "\u5348",
        "\u4E59": "\u5348",
        "\u4E19": "\u5BC5",
        "\u4E01": "\u672A",
        "\u620A": "\u8FB0",
        "\u5DF1": "\u8FB0",
        "\u5E9A": "\u620C",
        "\u8F9B": "\u9149",
        "\u58EC": "\u5B50",
        "\u7678": "\u7533"
      };
      return map[baseStem] === targetBranch;
    }
  }
];

// src/shensha/utils/xunkong.js
var STEM_CHARS2 = "\u7532\u4E59\u4E19\u4E01\u620A\u5DF1\u5E9A\u8F9B\u58EC\u7678";
var BRANCH_CHARS2 = "\u5B50\u4E11\u5BC5\u536F\u8FB0\u5DF3\u5348\u672A\u7533\u9149\u620C\u4EA5";
function parseGanzhi(value) {
  if (typeof value === "string") return { stem: value[0], branch: value[1] };
  if (value && value.stem && value.branch) return value;
  return null;
}
function calculateXunKong(ganzhi) {
  const parsed = parseGanzhi(ganzhi);
  if (!parsed) return { xun: null, emptyBranches: [], index: -1 };
  const index = sexagenaryIndex(STEM_CHARS2.indexOf(parsed.stem), BRANCH_CHARS2.indexOf(parsed.branch));
  if (index < 0) return { xun: null, emptyBranches: [], index: -1 };
  const start = Math.floor(index / 10) * 10;
  return {
    xun: `${STEM_CHARS2[start % 10]}${BRANCH_CHARS2[start % 12]}\u65EC`,
    emptyBranches: [BRANCH_CHARS2[(start + 10) % 12], BRANCH_CHARS2[(start + 11) % 12]],
    index
  };
}

// src/shensha/utils/context.js
function toPillar(pillar, key) {
  const available = pillar && pillar.available !== false && pillar.stem && pillar.branch;
  if (!available) return { pillar: key, available: false, stem: null, branch: null, ganzhi: null };
  const ganzhi = pillar.ganzhi || `${pillar.stem}${pillar.branch}`;
  return {
    pillar: key,
    available: true,
    stem: pillar.stem,
    branch: pillar.branch,
    ganzhi,
    sexagenaryIndex: pillar.sexagenaryIndex ?? null,
    nayin: pillar.sexagenaryIndex === void 0 ? null : getNayin(pillar.sexagenaryIndex)
  };
}
function createShenShaContext(pillars, options = {}) {
  const normalized = {
    year: toPillar(pillars.year, "year"),
    month: toPillar(pillars.month, "month"),
    day: toPillar(pillars.day, "day"),
    hour: toPillar(pillars.hour, "hour")
  };
  const yearStemInfo = STEMS[STEM_INDEX[normalized.year.stem]] || {};
  const bases = {
    yearStem: normalized.year.stem,
    monthStem: normalized.month.stem,
    dayStem: normalized.day.stem,
    yearBranch: normalized.year.branch,
    monthBranch: normalized.month.branch,
    dayBranch: normalized.day.branch,
    dayPillar: normalized.day.ganzhi,
    yearPillar: normalized.year,
    dayPillarData: normalized.day
  };
  return {
    pillars: normalized,
    bases,
    gender: options.gender || null,
    yearStemYinYang: yearStemInfo.yinYang || null,
    dayXunKong: calculateXunKong(normalized.day.ganzhi),
    target: null
  };
}
function getBaseValue(context, baseKey) {
  const value = context.bases[baseKey];
  if (value && typeof value === "object") return value.ganzhi || value.branch || null;
  return value ?? null;
}
function getPillarEntries(pillars) {
  return ["year", "month", "day", "hour"].map((key) => toPillar(pillars[key], key)).filter((item) => item.available);
}
function isBaseActive(context, baseKey) {
  return !context.activeBase || context.activeBase === baseKey;
}

// src/shensha/catalogs/extended/vnext.js
var branches = "\u5B50\u4E11\u5BC5\u536F\u8FB0\u5DF3\u5348\u672A\u7533\u9149\u620C\u4EA5";
var branchAt2 = (branch, offset) => branches[(branches.indexOf(branch) + offset + 12) % 12];
var matchMap = (context, baseKey, map) => {
  if (!isBaseActive(context, baseKey)) return false;
  const base = context.bases[baseKey];
  const expected = map[base];
  const values = Array.isArray(expected) ? expected : [expected];
  return values.includes(context.target.branch);
};
var matchStemMap = (context, baseKeys, map) => baseKeys.some((key) => {
  if (!isBaseActive(context, key)) return false;
  const expected = map[context.bases[key]];
  return (Array.isArray(expected) ? expected : [expected]).includes(context.target.branch);
});
var refs = (title, note) => [{ type: "classical", title, note }];
var rule = (definition) => ({
  aliases: [],
  tags: [],
  schools: ["classical"],
  tradition: "classical-ziping",
  conceptType: "shensha",
  ruleFamily: "general-shensha",
  scope: "natal",
  priority: 50,
  version: "2.0.0",
  ...definition
});
var YANG_REN = { \u7532: "\u536F", \u4E59: "\u5BC5", \u4E19: "\u5348", \u4E01: "\u5DF3", \u620A: "\u5348", \u5DF1: "\u5DF3", \u5E9A: "\u9149", \u8F9B: "\u7533", \u58EC: "\u5B50", \u7678: "\u4EA5" };
var GUO_YIN = { \u7532: "\u620C", \u4E59: "\u4EA5", \u4E19: "\u4E11", \u4E01: "\u5BC5", \u620A: "\u4E11", \u5DF1: "\u5BC5", \u5E9A: "\u8FB0", \u8F9B: "\u5DF3", \u58EC: "\u672A", \u7678: "\u7533" };
var XUE_TANG_BY_NAYIN = { \u91D1: "\u5DF3", \u6728: "\u4EA5", \u6C34: "\u7533", \u706B: "\u5BC5", \u571F: "\u7533" };
var CI_GUAN_BY_NAYIN = { \u91D1: "\u7533", \u6728: "\u5BC5", \u6C34: "\u4EA5", \u706B: "\u5DF3", \u571F: "\u4EA5" };
var CI_GUAN_COMMON = { \u7532: "\u5E9A\u5BC5", \u4E59: "\u8F9B\u536F", \u4E19: "\u4E59\u5DF3", \u4E01: "\u620A\u5348", \u620A: "\u4E01\u5DF3", \u5DF1: "\u5E9A\u5348", \u5E9A: "\u58EC\u7533", \u8F9B: "\u7678\u9149", \u58EC: "\u7678\u4EA5", \u7678: "\u58EC\u620C" };
var XUE_TANG_COMMON = { \u7532: "\u4E19\u5BC5", \u4E59: "\u4E01\u536F", \u4E19: "\u620A\u7533", \u4E01: "\u5DF1\u9149", \u620A: "\u5E9A\u7533", \u5DF1: "\u8F9B\u9149", \u5E9A: "\u58EC\u5BC5", \u8F9B: "\u7678\u536F", \u58EC: "\u7532\u7533", \u7678: "\u4E59\u9149" };
var FU_XING = { \u7532: ["\u5BC5", "\u5B50"], \u4E59: ["\u536F", "\u4EA5"], \u4E19: ["\u5BC5", "\u5B50"], \u4E01: ["\u9149", "\u4EA5"], \u620A: ["\u536F"], \u5DF1: ["\u5DF3"], \u5E9A: ["\u5348"], \u8F9B: ["\u7533"], \u58EC: ["\u8FB0"], \u7678: ["\u4EA5"] };
var TIAN_CHU = { \u7532: "\u5DF3", \u4E59: "\u5348", \u4E19: "\u5DF3", \u4E01: "\u5348", \u620A: "\u7533", \u5DF1: "\u9149", \u5E9A: "\u4EA5", \u8F9B: "\u5B50", \u58EC: "\u5BC5", \u7678: "\u536F" };
var TIAN_GUAN = { \u7532: "\u672A", \u4E59: "\u8FB0", \u4E19: "\u5DF3", \u4E01: "\u9149", \u620A: "\u620C", \u5DF1: "\u536F", \u5E9A: "\u4EA5", \u8F9B: "\u7533", \u58EC: "\u5BC5", \u7678: "\u5348" };
var TIAN_FU = { \u7532: "\u9149", \u4E59: "\u7533", \u4E19: "\u5B50", \u4E01: "\u4EA5", \u620A: "\u536F", \u5DF1: "\u5BC5", \u5E9A: "\u5348", \u8F9B: "\u5DF3", \u58EC: "\u5348", \u7678: "\u5DF3" };
var ZAI_SHA = { \u7533: "\u5348", \u5B50: "\u5348", \u8FB0: "\u5348", \u5BC5: "\u5B50", \u5348: "\u5B50", \u620C: "\u5B50", \u5DF3: "\u536F", \u9149: "\u536F", \u4E11: "\u536F", \u4EA5: "\u9149", \u536F: "\u9149", \u672A: "\u9149" };
var BAI_HU = { \u7533: "\u620C", \u5B50: "\u620C", \u8FB0: "\u620C", \u5BC5: "\u8FB0", \u5348: "\u8FB0", \u620C: "\u8FB0", \u5DF3: "\u4E11", \u9149: "\u4E11", \u4E11: "\u4E11", \u4EA5: "\u672A", \u536F: "\u672A", \u672A: "\u672A" };
var EXTENDED_SHENSHA = [
  rule({ id: "fei_ren", name: "\u98DB\u5203", displayName: "\u98DB\u5203", category: "inauspicious", tags: ["blade"], tier: "extended", priority: 25, confidence: "traditional", baseOn: ["dayStem"], target: "branch", ruleId: "SS_FEIREN_023", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B", "\u4EE5\u7F8A\u5203\u5C0D\u6C96\u4F4D\u8AD6\u98DB\u5203"), description: "\u4EE5\u65E5\u5E72\u7F8A\u5203\u4E4B\u5C0D\u6C96\u652F\u5224\u5B9A\u3002", match: (c) => matchStemMap(c, ["dayStem"], Object.fromEntries(Object.entries(YANG_REN).map(([k, v]) => [k, branchAt2(v, 6)]))) }),
  rule({ id: "liu_jia_kong_wang", name: "\u7A7A\u4EA1", displayName: "\u7A7A\u4EA1\uFF08\u516D\u7532\u7A7A\u4EA1\uFF09", aliases: ["\u65EC\u7A7A", "\u516D\u7532\u7A7A\u4EA1"], category: "neutral", tags: ["xunkong"], tier: "extended", priority: 20, confidence: "classical", baseOn: ["dayPillar"], target: "branch", ruleId: "SS_XUNKONG_024", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B", "\u516D\u7532\u65EC\u4E2D\u7A7A\u4EA1\u5169\u652F"), description: "\u4EE5\u65E5\u67F1\u6240\u5728\u65EC\u8A08\u7B97\u5169\u500B\u7A7A\u4EA1\u5730\u652F\u3002", match: (c) => isBaseActive(c, "dayPillar") && c.dayXunKong.emptyBranches.includes(c.target.branch) }),
  rule({ id: "ci_guan", name: "\u8A5E\u9928", displayName: "\u8A5E\u9928", aliases: ["\u5B78\u9928\u8A5E\u9928"], category: "auspicious", tags: ["nayin", "literary"], tier: "extended", priority: 34, confidence: "school-specific", baseOn: ["dayStem", "yearPillar"], target: "branch", ruleId: "SS_CIGUAN_025", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u76F8\u95DC\u8A5E\u9928\u8A23", "\u7D0D\u97F3\u6D3E\u8207\u5E72\u652F\u5B9A\u67F1\u6CD5\u4E26\u5B58"), variants: [{ id: "nayin", description: "\u4EE5\u5E74\u67F1\u7D0D\u97F3\u4E94\u884C\u53D6\u8A5E\u9928\u652F\u3002" }, { id: "stem-pillar", description: "\u4EE5\u65E5\u5E72\u53D6\u56FA\u5B9A\u8A5E\u9928\u5E72\u652F\u3002" }], researchNotes: { conflict: true, note: "\u8A5E\u9928\u5404\u66F8\u53D6\u6CD5\u4E0D\u4E00\uFF0C\u4FDD\u7559\u5169\u7A2E\u6BD4\u5C0D\u8B49\u64DA\u3002" }, description: "\u540C\u6642\u4FDD\u7559\u7D0D\u97F3\u6D3E\u8207\u56FA\u5B9A\u5E72\u652F\u6D3E\uFF0C\u907F\u514D\u8986\u84CB\u6D41\u6D3E\u5DEE\u7570\u3002", match: (c) => {
    if (c.target.pillar === "year") return false;
    if (isBaseActive(c, "yearPillar") && CI_GUAN_BY_NAYIN[c.bases.yearPillar.nayin && c.bases.yearPillar.nayin.slice(-1)] === c.target.branch) return true;
    if (isBaseActive(c, "dayStem") && CI_GUAN_COMMON[c.bases.dayStem] === c.target.ganzhi) return true;
    return false;
  } }),
  rule({ id: "guo_yin_gui_ren", name: "\u570B\u5370\u8CB4\u4EBA", displayName: "\u570B\u5370\u8CB4\u4EBA", category: "auspicious", tags: ["noble"], tier: "extended", priority: 35, confidence: "traditional", baseOn: ["dayStem", "yearStem"], target: "branch", ruleId: "SS_GYGR_026", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B", "\u4EE5\u65E5\u5E72\u6216\u5E74\u5E72\u67E5\u570B\u5370\u8CB4\u4EBA"), description: "\u4EE5\u65E5\u5E72\u3001\u5E74\u5E72\u67E5\u570B\u5370\u8CB4\u4EBA\u652F\u3002", match: (c) => matchStemMap(c, ["dayStem", "yearStem"], GUO_YIN) }),
  rule({ id: "xue_tang", name: "\u5B78\u5802", displayName: "\u5B78\u5802", category: "auspicious", tags: ["nayin", "literary"], tier: "extended", priority: 36, confidence: "school-specific", baseOn: ["dayStem", "yearPillar"], target: "branch", ruleId: "SS_XUETANG_027", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u76F8\u95DC\u5B78\u5802\u8A23", "\u7D0D\u97F3\u6D3E\u8207\u56FA\u5B9A\u5E72\u652F\u6CD5\u4E26\u5B58"), variants: [{ id: "nayin", description: "\u4EE5\u5E74\u67F1\u7D0D\u97F3\u4E94\u884C\u53D6\u5B78\u5802\u652F\u3002" }, { id: "stem-pillar", description: "\u4EE5\u65E5\u5E72\u53D6\u56FA\u5B9A\u5B78\u5802\u5E72\u652F\u3002" }], researchNotes: { conflict: true, note: "\u5B78\u5802\u5404\u5BB6\u6709\u7D0D\u97F3\u3001\u5E72\u652F\u5169\u5957\u5E38\u7528\u6CD5\u3002" }, description: "\u540C\u6642\u652F\u63F4\u7D0D\u97F3\u6D3E\u8207\u56FA\u5B9A\u5E72\u652F\u6D3E\u3002", match: (c) => {
    if (isBaseActive(c, "yearPillar") && XUE_TANG_BY_NAYIN[c.bases.yearPillar.nayin && c.bases.yearPillar.nayin.slice(-1)] === c.target.branch) return true;
    return isBaseActive(c, "dayStem") && XUE_TANG_COMMON[c.bases.dayStem] === c.target.ganzhi;
  } }),
  rule({ id: "pi_ma", name: "\u62AB\u9EBB", displayName: "\u62AB\u9EBB", category: "inauspicious", tags: ["mourning"], tier: "extended", priority: 38, confidence: "traditional", baseOn: ["yearBranch", "dayBranch"], target: "branch", ruleId: "SS_PIMA_028", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B", "\u62AB\u9EBB\u4EE5\u5E74\u652F\u6216\u65E5\u652F\u4E09\u5408\u5C40\u53D6\u6CD5"), description: "\u4EE5\u5E74\u652F\u3001\u65E5\u652F\u53D6\u62AB\u9EBB\u652F\u3002", match: (c) => matchMap(c, "yearBranch", { \u5B50: "\u9149", \u4E11: "\u620C", \u5BC5: "\u4EA5", \u536F: "\u5B50", \u8FB0: "\u4E11", \u5DF3: "\u5BC5", \u5348: "\u536F", \u672A: "\u8FB0", \u7533: "\u5DF3", \u9149: "\u5348", \u620C: "\u672A", \u4EA5: "\u7533" }) || matchMap(c, "dayBranch", { \u5B50: "\u9149", \u4E11: "\u620C", \u5BC5: "\u4EA5", \u536F: "\u5B50", \u8FB0: "\u4E11", \u5DF3: "\u5BC5", \u5348: "\u536F", \u672A: "\u8FB0", \u7533: "\u5DF3", \u9149: "\u5348", \u620C: "\u672A", \u4EA5: "\u7533" }) }),
  rule({ id: "xue_ren", name: "\u8840\u5203", displayName: "\u8840\u5203", category: "inauspicious", tags: ["injury"], tier: "extended", priority: 39, confidence: "traditional", baseOn: ["dayStem", "monthBranch"], target: "branch", ruleId: "SS_XUEREN_029", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u76F8\u95DC\u8840\u5203\u8A23", "\u65E5\u5E72\u3001\u6708\u4EE4\u5169\u7A2E\u5E38\u898B\u53D6\u6CD5\u4E26\u5217"), researchNotes: { conflict: true, note: "\u8840\u5203\u5E38\u898B\u6309\u65E5\u5E72\u6216\u6309\u6708\u652F\u8D77\u4F8B\uFF0C\u5169\u8005\u4E0D\u4E92\u76F8\u8986\u84CB\u3002" }, match: (c) => matchStemMap(c, ["dayStem"], { \u7532: "\u536F", \u4E59: "\u8FB0", \u4E19: "\u5348", \u4E01: "\u672A", \u620A: "\u5348", \u5DF1: "\u672A", \u5E9A: "\u9149", \u8F9B: "\u620C", \u58EC: "\u5B50", \u7678: "\u4E11" }) || matchMap(c, "monthBranch", { \u5BC5: "\u4E11", \u536F: "\u672A", \u8FB0: "\u5BC5", \u5DF3: "\u7533", \u5348: "\u536F", \u672A: "\u9149", \u7533: "\u8FB0", \u9149: "\u620C", \u620C: "\u5DF3", \u4EA5: "\u4EA5", \u5B50: "\u5348", \u4E11: "\u5B50" }) }),
  rule({ id: "fu_xing_gui_ren", name: "\u798F\u661F\u8CB4\u4EBA", displayName: "\u798F\u661F\u8CB4\u4EBA", category: "auspicious", tags: ["noble"], tier: "extended", priority: 45, confidence: "traditional", baseOn: ["dayStem", "yearStem"], target: "branch", ruleId: "SS_FXGR_030", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u798F\u661F\u8CB4\u4EBA\u8A23", "\u7532\u4E19\u5BC5\u5B50\u3001\u4E59\u7678\u536F\u4EA5\u7B49\u53D6\u6CD5"), match: (c) => matchStemMap(c, ["dayStem", "yearStem"], FU_XING) }),
  rule({ id: "tian_chu_gui_ren", name: "\u5929\u5EDA\u8CB4\u4EBA", displayName: "\u5929\u5EDA\u8CB4\u4EBA", category: "auspicious", tags: ["noble"], tier: "extended", priority: 46, confidence: "traditional", baseOn: ["dayStem", "yearStem"], target: "branch", ruleId: "SS_TCGR_031", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u5929\u5EDA\u8CB4\u4EBA\u8A23", "\u4EE5\u65E5\u5E72\u3001\u5E74\u5E72\u67E5\u5929\u5EDA"), match: (c) => matchStemMap(c, ["dayStem", "yearStem"], TIAN_CHU) }),
  rule({ id: "tian_guan_gui_ren", name: "\u5929\u5B98\u8CB4\u4EBA", displayName: "\u5929\u5B98\u8CB4\u4EBA", category: "auspicious", tags: ["noble"], tier: "extended", priority: 47, confidence: "traditional", baseOn: ["dayStem", "yearStem"], target: "branch", ruleId: "SS_TGGR_032", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u5929\u5B98\u8CB4\u4EBA\u8A23", "\u7532\u672A\u4E59\u8FB0\u4E19\u5DF3\u4E01\u9149\u7B49\u53D6\u6CD5"), match: (c) => matchStemMap(c, ["dayStem", "yearStem"], TIAN_GUAN) }),
  rule({ id: "tian_fu_gui_ren", name: "\u5929\u798F\u8CB4\u4EBA", displayName: "\u5929\u798F\u8CB4\u4EBA", category: "auspicious", tags: ["noble"], tier: "extended", priority: 48, confidence: "traditional", baseOn: ["dayStem", "yearStem"], target: "branch", ruleId: "SS_TFGR_033", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u5929\u798F\u8CB4\u4EBA\u8A23", "\u4EE5\u6B63\u5B98\u6240\u81E8\u797F\u4F4D\u53D6\u6CD5"), description: "\u4EE5\u65E5\u5E72\u6216\u5E74\u5E72\u6240\u81E8\u6B63\u5B98\u7684\u797F\u4F4D\u53D6\u5929\u798F\u8CB4\u4EBA\u3002", interpretation: "\u50B3\u7D71\u795E\u715E\u4E2D\u8C61\u5FB5\u798F\u6C23\u3001\u52A9\u529B\u8207\u8F49\u571C\u7684\u5409\u661F\uFF0C\u5E38\u7528\u4F86\u8868\u793A\u8F03\u5BB9\u6613\u5F97\u5230\u63D0\u651C\u3001\u7167\u61C9\u6216\u5728\u4E8B\u60C5\u4E2D\u7372\u5F97\u52A9\u529B\u3002", match: (c) => matchStemMap(c, ["dayStem", "yearStem"], TIAN_FU) }),
  rule({ id: "zai_sha", name: "\u707D\u715E", displayName: "\u707D\u715E", category: "inauspicious", tags: ["sha"], tier: "extended", priority: 52, confidence: "traditional", baseOn: ["yearBranch", "dayBranch"], target: "branch", ruleId: "SS_ZAISHA_034", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u795E\u715E\u4E09\u5408\u5C40\u8A23", "\u4E09\u5408\u5C40\u5C0D\u6C96\u4F4D\u53D6\u707D\u715E"), match: (c) => matchMap(c, "yearBranch", ZAI_SHA) || matchMap(c, "dayBranch", ZAI_SHA) }),
  rule({ id: "yuan_chen", name: "\u5143\u8FB0", displayName: "\u5143\u8FB0", category: "inauspicious", tags: ["sha", "gender-dependent"], tier: "extended", priority: 53, confidence: "traditional", baseOn: ["yearBranch"], target: "branch", ruleId: "SS_YUANCHEN_035", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u5143\u8FB0\u8A23", "\u9670\u967D\u7537\u5973\u5206\u9806\u9006\u53D6\u5143\u8FB0"), researchNotes: { conflict: true, note: "\u5143\u8FB0\u9806\u9006\u8207\u7537\u5973\u3001\u5E74\u5E72\u9670\u967D\u7D81\u5B9A\uFF1B\u672C\u7248\u4FDD\u7559\u660E\u78BA\u7537\u5973\u5206\u652F\u3002" }, match: (c) => {
    if (!isBaseActive(c, "yearBranch")) return false;
    const offset = c.yearStemYinYang === "yang" === (c.gender === "male") ? 7 : 5;
    return c.target.branch === branchAt2(c.bases.yearBranch, offset);
  } }),
  rule({ id: "gou_shen", name: "\u52FE\u795E", displayName: "\u52FE\u795E", category: "inauspicious", tags: ["sha"], tier: "extended", priority: 54, confidence: "traditional", baseOn: ["yearBranch"], target: "branch", ruleId: "SS_GOUSHEN_036", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u52FE\u795E\u7D5E\u715E\u8A23", "\u5E74\u652F\u9806\u6578\u4E09\u4F4D"), match: (c) => isBaseActive(c, "yearBranch") && c.target.branch === branchAt2(c.bases.yearBranch, 3) }),
  rule({ id: "jiao_sha", name: "\u7D5E\u715E", displayName: "\u7D5E\u715E", category: "inauspicious", tags: ["sha"], tier: "extended", priority: 55, confidence: "traditional", baseOn: ["yearBranch"], target: "branch", ruleId: "SS_JIAOSHA_037", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u52FE\u795E\u7D5E\u715E\u8A23", "\u5E74\u652F\u9806\u6578\u4E94\u4F4D"), match: (c) => isBaseActive(c, "yearBranch") && c.target.branch === branchAt2(c.bases.yearBranch, 5) }),
  rule({ id: "sang_men", name: "\u55AA\u9580", displayName: "\u55AA\u9580", category: "inauspicious", tags: ["mourning"], tier: "extended", priority: 56, confidence: "traditional", baseOn: ["yearBranch"], target: "branch", ruleId: "SS_SANGMEN_038", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u6B72\u715E\u8A23", "\u5E74\u652F\u9806\u6578\u4E8C\u4F4D"), match: (c) => isBaseActive(c, "yearBranch") && c.target.branch === branchAt2(c.bases.yearBranch, 2) }),
  rule({ id: "diao_ke", name: "\u540A\u5BA2", displayName: "\u540A\u5BA2", category: "inauspicious", tags: ["mourning"], tier: "extended", priority: 57, confidence: "traditional", baseOn: ["yearBranch"], target: "branch", ruleId: "SS_DIAOKE_039", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u6B72\u715E\u8A23", "\u5E74\u652F\u9006\u6578\u4E8C\u4F4D"), match: (c) => isBaseActive(c, "yearBranch") && c.target.branch === branchAt2(c.bases.yearBranch, 10) }),
  rule({ id: "bai_hu", name: "\u767D\u864E", displayName: "\u767D\u864E", category: "inauspicious", tags: ["sha"], tier: "extended", priority: 58, confidence: "traditional", baseOn: ["yearBranch"], target: "branch", ruleId: "SS_BAIHU_040", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u767D\u864E\u6B72\u715E\u8A23", "\u4E09\u5408\u5C40\u53D6\u767D\u864E\u4F4D"), match: (c) => matchMap(c, "yearBranch", BAI_HU) }),
  rule({ id: "tian_luo", name: "\u5929\u7F85", displayName: "\u5929\u7F85", category: "inauspicious", tags: ["net"], tier: "extended", priority: 59, confidence: "traditional", baseOn: ["dayStem"], target: "branch", ruleId: "SS_TIANLUO_041", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u5929\u7F85\u5730\u7DB2\u8A23", "\u706B\u547D\u620C\u4EA5\u70BA\u5929\u7F85"), description: "\u706B\u65E5\u4E3B\u898B\u620C\u3001\u4EA5\u70BA\u5929\u7F85\u3002", match: (c) => isBaseActive(c, "dayStem") && ["\u4E19", "\u4E01"].includes(c.bases.dayStem) && ["\u620C", "\u4EA5"].includes(c.target.branch) }),
  rule({ id: "di_wang", name: "\u5730\u7DB2", displayName: "\u5730\u7DB2", category: "inauspicious", tags: ["net"], tier: "extended", priority: 60, confidence: "traditional", baseOn: ["dayStem"], target: "branch", ruleId: "SS_DIWANG_042", references: refs("\u300A\u4E09\u547D\u901A\u6703\u300B\u5929\u7F85\u5730\u7DB2\u8A23", "\u6C34\u547D\u8FB0\u5DF3\u70BA\u5730\u7DB2"), description: "\u6C34\u65E5\u4E3B\u898B\u8FB0\u3001\u5DF3\u70BA\u5730\u7DB2\u3002", match: (c) => isBaseActive(c, "dayStem") && ["\u58EC", "\u7678"].includes(c.bases.dayStem) && ["\u8FB0", "\u5DF3"].includes(c.target.branch) })
];

// src/shensha/interpretations.js
var SHENSHA_INTERPRETATIONS = Object.freeze({
  tian_yi_gui_ren: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u8CB4\u4EBA\u6276\u52A9\u3001\u9047\u4E8B\u6709\u4EBA\u63D0\u651C\u8207\u5316\u89E3\u56F0\u96E3\u7684\u52A9\u529B\u3002",
  tai_ji_gui_ren: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u5C0D\u4E8B\u7406\u7684\u9818\u609F\u3001\u601D\u8003\u8207\u947D\u7814\uFF0C\u4E5F\u5E38\u8207\u5B78\u7FD2\u548C\u7CBE\u795E\u8FFD\u6C42\u76F8\u9023\u3002",
  tian_de_gui_ren: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u5BEC\u539A\u3001\u5FB7\u6027\u8207\u9022\u51F6\u5316\u89E3\u7684\u52A9\u529B\uFF0C\u5E38\u53D6\u4E8B\u60C5\u6709\u8F49\u571C\u9918\u5730\u4E4B\u610F\u3002",
  yue_de_gui_ren: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u6708\u4EE4\u6240\u5E36\u7684\u548C\u7DE9\u8207\u89E3\u5384\u529B\u91CF\uFF0C\u5E38\u53D6\u5F97\u52A9\u3001\u6E1B\u5C11\u963B\u6EEF\u4E4B\u610F\u3002",
  wen_chang_gui_ren: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u6587\u601D\u3001\u5B78\u7FD2\u3001\u8868\u9054\u8207\u624D\u85DD\uFF0C\u5E38\u7528\u4F86\u89C0\u5BDF\u8B80\u66F8\u548C\u6587\u5B57\u80FD\u529B\u3002",
  lu_shen: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u4FF8\u797F\u3001\u8077\u5206\u3001\u8CC7\u6E90\u8207\u81EA\u7ACB\u80FD\u529B\uFF0C\u4E5F\u6709\u5B89\u5B9A\u6536\u7A6B\u4E4B\u610F\u3002",
  yang_ren: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u525B\u70C8\u3001\u679C\u65B7\u8207\u884C\u52D5\u529B\uFF1B\u529B\u91CF\u904E\u5F37\u6642\u4E5F\u53EF\u80FD\u8868\u73FE\u70BA\u885D\u7A81\u6216\u6025\u8E81\u3002",
  yi_ma: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u79FB\u52D5\u3001\u65C5\u884C\u3001\u8B8A\u52D5\u8207\u5954\u6CE2\uFF0C\u4E5F\u53EF\u5F15\u7533\u70BA\u74B0\u5883\u6216\u8077\u6DAF\u7684\u8F49\u63DB\u3002",
  tao_hua: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u5438\u5F15\u529B\u3001\u4EBA\u969B\u5F80\u4F86\u3001\u60C5\u611F\u4E92\u52D5\u8207\u5BE9\u7F8E\u624D\u85DD\uFF0C\u5409\u51F6\u4ECD\u9808\u914D\u5408\u5168\u5C40\u3002",
  hua_gai: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u7368\u8655\u3001\u601D\u8003\u3001\u85DD\u8853\u8207\u6280\u85DD\uFF0C\u4E5F\u5E36\u6709\u6E05\u9AD8\u6216\u4E0D\u559C\u4FD7\u52D9\u7684\u610F\u5473\u3002",
  jiang_xing: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u7D71\u7387\u3001\u7D44\u7E54\u3001\u64D4\u7576\u8207\u9818\u5C0E\u529B\uFF0C\u5E38\u53D6\u5728\u5718\u9AD4\u4E2D\u80FD\u638C\u4E8B\u4E4B\u610F\u3002",
  jie_sha: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u7A81\u767C\u963B\u529B\u3001\u5916\u5728\u5E72\u64FE\u8207\u8CC7\u6E90\u53D7\u640D\u7684\u53EF\u80FD\uFF0C\u63D0\u9192\u884C\u4E8B\u7559\u610F\u8B8A\u6578\u3002",
  wang_shen: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u96B1\u4F0F\u7684\u727D\u639B\u3001\u8017\u640D\u8207\u4E0D\u6613\u5BDF\u89BA\u7684\u963B\u529B\uFF0C\u5E38\u53D6\u4E8B\u60C5\u9700\u8981\u591A\u52A0\u7559\u610F\u4E4B\u610F\u3002",
  gu_chen: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u7368\u7ACB\u3001\u5B64\u7ACB\u6216\u8F03\u5C11\u4F9D\u8CF4\u4ED6\u4EBA\u7684\u6027\u60C5\uFF0C\u4E26\u975E\u55AE\u7368\u4EE3\u8868\u4EBA\u751F\u5409\u51F6\u3002",
  gua_su: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u7368\u8655\u3001\u60C5\u611F\u8DDD\u96E2\u6216\u95DC\u4FC2\u4E2D\u7684\u5BC2\u5BDE\u611F\uFF0C\u4ECD\u9808\u914D\u5408\u5176\u4ED6\u914D\u7F6E\u7406\u89E3\u3002",
  jin_yu: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u7269\u8CEA\u4EAB\u53D7\u3001\u751F\u6D3B\u689D\u4EF6\u3001\u4EA4\u901A\u5668\u7528\u8207\u53D7\u4EBA\u7167\u6599\u7684\u798F\u5206\u3002",
  hong_luan: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u559C\u6176\u3001\u60C5\u611F\u4EA4\u6D41\u8207\u5A5A\u59FB\u7DE3\u5206\uFF0C\u5E38\u53D6\u95DC\u4FC2\u767C\u5C55\u8F03\u6709\u559C\u6C23\u4E4B\u610F\u3002",
  tian_xi: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u559C\u6085\u3001\u6176\u8CC0\u3001\u4EBA\u969B\u548C\u5408\u8207\u597D\u6D88\u606F\uFF0C\u5E38\u8207\u559C\u4E8B\u548C\u6B61\u805A\u7684\u8C61\u610F\u76F8\u9023\u3002",
  tian_yi_star: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u91AB\u85E5\u3001\u7167\u8B77\u3001\u8ABF\u990A\u8207\u75C5\u5F8C\u5FA9\u539F\u7684\u610F\u6DB5\uFF0C\u5C6C\u50B3\u7D71\u8853\u6578\u4E2D\u7684\u8F14\u52A9\u8C61\u610F\u3002",
  hong_yan: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u5916\u5728\u9B45\u529B\u3001\u60C5\u611F\u5438\u5F15\u8207\u4EBA\u969B\u7CFE\u845B\uFF0C\u5E38\u63D0\u9192\u7559\u610F\u95DC\u4FC2\u4E2D\u7684\u5206\u5BF8\u3002",
  fei_ren: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u7F8A\u5203\u529B\u91CF\u7684\u5916\u653E\u8207\u7A81\u767C\u6027\uFF0C\u5E38\u53D6\u6025\u9032\u3001\u885D\u649E\u6216\u9700\u8981\u6536\u6582\u4E4B\u610F\u3002",
  liu_jia_kong_wang: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u865B\u7A7A\u3001\u7F3A\u4F4D\u3001\u5EF6\u9072\u6216\u4E8B\u60C5\u4E0D\u6613\u843D\u5BE6\u7684\u611F\u53D7\uFF0C\u4E0D\u80FD\u53EA\u6191\u7A7A\u4EA1\u55AE\u7368\u4E0B\u65B7\u8A9E\u3002",
  ci_guan: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u6587\u66F8\u3001\u5B78\u554F\u3001\u8457\u8FF0\u8207\u8CC7\u683C\u7D2F\u7A4D\uFF0C\u5E38\u8207\u6587\u5B57\u80FD\u529B\u548C\u5B78\u7FD2\u6210\u679C\u76F8\u9023\u3002",
  guo_yin_gui_ren: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u5370\u4FE1\u3001\u8CAC\u4EFB\u3001\u5236\u5EA6\u8207\u7BA1\u7406\u80FD\u529B\uFF0C\u4E5F\u6709\u5F97\u5230\u6B63\u5F0F\u627F\u8A8D\u6216\u6388\u6B0A\u4E4B\u610F\u3002",
  xue_tang: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u5B78\u7FD2\u3001\u6559\u80B2\u3001\u624D\u667A\u8207\u5C08\u696D\u990A\u6210\uFF0C\u5E38\u53D6\u8B80\u66F8\u9032\u4FEE\u6216\u6280\u85DD\u7CBE\u719F\u4E4B\u610F\u3002",
  pi_ma: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u55AA\u670D\u3001\u54C0\u60BC\u8207\u5BB6\u65CF\u4E2D\u7684\u96E2\u5225\u610F\u6DB5\uFF0C\u5C6C\u50B3\u7D71\u6B72\u904B\u8C61\u5FB5\u800C\u975E\u4E8B\u4EF6\u9810\u544A\u3002",
  xue_ren: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u8840\u5149\u3001\u5200\u50B7\u6216\u6025\u6027\u640D\u50B7\u7684\u8B66\u793A\u610F\u6DB5\uFF0C\u50C5\u5C6C\u50B3\u7D71\u8853\u6578\u7B26\u865F\u3002",
  fu_xing_gui_ren: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u798F\u5206\u3001\u9806\u9042\u8207\u53D7\u52A9\uFF0C\u5E38\u53D6\u4E8B\u60C5\u8F03\u5BB9\u6613\u5F97\u5230\u7167\u61C9\u6216\u6709\u597D\u8F49\u6A5F\u6703\u4E4B\u610F\u3002",
  tian_chu_gui_ren: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u98F2\u98DF\u3001\u53E3\u798F\u3001\u751F\u6D3B\u8CC7\u6E90\u8207\u4EAB\u53D7\uFF0C\u4E5F\u6709\u8863\u98DF\u8F03\u4E0D\u5331\u4E4F\u4E4B\u610F\u3002",
  tian_guan_gui_ren: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u5B98\u5E9C\u3001\u898F\u7BC4\u3001\u8077\u4F4D\u8207\u6B63\u5F0F\u52A9\u529B\uFF0C\u5E38\u53D6\u53D7\u5230\u63D0\u62D4\u6216\u627F\u64D4\u8077\u8CAC\u4E4B\u610F\u3002",
  tian_fu_gui_ren: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u798F\u6C23\u3001\u52A9\u529B\u8207\u8F49\u571C\uFF0C\u5E38\u7528\u4F86\u8868\u793A\u8F03\u5BB9\u6613\u5F97\u5230\u63D0\u651C\u3001\u7167\u61C9\u6216\u4E8B\u60C5\u6709\u52A9\u529B\u3002",
  zai_sha: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u7A81\u767C\u8B8A\u6545\u3001\u5916\u5728\u98A8\u96AA\u8207\u74B0\u5883\u5E72\u64FE\uFF0C\u63D0\u9192\u9762\u5C0D\u8B8A\u52D5\u6642\u4FDD\u7559\u61C9\u8B8A\u7A7A\u9593\u3002",
  yuan_chen: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u758F\u96E2\u3001\u5931\u548C\u8207\u4E0D\u9806\u9042\u7684\u611F\u53D7\uFF0C\u5E38\u53D6\u4EBA\u969B\u6216\u74B0\u5883\u4E2D\u8F03\u6709\u727D\u5236\u4E4B\u610F\u3002",
  gou_shen: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u727D\u7E8F\u3001\u5EF6\u5B95\u8207\u4EBA\u4E8B\u7CFE\u7D50\uFF0C\u5E38\u53D6\u4E8B\u60C5\u5BB9\u6613\u88AB\u7D30\u7BC0\u6216\u95DC\u4FC2\u62D6\u4F4F\u4E4B\u610F\u3002",
  jiao_sha: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u963B\u6EEF\u3001\u727D\u5236\u8207\u53CD\u8986\uFF0C\u5E38\u53D6\u884C\u4E8B\u9700\u8981\u89E3\u958B\u7D50\u9EDE\u3001\u907F\u514D\u7CFE\u7E8F\u4E4B\u610F\u3002",
  sang_men: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u54C0\u621A\u3001\u5BB6\u5B85\u639B\u5FF5\u8207\u9001\u5225\u610F\u6DB5\uFF0C\u5C6C\u6B72\u904B\u4E2D\u7684\u50B3\u7D71\u8C61\u5FB5\u800C\u975E\u5FC5\u7136\u4E8B\u4EF6\u3002",
  diao_ke: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u5F14\u5501\u3001\u96E2\u5225\u8207\u4EBA\u60C5\u5F80\u4F86\u4E2D\u7684\u6C89\u91CD\u60C5\u7DD2\uFF0C\u9700\u914D\u5408\u6574\u9AD4\u914D\u7F6E\u7406\u89E3\u3002",
  bai_hu: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u525B\u731B\u3001\u58D3\u529B\u3001\u7A81\u767C\u640D\u50B7\u8207\u96E3\u4EE5\u67D4\u5316\u7684\u529B\u91CF\uFF0C\u63D0\u9192\u884C\u4E8B\u8B39\u614E\u3002",
  tian_luo: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u53D7\u56F0\u3001\u9650\u5236\u8207\u4E8B\u60C5\u96E3\u4EE5\u8212\u5C55\u7684\u611F\u53D7\uFF0C\u5E38\u53D6\u5916\u5728\u689D\u4EF6\u5F62\u6210\u727D\u7D46\u4E4B\u610F\u3002",
  di_wang: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u727D\u7E8F\u3001\u963B\u585E\u8207\u96E3\u4EE5\u812B\u8EAB\u7684\u5C40\u9762\uFF0C\u5E38\u53D6\u4E8B\u60C5\u9700\u8981\u9010\u6B65\u758F\u901A\u4E4B\u610F\u3002"
});

// src/shensha/registry.js
var LEGACY_DISPLAY = {
  tao_hua: { displayName: "\u6843\u82B1\uFF08\u54B8\u6C60\uFF09", aliases: ["\u54B8\u6C60"] },
  tian_xi: { name: "\u5929\u559C", displayName: "\u5929\u559C", aliases: ["\u5929\u559C\u661F"] },
  tian_yi_star: { name: "\u5929\u91AB", displayName: "\u5929\u91AB", aliases: ["\u5929\u91AB\u661F"] },
  hong_luan: { name: "\u7D05\u9E1E", displayName: "\u7D05\u9E1E", aliases: ["\u7D05\u9E1E\u661F"] }
};
function legacyMatcher(rule3, context) {
  if (rule3.matchChart) return context.target.pillar === "day" && rule3.matchChart(context.pillars);
  const baseKey = context.activeBase;
  if (baseKey === "dayStem") return rule3.match({ baseStem: context.bases.dayStem, targetBranch: context.target.branch, targetStem: context.target.stem });
  if (baseKey === "yearStem") return rule3.match({ baseStem: context.bases.yearStem, targetBranch: context.target.branch, targetStem: context.target.stem });
  if (baseKey === "monthBranch") return rule3.match({ monthBranch: context.bases.monthBranch, targetBranch: context.target.branch, targetStem: context.target.stem });
  if (baseKey === "dayBranch") return rule3.match({ baseBranch: context.bases.dayBranch, targetBranch: context.target.branch, targetStem: context.target.stem });
  if (baseKey === "yearBranch") return rule3.match({ baseBranch: context.bases.yearBranch, targetBranch: context.target.branch, targetStem: context.target.stem });
  return false;
}
function normalizeLegacyRule(rule3) {
  const override = LEGACY_DISPLAY[rule3.id] || {};
  const isPillarRule = Boolean(rule3.matchChart || rule3.baseOn.includes("dayPillar"));
  return {
    ...rule3,
    name: override.name || rule3.name,
    displayName: override.displayName || rule3.name,
    aliases: override.aliases || [],
    tradition: "classical-ziping",
    conceptType: "shensha",
    ruleFamily: "general-shensha",
    scope: "natal",
    tags: ["legacy", rule3.category === "auspicious" ? "noble" : rule3.category],
    tier: "core",
    priority: 100,
    confidence: "classical",
    schools: ["canonical", "legacy-catalog"],
    target: isPillarRule ? "pillar" : "branch",
    description: `\u7531 BaziJS v1 catalog adapter \u4FDD\u7559\u7684${rule3.name}\u898F\u5247\u3002`,
    references: [{ type: "classical", title: rule3.reference, note: "Legacy catalog adapter\uFF1B\u4FDD\u7559\u539F\u59CB\u5224\u5B9A\u51FD\u6578\u3002" }],
    match: (context) => legacyMatcher(rule3, context)
  };
}
function withInterpretation(rule3) {
  return {
    ...rule3,
    interpretation: rule3.interpretation || SHENSHA_INTERPRETATIONS[rule3.id] || ""
  };
}
var SHENSHA_REGISTRY = Object.freeze([
  ...SHENSHA_CATALOG.map(normalizeLegacyRule).map(withInterpretation),
  ...EXTENDED_SHENSHA.map(withInterpretation)
]);
function validateShenShaRegistry(registry = SHENSHA_REGISTRY) {
  const errors = [];
  const ids = /* @__PURE__ */ new Set();
  const ruleIds = /* @__PURE__ */ new Set();
  for (const rule3 of registry) {
    if (!rule3.id || ids.has(rule3.id)) errors.push(`duplicate id: ${rule3.id || "(empty)"}`);
    ids.add(rule3.id);
    if (!rule3.ruleId || ruleIds.has(rule3.ruleId)) errors.push(`duplicate ruleId: ${rule3.ruleId || "(empty)"}`);
    ruleIds.add(rule3.ruleId);
    if (!rule3.name || !rule3.displayName) errors.push(`${rule3.id}: name/displayName is required`);
    for (const field of ["tradition", "conceptType", "ruleFamily", "scope"]) {
      if (!rule3[field]) errors.push(`${rule3.id}: ${field} is required`);
    }
    if (!SHENSHA_CATEGORIES.includes(rule3.category)) errors.push(`${rule3.id}: invalid category`);
    if (!SHENSHA_TIERS.includes(rule3.tier)) errors.push(`${rule3.id}: invalid tier`);
    if (!SHENSHA_CONFIDENCES.includes(rule3.confidence)) errors.push(`${rule3.id}: invalid confidence`);
    if (!Array.isArray(rule3.baseOn) || rule3.baseOn.length === 0) errors.push(`${rule3.id}: baseOn is required`);
    if (typeof rule3.interpretation !== "string" || !rule3.interpretation.trim()) errors.push(`${rule3.id}: interpretation is required`);
    if (typeof rule3.match !== "function") errors.push(`${rule3.id}: match must be a function`);
    if (!rule3.version) errors.push(`${rule3.id}: version is required`);
    if (!Array.isArray(rule3.references) || rule3.references.length === 0) errors.push(`${rule3.id}: references is required`);
  }
  return { valid: errors.length === 0, errors, count: registry.length };
}
var validation = validateShenShaRegistry();
if (!validation.valid) throw new Error(`ShenSha registry invalid: ${validation.errors.join("; ")}`);
function getShenShaRule(id) {
  return SHENSHA_REGISTRY.find((rule3) => rule3.id === id) || null;
}
function getShenShaCatalog() {
  return SHENSHA_REGISTRY.slice();
}

// src/shensha/engine.js
function isRuleEnabled(rule3, preset) {
  return preset.tiers.includes(rule3.tier) && !(preset.excludeExperimental && rule3.confidence === "experimental");
}
function matchedValue(value) {
  if (typeof value === "object" && value !== null) return value.matched !== false;
  return Boolean(value);
}
function matchNote(value, rule3) {
  if (value && typeof value === "object") return value.evidence || value.reason || rule3.description;
  return rule3.description;
}
function normalizeTarget(target) {
  return {
    pillar: target.pillar,
    available: target.available !== false,
    stem: target.stem || null,
    branch: target.branch || null,
    ganzhi: target.ganzhi || (target.stem && target.branch ? `${target.stem}${target.branch}` : null),
    sexagenaryIndex: target.sexagenaryIndex ?? null
  };
}
function resultFor(rule3, hits, evidence) {
  const references = rule3.references || [];
  return {
    id: rule3.id,
    name: rule3.name,
    displayName: rule3.displayName || rule3.name,
    aliases: rule3.aliases || [],
    tradition: rule3.tradition,
    conceptType: rule3.conceptType,
    ruleFamily: rule3.ruleFamily,
    scope: rule3.scope,
    category: rule3.category,
    tags: rule3.tags || [],
    tier: rule3.tier,
    priority: rule3.priority,
    confidence: rule3.confidence,
    schools: rule3.schools || [],
    hitOn: [...new Set(hits)],
    baseOn: rule3.baseOn,
    basedOn: rule3.baseOn,
    target: rule3.target,
    ruleId: rule3.ruleId,
    version: rule3.version,
    reference: references[0] ? references[0].title : void 0,
    references,
    description: rule3.description || "",
    ...rule3.interpretation ? { interpretation: rule3.interpretation } : {},
    ...rule3.variants ? { variants: rule3.variants } : {},
    ...rule3.researchNotes ? { researchNotes: rule3.researchNotes } : {},
    evidence: { details: evidence }
  };
}
function evaluateRules(pillars, targets, options = {}) {
  const preset = getShenShaPreset(options.preset || options.shenshaPreset || options.shenShaPreset || "classical");
  const baseContext = createShenShaContext(pillars, { gender: options.gender });
  const external = options.external === true;
  const results = [];
  for (const rule3 of SHENSHA_REGISTRY) {
    if (!isRuleEnabled(rule3, preset)) continue;
    if (external && rule3.baseOn.includes("dayPillar")) continue;
    const hits = [];
    const evidence = [];
    for (const rawTarget of targets) {
      const target = normalizeTarget(rawTarget);
      if (!target.available) continue;
      for (const baseKey of rule3.baseOn) {
        const context = { ...baseContext, target, activeBase: baseKey };
        let value = false;
        try {
          value = rule3.match(context);
        } catch (error) {
          evidence.push({ basedOn: baseKey, matched: false, error: error.message });
          continue;
        }
        if (!matchedValue(value)) continue;
        if (!hits.includes(target.pillar)) hits.push(target.pillar);
        evidence.push({
          basedOn: baseKey,
          baseValue: getBaseValue(context, baseKey),
          targetPillar: target.pillar,
          targetValue: target.ganzhi || target.branch,
          matched: true,
          reason: matchNote(value, rule3)
        });
      }
    }
    if (hits.length > 0) results.push(resultFor(rule3, hits, evidence));
  }
  return results;
}
function calculateShenSha(pillars, options = {}) {
  return evaluateRules(pillars, getPillarEntries(pillars), options);
}
function calculateShenShaOnPillar(natalPillars, stemChar, branchChar, pillarLabel, options = {}) {
  if (!stemChar || !branchChar) return [];
  return evaluateRules(natalPillars, [{ pillar: pillarLabel, stem: stemChar, branch: branchChar, available: true }], { ...options, external: true });
}
function calculateTransitShenSha(natalChart, transit, options = {}) {
  const pillar = transit && (transit.year || transit);
  if (!pillar || !pillar.stem || !pillar.branch) return { year: null, shenSha: [] };
  const results = calculateShenShaOnPillar(natalChart.pillars || natalChart, pillar.stem, pillar.branch, "transit-year", options);
  return { year: transit && typeof transit.year === "number" ? transit.year : null, target: pillar.ganzhi || `${pillar.stem}${pillar.branch}`, shenSha: results };
}
function groupShenShaByPillar(results = []) {
  const grouped = { year: [], month: [], day: [], hour: [] };
  for (const item of results) {
    for (const pillar of item.hitOn || []) {
      if (!grouped[pillar]) continue;
      grouped[pillar].push({
        ...item,
        hitOn: [pillar],
        evidence: {
          ...item.evidence || {},
          details: (item.evidence && item.evidence.details ? item.evidence.details : []).filter((detail) => detail.targetPillar === pillar)
        }
      });
    }
  }
  return grouped;
}

// src/special-rules/index.js
var special_rules_exports = {};
__export(special_rules_exports, {
  BA_ZHUAN: () => BA_ZHUAN,
  GU_LUAN: () => GU_LUAN,
  JIN_SHEN: () => JIN_SHEN,
  JIU_CHOU: () => JIU_CHOU,
  KUI_GANG: () => KUI_GANG,
  RI_DE: () => RI_DE,
  RI_GUI: () => RI_GUI,
  SEASONAL_SPECIAL_RULES: () => SEASONAL_SPECIAL_RULES,
  SHI_E_DA_BAI: () => SHI_E_DA_BAI,
  SPECIAL_PILLAR_RULES: () => SPECIAL_PILLAR_RULES,
  SPECIAL_RULE_INTERPRETATIONS: () => SPECIAL_RULE_INTERPRETATIONS,
  SPECIAL_RULE_REGISTRY: () => SPECIAL_RULE_REGISTRY,
  YIN_YANG_CHA_CUO: () => YIN_YANG_CHA_CUO,
  calculateSeasonalSpecialRules: () => calculateSeasonalSpecialRules,
  calculateSpecialPillarRules: () => calculateSpecialPillarRules,
  calculateSpecialRules: () => calculateSpecialRules,
  getSpecialRule: () => getSpecialRule,
  getSpecialRuleCatalog: () => getSpecialRuleCatalog,
  validateSpecialRuleRegistry: () => validateSpecialRuleRegistry
});

// src/special-rules/context.js
var SEASON_BY_MONTH_BRANCH = Object.freeze({
  \u5BC5: "spring",
  \u536F: "spring",
  \u8FB0: "spring",
  \u5DF3: "summer",
  \u5348: "summer",
  \u672A: "summer",
  \u7533: "autumn",
  \u9149: "autumn",
  \u620C: "autumn",
  \u4EA5: "winter",
  \u5B50: "winter",
  \u4E11: "winter"
});
var SEASON_BRANCHES = Object.freeze({
  spring: Object.freeze(["\u5BC5", "\u536F", "\u8FB0"]),
  summer: Object.freeze(["\u5DF3", "\u5348", "\u672A"]),
  autumn: Object.freeze(["\u7533", "\u9149", "\u620C"]),
  winter: Object.freeze(["\u4EA5", "\u5B50", "\u4E11"])
});
function normalizePillar(pillar) {
  if (!pillar) return { available: false, stem: null, branch: null, ganzhi: null };
  const stem = pillar.stem || null;
  const branch = pillar.branch || null;
  return {
    ...pillar,
    available: pillar.available !== false && Boolean(stem || branch || pillar.ganzhi),
    stem,
    branch,
    ganzhi: pillar.ganzhi || (stem && branch ? `${stem}${branch}` : null)
  };
}
function createSpecialRuleContext(pillars, options = {}) {
  const normalized = {
    year: normalizePillar(pillars && pillars.year),
    month: normalizePillar(pillars && pillars.month),
    day: normalizePillar(pillars && pillars.day),
    hour: normalizePillar(pillars && pillars.hour)
  };
  const monthBranch = normalized.month.branch;
  const season = SEASON_BY_MONTH_BRANCH[monthBranch] || null;
  return {
    pillars: normalized,
    input: options.input || null,
    gender: options.gender || null,
    calendar: options.calendar || null,
    monthBranch,
    season,
    seasonBranches: season ? SEASON_BRANCHES[season] : [],
    seasonSource: "month-branch (\u7BC0\u4EE4\u6708\u4EE4)"
  };
}

// src/special-rules/interpretations.js
var SPECIAL_RULE_INTERPRETATIONS = Object.freeze({
  kui_gang: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u525B\u5065\u3001\u679C\u6C7A\u8207\u884C\u52D5\u529B\uFF1B\u529B\u91CF\u5982\u4F55\u767C\u63EE\u4ECD\u9808\u914D\u5408\u6708\u4EE4\u3001\u5168\u5C40\u8207\u6B72\u904B\u3002",
  shi_e_da_bai: "\u50B3\u7D71\u4E0A\u8996\u70BA\u65E5\u67F1\u4E2D\u7684\u7279\u6B8A\u6A19\u8A18\uFF0C\u5E38\u7528\u4F86\u63D0\u9192\u8CC7\u6E90\u8207\u884C\u4E8B\u7BC0\u594F\uFF1B\u4E0D\u80FD\u53EA\u6191\u4E00\u65E5\u4FBF\u65B7\u5B9A\u6210\u6557\u3002",
  ri_gui: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u65E5\u4E3B\u5E36\u6709\u8CB4\u6C23\u8207\u53D7\u52A9\u689D\u4EF6\uFF1B\u665D\u8CB4\u3001\u591C\u8CB4\u7684\u7D30\u5206\u53CA\u5BE6\u969B\u5409\u51F6\u4ECD\u6709\u7248\u672C\u5DEE\u7570\u3002",
  ri_de: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u65E5\u4E3B\u5177\u5FB7\u6027\u3001\u548C\u539A\u8207\u8F49\u571C\u529B\u91CF\uFF1B\u5B8C\u6574\u53D6\u7528\u4ECD\u9700\u89C0\u5BDF\u6574\u9AD4\u547D\u5C40\u3002",
  ba_zhuan: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u65E5\u67F1\u5E72\u652F\u540C\u6C23\u6216\u797F\u65FA\u7684\u7279\u6B8A\u7D50\u69CB\uFF0C\u5E38\u53D6\u5C08\u6CE8\u8207\u529B\u91CF\u96C6\u4E2D\u4E4B\u610F\u3002",
  jiu_chou: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u65E5\u67F1\u5E36\u6709\u8F03\u7279\u6B8A\u7684\u60C5\u611F\u3001\u4EBA\u4E8B\u6216\u884C\u4E8B\u963B\u6EEF\u610F\u6DB5\uFF1B\u53E4\u7C4D\u5217\u65E5\u6578\u6709\u7248\u672C\u5DEE\u7570\u3002",
  gu_luan: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u8F03\u91CD\u7684\u7368\u7ACB\u611F\u3001\u60C5\u611F\u8DDD\u96E2\u6216\u95DC\u4FC2\u8AB2\u984C\uFF1B\u4E0D\u4EE3\u8868\u55AE\u4E00\u65E5\u67F1\u5373\u53EF\u5224\u5B9A\u5A5A\u59FB\u7D50\u679C\u3002",
  yin_yang_cha_cuo: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u9670\u967D\u914D\u5408\u8F03\u5BB9\u6613\u51FA\u73FE\u932F\u4F4D\u6216\u53CD\u8986\uFF0C\u5E38\u7528\u4F86\u89C0\u5BDF\u95DC\u4FC2\u8207\u5408\u4F5C\u4E2D\u7684\u78E8\u5408\u3002",
  jin_shen: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u6642\u67F1\u5E36\u6709\u525B\u70C8\u3001\u96C6\u4E2D\u8207\u935B\u934A\u7684\u529B\u91CF\uFF1B\u706B\u5236\u3001\u6708\u4EE4\u8207\u5168\u5C40\u53D6\u7528\u53E6\u9808\u7368\u7ACB\u5224\u65B7\u3002",
  tian_she: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u4F9D\u7BC0\u4EE4\u800C\u5B9A\u7684\u8D66\u89E3\u3001\u8F49\u571C\u8207\u6E1B\u8F15\u963B\u6EEF\u4E4B\u610F\uFF1B\u5FC5\u9808\u540C\u6642\u7B26\u5408\u5B63\u7BC0\u8207\u65E5\u67F1\u3002",
  si_fei: "\u50B3\u7D71\u4E0A\u8C61\u5FB5\u5B63\u7BC0\u8207\u65E5\u67F1\u914D\u5408\u4E0B\u7684\u6C23\u52E2\u8870\u5F31\u6216\u96E3\u65BD\u5C55\u4E4B\u610F\uFF1B\u4E0D\u80FD\u812B\u96E2\u6708\u4EE4\u55AE\u7368\u5224\u5B9A\u3002"
});

// src/special-rules/registry.js
var CLASSICAL_ZIPING = "classical-ziping";
var DAY_PILLAR = "day-pillar-special";
var HOUR_PILLAR = "hour-pillar-special";
var SEASONAL_DAY = "seasonal-day-special";
var refs2 = (...references) => references.map(([title, locator, url, note]) => ({
  type: "classical",
  title,
  locator,
  url,
  ...note ? { note } : {}
}));
var pillarGanzhi = (context, pillar) => context.pillars[pillar] && context.pillars[pillar].ganzhi;
function fixedEvidence(context, pillar, values, originalBasis, notes = []) {
  const value = pillarGanzhi(context, pillar);
  return {
    matched: values.includes(value),
    basedOn: [`${pillar}Pillar`],
    targetPillar: pillar,
    targetValue: value,
    originalBasis,
    notes
  };
}
function seasonalEvidence(context, values, originalBasis, notes = []) {
  const dayPillar = pillarGanzhi(context, "day");
  const validBranches = context.season ? SEASON_BRANCHES[context.season] : [];
  const matched = Boolean(context.season && values[context.season] && values[context.season].includes(dayPillar));
  return {
    matched,
    basedOn: ["monthBranch", "dayPillar"],
    season: context.season,
    seasonSource: context.seasonSource,
    monthBranch: context.monthBranch,
    seasonBranches: validBranches,
    targetPillar: "day",
    targetValue: dayPillar,
    originalBasis,
    notes
  };
}
var KUI_GANG = Object.freeze(["\u5E9A\u8FB0", "\u58EC\u8FB0", "\u620A\u620C", "\u5E9A\u620C"]);
var SHI_E_DA_BAI = Object.freeze(["\u7532\u8FB0", "\u4E59\u5DF3", "\u4E19\u7533", "\u4E01\u4EA5", "\u620A\u620C", "\u5DF1\u4E11", "\u5E9A\u8FB0", "\u8F9B\u5DF3", "\u58EC\u7533", "\u7678\u4EA5"]);
var RI_GUI = Object.freeze(["\u4E01\u9149", "\u4E01\u4EA5", "\u7678\u5DF3", "\u7678\u536F"]);
var RI_DE = Object.freeze(["\u7532\u5BC5", "\u4E19\u8FB0", "\u620A\u8FB0", "\u5E9A\u8FB0", "\u58EC\u620C"]);
var BA_ZHUAN = Object.freeze(["\u7532\u5BC5", "\u4E59\u536F", "\u5DF1\u672A", "\u4E01\u672A", "\u5E9A\u7533", "\u8F9B\u9149", "\u620A\u620C", "\u7678\u4E11"]);
var JIU_CHOU = Object.freeze(["\u620A\u5B50", "\u620A\u5348", "\u5DF1\u536F", "\u5DF1\u9149", "\u8F9B\u536F", "\u8F9B\u9149", "\u58EC\u5B50", "\u58EC\u5348", "\u4E01\u9149", "\u4E59\u536F"]);
var GU_LUAN = Object.freeze(["\u4E59\u5DF3", "\u4E01\u5DF3", "\u8F9B\u4EA5", "\u620A\u7533", "\u7532\u5BC5", "\u4E19\u5348", "\u620A\u5348", "\u58EC\u5B50"]);
var YIN_YANG_CHA_CUO = Object.freeze(["\u4E19\u5B50", "\u4E01\u4E11", "\u620A\u5BC5", "\u8F9B\u536F", "\u58EC\u8FB0", "\u7678\u5DF3", "\u4E19\u5348", "\u4E01\u672A", "\u620A\u7533", "\u8F9B\u9149", "\u58EC\u620C", "\u7678\u4EA5"]);
var JIN_SHEN = Object.freeze(["\u7678\u9149", "\u5DF1\u5DF3", "\u4E59\u4E11"]);
var withInterpretation2 = (rule3) => ({
  ...rule3,
  interpretation: rule3.interpretation || SPECIAL_RULE_INTERPRETATIONS[rule3.id] || ""
});
var PILLAR_RULES = [
  {
    id: "kui_gang",
    name: "\u9B41\u7F61",
    displayName: "\u9B41\u7F61",
    aliases: ["\u9B41\u7F61\u8CB4\u4EBA"],
    tradition: CLASSICAL_ZIPING,
    conceptType: "special-pillar",
    ruleFamily: DAY_PILLAR,
    baseOn: ["dayPillar"],
    scope: "natal",
    category: "neutral",
    confidence: "classical",
    ruleId: "SP_KUIGANG_001",
    version: SPECIAL_RULE_VERSION,
    tier: "core",
    priority: 10,
    tags: ["special-day"],
    schools: ["classical-ziping"],
    references: refs2(
      ["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D", "\u9B41\u7F61", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"],
      ["\u300A\u6DF5\u6D77\u5B50\u5E73\u300B", "\u9B41\u7F61", "https://zh.wikisource.org/zh-hant/\u6DF5\u6D77\u5B50\u5E73"]
    ),
    description: "\u65E5\u67F1\u70BA\u5E9A\u8FB0\u3001\u58EC\u8FB0\u3001\u620A\u620C\u3001\u5E9A\u620C\u4E4B\u4E00\uFF0C\u5373\u4EE5\u9B41\u7F61\u7279\u6B8A\u65E5\u67F1\u689D\u4EF6\u8A18\u9304\uFF1B\u4E0D\u5728\u6B64\u8655\u63A8\u65B7\u9B41\u7F61\u683C\u6210\u683C\u3002",
    variants: [{ id: "four-day-core", description: "\u56DB\u67F1\u56FA\u5B9A\u65E5\u4F8B\uFF1A\u5E9A\u8FB0\u3001\u58EC\u8FB0\u3001\u620A\u620C\u3001\u5E9A\u620C\u3002" }],
    researchNotes: { migratedFrom: "SS_KUIGANG_017", note: "\u820A\u7248\u5C07\u56FA\u5B9A\u65E5\u67F1\u8AA4\u639B\u5728 ShenSha Catalog\uFF1B\u672C\u7248\u53EA\u4F5C SpecialPillar \u8B58\u5225\u3002" },
    match: (context) => KUI_GANG.includes(pillarGanzhi(context, "day")),
    evidence: (context) => fixedEvidence(context, "day", KUI_GANG, "\u56FA\u5B9A\u65E5\u67F1\u56DB\u65E5\uFF1A\u5E9A\u8FB0\u3001\u58EC\u8FB0\u3001\u620A\u620C\u3001\u5E9A\u620C\u3002")
  },
  {
    id: "shi_e_da_bai",
    name: "\u5341\u60E1\u5927\u6557\u65E5",
    displayName: "\u5341\u60E1\u5927\u6557\u65E5",
    aliases: ["\u5341\u60E1\u5927\u6557"],
    tradition: CLASSICAL_ZIPING,
    conceptType: "special-pillar",
    ruleFamily: DAY_PILLAR,
    baseOn: ["dayPillar"],
    scope: "natal",
    category: "inauspicious",
    confidence: "classical",
    ruleId: "SP_SHIEDABAI_002",
    version: SPECIAL_RULE_VERSION,
    tier: "core",
    priority: 11,
    tags: ["special-day"],
    schools: ["classical-ziping"],
    references: refs2(
      ["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E94", "\u5341\u60E1\u5927\u6557\u65E5", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u4E94"],
      ["\u300A\u6DF5\u6D77\u5B50\u5E73\u300B", "\u5341\u60E1\u5927\u6557", "https://zh.wikisource.org/zh-hant/\u6DF5\u6D77\u5B50\u5E73"]
    ),
    description: "\u65E5\u67F1\u843D\u5728\u5341\u60E1\u5927\u6557\u5341\u65E5\u4E4B\u4E00\uFF1B\u9019\u662F\u65E5\u67F1\u689D\u4EF6\uFF0C\u4E0D\u7B49\u540C\u65BC\u6574\u5C40\u5FC5\u7136\u51F6\u6557\u3002",
    variants: [{ id: "ten-day-list", description: "\u7532\u8FB0\u3001\u4E59\u5DF3\u3001\u4E19\u7533\u3001\u4E01\u4EA5\u3001\u620A\u620C\u3001\u5DF1\u4E11\u3001\u5E9A\u8FB0\u3001\u8F9B\u5DF3\u3001\u58EC\u7533\u3001\u7678\u4EA5\u3002" }],
    researchNotes: { migratedFrom: "SS_SHIEDABAI_022", note: "\u820A\u7248\u5C07\u56FA\u5B9A\u65E5\u67F1\u8AA4\u639B\u5728 ShenSha Catalog\uFF1B\u672C\u7248\u79FB\u81F3 SpecialPillar\u3002" },
    match: (context) => SHI_E_DA_BAI.includes(pillarGanzhi(context, "day")),
    evidence: (context) => fixedEvidence(context, "day", SHI_E_DA_BAI, "\u56FA\u5B9A\u65E5\u67F1\u5341\u65E5\uFF1A\u7532\u8FB0\u3001\u4E59\u5DF3\u3001\u4E19\u7533\u3001\u4E01\u4EA5\u3001\u620A\u620C\u3001\u5DF1\u4E11\u3001\u5E9A\u8FB0\u3001\u8F9B\u5DF3\u3001\u58EC\u7533\u3001\u7678\u4EA5\u3002")
  },
  {
    id: "ri_gui",
    name: "\u65E5\u8CB4",
    displayName: "\u65E5\u8CB4",
    aliases: ["\u65E5\u8CB4\u683C"],
    tradition: CLASSICAL_ZIPING,
    conceptType: "special-pillar",
    ruleFamily: DAY_PILLAR,
    baseOn: ["dayPillar"],
    scope: "natal",
    category: "auspicious",
    confidence: "classical",
    ruleId: "SP_RIGUI_003",
    version: SPECIAL_RULE_VERSION,
    tier: "core",
    priority: 12,
    tags: ["special-day", "noble"],
    schools: ["classical-ziping"],
    references: refs2(
      ["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D", "\u65E5\u8CB4", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"],
      ["\u300A\u6DF5\u6D77\u5B50\u5E73\u300B", "\u65E5\u8CB4", "https://zh.wikisource.org/zh-hant/\u6DF5\u6D77\u5B50\u5E73"]
    ),
    description: "\u65E5\u67F1\u70BA\u4E01\u9149\u3001\u4E01\u4EA5\u3001\u7678\u5DF3\u3001\u7678\u536F\u4E4B\u4E00\uFF1B\u65E5\u8CB4\u665D\u591C\u5206\u4F8B\u5C6C\u5F8C\u7E8C\u53D6\u7528\u5DEE\u7570\uFF0C\u672C\u8B58\u5225\u53EA\u6A19\u8A18\u65E5\u67F1\u3002",
    variants: [
      { id: "day-night", description: "\u4E01\u4EA5\u3001\u7678\u536F\u5E38\u5217\u665D\u8CB4\uFF1B\u4E01\u9149\u3001\u7678\u5DF3\u5E38\u5217\u591C\u8CB4\uFF0C\u5BE6\u969B\u5206\u914D\u4F9D\u7248\u672C\u3002" }
    ],
    researchNotes: { note: "\u4E0D\u4EE5\u51FA\u751F\u6642\u523B\u66FF\u53E4\u7C4D\u65E5\u8CB4\u665D\u591C\u5206\u4F8B\u505A\u55AE\u4E00\u5316\u88C1\u6C7A\uFF0C\u907F\u514D\u628A\u65E5\u67F1\u8B58\u5225\u8AA4\u7576\u5B8C\u6574\u683C\u5C40\u3002" },
    match: (context) => RI_GUI.includes(pillarGanzhi(context, "day")),
    evidence: (context) => fixedEvidence(context, "day", RI_GUI, "\u56FA\u5B9A\u65E5\u67F1\u56DB\u65E5\uFF1A\u4E01\u9149\u3001\u4E01\u4EA5\u3001\u7678\u5DF3\u3001\u7678\u536F\u3002", ["\u665D\u8CB4/\u591C\u8CB4\u5206\u914D\u5B58\u7248\u672C\u5DEE\u7570\u3002"])
  },
  {
    id: "ri_de",
    name: "\u65E5\u5FB7",
    displayName: "\u65E5\u5FB7",
    aliases: ["\u65E5\u5FB7\u683C"],
    tradition: CLASSICAL_ZIPING,
    conceptType: "special-pillar",
    ruleFamily: DAY_PILLAR,
    baseOn: ["dayPillar"],
    scope: "natal",
    category: "auspicious",
    confidence: "classical",
    ruleId: "SP_RIDE_004",
    version: SPECIAL_RULE_VERSION,
    tier: "core",
    priority: 13,
    tags: ["special-day"],
    schools: ["classical-ziping"],
    references: refs2(
      ["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D", "\u65E5\u5FB7", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"],
      ["\u300A\u6DF5\u6D77\u5B50\u5E73\u300B", "\u65E5\u5FB7", "https://zh.wikisource.org/zh-hant/\u6DF5\u6D77\u5B50\u5E73"]
    ),
    description: "\u65E5\u67F1\u70BA\u7532\u5BC5\u3001\u4E19\u8FB0\u3001\u620A\u8FB0\u3001\u5E9A\u8FB0\u3001\u58EC\u620C\u4E4B\u4E00\uFF1B\u50C5\u6A19\u8A18\u65E5\u5FB7\u65E5\u4F8B\uFF0C\u5B8C\u6574\u65E5\u5FB7\u683C\u4ECD\u9808\u8003\u5BDF\u6574\u5C40\u3002",
    variants: [{ id: "five-day-list", description: "\u7532\u5BC5\u3001\u4E19\u8FB0\u3001\u620A\u8FB0\u3001\u5E9A\u8FB0\u3001\u58EC\u620C\u3002" }],
    researchNotes: { note: "\u65E5\u5FB7\u5728\u53E4\u7C4D\u4E2D\u5E38\u8207\u683C\u5C40\u53D6\u7528\u4E26\u8AD6\uFF1B\u672C\u898F\u5247\u4E0D\u4EE3\u66FF\u6574\u5C40\u6210\u683C\u5224\u65B7\u3002" },
    match: (context) => RI_DE.includes(pillarGanzhi(context, "day")),
    evidence: (context) => fixedEvidence(context, "day", RI_DE, "\u56FA\u5B9A\u65E5\u67F1\u4E94\u65E5\uFF1A\u7532\u5BC5\u3001\u4E19\u8FB0\u3001\u620A\u8FB0\u3001\u5E9A\u8FB0\u3001\u58EC\u620C\u3002")
  },
  {
    id: "ba_zhuan",
    name: "\u516B\u5C08",
    displayName: "\u516B\u5C08",
    aliases: ["\u516B\u5C08\u65E5"],
    tradition: CLASSICAL_ZIPING,
    conceptType: "special-pillar",
    ruleFamily: DAY_PILLAR,
    baseOn: ["dayPillar"],
    scope: "natal",
    category: "neutral",
    confidence: "classical",
    ruleId: "SP_BAZHUAN_005",
    version: SPECIAL_RULE_VERSION,
    tier: "core",
    priority: 14,
    tags: ["special-day"],
    schools: ["classical-ziping"],
    references: refs2(
      ["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D", "\u516B\u5C08\u797F\u65FA", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"],
      ["\u300A\u6DF5\u6D77\u5B50\u5E73\u300B", "\u516B\u5C08", "https://zh.wikisource.org/zh-hant/\u6DF5\u6D77\u5B50\u5E73"]
    ),
    description: "\u4F9D\u300A\u4E09\u547D\u901A\u6703\u300B\u516B\u5C08\u65E5\u4F8B\uFF0C\u4EE5\u7532\u5BC5\u3001\u4E59\u536F\u3001\u5DF1\u672A\u3001\u4E01\u672A\u3001\u5E9A\u7533\u3001\u8F9B\u9149\u3001\u620A\u620C\u3001\u7678\u4E11\u4F5C\u56FA\u5B9A\u65E5\u67F1\u8B58\u5225\u3002",
    variants: [
      { id: "four-day-core", description: "\u90E8\u5206\u50B3\u672C\u6216\u8A3B\u5BB6\u53EA\u53D6\u7532\u5BC5\u3001\u4E59\u536F\u3001\u5E9A\u7533\u3001\u8F9B\u9149\u56DB\u65E5\uFF0C\u7A31\u516B\u5C08\u797F\u65FA\u6838\u5FC3\u3002" },
      { id: "eight-day-list", description: "\u672C\u7248\u4FDD\u7559\u5377\u516D\u5E38\u898B\u516B\u65E5\u8868\uFF0C\u4E26\u65BC evidence \u8A18\u9304\u56DB\u65E5\u6838\u5FC3\u5DEE\u7570\u3002" }
    ],
    researchNotes: { conflict: true, note: "\u516B\u5C08\u6709\u56DB\u65E5\u6838\u5FC3\u8207\u516B\u65E5\u64F4\u5C55\u5169\u7A2E\u7528\u6CD5\uFF1B\u672A\u628A\u5DEE\u7570\u975C\u9ED8\u5408\u4F75\u6210\u552F\u4E00\u683C\u5C40\u3002" },
    match: (context) => BA_ZHUAN.includes(pillarGanzhi(context, "day")),
    evidence: (context) => fixedEvidence(context, "day", BA_ZHUAN, "\u56FA\u5B9A\u65E5\u67F1\u516B\u65E5\u8868\uFF1A\u7532\u5BC5\u3001\u4E59\u536F\u3001\u5DF1\u672A\u3001\u4E01\u672A\u3001\u5E9A\u7533\u3001\u8F9B\u9149\u3001\u620A\u620C\u3001\u7678\u4E11\u3002", ["\u53E6\u6709\u56DB\u65E5\u6838\u5FC3 variant\u3002"])
  },
  {
    id: "jiu_chou",
    name: "\u4E5D\u919C",
    displayName: "\u4E5D\u919C",
    aliases: ["\u4E5D\u919C\u65E5"],
    tradition: CLASSICAL_ZIPING,
    conceptType: "special-pillar",
    ruleFamily: DAY_PILLAR,
    baseOn: ["dayPillar"],
    scope: "natal",
    category: "inauspicious",
    confidence: "classical",
    ruleId: "SP_JIUCHOU_006",
    version: SPECIAL_RULE_VERSION,
    tier: "core",
    priority: 15,
    tags: ["special-day"],
    schools: ["classical-ziping"],
    references: refs2(
      ["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09", "\u4E5D\u919C\u65E5", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703_(\u56DB\u5EAB\u5168\u66F8\u672C)/\u537703"],
      ["\u300A\u6B3D\u5B9A\u53E4\u4ECA\u5716\u66F8\u96C6\u6210\u300B\u85DD\u8853\u5178\u7B2C728\u5377", "\u4E5D\u919C", "https://zh.wikisource.org/wiki/\u6B3D\u5B9A\u53E4\u4ECA\u5716\u66F8\u96C6\u6210/\u535A\u7269\u5F59\u7DE8/\u85DD\u8853\u5178/\u7B2C728\u5377"]
    ),
    description: "\u4F9D\u300A\u4E09\u547D\u901A\u6703\u300B\u539F\u6587\u6240\u5217\u5341\u500B\u5E72\u652F\u65E5\u4F8B\u8B58\u5225\uFF1B\u540D\u7A31\u70BA\u4E5D\u919C\uFF0C\u4F46\u539F\u6587\u5217\u6578\u8207\u5F8C\u4E16\u4E5D\u65E5\u8868\u5B58\u5728\u885D\u7A81\u3002",
    variants: [
      { id: "sanming-ten-day-text", description: "\u620A\u5B50\u3001\u620A\u5348\u3001\u5DF1\u536F\u3001\u5DF1\u9149\u3001\u8F9B\u536F\u3001\u8F9B\u9149\u3001\u58EC\u5B50\u3001\u58EC\u5348\u3001\u4E01\u9149\u3001\u4E59\u536F\uFF0C\u5171\u5341\u65E5\u3002", source: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09" },
      { id: "later-nine-day-list", description: "\u5F8C\u4E16\u5E38\u898B\u4E5D\u65E5\u8868\u6703\u522A\u6E1B\u6216\u6539\u5217\uFF0C\u50C5\u4F5C\u7814\u7A76 variant\uFF0C\u4E0D\u4F5C\u672C\u7248\u9810\u8A2D\u3002" }
    ],
    researchNotes: { conflict: true, note: "\u4E5D\u919C\u7684\u300C\u4E5D\u300D\u8207\u53E4\u7C4D\u539F\u6587\u5341\u65E5\u5217\u6CD5\u4E0D\u4E00\u81F4\uFF1B\u9810\u8A2D\u63A1\u53EF\u9010\u5B57\u6838\u5C0D\u7684\u5377\u4E09\u5341\u65E5\u8868\u3002" },
    match: (context) => JIU_CHOU.includes(pillarGanzhi(context, "day")),
    evidence: (context) => fixedEvidence(context, "day", JIU_CHOU, "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09\u6240\u5217\u5341\u65E5\uFF0C\u540D\u7A31\u8207\u5217\u6578\u6709\u6587\u737B\u885D\u7A81\u3002", ["\u63A1\u5341\u65E5 variant\uFF1B\u672A\u5047\u88DD\u53EA\u6709\u552F\u4E00\u4E5D\u65E5\u8868\u3002"])
  },
  {
    id: "gu_luan",
    name: "\u5B64\u9E1E",
    displayName: "\u5B64\u9E1E",
    aliases: ["\u5B64\u9E1E\u715E", "\u5B64\u9E1E\u65E5"],
    tradition: CLASSICAL_ZIPING,
    conceptType: "special-pillar",
    ruleFamily: DAY_PILLAR,
    baseOn: ["dayPillar"],
    scope: "natal",
    category: "inauspicious",
    confidence: "classical",
    ruleId: "SP_GULUAN_007",
    version: SPECIAL_RULE_VERSION,
    tier: "core",
    priority: 16,
    tags: ["special-day", "marriage"],
    schools: ["classical-ziping"],
    references: refs2(
      ["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09", "\u5B64\u9E1E\u715E", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703_(\u56DB\u5EAB\u5168\u66F8\u672C)/\u537703"],
      ["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D", "\u5B64\u9E1E", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"]
    ),
    description: "\u4F9D\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09\u6240\u5217\u516B\u65E5\u4F5C\u5B64\u9E1E\u7279\u6B8A\u65E5\u67F1\u8B58\u5225\uFF0C\u4E0D\u628A\u5A5A\u59FB\u5409\u51F6\u76F4\u63A5\u5F9E\u55AE\u4E00\u65E5\u67F1\u63A8\u5B9A\u3002",
    variants: [
      { id: "sanming-eight-day-list", description: "\u4E59\u5DF3\u3001\u4E01\u5DF3\u3001\u8F9B\u4EA5\u3001\u620A\u7533\u3001\u7532\u5BC5\u3001\u4E19\u5348\u3001\u620A\u5348\u3001\u58EC\u5B50\u3002", source: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09" },
      { id: "legacy-conservative-five", description: "\u820A BaziJS vNext \u66FE\u63A1\u4E59\u5DF3\u3001\u4E01\u5DF3\u3001\u8F9B\u4EA5\u3001\u620A\u7533\u3001\u7532\u5BC5\u4E94\u67F1\u3002", source: "BaziJS vNext legacy" }
    ],
    researchNotes: { conflict: true, migratedFrom: "SS_GULUAN_043", note: "\u539F\u5178\u516B\u65E5\u3001\u820A\u7248\u4E94\u65E5\u53CA\u5F8C\u4E16\u589E\u6E1B\u4E26\u5B58\uFF1B\u672C\u7248\u9810\u8A2D\u539F\u5178\u516B\u65E5\uFF0C\u4FDD\u7559\u4E94\u65E5\u5DEE\u7570\u3002" },
    match: (context) => GU_LUAN.includes(pillarGanzhi(context, "day")),
    evidence: (context) => fixedEvidence(context, "day", GU_LUAN, "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09\u6240\u5217\u516B\u65E5\uFF1A\u4E59\u5DF3\u3001\u4E01\u5DF3\u3001\u8F9B\u4EA5\u3001\u620A\u7533\u3001\u7532\u5BC5\u3001\u4E19\u5348\u3001\u620A\u5348\u3001\u58EC\u5B50\u3002", ["\u8207\u820A\u7248\u4E94\u67F1\u6E05\u55AE\u5B58\u5728\u5DEE\u7570\u3002"])
  },
  {
    id: "yin_yang_cha_cuo",
    name: "\u9670\u967D\u5DEE\u932F",
    displayName: "\u9670\u967D\u5DEE\u932F",
    aliases: ["\u9670\u967D\u5DEE\u932F\u65E5"],
    tradition: CLASSICAL_ZIPING,
    conceptType: "special-pillar",
    ruleFamily: DAY_PILLAR,
    baseOn: ["dayPillar"],
    scope: "natal",
    category: "inauspicious",
    confidence: "classical",
    ruleId: "SP_YYCC_008",
    version: SPECIAL_RULE_VERSION,
    tier: "core",
    priority: 17,
    tags: ["special-day", "marriage"],
    schools: ["classical-ziping"],
    references: refs2(
      ["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09", "\u9670\u967D\u5DEE\u932F", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703_(\u56DB\u5EAB\u5168\u66F8\u672C)/\u537703"],
      ["\u300A\u6DF5\u6D77\u5B50\u5E73\u300B", "\u9670\u967D\u5DEE\u932F", "https://zh.wikisource.org/zh-hant/\u6DF5\u6D77\u5B50\u5E73"]
    ),
    description: "\u65E5\u67F1\u843D\u5728\u4E19\u5B50\u3001\u4E01\u4E11\u3001\u620A\u5BC5\u3001\u8F9B\u536F\u3001\u58EC\u8FB0\u3001\u7678\u5DF3\u3001\u4E19\u5348\u3001\u4E01\u672A\u3001\u620A\u7533\u3001\u8F9B\u9149\u3001\u58EC\u620C\u3001\u7678\u4EA5\u5341\u4E8C\u65E5\u4E4B\u4E00\u3002",
    variants: [{ id: "twelve-day-list", description: "\u56FA\u5B9A\u65E5\u67F1\u5341\u4E8C\u65E5\u8868\u3002" }],
    researchNotes: { migratedFrom: "SS_YYCC_044", note: "\u820A\u7248\u64FA\u5728 ShenSha extended\uFF1B\u672C\u7248\u79FB\u81F3 SpecialPillar\u3002" },
    match: (context) => YIN_YANG_CHA_CUO.includes(pillarGanzhi(context, "day")),
    evidence: (context) => fixedEvidence(context, "day", YIN_YANG_CHA_CUO, "\u56FA\u5B9A\u65E5\u67F1\u5341\u4E8C\u65E5\u8868\uFF1A\u4E19\u5B50\u3001\u4E01\u4E11\u3001\u620A\u5BC5\u3001\u8F9B\u536F\u3001\u58EC\u8FB0\u3001\u7678\u5DF3\u3001\u4E19\u5348\u3001\u4E01\u672A\u3001\u620A\u7533\u3001\u8F9B\u9149\u3001\u58EC\u620C\u3001\u7678\u4EA5\u3002")
  },
  {
    id: "jin_shen",
    name: "\u91D1\u795E",
    displayName: "\u91D1\u795E",
    aliases: ["\u91D1\u795E\u6642"],
    tradition: CLASSICAL_ZIPING,
    conceptType: "special-pillar",
    ruleFamily: HOUR_PILLAR,
    baseOn: ["hourPillar"],
    scope: "natal",
    category: "neutral",
    confidence: "classical",
    ruleId: "SP_JINSHEN_009",
    version: SPECIAL_RULE_VERSION,
    tier: "core",
    priority: 18,
    tags: ["special-hour"],
    schools: ["classical-ziping"],
    references: refs2(
      ["\u300A\u6DF5\u6D77\u5B50\u5E73\u300B", "\u91D1\u795E", "https://zh.wikisource.org/zh-hant/\u6DF5\u6D77\u5B50\u5E73"],
      ["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D", "\u91D1\u795E", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"]
    ),
    description: "\u6642\u67F1\u70BA\u7678\u9149\u3001\u5DF1\u5DF3\u3001\u4E59\u4E11\u4E4B\u4E00\uFF0C\u5373\u8A18\u9304\u91D1\u795E\u6642\uFF1B\u706B\u5236\u3001\u6708\u4EE4\u53CA\u5168\u5C40\u53D6\u7528\u5C6C\u5F8C\u7E8C\u683C\u5C40\u5224\u65B7\uFF0C\u4E26\u672A\u5728\u6B64\u55AE\u67F1\u8B58\u5225\u4E2D\u786C\u5224\u3002",
    variants: [{ id: "three-hour-list", description: "\u7678\u9149\u6642\u3001\u5DF1\u5DF3\u6642\u3001\u4E59\u4E11\u6642\u3002" }],
    researchNotes: { note: "\u53E4\u7C4D\u5C0D\u91D1\u795E\u5F8C\u7E8C\u559C\u5FCC\u53E6\u6709\u5168\u5C40\u689D\u4EF6\uFF1B\u672C\u898F\u5247\u523B\u610F\u53EA\u505A hour-pillar-special \u5075\u6E2C\u3002" },
    match: (context) => JIN_SHEN.includes(pillarGanzhi(context, "hour")),
    evidence: (context) => fixedEvidence(context, "hour", JIN_SHEN, "\u56FA\u5B9A\u6642\u67F1\u4E09\u4F8B\uFF1A\u7678\u9149\u3001\u5DF1\u5DF3\u3001\u4E59\u4E11\u3002", ["\u5B8C\u6574\u91D1\u795E\u683C\u53D6\u7528\u4E0D\u7531\u55AE\u4E00\u6642\u67F1\u6C7A\u5B9A\u3002"])
  }
];
var SEASONAL_RULES = [
  {
    id: "tian_she",
    name: "\u5929\u8D66",
    displayName: "\u5929\u8D66",
    aliases: ["\u5929\u8D66\u65E5"],
    tradition: CLASSICAL_ZIPING,
    conceptType: "seasonal-special",
    ruleFamily: SEASONAL_DAY,
    baseOn: ["monthBranch", "dayPillar"],
    scope: "natal",
    category: "auspicious",
    confidence: "classical",
    ruleId: "SE_TIANSHE_001",
    version: SPECIAL_RULE_VERSION,
    tier: "core",
    priority: 20,
    tags: ["seasonal", "special-day"],
    schools: ["classical-ziping"],
    references: refs2(
      ["\u300A\u6DF5\u6D77\u5B50\u5E73\u300B", "\u5929\u8D66", "https://zh.wikisource.org/zh-hant/\u6DF5\u6D77\u5B50\u5E73"],
      ["\u300A\u6B3D\u5B9A\u5354\u7D00\u8FA8\u65B9\u66F8\u300B\u5377\u4E94", "\u5929\u8D66", "https://zh.wikisource.org/wiki/\u6B3D\u5B9A\u5354\u7D00\u8FA8\u65B9\u66F8_(\u56DB\u5EAB\u5168\u66F8\u672C)/\u537705"]
    ),
    description: "\u5929\u8D66\u4E0D\u662F\u55AE\u4E00\u65E5\u67F1\u795E\u715E\uFF1A\u6625\u620A\u5BC5\u3001\u590F\u7532\u5348\u3001\u79CB\u620A\u7533\u3001\u51AC\u7532\u5B50\uFF0C\u9808\u5148\u4F9D\u7BC0\u4EE4\u6708\u652F\u5224\u5B9A\u5B63\u7BC0\uFF0C\u518D\u6BD4\u5C0D\u65E5\u67F1\u3002",
    variants: [{ id: "four-season-day-list", description: "\u672C\u7248\u63A1\u6625\u620A\u5BC5\u3001\u590F\u7532\u5348\u3001\u79CB\u620A\u7533\u3001\u51AC\u7532\u5B50\uFF1B\u5176\u4ED6\u66C6\u66F8\u7570\u6587\u4FDD\u7559\u65BC researchNotes\u3002" }],
    researchNotes: { conflict: true, note: "\u5929\u8D66\u7684\u5B63\u7BC0\u908A\u754C\u4F9D\u7BC0\u4EE4\u800C\u975E\u570B\u66C6\u6708\u4EFD\uFF1B\u65E5\u4F8B\u5728\u4E0D\u540C\u66C6\u66F8\u6709\u7570\u6587\uFF0C\u672C\u7248\u6CBF\u7528\u5B50\u5E73\u56DB\u5B63\u8868\u4E26\u628A\u5B63\u7BC0 evidence \u5B8C\u6574\u8F38\u51FA\u3002" },
    match: (context) => {
      const values = { spring: "\u620A\u5BC5", summer: "\u7532\u5348", autumn: "\u620A\u7533", winter: "\u7532\u5B50" };
      return Boolean(context.season && values[context.season] === pillarGanzhi(context, "day"));
    },
    evidence: (context) => seasonalEvidence(context, { spring: ["\u620A\u5BC5"], summer: ["\u7532\u5348"], autumn: ["\u620A\u7533"], winter: ["\u7532\u5B50"] }, "\u6625\u620A\u5BC5\u3001\u590F\u7532\u5348\u3001\u79CB\u620A\u7533\u3001\u51AC\u7532\u5B50\uFF1B\u4EE5\u7BC0\u4EE4\u6708\u652F\u5206\u5B63\u3002", ["\u7570\u672C\u5B63\u7BC0\u65E5\u4F8B\u9700\u4EE5 references \u9010\u7248\u672C\u6838\u5C0D\u3002"])
  },
  {
    id: "si_fei",
    name: "\u56DB\u5EE2",
    displayName: "\u56DB\u5EE2",
    aliases: ["\u56DB\u5EE2\u65E5"],
    tradition: CLASSICAL_ZIPING,
    conceptType: "seasonal-special",
    ruleFamily: SEASONAL_DAY,
    baseOn: ["monthBranch", "dayPillar"],
    scope: "natal",
    category: "inauspicious",
    confidence: "classical",
    ruleId: "SE_SIFEI_002",
    version: SPECIAL_RULE_VERSION,
    tier: "core",
    priority: 21,
    tags: ["seasonal", "special-day"],
    schools: ["classical-ziping"],
    references: refs2(
      ["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D", "\u56DB\u5EE2\u65E5\u4F8B", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"],
      ["\u300A\u6DF5\u6D77\u5B50\u5E73\u300B", "\u56DB\u5EE2", "https://zh.wikisource.org/zh-hant/\u6DF5\u6D77\u5B50\u5E73"]
    ),
    description: "\u6625\u5E9A\u7533\u8F9B\u9149\u3001\u590F\u58EC\u5B50\u7678\u4EA5\u3001\u79CB\u7532\u5BC5\u4E59\u536F\u3001\u51AC\u4E19\u5348\u4E01\u5DF3\uFF1B\u5FC5\u9808\u540C\u6642\u7B26\u5408\u5B63\u7BC0\uFF08\u6708\u4EE4\uFF09\u8207\u65E5\u67F1\u3002",
    variants: [{ id: "four-season-day-list", description: "\u6625\u5E9A\u7533\u8F9B\u9149\u3001\u590F\u58EC\u5B50\u7678\u4EA5\u3001\u79CB\u7532\u5BC5\u4E59\u536F\u3001\u51AC\u4E19\u5348\u4E01\u5DF3\u3002" }],
    researchNotes: { conflict: true, migratedFrom: "SS_SIFEI_045", note: "\u820A\u7248\u96D6\u6709 monthBranch \u689D\u4EF6\uFF0C\u4ECD\u6DF7\u5728 ShenSha\uFF1B\u672C\u7248\u5C07 season/month evidence \u7368\u7ACB\u8F38\u51FA\u3002" },
    match: (context) => {
      const values = { spring: ["\u5E9A\u7533", "\u8F9B\u9149"], summer: ["\u58EC\u5B50", "\u7678\u4EA5"], autumn: ["\u7532\u5BC5", "\u4E59\u536F"], winter: ["\u4E19\u5348", "\u4E01\u5DF3"] };
      return Boolean(context.season && values[context.season] && values[context.season].includes(pillarGanzhi(context, "day")));
    },
    evidence: (context) => seasonalEvidence(context, { spring: ["\u5E9A\u7533", "\u8F9B\u9149"], summer: ["\u58EC\u5B50", "\u7678\u4EA5"], autumn: ["\u7532\u5BC5", "\u4E59\u536F"], winter: ["\u4E19\u5348", "\u4E01\u5DF3"] }, "\u6625\u5E9A\u7533\u8F9B\u9149\u3001\u590F\u58EC\u5B50\u7678\u4EA5\u3001\u79CB\u7532\u5BC5\u4E59\u536F\u3001\u51AC\u4E19\u5348\u4E01\u5DF3\u3002", ["\u5B63\u7BC0\u4EE5\u6708\u652F\u5BC5\u536F\u8FB0\u3001\u5DF3\u5348\u672A\u3001\u7533\u9149\u620C\u3001\u4EA5\u5B50\u4E11\u6B78\u985E\u3002"])
  }
];
var SPECIAL_PILLAR_RULES = Object.freeze(PILLAR_RULES.map(withInterpretation2));
var SEASONAL_SPECIAL_RULES = Object.freeze(SEASONAL_RULES.map(withInterpretation2));
var SPECIAL_RULE_REGISTRY = Object.freeze([...SPECIAL_PILLAR_RULES, ...SEASONAL_SPECIAL_RULES]);

// src/special-rules/engine.js
function resultFor2(rule3, context, evidence) {
  return {
    id: rule3.id,
    name: rule3.name,
    displayName: rule3.displayName || rule3.name,
    aliases: rule3.aliases || [],
    tradition: rule3.tradition,
    conceptType: rule3.conceptType,
    ruleFamily: rule3.ruleFamily,
    baseOn: rule3.baseOn,
    scope: rule3.scope,
    category: rule3.category,
    tags: rule3.tags || [],
    tier: rule3.tier,
    priority: rule3.priority,
    confidence: rule3.confidence,
    schools: rule3.schools || [],
    hitOn: rule3.ruleFamily === "hour-pillar-special" ? ["hour"] : ["day"],
    target: rule3.ruleFamily === "hour-pillar-special" ? "hour" : "day",
    ruleId: rule3.ruleId,
    version: rule3.version,
    reference: rule3.references[0] ? rule3.references[0].title : void 0,
    references: rule3.references,
    description: rule3.description || "",
    ...rule3.interpretation ? { interpretation: rule3.interpretation } : {},
    ...rule3.variants ? { variants: rule3.variants } : {},
    ...rule3.researchNotes ? { researchNotes: rule3.researchNotes } : {},
    evidence
  };
}
function calculateFromRegistry(pillars, registry, options = {}) {
  const context = createSpecialRuleContext(pillars, options);
  return registry.flatMap((rule3) => {
    let matched = false;
    try {
      matched = rule3.match(context) === true;
    } catch (error) {
      return [];
    }
    if (!matched) return [];
    return [resultFor2(rule3, context, rule3.evidence(context))];
  });
}
function calculateSpecialPillarRules(pillars, options = {}) {
  return calculateFromRegistry(pillars, SPECIAL_PILLAR_RULES, options);
}
function calculateSeasonalSpecialRules(pillars, options = {}) {
  return calculateFromRegistry(pillars, SEASONAL_SPECIAL_RULES, options);
}
function calculateSpecialRules(pillars, options = {}) {
  return calculateFromRegistry(pillars, SPECIAL_RULE_REGISTRY, options);
}
function validateSpecialRuleRegistry(registry = SPECIAL_RULE_REGISTRY) {
  const errors = [];
  const ids = /* @__PURE__ */ new Set();
  const ruleIds = /* @__PURE__ */ new Set();
  for (const rule3 of registry) {
    if (!rule3.id || ids.has(rule3.id)) errors.push(`duplicate id: ${rule3.id || "(empty)"}`);
    ids.add(rule3.id);
    if (!rule3.ruleId || ruleIds.has(rule3.ruleId)) errors.push(`duplicate ruleId: ${rule3.ruleId || "(empty)"}`);
    ruleIds.add(rule3.ruleId);
    for (const field of ["name", "tradition", "conceptType", "ruleFamily", "scope", "category", "confidence", "version", "description", "interpretation"]) {
      if (!rule3[field]) errors.push(`${rule3.id}: ${field} is required`);
    }
    if (!Array.isArray(rule3.baseOn) || rule3.baseOn.length === 0) errors.push(`${rule3.id}: baseOn is required`);
    if (typeof rule3.match !== "function") errors.push(`${rule3.id}: match must be a function`);
    if (typeof rule3.evidence !== "function") errors.push(`${rule3.id}: evidence must be a function`);
    if (!Array.isArray(rule3.references) || rule3.references.length === 0) errors.push(`${rule3.id}: references is required`);
  }
  return { valid: errors.length === 0, errors, count: registry.length };
}
var validation2 = validateSpecialRuleRegistry();
if (!validation2.valid) throw new Error(`Special rule registry invalid: ${validation2.errors.join("; ")}`);
function getSpecialRule(id) {
  return SPECIAL_RULE_REGISTRY.find((rule3) => rule3.id === id) || null;
}
function getSpecialRuleCatalog() {
  return SPECIAL_RULE_REGISTRY.slice();
}

// src/luck/index.js
var luck_exports = {};
__export(luck_exports, {
  LUCK_START_AGE_METHODS: () => LUCK_START_AGE_METHODS,
  calculateLuckCycles: () => calculateLuckCycles
});

// src/transit/index.js
var transit_exports = {};
__export(transit_exports, {
  TRANSIT_GRAPH_VERSION: () => TRANSIT_GRAPH_VERSION2,
  buildTransitGraph: () => buildTransitGraph,
  calculateTransit: () => calculateTransit,
  parseTransitDatetime: () => parseTransitDatetime
});

// src/calendar/lunar.js
var lunar_exports = {};
__export(lunar_exports, {
  LUNAR_INFO: () => LUNAR_INFO,
  getLeapMonth: () => getLeapMonth,
  getLeapMonthDays: () => getLeapMonthDays,
  getLunarMonthDays: () => getLunarMonthDays,
  getLunarYearDays: () => getLunarYearDays,
  solarToLunar: () => solarToLunar
});
var LUNAR_INFO = [
  19416,
  19168,
  42352,
  21717,
  53856,
  55632,
  91476,
  22176,
  39632,
  21970,
  // 1900-1909
  19168,
  42422,
  42192,
  53840,
  119381,
  46400,
  54944,
  44450,
  38320,
  84343,
  // 1910-1919
  18800,
  42160,
  46261,
  27216,
  27968,
  109396,
  11104,
  38256,
  21234,
  18800,
  // 1920-1929
  25958,
  54432,
  59984,
  28309,
  23248,
  11104,
  100067,
  37600,
  116951,
  51536,
  // 1930-1939
  54432,
  120998,
  46416,
  22176,
  107956,
  9680,
  37584,
  53938,
  43344,
  46423,
  // 1940-1949
  27808,
  46416,
  86869,
  19872,
  42448,
  83315,
  21200,
  43432,
  59728,
  27296,
  // 1950-1959
  44710,
  43856,
  19296,
  43748,
  42352,
  21088,
  62051,
  55632,
  23383,
  22176,
  // 1960-1969
  38608,
  19925,
  19152,
  42192,
  54484,
  53840,
  54616,
  46400,
  46496,
  103846,
  // 1970-1979
  38320,
  18864,
  43380,
  42160,
  45690,
  27216,
  27968,
  44870,
  43872,
  38256,
  // 1980-1989
  19189,
  18800,
  25776,
  29859,
  59984,
  27480,
  21952,
  43872,
  38613,
  37600,
  // 1990-1999
  51552,
  55636,
  54432,
  55888,
  30034,
  22176,
  43959,
  9680,
  37584,
  51893,
  // 2000-2009
  43344,
  46240,
  47780,
  44368,
  21977,
  19360,
  42416,
  86390,
  21168,
  43312,
  // 2010-2019
  31060,
  27296,
  44368,
  23378,
  19296,
  42726,
  42208,
  53856,
  60005,
  54576,
  // 2020-2029
  23200,
  30371,
  38608,
  19195,
  19152,
  42192,
  118966,
  53840,
  54560,
  56645,
  // 2030-2039
  46496,
  22224,
  21938,
  18864,
  42359,
  42160,
  43600,
  111189,
  27936,
  44448,
  // 2040-2049
  84835,
  37744,
  18936,
  18800,
  25776,
  92326,
  59984,
  27296,
  108228,
  43744,
  // 2050-2059
  37600,
  53987,
  51552,
  54615,
  54432,
  55888,
  23893,
  22176,
  42704,
  21972,
  // 2060-2069
  21200,
  43448,
  43344,
  46240,
  46758,
  44368,
  21920,
  43940,
  42416,
  21168,
  // 2070-2079
  45683,
  26928,
  29495,
  27296,
  44368,
  84821,
  19296,
  42352,
  21732,
  53600,
  // 2080-2089
  59752,
  54560,
  55968,
  92838,
  22224,
  19168,
  43476,
  41680,
  53584,
  62034,
  // 2090-2099
  54560
  // 2100
];
var BASE_JD = gregorianToJulianDay(1900, 1, 31);
function getLeapMonth(year) {
  if (year < 1900 || year > 2100) return 0;
  return LUNAR_INFO[year - 1900] & 15;
}
function getLeapMonthDays(year) {
  if (getLeapMonth(year) === 0) return 0;
  return LUNAR_INFO[year - 1900] & 65536 ? 30 : 29;
}
function getLunarMonthDays(year, month) {
  if (year < 1900 || year > 2100) return 0;
  return LUNAR_INFO[year - 1900] & 65536 >> month ? 30 : 29;
}
function getLunarYearDays(year) {
  if (year < 1900 || year > 2100) return 0;
  let sum = 348;
  for (let i = 32768; i > 8; i >>= 1) {
    sum += LUNAR_INFO[year - 1900] & i ? 1 : 0;
  }
  return sum + getLeapMonthDays(year);
}
function solarToLunar(year, month, day) {
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new BaziCalendarError("\u8FB2\u66C6\u63DB\u7B97\u76EE\u524D\u652F\u63F4 1900-01-01 \u81F3 2100-12-31", {
      operation: "solarToLunar",
      allowedRange: ["1900-01-01", "2100-12-31"],
      providedYear: year
    });
  }
  const maxDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(day) || day < 1 || day > maxDay) {
    throw new BaziCalendarError("solarToLunar \u6536\u5230\u7121\u6548\u516C\u66C6\u65E5\u671F", { year, month, day });
  }
  const currentJD = gregorianToJulianDay(year, month, day);
  let offset = Math.round(currentJD - BASE_JD);
  if (offset < 0) {
    const MONTH_NAMES_PRE = ["", "\u6B63", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D", "\u5341", "\u51AC", "\u81D8"];
    const DAY_NAMES_PRE = [
      "",
      "\u521D\u4E00",
      "\u521D\u4E8C",
      "\u521D\u4E09",
      "\u521D\u56DB",
      "\u521D\u4E94",
      "\u521D\u516D",
      "\u521D\u4E03",
      "\u521D\u516B",
      "\u521D\u4E5D",
      "\u521D\u5341",
      "\u5341\u4E00",
      "\u5341\u4E8C",
      "\u5341\u4E09",
      "\u5341\u56DB",
      "\u5341\u4E94",
      "\u5341\u516D",
      "\u5341\u4E03",
      "\u5341\u516B",
      "\u5341\u4E5D",
      "\u4E8C\u5341",
      "\u5EFF\u4E00",
      "\u5EFF\u4E8C",
      "\u5EFF\u4E09",
      "\u5EFF\u56DB",
      "\u5EFF\u4E94",
      "\u5EFF\u516D",
      "\u5EFF\u4E03",
      "\u5EFF\u516B",
      "\u5EFF\u4E5D",
      "\u4E09\u5341"
    ];
    const preDay = offset + 31;
    return {
      year: 1899,
      month: 12,
      day: preDay,
      isLeap: false,
      monthName: MONTH_NAMES_PRE[12] + "\u6708",
      dayName: DAY_NAMES_PRE[preDay] || `${preDay}\u65E5`
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
  const MONTH_NAMES = ["", "\u6B63", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D", "\u5341", "\u51AC", "\u81D8"];
  const DAY_NAMES = [
    "",
    "\u521D\u4E00",
    "\u521D\u4E8C",
    "\u521D\u4E09",
    "\u521D\u56DB",
    "\u521D\u4E94",
    "\u521D\u516D",
    "\u521D\u4E03",
    "\u521D\u516B",
    "\u521D\u4E5D",
    "\u521D\u5341",
    "\u5341\u4E00",
    "\u5341\u4E8C",
    "\u5341\u4E09",
    "\u5341\u56DB",
    "\u5341\u4E94",
    "\u5341\u516D",
    "\u5341\u4E03",
    "\u5341\u516B",
    "\u5341\u4E5D",
    "\u4E8C\u5341",
    "\u5EFF\u4E00",
    "\u5EFF\u4E8C",
    "\u5EFF\u4E09",
    "\u5EFF\u56DB",
    "\u5EFF\u4E94",
    "\u5EFF\u516D",
    "\u5EFF\u4E03",
    "\u5EFF\u516B",
    "\u5EFF\u4E5D",
    "\u4E09\u5341"
  ];
  return {
    year: lYear,
    month: lMonth,
    day: lDay,
    isLeap,
    monthName: (isLeap ? "\u958F" : "") + MONTH_NAMES[lMonth] + "\u6708",
    dayName: DAY_NAMES[lDay] || `${lDay}\u65E5`
  };
}

// src/transit/index.js
var PILLAR_LABELS = Object.freeze({
  year: "\u5E74",
  month: "\u6708",
  day: "\u65E5",
  hour: "\u6642"
});
var TRANSIT_GRAPH_VERSION2 = TRANSIT_GRAPH_VERSION;
function formatPillarLabel(pillar) {
  return PILLAR_LABELS[pillar] || pillar || "\u2014";
}
function daysInMonth2(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}
function parseTransitDatetime(value) {
  if (value instanceof Date && Number.isNaN(value.getTime())) {
    throw new BaziValidationError("Transit datetime \u7684 Date \u7121\u6548", "datetime");
  }
  const dtStr = value instanceof Date ? value.toISOString() : value || (/* @__PURE__ */ new Date()).toISOString();
  if (typeof dtStr !== "string") {
    throw new BaziValidationError("Transit datetime \u5FC5\u9808\u662F ISO \u65E5\u671F\u5B57\u4E32\u6216 Date", "datetime");
  }
  const match = dtStr.match(/^(\d{4})-(\d{2})-(\d{2})(?:T|\s)(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{1,2}(?::?\d{2})?)?$/);
  if (!match) {
    throw new BaziValidationError("Transit datetime \u683C\u5F0F\u4E0D\u6B63\u78BA\uFF0C\u8ACB\u4F7F\u7528 YYYY-MM-DDTHH:mm[:ss](Z \u6216 \xB1HH:mm)", "datetime");
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth2(year, month) || hour > 23 || minute > 59) {
    throw new BaziValidationError("Transit datetime \u5305\u542B\u7121\u6548\u65E5\u671F\u6216\u6642\u9593", "datetime");
  }
  const suffix = match[6];
  const timezoneOffsetHours = suffix === "Z" ? 0 : suffix ? parseTimezoneOffset(suffix) : 8;
  return {
    datePart: `${match[1]}-${match[2]}-${match[3]}`,
    timePart: `${match[4]}:${match[5]}`,
    year,
    month,
    day,
    hour,
    minute,
    timezoneOffsetHours,
    input: dtStr
  };
}
function calculateTransit(chartPillars, options = {}) {
  const parsed = parseTransitDatetime(options.datetime);
  const { datePart, timePart, year: y, month: m, day: d, hour: hh, minute: mm, timezoneOffsetHours } = parsed;
  const yearBoundary = options.yearBoundary || "lichun";
  const monthBoundary = options.monthBoundary || "jie";
  const dayBoundary = options.dayBoundary || "23:00";
  const needsLunarBoundary = yearBoundary === "lunar_new_year" || monthBoundary === "lunar_month";
  const lunarInfo = needsLunarBoundary ? Number.isInteger(options.lunarYear) ? {
    year: options.lunarYear,
    month: Number.isInteger(options.lunarMonth) ? options.lunarMonth : null
  } : solarToLunar(y, m, d) : null;
  const transitPillars = calculateFourPillars({
    year: y,
    month: m,
    day: d,
    hour: hh,
    minute: mm,
    birthTimeMode: "exact",
    timezoneOffsetHours,
    yearBoundary,
    monthBoundary,
    lunarYear: lunarInfo ? lunarInfo.year : null,
    lunarMonth: lunarInfo ? lunarInfo.month : null,
    dayBoundary
  });
  const dayMaster = chartPillars.day.stem;
  const enrichTransitPillar = (p) => ({
    ganzhi: p.ganzhi,
    stem: p.stem,
    branch: p.branch,
    sexagenaryIndex: p.sexagenaryIndex,
    tenGod: getTenGod(dayMaster, p.stem),
    stage: getTwelveStage(dayMaster, p.branch),
    nayin: getNayin(p.sexagenaryIndex)
  });
  const yearTransit = enrichTransitPillar(transitPillars.year);
  const monthTransit = enrichTransitPillar(transitPillars.month);
  const dayTransit = enrichTransitPillar(transitPillars.day);
  const hourTransit = enrichTransitPillar(transitPillars.hour);
  const interactions = [];
  const natalBranches = [
    { pillar: "year", branch: chartPillars.year.branch },
    { pillar: "month", branch: chartPillars.month.branch },
    { pillar: "day", branch: chartPillars.day.branch },
    ...chartPillars.hour.available ? [{ pillar: "hour", branch: chartPillars.hour.branch }] : []
  ];
  const CLASH_MAP = {
    "\u5B50": "\u5348",
    "\u5348": "\u5B50",
    "\u4E11": "\u672A",
    "\u672A": "\u4E11",
    "\u5BC5": "\u7533",
    "\u7533": "\u5BC5",
    "\u536F": "\u9149",
    "\u9149": "\u536F",
    "\u8FB0": "\u620C",
    "\u620C": "\u8FB0",
    "\u5DF3": "\u4EA5",
    "\u4EA5": "\u5DF3"
  };
  const HE_MAP = {
    "\u5B50": "\u4E11",
    "\u4E11": "\u5B50",
    "\u5BC5": "\u4EA5",
    "\u4EA5": "\u5BC5",
    "\u536F": "\u620C",
    "\u620C": "\u536F",
    "\u8FB0": "\u9149",
    "\u9149": "\u8FB0",
    "\u5DF3": "\u7533",
    "\u7533": "\u5DF3",
    "\u5348": "\u672A",
    "\u672A": "\u5348"
  };
  for (const natal of natalBranches) {
    if (CLASH_MAP[yearTransit.branch] === natal.branch) {
      interactions.push({
        type: "transit_clash",
        target: "year",
        natalPillar: natal.pillar,
        natalPillarLabel: `${formatPillarLabel(natal.pillar)}\u67F1`,
        transitBranch: yearTransit.branch,
        natalBranch: natal.branch,
        description: `\u6D41\u5E74\u652F\u3010${yearTransit.branch}\u3011\u6C96\u539F\u5C40${formatPillarLabel(natal.pillar)}\u652F\u3010${natal.branch}\u3011`
      });
    }
    if (HE_MAP[yearTransit.branch] === natal.branch) {
      interactions.push({
        type: "transit_combine",
        target: "year",
        natalPillar: natal.pillar,
        natalPillarLabel: `${formatPillarLabel(natal.pillar)}\u67F1`,
        transitBranch: yearTransit.branch,
        natalBranch: natal.branch,
        description: `\u6D41\u5E74\u652F\u3010${yearTransit.branch}\u3011\u5408\u539F\u5C40${formatPillarLabel(natal.pillar)}\u652F\u3010${natal.branch}\u3011`
      });
    }
  }
  return {
    targetDatetime: `${datePart} ${timePart}`,
    timezoneOffsetHours,
    ruleBasis: { yearBoundary, monthBoundary, dayBoundary },
    year: yearTransit,
    month: monthTransit,
    day: dayTransit,
    hour: hourTransit,
    interactions
  };
}
function buildTransitGraph({ pillars = null, luckCycles = null, transits = null } = {}) {
  const nodes = [];
  const edges = [];
  const events = [];
  const addNode = (id, layer, value, extra = {}) => {
    if (!value) return;
    nodes.push({ id, layer, ...value, ...extra });
  };
  for (const key of ["year", "month", "day", "hour"]) {
    const pillar = pillars?.[key];
    if (pillar?.available === false || !pillar?.ganzhi) continue;
    addNode(`natal-${key}`, "natal", {
      pillar: key,
      ganzhi: pillar.ganzhi,
      stem: pillar.stem,
      branch: pillar.branch
    });
  }
  const targetYear = Number(String(transits?.targetDatetime || "").slice(0, 4));
  const activeLuck = Number.isInteger(targetYear) ? (luckCycles?.cycles || []).find((cycle) => targetYear >= cycle.fromYear && targetYear <= cycle.toYear) || null : null;
  if (activeLuck) {
    edges.push({
      id: `edge-${edges.length + 1}`,
      source: `luck-${activeLuck.step}`,
      target: "transit-year",
      type: "active-luck-cycle",
      status: "observed",
      description: `\u76EE\u6A19\u5E74\u4EFD ${targetYear} \u843D\u5728\u7B2C ${activeLuck.step} \u6B65\u5927\u904B\uFF08${activeLuck.ganzhi}\uFF09`,
      evidence: {
        matched: true,
        targetYear,
        fromYear: activeLuck.fromYear,
        toYear: activeLuck.toYear
      }
    });
  }
  const timelinePairs = [["year", "month"], ["month", "day"], ["day", "hour"]];
  for (const [parent, child] of timelinePairs) {
    if (!transits?.[parent]?.ganzhi || !transits?.[child]?.ganzhi) continue;
    edges.push({
      id: `edge-${edges.length + 1}`,
      source: `transit-${parent}`,
      target: `transit-${child}`,
      type: "transit-time-containment",
      status: "structural",
      description: `${formatPillarLabel(parent)}\u904B\u5305\u542B${formatPillarLabel(child)}\u904B`,
      evidence: { matched: true, targetDatetime: transits.targetDatetime }
    });
  }
  for (const cycle of luckCycles?.cycles || []) {
    addNode(`luck-${cycle.step}`, "luck", {
      step: cycle.step,
      ganzhi: cycle.ganzhi,
      stem: cycle.stem,
      branch: cycle.branch,
      fromYear: cycle.fromYear,
      toYear: cycle.toYear
    });
  }
  for (const key of ["year", "month", "day", "hour"]) {
    const transit = transits?.[key];
    if (!transit?.ganzhi) continue;
    addNode(`transit-${key}`, key === "year" ? "transit-year" : `transit-${key}`, {
      pillar: key,
      ganzhi: transit.ganzhi,
      stem: transit.stem,
      branch: transit.branch
    });
  }
  for (const interaction of transits?.interactions || []) {
    const targetId = interaction.natalPillar ? `natal-${interaction.natalPillar}` : null;
    const sourceId = interaction.target ? `transit-${interaction.target}` : null;
    if (!sourceId || !targetId) continue;
    edges.push({
      id: `edge-${edges.length + 1}`,
      source: sourceId,
      target: targetId,
      type: interaction.type,
      status: "observed",
      description: interaction.description,
      evidence: {
        matched: true,
        source: "transits.interactions",
        transitBranch: interaction.transitBranch,
        natalBranch: interaction.natalBranch
      }
    });
  }
  const STEM_CLASH_MAP = {
    \u7532: "\u5E9A",
    \u4E59: "\u8F9B",
    \u4E19: "\u58EC",
    \u4E01: "\u7678",
    \u5E9A: "\u7532",
    \u8F9B: "\u4E59",
    \u58EC: "\u4E19",
    \u7678: "\u4E01"
  };
  const BRANCH_CLASH_MAP = {
    \u5B50: "\u5348",
    \u5348: "\u5B50",
    \u4E11: "\u672A",
    \u672A: "\u4E11",
    \u5BC5: "\u7533",
    \u7533: "\u5BC5",
    \u536F: "\u9149",
    \u9149: "\u536F",
    \u8FB0: "\u620C",
    \u620C: "\u8FB0",
    \u5DF3: "\u4EA5",
    \u4EA5: "\u5DF3"
  };
  const inspectStructuralEvents = (sourceId, targetId, source, target, scope) => {
    if (!source || !target) return;
    if (source.ganzhi === target.ganzhi) {
      events.push({
        id: `event-${events.length + 1}`,
        type: scope === "luck-transit-year" ? "\u6B72\u904B\u4E26\u81E8" : "\u4F0F\u541F",
        status: "observed",
        source: sourceId,
        target: targetId,
        evidence: {
          matched: true,
          sourceGanzhi: source.ganzhi,
          targetGanzhi: target.ganzhi,
          scope
        }
      });
    }
    if (STEM_CLASH_MAP[source.stem] === target.stem && BRANCH_CLASH_MAP[source.branch] === target.branch) {
      events.push({
        id: `event-${events.length + 1}`,
        type: "\u5929\u524B\u5730\u6C96",
        status: "observed",
        source: sourceId,
        target: targetId,
        evidence: {
          matched: true,
          sourceStem: source.stem,
          targetStem: target.stem,
          sourceBranch: source.branch,
          targetBranch: target.branch,
          scope
        }
      });
    }
  };
  for (const key of ["year", "month", "day", "hour"]) {
    inspectStructuralEvents(`transit-${key}`, `natal-${key}`, transits?.[key], pillars?.[key], `transit-natal-${key}`);
  }
  if (activeLuck) inspectStructuralEvents(`luck-${activeLuck.step}`, "transit-year", activeLuck, transits?.year, "luck-transit-year");
  return {
    modelId: "transit-multi-layer-graph",
    version: TRANSIT_GRAPH_VERSION2,
    layers: ["natal", "luck", "transit-year", "transit-month", "transit-day", "transit-hour"],
    activeLuck: activeLuck ? { step: activeLuck.step, ganzhi: activeLuck.ganzhi, fromYear: activeLuck.fromYear, toYear: activeLuck.toYear } : null,
    nodes,
    edges,
    events,
    evidence: {
      matched: true,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      eventCount: events.length,
      note: "\u5716\u53EA\u6536\u9304\u5DF2\u8A08\u7B97\u7684\u67F1\u4F4D\u3001\u6642\u9593\u5C64\u9023\u7DDA\u8207\u7D50\u69CB\u4E8B\u4EF6\uFF1B\u672A\u5C07\u4E8B\u4EF6\u81EA\u52D5\u89E3\u8B80\u70BA\u5409\u51F6\u3002"
    }
  };
}

// src/luck/index.js
var LUCK_START_AGE_METHODS = Object.freeze({
  "jieqi-diff-divide-3": Object.freeze({
    label: "\u7BC0\u6C23\u5DEE\u9664\u4E09\uFF08\u7CBE\u78BA\u65E5\u5206\uFF09",
    calculation: "raw-difference",
    ruleId: "LUCK_START_DIFF_DIV_3",
    references: ["https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703_(\u56DB\u5EAB\u5168\u66F8\u672C)/\u537702"],
    caveat: "\u4EE5\u51FA\u751F\u6642\u523B\u8207\u524D\uFF0F\u5F8C\u4E00\u500B\u7BC0\u7684\u7CBE\u78BA\u6642\u5DEE\u63DB\u7B97\uFF1B\u4E0D\u540C\u5BB6\u6D3E\u4ECD\u53EF\u80FD\u53D6\u6574\u6216\u53D6\u6C23\u3002"
  }),
  "jieqi-whole-days-divide-3": Object.freeze({
    label: "\u7BC0\u6C23\u5DEE\u9664\u4E09\uFF08\u6574\u65E5\u6BD4\u8F03\uFF09",
    calculation: "whole-days",
    ruleId: "LUCK_START_DIFF_WHOLE_DAY_DIV_3",
    references: ["https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703_(\u56DB\u5EAB\u5168\u66F8\u672C)/\u537702"],
    caveat: "\u5148\u53D6\u76F8\u5DEE\u6574\u65E5\u518D\u9664\u4E09\uFF0C\u53EA\u4F5C\u6D41\u6D3E\uFF0F\u6392\u76E4\u7DB2\u7AD9\u5DEE\u7570\u6BD4\u5C0D\uFF0C\u4E0D\u662F canonical \u9810\u8A2D\u3002"
  })
});
function roundDays(value) {
  return Number(Number(value).toFixed(3));
}
function calculateStartAgeDetails({ method, rawDiffDays, currentJD, timezoneOffsetHours, targetJie, timingAssumption, timingDate, timingTime, bHour, bMinute }) {
  const descriptor = LUCK_START_AGE_METHODS[method];
  if (!descriptor) {
    throw new Error(`\u4E0D\u652F\u63F4\u7684\u8D77\u904B\u6B72\u6578\u65B9\u6CD5\uFF1A${method}`);
  }
  const calculationDiffDays = descriptor.calculation === "whole-days" ? Math.floor(rawDiffDays) : rawDiffDays;
  const totalMonths = calculationDiffDays * 4;
  const startYears = Math.floor(totalMonths / 12);
  const remMonths = totalMonths - startYears * 12;
  const startMonths = Math.floor(remMonths);
  const remDays = (remMonths - startMonths) * 30;
  const startDays = Math.round(remDays);
  const startJdOffset = calculationDiffDays * (365.2422 / 3);
  const startLocal = jdToLocalParts(currentJD + startJdOffset, timezoneOffsetHours);
  const pad = (n) => String(n).padStart(2, "0");
  const startDateStr = `${startLocal.year}-${pad(startLocal.month)}-${pad(startLocal.day)}`;
  const startDateTimeStr = formatLocalDateTime(startLocal);
  return {
    years: startYears,
    months: startMonths,
    days: startDays,
    display: `${startYears} \u6B72 ${startMonths} \u500B\u6708 ${startDays} \u5929`,
    startDate: startDateStr,
    startDateTime: startDateTimeStr,
    targetJie: targetJie.name,
    method,
    methodLabel: descriptor.label,
    references: descriptor.references,
    caveat: descriptor.caveat,
    rawDiffDays: roundDays(rawDiffDays),
    calculationDiffDays: roundDays(calculationDiffDays),
    rounding: descriptor.calculation,
    timingAssumption,
    timingDate,
    timingTime: `${String(bHour).padStart(2, "0")}:${String(bMinute).padStart(2, "0")}`
  };
}
function summarizeStartAgeVariant({ method, rawDiffDays, currentJD, timezoneOffsetHours, targetJie, timingAssumption, timingDate, timingTime, bHour, bMinute }) {
  const details = calculateStartAgeDetails({ method, rawDiffDays, currentJD, timezoneOffsetHours, targetJie, timingAssumption, timingDate, timingTime, bHour, bMinute });
  return {
    method: details.method,
    methodLabel: details.methodLabel,
    rawDiffDays: details.rawDiffDays,
    calculationDiffDays: details.calculationDiffDays,
    rounding: details.rounding,
    years: details.years,
    months: details.months,
    days: details.days,
    display: details.display,
    startDate: details.startDate,
    startDateTime: details.startDateTime,
    targetJie: details.targetJie,
    references: details.references,
    caveat: details.caveat
  };
}
function formatLocalDateTime(parts) {
  if (!parts) return null;
  const pad = (value) => String(value).padStart(2, "0");
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)} ${pad(parts.hour)}:${pad(parts.minute)}`;
}
function formatTimezoneOffset(offsetHours) {
  const sign = offsetHours < 0 ? "-" : "+";
  const absolute = Math.abs(offsetHours);
  const hours = Math.floor(absolute);
  const minutes = Math.round((absolute - hours) * 60);
  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
function annualRange(startLocal, step) {
  const fromYear = startLocal.year + (step - 1) * 10;
  return { fromYear, toYear: fromYear + 9 };
}
function buildAnnualDetails({ pillars, cycle, birthYear, startLocal, timezoneOffsetHours, shenshaPreset, gender, includeAnnualShenSha, yearBoundary, monthBoundary, dayBoundary }) {
  const { fromYear, toYear } = annualRange(startLocal, cycle.step);
  const annuals = [];
  for (let year = fromYear; year <= toYear; year++) {
    const transit = calculateTransit(pillars, {
      datetime: `${year}-06-01T12:00:00${formatTimezoneOffset(timezoneOffsetHours)}`,
      yearBoundary,
      monthBoundary,
      dayBoundary,
      // 年中必已過正月初一；直接把該年度的農曆年傳給 Transit，
      // 讓大運逐年展開不因 2100 年以後的農曆查表範圍而失敗。
      lunarYear: year
    });
    const yearPillar = transit.year;
    const transitShenSha = includeAnnualShenSha ? calculateTransitShenSha(pillars, transit, { preset: shenshaPreset, gender }).shenSha : [];
    const xunKong = calculateXunKong(yearPillar.ganzhi);
    annuals.push({
      age: year - birthYear + 1,
      year,
      ganzhi: yearPillar.ganzhi,
      stem: yearPillar.stem,
      branch: yearPillar.branch,
      tenGod: yearPillar.tenGod,
      stage: yearPillar.stage,
      nayin: yearPillar.nayin,
      xunKong,
      shenSha: transitShenSha,
      interactions: transit.interactions,
      basis: {
        luck: cycle.ganzhi,
        method: "annual-transit-at-mid-year",
        note: "SDK \u63D0\u4F9B\u53EF\u8FFD\u6EAF\u7684\u6D41\u5E74\u7D50\u69CB\u8207\u4E92\u52D5\uFF1B\u672A\u5C07\u672A\u8003\u64DA\u7684\u5409\u51F6\u5206\u6578\u6216\u5C0F\u904B\u6587\u6848\u786C\u7DE8\u5165\u7D50\u679C\u3002"
      }
    });
  }
  return annuals;
}
function calculateLuckCycles({
  pillars,
  gender,
  // 'male' | 'female'
  birthDate,
  // 'YYYY-MM-DD'
  birthTime = "12:00",
  birthTimeMode = birthTime ? "exact" : "unknown",
  birthHourBranch = null,
  timingDate = birthDate,
  timingTime = null,
  timezoneOffsetHours = 8,
  cycleCount = 10,
  directionRule = "gender-year-yinyang",
  startAgeMethod = "jieqi-diff-divide-3",
  includeAnnualDetails = false,
  shenshaPreset = "classical",
  includeAnnualShenSha = true,
  yearBoundary = "lichun",
  monthBoundary = "jie",
  dayBoundary = "23:00"
}) {
  const [bYear, bMonth, bDay] = birthDate.split("-").map(Number);
  const [tYear, tMonth, tDay] = timingDate.split("-").map(Number);
  let bHour = 12;
  let bMinute = 0;
  let timingAssumption = "unknown-time-civil-noon";
  if (birthTimeMode === "exact" && (timingTime || birthTime)) {
    [bHour, bMinute] = (timingTime || birthTime).split(":").map(Number);
    timingAssumption = timingTime && timingDate !== birthDate ? "effective-solar-time" : "civil-exact-time";
  } else if (birthTimeMode === "branch" && birthHourBranch) {
    bHour = (branchStartHour(branchIndex(birthHourBranch)) + 1) % 24;
    bMinute = 0;
    timingAssumption = "branch-midpoint";
  }
  const currentJD = gregorianToJulianDay(tYear, tMonth, tDay + (bHour + bMinute / 60) / 24) - timezoneOffsetHours / 24;
  const yearStemYinYang = pillars.year.stemData.yinYang;
  let forward = true;
  if (directionRule === "gender-year-yinyang") {
    if (gender === "male") {
      forward = yearStemYinYang === "yang";
    } else {
      forward = yearStemYinYang === "yin";
    }
  }
  const surrounding = getSurroundingJie(currentJD, timezoneOffsetHours);
  const prevJie = surrounding.prevJie;
  const nextJie = surrounding.nextJie;
  let targetJie = forward ? nextJie : prevJie;
  const rawDiffDays = Math.max(0, forward ? nextJie.jdUT - currentJD : currentJD - prevJie.jdUT);
  const startAge = calculateStartAgeDetails({
    method: startAgeMethod,
    rawDiffDays,
    currentJD,
    timezoneOffsetHours,
    targetJie,
    timingAssumption,
    timingDate,
    timingTime,
    bHour,
    bMinute
  });
  const methodVariants = Object.keys(LUCK_START_AGE_METHODS).map((method) => summarizeStartAgeVariant({
    method,
    rawDiffDays,
    currentJD,
    timezoneOffsetHours,
    targetJie,
    timingAssumption,
    timingDate,
    timingTime,
    bHour,
    bMinute
  }));
  const startLocal = jdToLocalParts(currentJD + (startAge.rounding === "whole-days" ? Math.floor(rawDiffDays) : rawDiffDays) * (365.2422 / 3), timezoneOffsetHours);
  const pad = (n) => String(n).padStart(2, "0");
  const monthStemIdx = stemIndex(pillars.month.stem);
  const monthBranchIdx = branchIndex(pillars.month.branch);
  const cycles = [];
  const dayMaster = pillars.day.stem;
  for (let step = 1; step <= cycleCount; step++) {
    const sOffset = forward ? step : -step;
    const sStemIdx = ((monthStemIdx + sOffset) % 10 + 10) % 10;
    const sBranchIdx = ((monthBranchIdx + sOffset) % 12 + 12) % 12;
    const stemChar = stemAt(sStemIdx).char;
    const branchChar = branchAt(sBranchIdx).char;
    const ganzhi = `${stemChar}${branchChar}`;
    const ganzhiIdx = sexagenaryIndex(sStemIdx, sBranchIdx);
    const fromAge = startAge.years + (step - 1) * 10;
    const toAge = fromAge + 9;
    const range = annualRange(startLocal, step);
    const fromYear = range.fromYear;
    const toYear = range.toYear;
    const cycle = {
      step,
      ganzhi,
      stem: stemChar,
      branch: branchChar,
      sexagenaryIndex: ganzhiIdx,
      fromAge,
      toAge,
      fromYear,
      toYear,
      tenGodStem: getTenGod(dayMaster, stemChar),
      stage: getTwelveStage(dayMaster, branchChar),
      nayin: getNayin(ganzhiIdx)
    };
    cycle.nominalFromAge = fromYear - bYear + 1;
    cycle.nominalToAge = toYear - bYear + 1;
    cycle.startDate = `${fromYear}-${pad(startLocal.month)}-${pad(startLocal.day)}`;
    cycle.endDate = `${toYear + 1}-${pad(startLocal.month)}-${pad(startLocal.day)}`;
    if (includeAnnualDetails) {
      cycle.annuals = buildAnnualDetails({
        pillars,
        cycle,
        birthYear: bYear,
        startLocal,
        timezoneOffsetHours,
        shenshaPreset,
        gender,
        includeAnnualShenSha,
        yearBoundary,
        monthBoundary,
        dayBoundary
      });
    }
    cycles.push(cycle);
  }
  return {
    direction: forward ? "forward" : "backward",
    directionText: forward ? "\u9806\u884C" : "\u9006\u884C",
    forward,
    directionRule,
    startAgeMethod,
    diffDays: roundDays(rawDiffDays),
    targetJie: {
      name: targetJie.name,
      jdUT: targetJie.jdUT,
      local: targetJie.local
    },
    startAge,
    variants: methodVariants,
    cycles
  };
}

// src/calendar/true-solar-time.js
var true_solar_time_exports = {};
__export(true_solar_time_exports, {
  calculateTrueSolarTime: () => calculateTrueSolarTime,
  dayOfYear: () => dayOfYear,
  equationOfTime: () => equationOfTime
});
function dayOfYear(year, month, day) {
  const jdCurr = gregorianToJulianDay(year, month, day);
  const jdStart = gregorianToJulianDay(year, 1, 1);
  return Math.floor(jdCurr - jdStart) + 1;
}
function equationOfTime(year, month, day, hour = 12) {
  const N = dayOfYear(year, month, day);
  const gamma = 2 * Math.PI / 365 * (N - 1 + (hour - 12) / 24);
  const eot = 229.18 * (75e-6 + 1868e-6 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  return eot;
}
function calculateTrueSolarTime({
  year,
  month,
  day,
  hour,
  minute,
  longitude,
  timezoneOffsetHours = 8
}) {
  const standardMeridian = timezoneOffsetHours * 15;
  const longitudeCorrection = (longitude - standardMeridian) * 4;
  const eotCorrection = equationOfTime(year, month, day, hour + minute / 60);
  const totalCorrectionMinutes = longitudeCorrection + eotCorrection;
  const civilTotalMinutes = hour * 60 + minute;
  const trueSolarTotalMinutes = civilTotalMinutes + totalCorrectionMinutes;
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
  const jdBase = gregorianToJulianDay(year, month, day);
  const jdAdjusted = jdBase + adjustedDayOffset;
  const adjGreg = julianDayToGregorian(jdAdjusted);
  const pad = (n) => String(n).padStart(2, "0");
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

// src/calendar/constellation.js
var constellation_exports = {};
__export(constellation_exports, {
  CONSTELLATIONS: () => CONSTELLATIONS,
  getWesternConstellation: () => getWesternConstellation
});
var CONSTELLATIONS = [
  { id: "capricorn", name: "\u6469\u7FAF\u5EA7", english: "Capricorn", start: [12, 22], end: [1, 19] },
  { id: "aquarius", name: "\u6C34\u74F6\u5EA7", english: "Aquarius", start: [1, 20], end: [2, 18] },
  { id: "pisces", name: "\u96D9\u9B5A\u5EA7", english: "Pisces", start: [2, 19], end: [3, 20] },
  { id: "aries", name: "\u7261\u7F8A\u5EA7", english: "Aries", start: [3, 21], end: [4, 19] },
  { id: "taurus", name: "\u91D1\u725B\u5EA7", english: "Taurus", start: [4, 20], end: [5, 20] },
  { id: "gemini", name: "\u96D9\u5B50\u5EA7", english: "Gemini", start: [5, 21], end: [6, 21] },
  { id: "cancer", name: "\u5DE8\u87F9\u5EA7", english: "Cancer", start: [6, 22], end: [7, 22] },
  { id: "leo", name: "\u7345\u5B50\u5EA7", english: "Leo", start: [7, 23], end: [8, 22] },
  { id: "virgo", name: "\u8655\u5973\u5EA7", english: "Virgo", start: [8, 23], end: [9, 22] },
  { id: "libra", name: "\u5929\u79E4\u5EA7", english: "Libra", start: [9, 23], end: [10, 23] },
  { id: "scorpio", name: "\u5929\u880D\u5EA7", english: "Scorpio", start: [10, 24], end: [11, 22] },
  { id: "sagittarius", name: "\u5C04\u624B\u5EA7", english: "Sagittarius", start: [11, 23], end: [12, 21] }
];
function dayOfYear2(month, day) {
  const monthDays = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  return monthDays[month - 1] + day;
}
function getWesternConstellation(month, day) {
  const value = dayOfYear2(month, day);
  const capricornStart = dayOfYear2(12, 22);
  const capricornEnd = dayOfYear2(1, 19);
  const definition = value >= capricornStart || value <= capricornEnd ? CONSTELLATIONS[0] : CONSTELLATIONS.slice(1).find((item) => {
    const start = dayOfYear2(item.start[0], item.start[1]);
    const end = dayOfYear2(item.end[0], item.end[1]);
    return value >= start && value <= end;
  });
  return definition ? { ...definition } : null;
}

// src/calendar/zodiac.js
var zodiac_exports = {};
__export(zodiac_exports, {
  ZODIAC_ANIMALS: () => ZODIAC_ANIMALS,
  getZodiacAnimal: () => getZodiacAnimal
});
var ZODIAC_ANIMALS = Object.freeze({
  \u5B50: { id: "rat", name: "\u9F20" },
  \u4E11: { id: "ox", name: "\u725B" },
  \u5BC5: { id: "tiger", name: "\u864E" },
  \u536F: { id: "rabbit", name: "\u5154" },
  \u8FB0: { id: "dragon", name: "\u9F8D" },
  \u5DF3: { id: "snake", name: "\u86C7" },
  \u5348: { id: "horse", name: "\u99AC" },
  \u672A: { id: "goat", name: "\u7F8A" },
  \u7533: { id: "monkey", name: "\u7334" },
  \u9149: { id: "rooster", name: "\u96DE" },
  \u620C: { id: "dog", name: "\u72D7" },
  \u4EA5: { id: "pig", name: "\u8C6C" }
});
function getZodiacAnimal(branch) {
  const animal = ZODIAC_ANIMALS[branch];
  return animal ? { ...animal, branch } : null;
}

// src/rules/rule-registry.js
var rule_registry_exports = {};
__export(rule_registry_exports, {
  PROFILE_CATALOG: () => PROFILE_CATALOG,
  RuleRegistry: () => RuleRegistry
});

// src/rules/profiles/canonical.js
var CANONICAL_PROFILE = {
  id: "canonical",
  name: "\u5B98\u65B9\u6B63\u7D71\uFF08\u5B50\u5E73\u8853\u898F\u7BC4\uFF09",
  description: "\u7ACB\u6625\u5207\u5E74\u3001\u5341\u4E8C\u7BC0\u5207\u6708\u300123:00 \u5B50\u521D\u63DB\u65E5\u3001\u9670\u967D\u5E74\u8207\u6027\u5225\u9806\u9006\u5927\u904B\u3001\u7BC0\u6C23\u5DEE\u9664\u4EE5\u4E09\u8D77\u904B",
  version: "1.0.0",
  rules: {
    // 年柱切界：'lichun' (立春) | 'lunar_new_year' (正月初一)
    yearBoundary: {
      value: "lichun",
      ruleId: "YEAR_BOUNDARY_LICHUN",
      version: "1.0.0"
    },
    // 月柱切界：'jie' (十二節切月) | 'lunar_month' (農曆初一換月)
    monthBoundary: {
      value: "jie",
      ruleId: "MONTH_BOUNDARY_JIE",
      version: "1.0.0"
    },
    // 日柱換日界線：'23:00' (子初換日) | '00:00' (民用午夜換日)
    dayBoundary: {
      value: "23:00",
      ruleId: "DAY_BOUNDARY_ZISHI_2300",
      version: "1.0.0"
    },
    // 真太陽時：預設關閉
    trueSolarTime: {
      value: false,
      ruleId: "TRUE_SOLAR_TIME_DISABLED",
      version: "1.0.0"
    },
    // 大運配置
    luckCycle: {
      directionRule: {
        value: "gender-year-yinyang",
        ruleId: "LUCK_DIR_GENDER_YINYANG",
        version: "1.0.0"
      },
      startAgeMethod: {
        value: "jieqi-diff-divide-3",
        ruleId: "LUCK_START_DIFF_DIV_3",
        version: "1.0.0"
      }
    },
    // 強弱引擎配置
    strength: {
      deLingWeight: 40,
      deDiWeight: 30,
      deShiWeight: 30,
      categoryMethod: "canonical-use-derived",
      ruleId: "STR_CANONICAL_DEFAULT",
      version: "1.0.0"
    },
    // 分析模型選擇：研究模型可以被 Profile 指定，但未完成時不覆寫 canonical 結果。
    analysis: {
      monthCommander: { value: "bazi-js-human-element", ruleId: "STR_MONTH_COMMANDER_001", version: "1.0.0" },
      auxiliary: { value: "canonical-palm", ruleId: "AUX_CANONICAL_PALM_001", version: "1.0.0" },
      useGod: { value: "fuyi-canonical", ruleId: "STR_CANONICAL_DEFAULT", version: "1.0.0" },
      seasonal: { value: "none", ruleId: "ANALYSIS_SEASONAL_NONE_001", version: "1.0.0" },
      mediator: { value: "none", ruleId: "ANALYSIS_MEDIATOR_NONE_001", version: "1.0.0" },
      patterns: { value: "research-registry", ruleId: "PATTERN_RESEARCH_ONLY_001", version: "0.1.0" }
    }
  }
};

// src/analysis/index.js
var analysis_exports = {};
__export(analysis_exports, {
  ANALYSIS_DIMENSIONS: () => ANALYSIS_DIMENSIONS,
  ANALYSIS_MODEL_CATALOG: () => ANALYSIS_MODEL_CATALOG,
  ANALYSIS_MODEL_IDS: () => ANALYSIS_MODEL_IDS,
  ANALYSIS_RULE_IDS: () => ANALYSIS_RULE_IDS,
  ANALYSIS_RULE_VERSION: () => ANALYSIS_RULE_VERSION2,
  ANALYSIS_SELECTION_RULE_ID: () => ANALYSIS_SELECTION_RULE_ID,
  buildAnalysisResult: () => buildAnalysisResult,
  buildUseGodResolver: () => buildUseGodResolver,
  getAnalysisModel: () => getAnalysisModel,
  getAnalysisRuleId: () => getAnalysisRuleId,
  validateAnalysisProfileRules: () => validateAnalysisProfileRules
});

// src/analysis/use-god-resolver.js
var RESOLVER_VERSION = "0.1.0";
var CLASSICAL_ZIPING2 = "classical-ziping";
var RESEARCH_MODELS = Object.freeze([
  {
    modelId: "geju-research",
    name: "\u683C\u5C40\u53D6\u7528\u7814\u7A76\u6A21\u578B",
    ruleId: "ANALYSIS_GEJU_RESEARCH_001",
    description: "\u4F9D\u6708\u4EE4\u3001\u900F\u5E72\u3001\u6210\u683C\u8207\u7834\u683C\u689D\u4EF6\u63D0\u51FA\u5019\u9078\uFF1B\u76EE\u524D\u5C1A\u672A\u5B8C\u6210\u5168\u5C40 predicate\u3002"
  },
  {
    modelId: "tiaohou-research",
    name: "\u8ABF\u5019\u53D6\u7528\u7814\u7A76\u6A21\u578B",
    ruleId: "ANALYSIS_TIAOHOU_RESEARCH_001",
    description: "\u4F9D\u5BD2\u6696\u71E5\u6FD5\u8207\u5B63\u7BC0\u914D\u7F6E\u63D0\u51FA\u5019\u9078\uFF1B\u76EE\u524D\u4E0D\u4E0B\u552F\u4E00\u53D6\u7528\u6C7A\u5B9A\u3002"
  },
  {
    modelId: "tongguan-research",
    name: "\u901A\u95DC\u53D6\u7528\u7814\u7A76\u6A21\u578B",
    ruleId: "ANALYSIS_TONGGUAN_RESEARCH_001",
    description: "\u4F9D\u5C0D\u7ACB\u4E94\u884C\u3001\u4ECB\u5165\u4E94\u884C\u8207\u5408\u6C96\u5211\u5BB3\u63D0\u51FA\u5019\u9078\uFF1B\u76EE\u524D\u4E0D\u4E0B\u552F\u4E00\u53D6\u7528\u6C7A\u5B9A\u3002"
  },
  {
    modelId: "conformity-research",
    name: "\u5F9E\u683C\uFF0F\u5C08\u65FA\u7814\u7A76\u6A21\u578B",
    ruleId: "ANALYSIS_CONFORMITY_RESEARCH_001",
    description: "\u7279\u6B8A\u5F37\u5F31\u8207\u5F9E\u5316\u689D\u4EF6\u5C1A\u9808\u7368\u7ACB\u9A57\u8B49\uFF0C\u4E0D\u7531\u5F37\u5F31\u95BE\u503C\u76F4\u63A5\u5BA3\u544A\u3002"
  }
]);
function researchCandidate(model, result = null) {
  return {
    modelId: model.modelId,
    name: model.name,
    ruleId: model.ruleId,
    version: RESOLVER_VERSION,
    tradition: CLASSICAL_ZIPING2,
    status: "research-only",
    confidence: "research",
    finalDecision: false,
    result,
    evidence: {
      matched: false,
      status: "research-only",
      reason: model.description
    }
  };
}
function buildUseGodResolver({ profile = null, strength = null, patterns = null } = {}) {
  const selectedModelId = profile?.rules?.analysis?.useGod?.value || "fuyi-canonical";
  const canonical = {
    modelId: "fuyi-canonical",
    name: "canonical \u6276\u6291\u6A21\u578B",
    ruleId: "STR_CANONICAL_DEFAULT",
    version: "1.0.0",
    tradition: CLASSICAL_ZIPING2,
    status: "implemented",
    confidence: "model-derived",
    finalDecision: Boolean(strength),
    result: strength ? {
      score: strength.score,
      level: strength.level,
      favorableElements: strength.favorableElements,
      unfavorableElements: strength.unfavorableElements
    } : null,
    evidence: {
      matched: Boolean(strength),
      status: "implemented",
      source: "strength.decision",
      reason: "\u7531 BaziJS canonical \u6276\u6291\u6A21\u578B\u63D0\u4F9B\u76EE\u524D\u552F\u4E00\u5DF2\u5BE6\u4F5C\u7684\u7528\u795E\u65B9\u5411\u3002"
    }
  };
  const candidates = [canonical, ...RESEARCH_MODELS.map((model) => researchCandidate(model, model.modelId === "geju-research" && patterns ? {
    candidateCount: patterns.regular?.evidence?.candidateCount || 0,
    candidates: (patterns.regular?.candidates || []).filter((candidate) => candidate.matched).map((candidate) => candidate.id)
  } : null))];
  const selected = candidates.find((candidate) => candidate.modelId === selectedModelId) || null;
  const hasResearchSelection = selected?.status === "research-only";
  const conflicts = hasResearchSelection ? [{
    type: "unresolved-model-selection",
    models: [selectedModelId],
    status: "undetermined",
    reason: "\u6240\u9078 Profile \u7684\u6A21\u578B\u5C1A\u672A\u5B8C\u6210\u53EF\u5BE9\u6838\u7684\u5168\u5C40\u5224\u5B9A\uFF0C\u56E0\u6B64\u4E0D\u8986\u5BEB canonical \u7D50\u679C\u3002"
  }] : [];
  return {
    modelId: "multi-model-use-god-resolver",
    version: RESOLVER_VERSION,
    tradition: CLASSICAL_ZIPING2,
    profileId: profile?.id || "canonical",
    selectedModelId,
    status: hasResearchSelection ? "research-only" : "implemented",
    candidates,
    conflicts,
    finalDecision: selected?.status === "implemented" && selected.finalDecision ? { modelId: selected.modelId, result: selected.result } : null,
    evidence: {
      matched: Boolean(selected),
      candidateCount: candidates.length,
      unresolvedModels: candidates.filter((candidate) => candidate.status === "research-only").map((candidate) => candidate.modelId),
      rule: "\u53EA\u63A1\u7528\u660E\u78BA\u9078\u53D6\u4E14\u5DF2\u5BE6\u4F5C\u7684\u6A21\u578B\uFF1B\u7814\u7A76\u6A21\u578B\u4FDD\u7559 candidate\uFF0Fconflict\uFF0C\u4E0D\u81EA\u52D5\u5408\u4F75\u3002"
    }
  };
}

// src/analysis/index.js
var ANALYSIS_RULE_VERSION2 = "1.0.0";
var ANALYSIS_SELECTION_RULE_ID = "PROFILE_ANALYSIS_SELECTION_001";
var REFERENCES3 = Object.freeze({
  fuyi: [
    {
      type: "classical",
      sourceId: "di-tian-sui-yan-wei",
      title: "\u300A\u6EF4\u5929\u9AD3\u95E1\u5FAE\u300B",
      locator: "\u7528\u795E\u3001\u559C\u795E\u3001\u5FCC\u795E\u3001\u4EC7\u795E\u3001\u9592\u795E\u76F8\u95DC\u6CE8\u89E3",
      url: "https://zh.wikisource.org/zh-hant/\u6EF4\u5929\u9AD3\u95E1\u5FAE"
    }
  ],
  seasonal: [
    {
      type: "classical",
      sourceId: "san-ming-tong-hui",
      title: "\u300A\u4E09\u547D\u901A\u6703\u300B",
      locator: "\u5377\u4E8C\u3008\u8AD6\u56DB\u6642\u7BC0\u6C23\u3009\u3001\u3008\u8AD6\u4E94\u884C\u65FA\u76F8\u4F11\u56DA\u6B7B\u3009",
      url: "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u4E8C"
    }
  ],
  mediator: [
    {
      type: "classical",
      sourceId: "di-tian-sui-yan-wei",
      title: "\u300A\u6EF4\u5929\u9AD3\u95E1\u5FAE\u300B",
      locator: "\u4E94\u884C\u751F\u524B\u3001\u901A\u95DC\u8207\u4E2D\u548C\u76F8\u95DC\u6CE8\u89E3",
      url: "https://zh.wikisource.org/zh-hant/\u6EF4\u5929\u9AD3\u95E1\u5FAE"
    }
  ],
  patterns: [
    {
      type: "classical",
      sourceId: "san-ming-tong-hui",
      title: "\u300A\u4E09\u547D\u901A\u6703\u300B",
      locator: "\u5377\u516D\u7279\u6B8A\u683C\u5404\u689D",
      url: "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"
    }
  ]
});
var MODEL_DEFINITIONS = Object.freeze({
  "bazi-js-human-element": {
    id: "bazi-js-human-element",
    name: "BaziJS \u4EBA\u5143\u53F8\u4EE4\u5206\u65E5\u6A21\u578B",
    status: "implemented",
    confidence: "school-specific",
    conceptType: "seasonal-derived",
    ruleFamily: "month-commander",
    baseOn: ["monthPillar.branch", "solarTerms.prevJie", "hiddenStems.month"],
    scope: "seasonal-month",
    ruleId: "STR_MONTH_COMMANDER_001",
    version: "1.0.0",
    references: REFERENCES3.seasonal,
    description: "\u63A1 BaziJS canonical \u7684\u53EF\u91CD\u73FE\u4EBA\u5143\u53F8\u4EE4\u5206\u65E5\u8868\u3002"
  },
  "san-ming-volume-2": {
    id: "san-ming-volume-2",
    name: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E8C\u4EBA\u5143\u53F8\u4E8B\u5206\u65E5\u6A21\u578B",
    status: "comparison",
    confidence: "classical-variant",
    conceptType: "seasonal-derived",
    ruleFamily: "month-commander",
    baseOn: ["monthPillar.branch", "solarTerms.prevJie", "hiddenStems.month"],
    scope: "seasonal-month",
    ruleId: "STR_MONTH_COMMANDER_SANMING_002",
    version: "1.0.0",
    references: REFERENCES3.seasonal,
    description: "\u4EE5\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E8C\u6240\u898B\u5206\u65E5\u8868\u4F5C\u70BA\u6BD4\u8F03\u6A21\u578B\uFF1B\u8207 canonical \u8B8A\u9AD4\u4E26\u5B58\u3002"
  },
  "canonical-palm": {
    id: "canonical-palm",
    name: "BaziJS canonical \u547D\u5BAE\u8EAB\u5BAE\u638C\u8A23",
    status: "implemented",
    confidence: "classical-scope",
    conceptType: "palace-calculation",
    ruleFamily: "month-hour-palm",
    baseOn: ["monthPillar.branch", "hourPillar.branch", "yearPillar.stem"],
    scope: "month-hour",
    ruleId: "AUX_CANONICAL_PALM_001",
    version: "1.0.0",
    references: [{ type: "classical", sourceId: "san-ming-tong-hui", title: "\u300A\u4E09\u547D\u901A\u6703\u300B", locator: "\u5377\u4E8C\u3008\u8AD6\u5750\u547D\u5B98\u3009", url: "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u4E8C" }],
    description: "\u4F9D\u6708\u652F\u3001\u6642\u652F\u8207\u5E74\u5E72\u4E94\u864E\u9041\u8A08\u7B97\u547D\u5BAE\u8207\u8EAB\u5BAE\u3002"
  },
  "san-ming-palm-research": {
    id: "san-ming-palm-research",
    name: "\u300A\u4E09\u547D\u901A\u6703\u300B\u547D\u5BAE\u638C\u8A23\u7814\u7A76\u6A21\u578B",
    status: "research-only",
    confidence: "research",
    conceptType: "palace-calculation",
    ruleFamily: "month-hour-palm",
    baseOn: ["monthPillar.branch", "hourPillar.branch", "yearPillar.stem"],
    scope: "month-hour",
    ruleId: "AUX_SANMING_PALM_RESEARCH_001",
    version: "0.1.0",
    references: [{ type: "classical", sourceId: "san-ming-tong-hui", title: "\u300A\u4E09\u547D\u901A\u6703\u300B", locator: "\u5377\u4E8C\u3008\u8AD6\u5750\u547D\u5B98\u3009", url: "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u4E8C" }],
    description: "\u7814\u7A76\u4E0D\u540C\u638C\u8A23\u50B3\u672C\u7684\u547D\u5BAE\uFF0F\u8EAB\u5BAE\u5DEE\u7570\uFF1B\u5C1A\u672A\u5B8C\u6210\u8B8A\u9AD4\u7B97\u6CD5\u3002"
  },
  "fuyi-canonical": {
    id: "fuyi-canonical",
    name: "canonical \u6276\u6291\u6A21\u578B",
    status: "implemented",
    confidence: "model-derived",
    conceptType: "strength-model",
    ruleFamily: "whole-chart-analysis",
    baseOn: ["dayMaster", "monthPillar", "wholeChart"],
    scope: "whole-chart",
    ruleId: "STR_CANONICAL_DEFAULT",
    version: "1.0.0",
    references: REFERENCES3.fuyi,
    description: "\u4F9D BaziJS canonical \u6B0A\u91CD\u8207\u5F97\u4EE4\u3001\u5F97\u5730\u3001\u5F97\u52E2\u8A08\u7B97\u5F37\u5F31\uFF0C\u518D\u63A8\u5C0E\u6276\u6291\u65B9\u5411\u3002"
  },
  "tiaohou-research": {
    id: "tiaohou-research",
    name: "\u8ABF\u5019\u7814\u7A76\u6A21\u578B",
    status: "research-only",
    confidence: "research",
    conceptType: "seasonal-analysis",
    ruleFamily: "seasonal-day-analysis",
    baseOn: ["monthPillar", "dayMaster", "wholeChart"],
    scope: "seasonal-whole-chart",
    ruleId: "ANALYSIS_TIAOHOU_RESEARCH_001",
    version: "0.1.0",
    references: REFERENCES3.seasonal,
    description: "\u8ABF\u5019\u9700\u4F9D\u5B63\u7BC0\u5BD2\u6696\u71E5\u6FD5\u8207\u5168\u5C40\u914D\u7F6E\u5224\u65B7\uFF1B\u76EE\u524D\u53EA\u5EFA\u7ACB Profile \u908A\u754C\uFF0C\u4E0D\u8F38\u51FA\u672A\u5B8C\u6210\u7684\u552F\u4E00\u53D6\u7528\u7D50\u8AD6\u3002"
  },
  "tongguan-research": {
    id: "tongguan-research",
    name: "\u901A\u95DC\u7814\u7A76\u6A21\u578B",
    status: "research-only",
    confidence: "research",
    conceptType: "mediator-analysis",
    ruleFamily: "whole-chart-mediation",
    baseOn: ["wholeChart", "interactions", "elementDistribution"],
    scope: "whole-chart",
    ruleId: "ANALYSIS_TONGGUAN_RESEARCH_001",
    version: "0.1.0",
    references: REFERENCES3.mediator,
    description: "\u901A\u95DC\u9700\u78BA\u8A8D\u5C0D\u7ACB\u4E94\u884C\u3001\u4ECB\u5165\u4E94\u884C\u7684\u6709\u6548\u6027\u53CA\u5408\u6C96\u5211\u5BB3\uFF1B\u76EE\u524D\u53EA\u5EFA\u7ACB Profile \u908A\u754C\uFF0C\u4E0D\u8F38\u51FA\u672A\u5B8C\u6210\u7684\u552F\u4E00\u53D6\u7528\u7D50\u8AD6\u3002"
  },
  "patterns-research": {
    id: "patterns-research",
    name: "\u53E4\u5178\u7279\u6B8A\u683C\u7814\u7A76\u6A21\u578B",
    status: "research-only",
    confidence: "research",
    conceptType: "special-pattern",
    ruleFamily: "whole-chart-pattern",
    baseOn: ["dayPillar", "hourPillar", "monthPillar", "wholeChart"],
    scope: "whole-chart",
    ruleId: "PATTERN_RESEARCH_ONLY_001",
    version: "0.1.0",
    references: REFERENCES3.patterns,
    description: "\u6574\u5C40\u7279\u6B8A\u683C\u4ECD\u7531 Bazi.Patterns \u7814\u7A76\u767B\u9304\uFF1B\u672A\u5B8C\u6210\u6210\u683C\u8207\u7834\u683C predicate \u524D\u4E0D\u5BA3\u544A\u547D\u4E2D\u3002"
  }
});
var ANALYSIS_MODEL_CATALOG = Object.freeze(Object.values(MODEL_DEFINITIONS));
var ANALYSIS_DIMENSIONS = Object.freeze([
  "monthCommander",
  "auxiliary",
  "useGod",
  "seasonal",
  "mediator",
  "patterns"
]);
var ANALYSIS_MODEL_IDS = Object.freeze({
  monthCommander: ["bazi-js-human-element", "san-ming-volume-2"],
  auxiliary: ["canonical-palm", "san-ming-palm-research"],
  useGod: ["fuyi-canonical", "tiaohou-research", "tongguan-research"],
  seasonal: ["none", "tiaohou-research"],
  mediator: ["none", "tongguan-research"],
  patterns: ["research-registry", "patterns-research"]
});
var ANALYSIS_RULE_IDS = Object.freeze({
  "bazi-js-human-element": "STR_MONTH_COMMANDER_001",
  "san-ming-volume-2": "STR_MONTH_COMMANDER_SANMING_002",
  "canonical-palm": "AUX_CANONICAL_PALM_001",
  "san-ming-palm-research": "AUX_SANMING_PALM_RESEARCH_001",
  "fuyi-canonical": "STR_CANONICAL_DEFAULT",
  "tiaohou-research": "ANALYSIS_TIAOHOU_RESEARCH_001",
  "tongguan-research": "ANALYSIS_TONGGUAN_RESEARCH_001",
  "none": "ANALYSIS_NONE_001",
  "research-registry": "PATTERN_RESEARCH_ONLY_001",
  "patterns-research": "PATTERN_RESEARCH_ONLY_001"
});
function getAnalysisRuleId(modelId, dimension2) {
  return ANALYSIS_RULE_IDS[modelId] || `ANALYSIS_${String(dimension2).toUpperCase().replaceAll("-", "_")}_UNREGISTERED`;
}
function noDecisionModel(modelId, dimension2, profileId) {
  const definition = MODEL_DEFINITIONS[modelId];
  return {
    ...definition || {
      id: modelId,
      name: modelId,
      status: "research-only",
      confidence: "research",
      conceptType: "analysis",
      ruleFamily: dimension2,
      baseOn: ["wholeChart"],
      scope: "whole-chart",
      ruleId: `ANALYSIS_${dimension2.toUpperCase()}_UNREGISTERED`,
      version: "0.1.0",
      references: [],
      description: "\u5C1A\u672A\u5EFA\u7ACB\u53EF\u5BE9\u6838\u7684\u6A21\u578B\u5B9A\u7FA9\u3002"
    },
    dimension: dimension2,
    profileId,
    finalDecision: false,
    result: null,
    evidence: {
      matched: false,
      status: "research-only",
      reason: "\u6B64 Profile \u5DF2\u9078\u53D6\u7814\u7A76\u6A21\u578B\uFF0C\u4F46\u76EE\u524D\u4E0D\u8986\u5BEB canonical \u7D50\u679C\uFF1B\u5F85\u5B8C\u6210\u53EF\u5BE9\u6838\u7684\u5168\u5C40\u5224\u5B9A\u51FD\u6578\u3002"
    }
  };
}
function selectedRule(profile, dimension2) {
  const rule3 = profile?.rules?.analysis?.[dimension2];
  return rule3 || { value: dimension2 === "seasonal" || dimension2 === "mediator" ? "none" : "research-registry", ruleId: "PROFILE_ANALYSIS_DEFAULT_001", version: ANALYSIS_RULE_VERSION2 };
}
function buildAnalysisResult({ profile, strength = null, auxiliary = null, patterns = null } = {}) {
  const profileId = profile?.id || "canonical";
  const selected = Object.fromEntries(ANALYSIS_DIMENSIONS.map((dimension2) => {
    const rule3 = selectedRule(profile, dimension2);
    return [dimension2, { ...rule3, modelId: rule3.value }];
  }));
  const useGodRule = selected.useGod;
  const useGodModel = useGodRule.modelId;
  const useGod = useGodModel === "fuyi-canonical" ? {
    ...MODEL_DEFINITIONS["fuyi-canonical"],
    dimension: "useGod",
    profileId,
    finalDecision: true,
    result: strength ? {
      score: strength.score,
      level: strength.level,
      favorableElements: strength.favorableElements,
      unfavorableElements: strength.unfavorableElements
    } : null,
    evidence: { matched: true, status: "implemented", source: "strength" }
  } : noDecisionModel(useGodModel, "useGod", profileId);
  const useGodResolver = buildUseGodResolver({ profile, strength, patterns });
  const monthCommander = MODEL_DEFINITIONS[selected.monthCommander.modelId]?.status === "research-only" ? noDecisionModel(selected.monthCommander.modelId, "monthCommander", profileId) : {
    ...MODEL_DEFINITIONS[selected.monthCommander.modelId],
    dimension: "monthCommander",
    profileId,
    finalDecision: Boolean(strength?.monthCommander),
    result: strength?.monthCommander || null,
    evidence: strength?.monthCommander?.evidence || { matched: false, status: "not-calculated" }
  };
  const auxiliaryModel = MODEL_DEFINITIONS[selected.auxiliary.modelId]?.status === "research-only" ? noDecisionModel(selected.auxiliary.modelId, "auxiliary", profileId) : {
    ...MODEL_DEFINITIONS[selected.auxiliary.modelId],
    dimension: "auxiliary",
    profileId,
    finalDecision: Boolean(auxiliary),
    result: auxiliary || null,
    evidence: auxiliary?.model?.evidence || { matched: false, status: "not-calculated" }
  };
  const models = {
    monthCommander,
    auxiliary: auxiliaryModel,
    useGod,
    seasonal: selected.seasonal.modelId === "none" ? { id: "none", dimension: "seasonal", status: "not-selected", finalDecision: false, result: null, evidence: { matched: false, status: "not-selected" } } : noDecisionModel(selected.seasonal.modelId, "seasonal", profileId),
    mediator: selected.mediator.modelId === "none" ? { id: "none", dimension: "mediator", status: "not-selected", finalDecision: false, result: null, evidence: { matched: false, status: "not-selected" } } : noDecisionModel(selected.mediator.modelId, "mediator", profileId),
    patterns: selected.patterns.modelId === "research-registry" ? { id: "research-registry", dimension: "patterns", status: "research-only", finalDecision: false, result: null, evidence: { matched: false, status: "research-only", source: "Bazi.Patterns" } } : noDecisionModel(selected.patterns.modelId, "patterns", profileId)
  };
  return {
    schemaVersion: ANALYSIS_RULE_VERSION2,
    profileId,
    profileName: profile?.name || "canonical",
    selected,
    models,
    useGodResolver,
    ruleId: ANALYSIS_SELECTION_RULE_ID,
    version: ANALYSIS_RULE_VERSION2,
    evidence: {
      matched: true,
      profileId,
      selectedModelIds: Object.fromEntries(Object.entries(selected).map(([key, value]) => [key, value.modelId])),
      nonCanonicalModels: Object.values(models).filter((model) => model.status === "research-only").map((model) => model.id)
    },
    description: "Profile \u53EA\u6C7A\u5B9A\u672C\u6B21\u5206\u6790\u6A21\u578B\uFF1B\u7814\u7A76\u6A21\u578B\u82E5\u5C1A\u672A\u5B8C\u6210\u5168\u5C40\u5224\u5B9A\uFF0C\u4E0D\u6703\u8986\u5BEB canonical \u7D50\u679C\u3002resolver \u6703\u4FDD\u7559\u5404\u6A21\u578B candidate\u3001conflict \u8207 finalDecision\u3002"
  };
}
function getAnalysisModel(id) {
  return MODEL_DEFINITIONS[id] || null;
}
function validateAnalysisProfileRules(profile) {
  const errors = [];
  for (const dimension2 of ANALYSIS_DIMENSIONS) {
    const rule3 = profile?.rules?.analysis?.[dimension2];
    if (!rule3) {
      errors.push(`rules.analysis.${dimension2} is required`);
      continue;
    }
    if (!ANALYSIS_MODEL_IDS[dimension2].includes(rule3.value)) errors.push(`rules.analysis.${dimension2}.value is invalid: ${rule3.value}`);
    if (!rule3.ruleId || !rule3.version) errors.push(`rules.analysis.${dimension2} requires ruleId/version`);
  }
  return errors;
}

// src/rules/profiles/catalog.js
var CLASSICAL_ZIPING3 = "classical-ziping";
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
function rule2(value, ruleId, overridden = false) {
  return { value, ruleId, version: "1.0.0", ...overridden ? { overridden: true } : {} };
}
function analysisRule(value, dimension2) {
  return {
    value,
    ruleId: getAnalysisRuleId(value, dimension2),
    version: value.endsWith("-research") || value === "research-registry" ? "0.1.0" : "1.0.0",
    overridden: true
  };
}
function buildComparisonProfile({ id, name, description, overrides, differences, status = "comparison" }) {
  const profile = clone(CANONICAL_PROFILE);
  profile.id = id;
  profile.name = name;
  profile.description = description;
  profile.tradition = CLASSICAL_ZIPING3;
  profile.profileType = "comparison";
  profile.status = status;
  profile.baseId = "canonical";
  profile.version = status === "research-only" ? "0.1.0" : "1.0.0";
  profile.diff = differences;
  if (overrides.dayBoundary) {
    profile.rules.dayBoundary = rule2(
      overrides.dayBoundary,
      overrides.dayBoundary === "00:00" ? "DAY_BOUNDARY_MIDNIGHT_0000" : "DAY_BOUNDARY_ZISHI_2300",
      true
    );
  }
  if (overrides.yearBoundary) {
    profile.rules.yearBoundary = rule2(overrides.yearBoundary, `YEAR_BOUNDARY_${overrides.yearBoundary.toUpperCase()}`, true);
  }
  if (overrides.monthBoundary) {
    profile.rules.monthBoundary = rule2(overrides.monthBoundary, `MONTH_BOUNDARY_${overrides.monthBoundary.toUpperCase()}`, true);
  }
  if (overrides.startAgeMethod) {
    profile.rules.luckCycle.startAgeMethod = rule2(
      overrides.startAgeMethod,
      overrides.startAgeMethod === "jieqi-whole-days-divide-3" ? "LUCK_START_DIFF_WHOLE_DAY_DIV_3" : "LUCK_START_DIFF_DIV_3",
      true
    );
  }
  if (typeof overrides.trueSolarTime === "boolean") {
    profile.rules.trueSolarTime = rule2(
      overrides.trueSolarTime,
      overrides.trueSolarTime ? "TRUE_SOLAR_TIME_ENABLED" : "TRUE_SOLAR_TIME_DISABLED",
      true
    );
  }
  if (overrides.analysis) {
    for (const [dimension2, modelId] of Object.entries(overrides.analysis)) {
      profile.rules.analysis[dimension2] = analysisRule(modelId, dimension2);
    }
  }
  return profile;
}
var CANONICAL_DESCRIPTOR = {
  ...clone(CANONICAL_PROFILE),
  tradition: CLASSICAL_ZIPING3,
  profileType: "reference",
  status: "default",
  references: ["docs/references/rule-differences.md", "docs/architecture/quality-gates.md"]
};
var PROFILE_CATALOG = Object.freeze([
  CANONICAL_DESCRIPTOR,
  buildComparisonProfile({
    id: "civil-midnight",
    name: "\u6C11\u7528\u5348\u591C\u63DB\u65E5\u6BD4\u8F03",
    description: "\u53EA\u5C07\u63DB\u65E5\u754C\u7DDA\u6539\u70BA 00:00\uFF0C\u4F9B\u8207\u6C11\u7528\u66C6\u6CD5\u6216\u5176\u4ED6\u6392\u76E4\u7CFB\u7D71\u9010\u6848\u6BD4\u5C0D\u3002",
    overrides: { dayBoundary: "00:00" },
    differences: { dayBoundary: { from: "23:00", to: "00:00" } }
  }),
  buildComparisonProfile({
    id: "lunar-calendar",
    name: "\u8FB2\u66C6\u521D\u4E00\u5207\u754C\u6BD4\u8F03",
    description: "\u4EE5\u8FB2\u66C6\u6B63\u6708\u521D\u4E00\u5207\u5E74\u3001\u8FB2\u66C6\u521D\u4E00\u5207\u6708\u4E26\u4EE5 00:00 \u63DB\u65E5\uFF0C\u50C5\u4F5C\u5DEE\u7570\u7814\u7A76\u3002",
    overrides: { yearBoundary: "lunar_new_year", monthBoundary: "lunar_month", dayBoundary: "00:00" },
    differences: {
      yearBoundary: { from: "lichun", to: "lunar_new_year" },
      monthBoundary: { from: "jie", to: "lunar_month" },
      dayBoundary: { from: "23:00", to: "00:00" }
    }
  }),
  buildComparisonProfile({
    id: "true-solar",
    name: "\u771F\u592A\u967D\u6642\u6BD4\u8F03",
    description: "\u4FDD\u7559 canonical \u7684\u5B50\u5E73\u5207\u754C\uFF0C\u6539\u4EE5\u51FA\u751F\u5730\u7D93\u5EA6\u4FEE\u6B63\u771F\u592A\u967D\u6642\uFF1B\u672A\u63D0\u4F9B\u5730\u9EDE\u6642\u4F7F\u7528\u6642\u5340\u4E2D\u592E\u7D93\u7DDA\u3002",
    overrides: { trueSolarTime: true },
    differences: { trueSolarTime: { from: false, to: true } }
  }),
  buildComparisonProfile({
    id: "jieqi-whole-day",
    name: "\u7BC0\u6C23\u5DEE\u6574\u65E5\u63DB\u7B97\u6BD4\u8F03",
    description: "\u4FDD\u7559 canonical \u7684\u7BC0\u6C23\u53D6\u7BC0\u8207\u9806\u9006\u898F\u5247\uFF0C\u4F46\u5148\u53D6\u6574\u65E5\u518D\u4EE5\u4E09\u65E5\u4E00\u6B72\u63DB\u7B97\uFF1B\u53EA\u4F5C\u65B9\u6CD5\u5DEE\u7570\u7814\u7A76\u3002",
    overrides: { startAgeMethod: "jieqi-whole-days-divide-3" },
    differences: { startAgeMethod: { from: "jieqi-diff-divide-3", to: "jieqi-whole-days-divide-3" } }
  }),
  buildComparisonProfile({
    id: "classical-sanming",
    name: "\u300A\u4E09\u547D\u901A\u6703\u300B\u4EBA\u5143\u5206\u65E5\u6BD4\u8F03",
    description: "\u53EA\u5C07\u6708\u4EE4\u4EBA\u5143\u53F8\u4E8B\u5206\u65E5\u5207\u63DB\u70BA\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E8C\u8868\u683C\uFF0C\u4FDD\u7559 canonical \u5176\u4ED6\u8A08\u7B97\uFF0C\u4F9B\u9010\u6848\u7814\u7A76\u3002",
    overrides: { analysis: { monthCommander: "san-ming-volume-2" } },
    differences: { analysis: { monthCommander: { from: "bazi-js-human-element", to: "san-ming-volume-2" } } }
  }),
  buildComparisonProfile({
    id: "research-tiaohou",
    name: "\u8ABF\u5019\u7814\u7A76 Profile",
    description: "\u6A19\u8A18\u8ABF\u5019\u8207\u5B63\u7BC0\u5206\u6790\u7684\u7814\u7A76\u908A\u754C\uFF1B\u672A\u5B8C\u6210\u5224\u5B9A\u524D\u4E0D\u8986\u5BEB canonical \u6276\u6291\u7D50\u679C\u3002",
    overrides: { analysis: { useGod: "tiaohou-research", seasonal: "tiaohou-research" } },
    differences: {
      analysis: {
        useGod: { from: "fuyi-canonical", to: "tiaohou-research" },
        seasonal: { from: "none", to: "tiaohou-research" }
      }
    },
    status: "research-only"
  }),
  buildComparisonProfile({
    id: "research-tongguan",
    name: "\u901A\u95DC\u7814\u7A76 Profile",
    description: "\u6A19\u8A18\u901A\u95DC\u8207\u4ECB\u5165\u4E94\u884C\u7684\u7814\u7A76\u908A\u754C\uFF1B\u672A\u5B8C\u6210\u5168\u5C40\u5224\u5B9A\u524D\u4E0D\u8986\u5BEB canonical \u7D50\u679C\u3002",
    overrides: { analysis: { useGod: "tongguan-research", mediator: "tongguan-research" } },
    differences: {
      analysis: {
        useGod: { from: "fuyi-canonical", to: "tongguan-research" },
        mediator: { from: "none", to: "tongguan-research" }
      }
    },
    status: "research-only"
  }),
  buildComparisonProfile({
    id: "research-patterns",
    name: "\u53E4\u5178\u7279\u6B8A\u683C\u7814\u7A76 Profile",
    description: "\u53EA\u9078\u53D6 Pattern \u7814\u7A76\u767B\u9304\uFF1B\u6C92\u6709\u5B8C\u6574\u6210\u683C\u8207\u7834\u683C predicate \u6642\u4E0D\u5BA3\u544A\u547D\u4E2D\u3002",
    overrides: { analysis: { patterns: "patterns-research" } },
    differences: { analysis: { patterns: { from: "research-registry", to: "patterns-research" } } },
    status: "research-only"
  })
]);
var BUILTIN_PROFILES = Object.freeze(PROFILE_CATALOG.filter((profile) => profile.id !== CANONICAL_PROFILE.id));

// src/rules/rule-registry.js
var VALID_YEAR_BOUNDARIES = /* @__PURE__ */ new Set(["lichun", "lunar_new_year"]);
var VALID_MONTH_BOUNDARIES = /* @__PURE__ */ new Set(["jie", "lunar_month"]);
var VALID_DAY_BOUNDARIES = /* @__PURE__ */ new Set(["23:00", "00:00"]);
var VALID_START_AGE_METHODS = /* @__PURE__ */ new Set(["jieqi-diff-divide-3", "jieqi-whole-days-divide-3"]);
function validateProfile(profile) {
  const errors = [];
  if (!profile || typeof profile !== "object") errors.push("profile must be an object");
  if (!profile?.id || typeof profile.id !== "string") errors.push("id is required");
  if (!profile?.rules || typeof profile.rules !== "object") errors.push("rules is required");
  if (profile?.rules?.yearBoundary && !VALID_YEAR_BOUNDARIES.has(profile.rules.yearBoundary.value)) {
    errors.push("rules.yearBoundary.value is invalid");
  }
  if (profile?.rules?.monthBoundary && !VALID_MONTH_BOUNDARIES.has(profile.rules.monthBoundary.value)) {
    errors.push("rules.monthBoundary.value is invalid");
  }
  if (profile?.rules?.dayBoundary && !VALID_DAY_BOUNDARIES.has(profile.rules.dayBoundary.value)) {
    errors.push("rules.dayBoundary.value is invalid");
  }
  if (profile?.rules?.trueSolarTime && typeof profile.rules.trueSolarTime.value !== "boolean") {
    errors.push("rules.trueSolarTime.value must be boolean");
  }
  if (profile?.rules?.luckCycle?.startAgeMethod && !VALID_START_AGE_METHODS.has(profile.rules.luckCycle.startAgeMethod.value)) {
    errors.push("rules.luckCycle.startAgeMethod.value is invalid");
  }
  errors.push(...validateAnalysisProfileRules(profile));
  return errors;
}
var ProfileRegistry = class {
  constructor() {
    this.profiles = /* @__PURE__ */ new Map();
    this.register(CANONICAL_PROFILE);
    for (const profile of BUILTIN_PROFILES) this.register(profile);
  }
  register(profile) {
    const errors = validateProfile(profile);
    if (errors.length) {
      throw new BaziRuleError(`Profile \u7121\u6548\uFF1A${errors.join("\uFF1B")}`, "PROFILE_SCHEMA_INVALID", { errors });
    }
    if (this.profiles.has(profile.id)) {
      throw new BaziRuleError(`Profile \u5DF2\u5B58\u5728\uFF1A${profile.id}`, "PROFILE_DUPLICATE", { profileId: profile.id });
    }
    this.profiles.set(profile.id, profile);
  }
  get(id = "canonical") {
    return this.profiles.get(id);
  }
  require(id = "canonical") {
    const profile = this.get(id);
    if (!profile) {
      throw new BaziRuleError(`\u627E\u4E0D\u5230\u898F\u5247 Profile\uFF1A${id}`, "PROFILE_NOT_FOUND", { profileId: id });
    }
    return profile;
  }
  // 建立自訂 Profile（繼承 base，覆寫 overrides）
  createProfile({ id, name, description, base = "canonical", overrides = {} }) {
    var _a;
    if (!id || typeof id !== "string") {
      throw new BaziRuleError("\u81EA\u8A02 Profile \u5FC5\u9808\u63D0\u4F9B id", "PROFILE_ID_REQUIRED");
    }
    const baseProfile = this.require(base);
    if (this.profiles.has(id)) {
      throw new BaziRuleError(`Profile \u5DF2\u5B58\u5728\uFF1A${id}`, "PROFILE_DUPLICATE", { profileId: id });
    }
    const newProfile = JSON.parse(JSON.stringify(baseProfile));
    newProfile.id = id;
    newProfile.name = name || id;
    newProfile.description = description || `\u57FA\u65BC ${base} \u8986\u5BEB\u4E4B\u81EA\u8A02\u6D41\u6D3E`;
    newProfile.baseId = base;
    newProfile.version = "1.0.0-custom";
    newProfile.diff = {};
    for (const [key, val] of Object.entries(overrides)) {
      if (key === "dayBoundary") {
        if (!VALID_DAY_BOUNDARIES.has(val)) throw new BaziRuleError(`\u7121\u6548 dayBoundary\uFF1A${val}`, "PROFILE_OVERRIDE_INVALID", { key, value: val });
        newProfile.rules.dayBoundary = {
          value: val,
          ruleId: val === "00:00" ? "DAY_BOUNDARY_MIDNIGHT_0000" : "DAY_BOUNDARY_ZISHI_2300",
          version: "1.0.0",
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.dayBoundary.value, to: val };
      } else if (key === "trueSolarTime") {
        if (typeof val !== "boolean") throw new BaziRuleError(`trueSolarTime \u5FC5\u9808\u662F boolean`, "PROFILE_OVERRIDE_INVALID", { key, value: val });
        newProfile.rules.trueSolarTime = {
          value: Boolean(val),
          ruleId: val ? "TRUE_SOLAR_TIME_ENABLED" : "TRUE_SOLAR_TIME_DISABLED",
          version: "1.0.0",
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.trueSolarTime.value, to: val };
      } else if (key === "yearBoundary") {
        if (!VALID_YEAR_BOUNDARIES.has(val)) throw new BaziRuleError(`\u7121\u6548 yearBoundary\uFF1A${val}`, "PROFILE_OVERRIDE_INVALID", { key, value: val });
        newProfile.rules.yearBoundary = {
          value: val,
          ruleId: `YEAR_BOUNDARY_${val.toUpperCase()}`,
          version: "1.0.0",
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.yearBoundary.value, to: val };
      } else if (key === "monthBoundary") {
        if (!VALID_MONTH_BOUNDARIES.has(val)) throw new BaziRuleError(`\u7121\u6548 monthBoundary\uFF1A${val}`, "PROFILE_OVERRIDE_INVALID", { key, value: val });
        newProfile.rules.monthBoundary = {
          value: val,
          ruleId: `MONTH_BOUNDARY_${val.toUpperCase()}`,
          version: "1.0.0",
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.monthBoundary.value, to: val };
      } else if (key === "startAgeMethod") {
        if (!VALID_START_AGE_METHODS.has(val)) throw new BaziRuleError(`\u7121\u6548 startAgeMethod\uFF1A${val}`, "PROFILE_OVERRIDE_INVALID", { key, value: val });
        newProfile.rules.luckCycle.startAgeMethod = {
          value: val,
          ruleId: val === "jieqi-whole-days-divide-3" ? "LUCK_START_DIFF_WHOLE_DAY_DIV_3" : "LUCK_START_DIFF_DIV_3",
          version: "1.0.0",
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.luckCycle.startAgeMethod.value, to: val };
      } else if (key === "analysis") {
        if (!val || typeof val !== "object" || Array.isArray(val)) {
          throw new BaziRuleError("analysis \u8986\u5BEB\u5FC5\u9808\u662F dimension \u2192 modelId \u7269\u4EF6", "PROFILE_OVERRIDE_INVALID", { key, value: val });
        }
        for (const [dimension2, modelId] of Object.entries(val)) {
          if (!ANALYSIS_DIMENSIONS.includes(dimension2)) {
            throw new BaziRuleError(`\u4E0D\u652F\u63F4\u7684 analysis \u7DAD\u5EA6\uFF1A${dimension2}`, "PROFILE_OVERRIDE_INVALID", { key, dimension: dimension2 });
          }
          if (!ANALYSIS_MODEL_IDS[dimension2].includes(modelId)) {
            throw new BaziRuleError(`\u7121\u6548 analysis model\uFF1A${dimension2}=${modelId}`, "PROFILE_OVERRIDE_INVALID", { key, dimension: dimension2, value: modelId });
          }
          const baseRule = newProfile.rules.analysis[dimension2];
          newProfile.rules.analysis[dimension2] = {
            value: modelId,
            ruleId: getAnalysisRuleId(modelId, dimension2),
            version: modelId.endsWith("-research") || modelId === "research-registry" ? "0.1.0" : "1.0.0",
            overridden: true
          };
          (_a = newProfile.diff).analysis || (_a.analysis = {});
          newProfile.diff.analysis[dimension2] = { from: baseRule.value, to: modelId };
        }
      } else {
        throw new BaziRuleError(`\u4E0D\u652F\u63F4\u7684 Profile \u8986\u5BEB\u6B04\u4F4D\uFF1A${key}`, "PROFILE_OVERRIDE_UNSUPPORTED", { key });
      }
    }
    this.register(newProfile);
    return newProfile;
  }
  // 取得 Profile 與 canonical 的 diff
  getDiff(profileId) {
    const p = this.get(profileId);
    if (!p) return null;
    return p.diff || {};
  }
  // 列出所有可用 Profiles
  listProfiles() {
    return Array.from(this.profiles.values()).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      version: p.version,
      baseId: p.baseId || null,
      status: p.status || (p.id === "canonical" ? "default" : "custom"),
      diff: p.diff || {}
    }));
  }
};
var RuleRegistry = new ProfileRegistry();

// src/ai/index.js
var ai_exports = {};
__export(ai_exports, {
  toContext: () => toContext,
  toShenShaContext: () => toShenShaContext,
  toSpecialRulesContext: () => toSpecialRulesContext
});
function buildShenShaItem(item, options = {}) {
  const { includeRules = true, includeEvidence = true } = options;
  return {
    id: item.id,
    name: item.name,
    displayName: item.displayName || item.name,
    aliases: item.aliases || [],
    tradition: item.tradition,
    conceptType: item.conceptType,
    ruleFamily: item.ruleFamily,
    scope: item.scope,
    category: item.category,
    tags: item.tags || [],
    tier: item.tier,
    priority: item.priority,
    confidence: item.confidence,
    schools: item.schools || [],
    hitOn: item.hitOn || [],
    baseOn: item.baseOn || item.basedOn || [],
    basedOn: item.basedOn || [],
    target: item.target,
    ...includeRules ? { ruleId: item.ruleId, version: item.version } : {},
    reference: item.reference,
    ...Array.isArray(item.references) ? { references: item.references } : {},
    ...item.description ? { description: item.description } : {},
    ...item.interpretation ? { interpretation: item.interpretation } : {},
    ...item.variants ? { variants: item.variants } : {},
    ...item.researchNotes ? { researchNotes: item.researchNotes } : {},
    ...includeEvidence ? { evidence: item.evidence } : {}
  };
}
function buildSpecialRuleItem(item, options = {}) {
  const { includeRules = true, includeEvidence = true } = options;
  return {
    id: item.id,
    name: item.name,
    displayName: item.displayName || item.name,
    aliases: item.aliases || [],
    tradition: item.tradition,
    conceptType: item.conceptType,
    ruleFamily: item.ruleFamily,
    baseOn: item.baseOn || [],
    scope: item.scope,
    category: item.category,
    tags: item.tags || [],
    confidence: item.confidence,
    hitOn: item.hitOn || [],
    ...includeRules ? { ruleId: item.ruleId, version: item.version } : {},
    reference: item.reference,
    ...Array.isArray(item.references) ? { references: item.references } : {},
    ...item.description ? { description: item.description } : {},
    ...item.interpretation ? { interpretation: item.interpretation } : {},
    ...item.variants ? { variants: item.variants } : {},
    ...item.researchNotes ? { researchNotes: item.researchNotes } : {},
    ...includeEvidence ? { evidence: item.evidence } : {}
  };
}
function toShenShaContext(result, options = {}) {
  const items = (result.shenSha || []).map((item) => buildShenShaItem(item, options));
  const grouped = groupShenShaByPillar(result.shenSha || []);
  const context = {
    preset: result.meta.shenshaPreset || "classical",
    ruleVersion: result.meta.shenShaRuleVersion || "2.1.0",
    all: items,
    byPillar: Object.fromEntries(Object.entries(grouped).map(([pillar, list]) => [
      pillar,
      list.map((item) => buildShenShaItem(item, options))
    ]))
  };
  return options.compact ? JSON.stringify(context) : context;
}
function toSpecialRulesContext(result, options = {}) {
  const items = (result.specialRules || []).map((item) => buildSpecialRuleItem(item, options));
  const byConceptType = items.reduce((grouped, item) => {
    const key = item.conceptType || "unknown";
    (grouped[key] || (grouped[key] = [])).push(item);
    return grouped;
  }, {});
  const context = {
    ruleVersion: result.meta.specialRuleVersion || "1.0.0",
    all: items,
    byConceptType
  };
  return options.compact ? JSON.stringify(context) : context;
}
function buildPillarContext(result, pillarKey, options = {}) {
  const pillar = result.pillars[pillarKey];
  const hidden = result.tenGods.hidden[pillarKey] || [];
  const stage = result.twelveStages.byDayMaster[pillarKey] || null;
  const selfSeated = result.twelveStages.selfSeated[pillarKey] || null;
  return {
    available: pillar.available !== false,
    ganzhi: pillar.ganzhi,
    stem: pillar.stem,
    branch: pillar.branch,
    sexagenaryIndex: pillar.sexagenaryIndex,
    tenGod: pillarKey === "day" ? "\u65E5\u4E3B\uFF08\u5143\u795E\uFF09" : result.tenGods.stems[pillarKey] ? result.tenGods.stems[pillarKey].full : null,
    nayin: result.nayin[pillarKey],
    hidden: hidden.map((item) => `${item.stem}(${item.tenGod.full})`),
    hiddenDetails: hidden,
    stage,
    selfSeated,
    xunKong: pillar.ganzhi ? calculateXunKong(pillar.ganzhi) : null,
    ...options.includeRules ? { source: "BaziJS canonical chart result" } : {}
  };
}
function buildTransitPillarContext(result, pillarKey, options = {}) {
  const pillar = result.transits && result.transits[pillarKey];
  if (!pillar) return null;
  return {
    ganzhi: pillar.ganzhi,
    stem: pillar.stem,
    branch: pillar.branch,
    sexagenaryIndex: pillar.sexagenaryIndex,
    tenGod: pillar.tenGod || null,
    stage: pillar.stage || null,
    nayin: pillar.nayin || null,
    shenSha: (pillar.shenSha || []).map((item) => buildShenShaItem(item, options))
  };
}
function toContext(result, options = {}) {
  const {
    compact = true,
    includeRules = true,
    includeEvidence = true,
    includeShenShaEvidence = includeEvidence,
    includeStrengthEvidence = true,
    includeInteractions = true,
    maxLuckCycles = 10
  } = options;
  const ctx = {
    metadata: {
      engine: "BaziJS",
      engineVersion: result.meta.engineVersion,
      resultSchemaVersion: result.meta.resultSchemaVersion || "2.1.0",
      ruleSetVersion: result.meta.ruleSetVersion,
      profileId: result.meta.profileId,
      shenshaPreset: result.meta.shenshaPreset || "classical",
      shenShaRuleVersion: result.meta.shenShaRuleVersion || "2.1.0",
      specialRuleVersion: result.meta.specialRuleVersion || "1.0.0",
      strengthQiLayerVersion: result.meta.strengthQiLayerVersion || "1.1.0",
      fiveCategoryRuleVersion: result.meta.fiveCategoryRuleVersion || "1.0.0",
      auxiliaryRuleVersion: result.meta.auxiliaryRuleVersion || "1.0.0",
      classicalSummaryRuleVersion: result.meta.classicalSummaryRuleVersion || "1.0.0",
      analysisRuleVersion: result.meta.analysisRuleVersion || "1.0.0",
      useGodResolverVersion: result.meta.useGodResolverVersion || "0.1.0",
      transitGraphVersion: result.meta.transitGraphVersion || "0.1.0",
      luckRuleVersion: result.meta.luckRuleVersion || "1.0.0"
    },
    inputSummary: {
      birthDate: result.input.birthDate,
      birthTime: result.input.birthTime || "\u672A\u77E5",
      gender: result.input.gender === "male" ? "\u4E7E\u9020\uFF08\u7537\uFF09" : "\u5764\u9020\uFF08\u5973\uFF09",
      timezone: result.input.timezone,
      trueSolarTimeUsed: result.accuracy.trueSolarTimeUsed,
      zodiac: result.calendar.zodiac ? result.calendar.zodiac.name : null,
      constellation: result.calendar.constellation ? result.calendar.constellation.name : null
    },
    // AI Context 也必須能重現本次排盤，不只保留人類可讀摘要。
    input: result.input,
    accuracy: result.accuracy,
    calendar: {
      solar: result.calendar.solar,
      lunar: result.calendar.lunar,
      zodiac: result.calendar.zodiac || null,
      constellation: result.calendar.constellation || null,
      solarTerms: result.calendar.solarTerms,
      time: result.calendar.time
    },
    pillars: {
      year: buildPillarContext(result, "year", { includeRules }),
      month: buildPillarContext(result, "month", { includeRules }),
      day: buildPillarContext(result, "day", { includeRules }),
      hour: result.pillars.hour.available ? buildPillarContext(result, "hour", { includeRules }) : { available: false, reason: "\u6642\u9593\u672A\u77E5" }
    },
    dayMaster: {
      stem: result.strength.dayMasterStem || result.pillars.day.stem,
      element: result.strength.dayMaster,
      elementScore: result.strength.score,
      strengthLevel: result.strength.level,
      monthState: result.strength.monthState || null,
      monthCommander: result.strength.monthCommander || null,
      seasonalStates: result.strength.seasonalStates || {},
      favorableElements: result.strength.favorableElements,
      unfavorableElements: result.strength.unfavorableElements,
      fiveCategory: result.strength.fiveCategory || null,
      rawQi: result.strength.rawQi || null,
      effectiveQi: result.strength.effectiveQi || null,
      transformations: result.strength.transformations || null,
      assessment: result.strength.assessment || null,
      decision: result.strength.decision || null,
      ...includeStrengthEvidence ? { strengthEvidence: result.strength.evidence } : {}
    },
    fiveElementsDistribution: result.strength.distribution,
    kongWang: {
      byDay: result.kongWang.byDay.branches,
      byYear: result.kongWang.byYear.branches
    },
    auxiliary: {
      taiYuan: result.auxiliary.taiYuan || null,
      taiXi: result.auxiliary.taiXi || null,
      mingGong: result.auxiliary.mingGong || null,
      shenGong: result.auxiliary.shenGong || null,
      mingGua: result.auxiliary.mingGua || null
    },
    classicalSummary: result.classicalSummary || null,
    analysis: result.analysis || null,
    patterns: result.patterns || null,
    transitGraph: result.transits?.transitGraph || null,
    rules: result.rules,
    shenSha: toShenShaContext(result, {
      includeRules,
      includeEvidence: includeShenShaEvidence,
      compact: false
    }),
    specialRules: toSpecialRulesContext(result, {
      includeRules,
      includeEvidence: includeShenShaEvidence,
      compact: false
    }),
    // 舊欄位保留，讓既有整合不必同步升級；新程式請使用 shenSha。
    shenShaList: result.shenSha.map((s) => buildShenShaItem(s, {
      includeRules,
      includeEvidence: includeShenShaEvidence
    })),
    ...includeInteractions ? {
      interactions: {
        stems: result.interactions.stems.map((s) => s.name),
        branches: result.interactions.branches.map((b) => b.name),
        details: result.interactions
      }
    } : {},
    // 畫面會顯示目前流年；AI Context 不能只保留原局與大運摘要。
    transits: result.transits ? {
      targetDatetime: result.transits.targetDatetime,
      year: buildTransitPillarContext(result, "year", { includeRules, includeEvidence: includeShenShaEvidence }),
      month: buildTransitPillarContext(result, "month", { includeRules, includeEvidence: includeShenShaEvidence }),
      day: buildTransitPillarContext(result, "day", { includeRules, includeEvidence: includeShenShaEvidence }),
      hour: buildTransitPillarContext(result, "hour", { includeRules, includeEvidence: includeShenShaEvidence }),
      interactions: result.transits.interactions || [],
      shenShaYear: (result.transits.shenShaYear || []).map((item) => buildShenShaItem(item, {
        includeRules,
        includeEvidence: includeShenShaEvidence
      })),
      shenSha: ((Array.isArray(result.transits.shenSha) ? result.transits.shenSha : result.transits.shenSha && result.transits.shenSha.shenSha) || []).map((item) => buildShenShaItem(item, {
        includeRules,
        includeEvidence: includeShenShaEvidence
      }))
    } : null,
    luckCyclesSummary: {
      direction: result.luckCycles.directionText,
      startAge: result.luckCycles.startAge.display,
      startDate: result.luckCycles.startAge.startDate,
      startAgeMethod: result.luckCycles.startAgeMethod,
      startAgeDetails: result.luckCycles.startAge,
      variants: result.luckCycles.variants || [],
      cycles: result.luckCycles.cycles.slice(0, maxLuckCycles).map((c) => ({
        step: c.step,
        ganzhi: c.ganzhi,
        stem: c.stem,
        branch: c.branch,
        sexagenaryIndex: c.sexagenaryIndex,
        ageRange: `${c.fromAge}~${c.toAge}\u6B72`,
        fromYear: c.fromYear,
        toYear: c.toYear,
        tenGodStem: c.tenGodStem ? c.tenGodStem.full : "",
        stage: c.stage || null,
        nayin: c.nayin,
        startDate: c.startDate || null,
        endDate: c.endDate || null,
        nominalAgeRange: c.nominalFromAge !== void 0 ? `${c.nominalFromAge}~${c.nominalToAge}\u6B72` : null,
        shenSha: (c.shenSha || []).map((item) => buildShenShaItem(item, {
          includeRules,
          includeEvidence: includeShenShaEvidence
        })),
        ...options.includeLuckAnnualDetails && Array.isArray(c.annuals) ? {
          annuals: c.annuals.map((annual) => ({
            age: annual.age,
            year: annual.year,
            ganzhi: annual.ganzhi,
            tenGod: annual.tenGod,
            stage: annual.stage,
            nayin: annual.nayin,
            xunKong: annual.xunKong,
            shenSha: (annual.shenSha || []).map((item) => buildShenShaItem(item, {
              includeRules,
              includeEvidence: includeShenShaEvidence
            })),
            interactions: includeInteractions ? annual.interactions : void 0
          }))
        } : {}
      }))
    }
  };
  if (compact) {
    return JSON.stringify(ctx);
  }
  return ctx;
}

// src/summary/index.js
var summary_exports = {};
__export(summary_exports, {
  CLASSICAL_SUMMARY_METHOD: () => CLASSICAL_SUMMARY_METHOD,
  CLASSICAL_SUMMARY_RULE_ID: () => CLASSICAL_SUMMARY_RULE_ID,
  CLASSICAL_SUMMARY_VERSION: () => CLASSICAL_SUMMARY_VERSION,
  buildClassicalSummary: () => buildClassicalSummary
});

// src/summary/classical.js
var CLASSICAL_SUMMARY_METHOD = "classical-summary-derived";
var CLASSICAL_SUMMARY_RULE_ID = "SUMMARY_CLASSICAL_TRACEABLE_001";
var CLASSICAL_SUMMARY_VERSION = "1.0.0";
var REFERENCES4 = Object.freeze([
  {
    sourceId: "san-ming-tong-hui",
    title: "\u300A\u4E09\u547D\u901A\u6703\u300B",
    locator: "\u5377\u4E8C\u3008\u8AD6\u4EBA\u5143\u53F8\u4E8B\u3009\u3001\u3008\u8AD6\u80CE\u5143\u3009\u3001\u3008\u8AD6\u5750\u547D\u5B98\u3009\uFF1B\u5377\u4E09\u3008\u8AD6\u7A7A\u4EA1\u3009",
    url: "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u4E8C"
  },
  {
    sourceId: "san-ming-tong-hui",
    title: "\u300A\u4E09\u547D\u901A\u6703\u300B",
    locator: "\u5377\u4E09\u3008\u8AD6\u7A7A\u4EA1\u3009",
    url: "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u4E09"
  },
  {
    sourceId: "di-tian-sui-yan-wei",
    title: "\u300A\u6EF4\u5929\u9AD3\u95E1\u5FAE\u300B",
    locator: "\u6708\u4EE4\u3001\u4EBA\u5143\u8207\u7528\u795E\u559C\u5FCC\u76F8\u95DC\u6CE8\u89E3",
    url: "https://zh.wikisource.org/zh-hant/\u6EF4\u5929\u9AD3\u95E1\u5FAE"
  }
]);
function stemElement(stem) {
  return STEMS[STEM_INDEX[stem]]?.element || null;
}
function branchElement(branch) {
  return BRANCHES.find((item) => item.char === branch)?.element || null;
}
function palaceRecord(key, label, ruleId, value, baseOn, note) {
  return {
    id: key,
    label,
    value: value || null,
    ruleId,
    version: "1.1.0",
    tradition: "classical-ziping-compatible",
    conceptType: "auxiliary",
    ruleFamily: "palace-and-embryo",
    baseOn,
    scope: key === "mingGua" ? "birth-year" : "chart-auxiliary",
    category: "auxiliary",
    confidence: key === "mingGua" ? "modern-common" : "school-specific",
    references: REFERENCES4.filter((item) => item.sourceId === "san-ming-tong-hui"),
    description: note,
    variants: key === "mingGong" || key === "shenGong" ? [{ id: "solar-term-over-month", description: "\u547D\u5BAE\u3001\u8EAB\u5BAE\u53E6\u6709\u4E2D\u6C23\u904E\u5BAE\u8207\u6708\u5EFA\u53D6\u6CD5\u5DEE\u7570\u3002" }, { id: "zi-hour-boundary", description: "\u5B50\u6642\u63DB\u65E5\u8207\u6642\u652F\u908A\u754C\u53EF\u80FD\u4F7F\u5BAE\u4F4D\u4E0D\u540C\u3002" }] : [{ id: "school-formula", description: "\u80CE\u5143\u3001\u80CE\u606F\u5728\u4E0D\u540C\u50B3\u672C\u8207\u8A3B\u5BB6\u6709\u7B97\u6CD5\u5DEE\u7570\u3002" }],
    researchNotes: {
      conflict: key !== "mingGua",
      note
    },
    evidence: {
      matched: Boolean(value),
      sourceValue: value?.ganzhi || value?.groupName || null,
      basedOn: baseOn,
      calculation: note
    }
  };
}
function buildFiveCategory(result) {
  const source = result.strength.fiveCategory;
  if (!source) return null;
  const rows = ["use", "joy", "idle", "adversary", "taboo"].map((category) => {
    const item = source.byElement ? Object.values(source.byElement).find((entry) => entry.category === category) : null;
    const element = item?.element || source.groups?.[category]?.[0] || null;
    return {
      category,
      label: item?.label || category,
      element,
      relationToUse: item?.relationToUse || (element ? elementRelation(element, source.useElement) : null),
      strength: element ? result.strength.distribution[element] || null : null,
      seasonalState: element ? result.strength.seasonalStates[element] || null : null,
      description: item?.description || null
    };
  });
  return {
    ...source,
    method: source.method || source.modelId,
    rows,
    references: [
      ...source.references,
      {
        sourceId: "di-tian-sui-yan-wei",
        title: "\u300A\u6EF4\u5929\u9AD3\u95E1\u5FAE\u300B",
        locator: "\u559C\u795E\u3001\u5FCC\u795E\u3001\u4EC7\u795E\u3001\u9592\u795E\u76F8\u95DC\u6CE8\u89E3",
        url: "https://zh.wikisource.org/zh-hant/\u6EF4\u5929\u9AD3\u95E1\u5FAE"
      }
    ],
    evidence: {
      ...source.evidence,
      sourceScope: "whole-chart strength model",
      categoryOrder: ["use", "joy", "idle", "adversary", "taboo"],
      rows
    }
  };
}
function buildMonthCommand(result) {
  const commander = result.strength.monthCommander;
  const hidden = result.hiddenStems?.month || [];
  const hiddenGods = result.tenGods?.hidden?.month || [];
  return {
    ...commander || {},
    hiddenStems: hidden.map((item, index) => ({
      ...item,
      element: stemElement(item.stem),
      tenGod: hiddenGods[index]?.tenGod || null
    })),
    monthPillar: result.pillars.month,
    previousJie: result.calendar.solarTerms.prevJie || null,
    evidence: {
      ...commander?.evidence || {},
      monthPillar: result.pillars.month.ganzhi,
      previousJie: result.calendar.solarTerms.prevJie || null,
      hiddenStems: hidden
    }
  };
}
function buildVoids(result) {
  const byDay = result.kongWang.byDay;
  const byYear = result.kongWang.byYear;
  return {
    method: "six-jia-xun-kong",
    ruleId: "AUX_KONGWANG_SIX_XUN_001",
    version: "1.0.0",
    tradition: "classical-ziping",
    conceptType: "auxiliary",
    ruleFamily: "xun-kong",
    baseOn: ["dayPillar.sexagenaryIndex", "yearPillar.sexagenaryIndex"],
    scope: "day-and-year-pillar",
    category: "void-branch",
    confidence: "classical-derived",
    byDay,
    byYear,
    rows: [
      { id: "day", label: "\u65E5\u7A7A", sourcePillar: result.pillars.day.ganzhi, ...byDay },
      { id: "year", label: "\u5E74\u7A7A", sourcePillar: result.pillars.year.ganzhi, ...byYear }
    ],
    references: REFERENCES4.filter((item) => item.locator.includes("\u7A7A\u4EA1")),
    variants: [
      { id: "day-xun", description: "\u4EE5\u65E5\u67F1\u65EC\u7A7A\u4F5C\u4E3B\u8981\u7A7A\u4EA1\u6B04\u4F4D\u3002" },
      { id: "year-xun", description: "\u5E74\u67F1\u65EC\u7A7A\u53E6\u5217\u70BA\u5E74\u7A7A\uFF0C\u50C5\u4F5C\u8CC7\u6599\u5C0D\u7167\u3002" }
    ],
    researchNotes: {
      conflict: false,
      note: "\u65EC\u7A7A\u7B97\u6CD5\u53EF\u7531\u516D\u5341\u7532\u5B50\u7D22\u5F15\u91CD\u73FE\uFF1B\u5409\u51F6\u89E3\u91CB\u4E0D\u5728\u6B64\u8CC7\u6599\u5C64\u6C7A\u5B9A\u3002"
    },
    evidence: {
      matched: true,
      dayPillar: result.pillars.day.ganzhi,
      yearPillar: result.pillars.year.ganzhi,
      dayVoid: byDay.branches,
      yearVoid: byYear.branches,
      hitMatrix: { day: byDay.hits, year: byYear.hits }
    }
  };
}
function buildAuxiliary(result) {
  const values = result.auxiliary || {};
  const palaceRows = [
    palaceRecord("taiYuan", "\u80CE\u5143", "AUX_TAIYUAN_001", values.taiYuan, ["monthPillar.stem", "monthPillar.branch"], "\u6708\u5E72\u9032\u4E00\u4F4D\u3001\u6708\u652F\u9032\u4E09\u4F4D\u3002"),
    palaceRecord("taiXi", "\u80CE\u606F", "AUX_TAIXI_002", values.taiXi, ["dayPillar.stem", "dayPillar.branch"], "\u65E5\u5E72\u53D6\u4E94\u5408\u3001\u65E5\u652F\u53D6\u516D\u5408\u3002"),
    palaceRecord("mingGong", "\u547D\u5BAE", "AUX_MINGGONG_003", values.mingGong, ["monthPillar.branch", "hourPillar.branch", "yearPillar.stem"], "\u547D\u5BAE\u503C\u4EE5\u6708\u6578\u8207\u6642\u6578\u7684\u638C\u8A23\u516C\u5F0F\u8A08\u7B97\uFF0C\u5929\u5E72\u7528\u4E94\u864E\u9041\u3002"),
    palaceRecord("shenGong", "\u8EAB\u5BAE", "AUX_SHENGONG_004", values.shenGong, ["monthPillar.branch", "hourPillar.branch", "yearPillar.stem"], "\u8EAB\u5BAE\u503C\u4EE5\u6708\u6578\u8207\u6642\u6578\u7684\u638C\u8A23\u516C\u5F0F\u8A08\u7B97\uFF0C\u5929\u5E72\u7528\u4E94\u864E\u9041\u3002")
  ];
  const matrix = palaceRows.map((row) => ({
    id: row.id,
    label: row.label,
    ganzhi: row.value?.ganzhi || null,
    stem: row.value?.stem || null,
    stemElement: stemElement(row.value?.stem),
    branch: row.value?.branch || null,
    branchElement: branchElement(row.value?.branch),
    nayin: row.value?.nayin || null,
    ruleId: row.ruleId
  }));
  return {
    method: "auxiliary-palace-and-embryo",
    ruleId: "AUX_CLASSICAL_AUXILIARY_001",
    version: "1.1.0",
    tradition: "classical-ziping-compatible",
    conceptType: "auxiliary",
    ruleFamily: "palace-and-embryo",
    baseOn: ["monthPillar", "dayPillar", "hourPillar", "yearPillar.stem"],
    scope: "whole-chart-auxiliary",
    category: "auxiliary",
    confidence: "school-specific",
    palaceRows,
    matrix,
    mingGua: values.mingGua || null,
    elementDistribution: result.strength.distribution,
    seasonalStates: result.strength.seasonalStates,
    references: REFERENCES4.filter((item) => item.sourceId === "san-ming-tong-hui"),
    variants: [
      { id: "ming-shen-palace", description: "\u547D\u5BAE\u3001\u8EAB\u5BAE\u5B58\u5728\u4E2D\u6C23\u904E\u5BAE\u3001\u6708\u5EFA\u8207\u5B50\u6642\u908A\u754C\u5DEE\u7570\u3002" },
      { id: "tai-xi", description: "\u80CE\u606F\u5E38\u898B\u4EE5\u65E5\u5E72\u652F\u5929\u5730\u5408\u63A8\u7B97\uFF0C\u4F46\u50B3\u672C\u5C0D\u80CE\u606F\u6709\u4E0D\u540C\u53D6\u6CD5\u3002" },
      { id: "ming-gua-separate", description: "\u547D\u5366\u5C6C\u516B\u5B85\u8F14\u52A9\u6CD5\uFF0C\u4E0D\u80FD\u7576\u4F5C\u5B50\u5E73\u6838\u5FC3\u5BAE\u4F4D\u3002" }
    ],
    researchNotes: {
      conflict: true,
      note: "\u77E9\u9663\u96C6\u4E2D\u5448\u73FE\u5DF2\u5BE6\u4F5C\u6B04\u4F4D\uFF1B\u4E0D\u628A\u8F14\u52A9\u5BAE\u4F4D\u76F4\u63A5\u8F49\u6210\u6027\u683C\u3001\u91AB\u7642\u6216\u8CA1\u52D9\u65B7\u8A9E\u3002"
    },
    evidence: {
      matched: true,
      palaceRows: matrix,
      hourAvailable: Boolean(result.pillars.hour.available),
      unknownHourHandling: result.pillars.hour.available ? null : "\u547D\u5BAE\u3001\u8EAB\u5BAE\u4FDD\u7559 null\uFF0C\u4E0D\u731C\u7B97\u3002"
    }
  };
}
function buildClassicalSummary(result) {
  return {
    modelId: CLASSICAL_SUMMARY_METHOD,
    version: CLASSICAL_SUMMARY_VERSION,
    confidence: "traceable-derived",
    tradition: "classical-ziping-compatible",
    conceptType: "summary",
    ruleFamily: "classical-summary",
    baseOn: ["strength.fiveCategory", "strength.monthCommander", "kongWang", "auxiliary"],
    scope: "whole-chart",
    category: "data-summary",
    ruleId: CLASSICAL_SUMMARY_RULE_ID,
    method: CLASSICAL_SUMMARY_METHOD,
    sections: ["fiveCategory", "monthCommand", "voids", "auxiliary"],
    references: REFERENCES4,
    description: "\u628A\u6276\u6291\u4E94\u5206\u985E\u3001\u6708\u4EE4\u4EBA\u5143\u53F8\u4EE4\u3001\u65E5\u7A7A\u5E74\u7A7A\u8207\u8F14\u52A9\u5BAE\u4F4D\u6574\u7406\u6210\u53EF\u9A57\u8B49\u7684\u8CC7\u6599\u6458\u8981\uFF1B\u4E0D\u65B0\u589E\u672A\u7D93\u8B49\u5BE6\u7684\u65B7\u8A9E\u3002",
    fiveCategory: buildFiveCategory(result),
    monthCommand: buildMonthCommand(result),
    voids: buildVoids(result),
    auxiliary: buildAuxiliary(result),
    variants: [
      { id: "school-profile", description: "\u4E0D\u540C Profile \u53EF\u66FF\u63DB\u6708\u4EE4\u5206\u65E5\u3001\u7528\u795E\u8207\u5BAE\u4F4D\u7B97\u6CD5\uFF1B\u672C\u6458\u8981\u8A18\u9304\u672C\u6B21\u5BE6\u969B\u63A1\u7528\u7D50\u679C\u3002" }
    ],
    researchNotes: {
      conflict: true,
      note: "\u7D93\u5178\u4F86\u6E90\u652F\u6301\u540D\u76EE\u8207\u5224\u5B9A\u7BC4\u570D\uFF0C\u4F46\u4E0D\u4EE3\u8868\u4E94\u5206\u985E\u3001\u5206\u65E5\u8868\u8207\u5BAE\u4F4D\u516C\u5F0F\u8DE8\u6D41\u6D3E\u552F\u4E00\u3002"
    },
    evidence: {
      matched: true,
      chartPillars: Object.fromEntries(Object.entries(result.pillars).map(([key, value]) => [key, value.ganzhi])),
      sectionEvidence: {
        fiveCategory: Boolean(result.strength.fiveCategory),
        monthCommand: Boolean(result.strength.monthCommander),
        voids: Boolean(result.kongWang),
        auxiliary: Boolean(result.auxiliary)
      }
    }
  };
}

// src/patterns/index.js
var patterns_exports = {};
__export(patterns_exports, {
  REGULAR_PATTERN_REGISTRY: () => REGULAR_PATTERN_REGISTRY,
  SPECIAL_PATTERN_REGISTRY: () => SPECIAL_PATTERN_REGISTRY,
  calculatePatterns: () => calculatePatterns,
  calculateRegularPatterns: () => calculateRegularPatterns,
  getSpecialPattern: () => getSpecialPattern,
  listResearchPatterns: () => listResearchPatterns,
  validateRegularPatternRegistry: () => validateRegularPatternRegistry,
  validateSpecialPatternRegistry: () => validateSpecialPatternRegistry
});

// src/patterns/registry.js
var CLASSICAL_ZIPING4 = "classical-ziping";
var refs3 = (...references) => references.map(([title, locator, url, note]) => ({
  type: "classical",
  title,
  locator,
  url,
  ...note ? { note } : {}
}));
var researchPattern = (definition) => ({
  aliases: [],
  tradition: CLASSICAL_ZIPING4,
  conceptType: "pattern",
  patternType: "special",
  legacyConceptType: "special-pattern",
  ruleFamily: "whole-chart-pattern",
  scope: "natal",
  category: "neutral",
  confidence: "classical",
  tier: "research",
  priority: 100,
  version: "0.1.0",
  tags: ["pattern", "research-only"],
  schools: ["classical-ziping"],
  implemented: false,
  status: "research-only",
  match: null,
  evidence: () => ({ matched: false, status: "research-only", reason: "\u5C1A\u672A\u5BE6\u4F5C\uFF1B\u6B64\u9805\u53EA\u63D0\u4F9B\u53E4\u5178\u689D\u4EF6\u67B6\u69CB\u3002" }),
  ...definition
});
var SPECIAL_PATTERN_REGISTRY = Object.freeze([
  researchPattern({
    id: "ren_qi_long_bei",
    name: "\u58EC\u9A0E\u9F8D\u80CC",
    displayName: "\u58EC\u9A0E\u9F8D\u80CC",
    aliases: ["\u58EC\u9A0E\u9F8D\u80CC\u683C"],
    baseOn: ["dayPillar", "monthBranch", "wholeChart"],
    ruleId: "PT_RENQILONG_001",
    references: refs3(["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D", "\u58EC\u9A0E\u9F8D\u80CC", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"]),
    description: "\u4EE5\u58EC\u65E5\u5750\u8FB0\u70BA\u6838\u5FC3\uFF0C\u9808\u8003\u5BDF\u8FB0\u591A\u3001\u5BC5\u5B57\u5408\u4F4F\u53CA\u8CA1\u5B98\u5370\u7B49\u5168\u5C40\u689D\u4EF6\uFF1B\u539F\u6587\u53E6\u6709\u58EC\u65E5\u5750\u5BC5\u3001\u8FB0\u591A\u7684\u8B8A\u4F8B\u3002",
    variants: [{ id: "ren-day-chen-core", description: "\u58EC\u8FB0\u65E5\u70BA\u6838\u5FC3\uFF0C\u8FB0\u591A\u5247\u8CB4\u3002" }, { id: "ren-day-yin-variant", description: "\u58EC\u5BC5\u65E5\u3001\u8FB0\u591A\u70BA\u8B8A\u4F8B\u3002" }],
    researchNotes: { note: "\u4E0D\u80FD\u7531\u55AE\u4E00 dayPillar \u5224\u5B9A\uFF1B\u9700\u5EFA\u7ACB\u5168\u5C40\u8FB0\u5BC5\u3001\u900F\u5E72\u53CA\u8CA1\u5B98\u53D6\u7528 evidence\u3002" }
  }),
  researchPattern({
    id: "liu_yin_chao_yang",
    name: "\u516D\u9670\u671D\u967D",
    displayName: "\u516D\u9670\u671D\u967D",
    aliases: ["\u516D\u9670\u671D\u967D\u683C"],
    baseOn: ["dayStem", "hourPillar", "wholeChart"],
    ruleId: "PT_LIUYIN_002",
    references: refs3(["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D", "\u516D\u9670\u671D\u967D", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"]),
    description: "\u8F9B\u65E5\u9022\u620A\u5B50\u6642\u7684\u7279\u6B8A\u683C\u67B6\u69CB\uFF0C\u9084\u8981\u6AA2\u67E5\u5B50\u6578\u3001\u5348\u4E11\u7B49\u7834\u683C\u689D\u4EF6\u53CA\u5168\u5C40\u5B98\u6BBA\u8CA1\u5370\u3002",
    variants: [{ id: "six-xin-days", description: "\u8F9B\u65E5\u9047\u620A\u5B50\u6642\uFF1B\u300C\u516D\u9670\u300D\u6307\u516D\u500B\u8F9B\u65E5\u3002" }],
    researchNotes: { note: "\u6642\u67F1\u3001\u65E5\u5E72\u8207\u5168\u5C40\u7834\u683C\u689D\u4EF6\u7F3A\u4E00\u4E0D\u53EF\uFF0C\u4E0D\u5217\u5165 SpecialPillar\u3002" }
  }),
  researchPattern({
    id: "liu_yi_shu_gui",
    name: "\u516D\u4E59\u9F20\u8CB4",
    displayName: "\u516D\u4E59\u9F20\u8CB4",
    aliases: ["\u516D\u4E59\u9F20\u8CB4\u683C"],
    baseOn: ["dayStem", "hourPillar", "wholeChart"],
    ruleId: "PT_LIUYI_003",
    references: refs3(["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D", "\u516D\u4E59\u9F20\u8CB4", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"]),
    description: "\u4E59\u65E5\u9022\u4E19\u5B50\u6642\u7684\u67B6\u69CB\uFF0C\u9808\u8FA8\u516D\u4E59\u65E5\u3001\u5B50\u4E2D\u7678\u6C34\u53CA\u5B98\u661F\u900F\u85CF\u3001\u5211\u6C96\u7834\u5BB3\u7B49\u5168\u5C40\u689D\u4EF6\u3002",
    variants: [{ id: "yi-day-bing-zi-hour", description: "\u516D\u4E59\u65E5\u9022\u4E19\u5B50\u6642\u3002" }],
    researchNotes: { note: "\u300C\u9F20\u8CB4\u300D\u662F\u501F\u6642\u652F\u5B50\u4E2D\u7678\u6C34\u53D6\u8CB4\u7684\u683C\u5C40\u8A9E\u8A00\uFF0C\u4E0D\u662F\u4E00\u822C\u67E5\u652F\u795E\u715E\u3002" }
  }),
  researchPattern({
    id: "ri_lu_gui_shi",
    name: "\u65E5\u797F\u6B78\u6642",
    displayName: "\u65E5\u797F\u6B78\u6642",
    aliases: ["\u65E5\u797F\u6B78\u6642\u683C"],
    baseOn: ["dayStem", "hourPillar", "wholeChart"],
    ruleId: "PT_RILUGUI_004",
    references: refs3(["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D", "\u65E5\u797F\u6B78\u6642", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"]),
    description: "\u65E5\u5E72\u4E4B\u797F\u843D\u5728\u6642\u652F\u7684\u67B6\u69CB\uFF0C\u9808\u6AA2\u67E5\u5B98\u6BBA\u3001\u50B7\u5B98\u3001\u885D\u7834\u53CA\u6708\u4EE4\u6276\u6291\uFF0C\u4E0D\u80FD\u53EA\u4EE5\u65E5\u5E72\u67E5\u4E00\u500B\u6642\u652F\u5C31\u5BA3\u544A\u6210\u683C\u3002",
    variants: [{ id: "stem-lu-to-hour", description: "\u7532\u5BC5\u3001\u4E59\u536F\u3001\u4E19\u620A\u5DF3\u3001\u4E01\u5DF1\u5348\u3001\u5E9A\u7533\u3001\u8F9B\u9149\u3001\u58EC\u4EA5\u3001\u7678\u5B50\u7B49\u65E5\u797F\u6B78\u6642\u95DC\u4FC2\u3002" }],
    researchNotes: { note: "\u65E5\u797F\u6B78\u6642\u96D6\u6709\u56FA\u5B9A\u5E72\u652F\u5C0D\u61C9\uFF0C\u6210\u683C\u4ECD\u662F\u5168\u5C40\u5224\u5B9A\u3002" }
  }),
  researchPattern({
    id: "gong_lu",
    name: "\u62F1\u797F",
    displayName: "\u62F1\u797F",
    aliases: ["\u62F1\u797F\u683C"],
    baseOn: ["dayPillar", "hourPillar", "wholeChart"],
    ruleId: "PT_GONGLU_005",
    references: refs3(["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D", "\u62F1\u797F", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"]),
    description: "\u65E5\u6642\u5169\u67F1\u593E\u62F1\u797F\u4F4D\u7684\u865B\u795E\u67B6\u69CB\uFF0C\u9808\u5169\u67F1\u5E72\u540C\u3001\u5730\u652F\u76F8\u9694\u3001\u7121\u586B\u5BE6\u53CA\u6C96\u7834\uFF0C\u4E26\u8003\u5BDF\u6708\u4EE4\u5168\u5C40\u3002",
    variants: [{ id: "virtual-lu", description: "\u4EE5\u65E5\u6642\u593E\u51FA\u672A\u73FE\u4E4B\u797F\u652F\uFF1B\u865B\u795E\u4E0D\u53EF\u88AB\u586B\u5BE6\u6216\u7834\u58DE\u3002" }],
    researchNotes: { note: "\u62F1\u5B57\u672C\u8EAB\u8868\u793A\u865B\u795E\u63A8\u53D6\uFF0C\u4E0D\u80FD\u7528\u4E00\u822C\u795E\u715E\u7684\u55AE\u652F\u547D\u4E2D\u6A21\u578B\u5BE6\u4F5C\u3002" }
  }),
  researchPattern({
    id: "gong_gui",
    name: "\u62F1\u8CB4",
    displayName: "\u62F1\u8CB4",
    aliases: ["\u62F1\u8CB4\u683C"],
    baseOn: ["dayPillar", "hourPillar", "wholeChart"],
    ruleId: "PT_GONGGUI_006",
    references: refs3(["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D", "\u62F1\u8CB4", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"]),
    description: "\u65E5\u6642\u593E\u62F1\u5929\u4E59\u8CB4\u4EBA\u7B49\u8CB4\u795E\u7684\u865B\u795E\u67B6\u69CB\uFF0C\u9700\u8FA8\u65E5\u5E72\u8CB4\u4EBA\u3001\u76F8\u9130\u5730\u652F\u3001\u586B\u5BE6\u8207\u6C96\u7834\u3002",
    variants: [{ id: "virtual-noble", description: "\u4EE5\u65E5\u6642\u593E\u51FA\u672A\u73FE\u4E4B\u8CB4\u795E\u652F\u3002" }],
    researchNotes: { note: "\u62F1\u8CB4\u8207\u4E00\u822C\u5929\u4E59\u8CB4\u4EBA\u67E5\u6CD5\u4E0D\u540C\uFF1B\u9808\u53E6\u5EFA\u865B\u795E\u8207\u7834\u683C evidence\u3002" }
  }),
  researchPattern({
    id: "fu_de_xiu_qi",
    name: "\u798F\u5FB7\u79C0\u6C23",
    displayName: "\u798F\u5FB7\u79C0\u6C23",
    aliases: ["\u798F\u5FB7\u79C0\u6C23\u683C"],
    baseOn: ["yearPillar", "monthPillar", "dayPillar", "hourPillar", "wholeChart"],
    ruleId: "PT_FUDE_007",
    references: refs3(["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D", "\u798F\u5FB7\u79C0\u6C23", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"]),
    description: "\u4EE5\u5DF3\u9149\u4E11\u91D1\u5C40\u53CA\u65E5\u5E72\u7B49\u7D44\u5408\u53D6\u798F\u5FB7\u79C0\u6C23\uFF0C\u9808\u6574\u5408\u4E09\u5408\u5C40\u3001\u5B63\u7BC0\u3001\u900F\u5E72\u8207\u5211\u6C96\uFF0C\u4E0D\u5B9C\u62C6\u6210\u4E00\u9846\u795E\u715E\u3002",
    variants: [{ id: "si-you-chou-metal", description: "\u5DF3\u9149\u4E11\u4E09\u5408\u91D1\u5C40\u662F\u91CD\u8981\u9AA8\u67B6\uFF0C\u4ECD\u9700\u6309\u539F\u6587\u689D\u4EF6\u7D30\u5206\u3002" }],
    researchNotes: { note: "\u6B64\u9805\u9700\u5148\u5B8C\u6210 whole-chart pattern DSL \u6216\u660E\u78BA\u7684\u5168\u5C40 predicate\uFF0C\u73FE\u968E\u6BB5\u53EA\u5EFA\u7814\u7A76\u767B\u9304\u3002" }
  })
]);
function validateSpecialPatternRegistry(registry = SPECIAL_PATTERN_REGISTRY) {
  const errors = [];
  const ids = /* @__PURE__ */ new Set();
  const ruleIds = /* @__PURE__ */ new Set();
  for (const rule3 of registry) {
    if (!rule3.id || ids.has(rule3.id)) errors.push(`duplicate id: ${rule3.id || "(empty)"}`);
    ids.add(rule3.id);
    if (!rule3.ruleId || ruleIds.has(rule3.ruleId)) errors.push(`duplicate ruleId: ${rule3.ruleId || "(empty)"}`);
    ruleIds.add(rule3.ruleId);
    for (const field of ["name", "tradition", "conceptType", "patternType", "ruleFamily", "scope", "category", "confidence", "version", "description"]) {
      if (!rule3[field]) errors.push(`${rule3.id}: ${field} is required`);
    }
    if (!Array.isArray(rule3.baseOn) || rule3.baseOn.length === 0) errors.push(`${rule3.id}: baseOn is required`);
    if (rule3.implemented && typeof rule3.match !== "function") errors.push(`${rule3.id}: implemented patterns require match`);
    if (typeof rule3.evidence !== "function") errors.push(`${rule3.id}: evidence must be a function`);
    if (!Array.isArray(rule3.references) || rule3.references.length === 0) errors.push(`${rule3.id}: references is required`);
  }
  return { valid: errors.length === 0, errors, count: registry.length };
}
var validation3 = validateSpecialPatternRegistry();
if (!validation3.valid) throw new Error(`Special pattern registry invalid: ${validation3.errors.join("; ")}`);

// src/patterns/regular.js
var CLASSICAL_ZIPING5 = "classical-ziping";
var REGULAR_PATTERN_VERSION = REGULAR_PATTERN_RULE_VERSION;
var LU_BRANCH_BY_STEM = Object.freeze({
  \u7532: "\u5BC5",
  \u4E59: "\u536F",
  \u4E19: "\u5DF3",
  \u4E01: "\u5348",
  \u620A: "\u5DF3",
  \u5DF1: "\u5348",
  \u5E9A: "\u7533",
  \u8F9B: "\u9149",
  \u58EC: "\u4EA5",
  \u7678: "\u5B50"
});
var YANG_REN_BRANCH_BY_STEM = Object.freeze({
  \u7532: "\u536F",
  \u4E59: "\u8FB0",
  \u4E19: "\u5348",
  \u4E01: "\u672A",
  \u620A: "\u5348",
  \u5DF1: "\u672A",
  \u5E9A: "\u9149",
  \u8F9B: "\u620C",
  \u58EC: "\u5B50",
  \u7678: "\u4E11"
});
var refs4 = (...references) => references.map(([title, locator, url, note]) => ({
  type: "classical",
  title,
  locator,
  url,
  ...note ? { note } : {}
}));
var regularPattern = ({ id, name, aliases, ruleId, description, match, baseOn = ["dayMaster", "monthPillar", "monthCommander"], variants = [] }) => ({
  id,
  name,
  displayName: name,
  aliases,
  tradition: CLASSICAL_ZIPING5,
  conceptType: "pattern",
  patternType: "regular",
  legacyConceptType: "special-pattern",
  ruleFamily: "month-commander-pattern",
  baseOn,
  scope: "natal",
  category: "neutral",
  confidence: "classical-variant",
  tier: "candidate",
  priority: 50,
  version: REGULAR_PATTERN_VERSION,
  ruleId,
  references: refs4(
    ["\u300A\u5B50\u5E73\u771F\u8A6E\u300B", "\u6708\u4EE4\u53D6\u683C\u3001\u7528\u795E\u76F8\u95DC\u7BC7\u7AE0", "https://zh.wikisource.org/zh-hant/\u5B50\u5E73\u771F\u8A6E"],
    ["\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D", "\u8AD6\u6B63\u5B98\u3001\u4E03\u6BBA\u3001\u8CA1\u5370\u98DF\u50B7\u53CA\u6708\u4EE4\u53D6\u683C\u76F8\u95DC\u689D\u76EE", "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D"]
  ),
  description,
  variants,
  researchNotes: {
    conflict: true,
    note: "\u672C\u898F\u5247\u53EA\u8FA8\u8B58\u6708\u4EE4\u53F8\u4EE4\uFF0F\u5EFA\u797F\uFF0F\u6708\u5203\u7684\u7D50\u69CB\u5019\u9078\uFF0C\u4E0D\u5BA3\u544A\u5B8C\u6574\u6210\u683C\u3001\u7834\u683C\u6216\u53D6\u7528\uFF1B\u900F\u5E72\u3001\u6703\u5C40\u3001\u5211\u6C96\u8207\u5168\u5C40\u559C\u5FCC\u4ECD\u9700\u7368\u7ACB\u5224\u5B9A\u3002"
  },
  implemented: true,
  status: "candidate-only",
  match,
  evidence: (context) => {
    const matched = Boolean(match(context));
    return {
      matched,
      status: "candidate-only",
      basedOn: ["dayMaster", "monthPillar", "monthCommander"],
      dayMaster: context.dayMaster,
      monthPillar: context.monthPillar,
      monthCommander: context.monthCommander,
      preliminaryOnly: true,
      reason: matched ? "\u5DF2\u547D\u4E2D\u6708\u4EE4\u7D50\u69CB\u5019\u9078\uFF1B\u5C1A\u672A\u9032\u884C\u900F\u5E72\u3001\u6210\u683C\u3001\u7834\u683C\u8207\u5168\u5C40\u53D6\u7528\u88C1\u6C7A\u3002" : "\u672A\u547D\u4E2D\u672C\u689D\u4EF6\u7684\u6708\u4EE4\u7D50\u69CB\u5019\u9078\u3002"
    };
  }
});
var monthTenGodMatch = (id, name, aliases, ruleId, description) => regularPattern({
  id,
  name,
  aliases,
  ruleId,
  description,
  match: (context) => context.monthCommanderTenGod?.id === id
});
var REGULAR_PATTERN_REGISTRY = Object.freeze([
  monthTenGodMatch("direct_officer", "\u6B63\u5B98\u683C\u5019\u9078", ["\u6B63\u5B98\u683C"], "PT_REGULAR_ZHENGGUAN_001", "\u6708\u4EE4\u4EBA\u5143\u53F8\u4EE4\u5C0D\u65E5\u4E3B\u70BA\u6B63\u5B98\u6642\uFF0C\u8A18\u9304\u6B63\u5B98\u683C\u5019\u9078\u3002"),
  monthTenGodMatch("seven_killings", "\u4E03\u6BBA\u683C\u5019\u9078", ["\u4E03\u6BBA\u683C", "\u504F\u5B98\u683C"], "PT_REGULAR_QISHA_002", "\u6708\u4EE4\u4EBA\u5143\u53F8\u4EE4\u5C0D\u65E5\u4E3B\u70BA\u4E03\u6BBA\u6642\uFF0C\u8A18\u9304\u4E03\u6BBA\u683C\u5019\u9078\u3002"),
  monthTenGodMatch("direct_wealth", "\u6B63\u8CA1\u683C\u5019\u9078", ["\u6B63\u8CA1\u683C"], "PT_REGULAR_ZHENGCAI_003", "\u6708\u4EE4\u4EBA\u5143\u53F8\u4EE4\u5C0D\u65E5\u4E3B\u70BA\u6B63\u8CA1\u6642\uFF0C\u8A18\u9304\u6B63\u8CA1\u683C\u5019\u9078\u3002"),
  monthTenGodMatch("indirect_wealth", "\u504F\u8CA1\u683C\u5019\u9078", ["\u504F\u8CA1\u683C"], "PT_REGULAR_PIANCAI_004", "\u6708\u4EE4\u4EBA\u5143\u53F8\u4EE4\u5C0D\u65E5\u4E3B\u70BA\u504F\u8CA1\u6642\uFF0C\u8A18\u9304\u504F\u8CA1\u683C\u5019\u9078\u3002"),
  monthTenGodMatch("direct_resource", "\u6B63\u5370\u683C\u5019\u9078", ["\u6B63\u5370\u683C"], "PT_REGULAR_ZHENGYIN_005", "\u6708\u4EE4\u4EBA\u5143\u53F8\u4EE4\u5C0D\u65E5\u4E3B\u70BA\u6B63\u5370\u6642\uFF0C\u8A18\u9304\u6B63\u5370\u683C\u5019\u9078\u3002"),
  monthTenGodMatch("indirect_resource", "\u504F\u5370\u683C\u5019\u9078", ["\u504F\u5370\u683C", "\u689F\u795E\u683C"], "PT_REGULAR_PIANYIN_006", "\u6708\u4EE4\u4EBA\u5143\u53F8\u4EE4\u5C0D\u65E5\u4E3B\u70BA\u504F\u5370\u6642\uFF0C\u8A18\u9304\u504F\u5370\u683C\u5019\u9078\u3002"),
  monthTenGodMatch("eating_god", "\u98DF\u795E\u683C\u5019\u9078", ["\u98DF\u795E\u683C"], "PT_REGULAR_SHISHEN_007", "\u6708\u4EE4\u4EBA\u5143\u53F8\u4EE4\u5C0D\u65E5\u4E3B\u70BA\u98DF\u795E\u6642\uFF0C\u8A18\u9304\u98DF\u795E\u683C\u5019\u9078\u3002"),
  monthTenGodMatch("hurting_officer", "\u50B7\u5B98\u683C\u5019\u9078", ["\u50B7\u5B98\u683C"], "PT_REGULAR_SHANGGUAN_008", "\u6708\u4EE4\u4EBA\u5143\u53F8\u4EE4\u5C0D\u65E5\u4E3B\u70BA\u50B7\u5B98\u6642\uFF0C\u8A18\u9304\u50B7\u5B98\u683C\u5019\u9078\u3002"),
  regularPattern({
    id: "built_lu",
    name: "\u5EFA\u797F\u683C\u5019\u9078",
    aliases: ["\u5EFA\u797F\u683C", "\u6708\u797F\u683C"],
    ruleId: "PT_REGULAR_JIANLU_009",
    description: "\u6708\u652F\u70BA\u65E5\u4E3B\u81E8\u5B98\u797F\u4F4D\u6642\uFF0C\u8A18\u9304\u5EFA\u797F\u683C\u5019\u9078\u3002",
    baseOn: ["dayMaster", "monthPillar"],
    match: (context) => LU_BRANCH_BY_STEM[context.dayMaster?.stem] === context.monthPillar?.branch,
    variants: [{ id: "lu-and-month-commander", description: "\u797F\u4F4D\u8207\u6708\u4EE4\u53D6\u683C\u5728\u4E0D\u540C\u50B3\u672C\u7684\u540D\u7A31\u8207\u53D6\u7528\u7BC4\u570D\u53EF\u80FD\u4E0D\u540C\u3002" }]
  }),
  regularPattern({
    id: "month_blade",
    name: "\u6708\u5203\u683C\u5019\u9078",
    aliases: ["\u6708\u5203\u683C", "\u967D\u5203\u683C"],
    ruleId: "PT_REGULAR_YANGREN_010",
    description: "\u6708\u652F\u70BA\u65E5\u4E3B\u967D\u5203\u4F4D\u6642\uFF0C\u8A18\u9304\u6708\u5203\u683C\u5019\u9078\u3002",
    baseOn: ["dayMaster", "monthPillar"],
    match: (context) => YANG_REN_BRANCH_BY_STEM[context.dayMaster?.stem] === context.monthPillar?.branch,
    variants: [{ id: "yang-ren-naming", description: "\u967D\u5203\u3001\u6708\u5203\u7684\u547D\u540D\u8207\u662F\u5426\u7368\u7ACB\u53D6\u683C\uFF0C\u4F9D\u6D41\u6D3E\u6709\u5DEE\u7570\u3002" }]
  })
]);
function calculateRegularPatterns({ pillars, monthCommander = null } = {}) {
  const dayMaster = pillars?.day?.stem ? { stem: pillars.day.stem } : null;
  const monthPillar = pillars?.month ? { stem: pillars.month.stem, branch: pillars.month.branch, ganzhi: pillars.month.ganzhi } : null;
  const commanderStem = monthCommander?.stem || null;
  const monthCommanderTenGod = dayMaster?.stem && commanderStem ? getTenGod(dayMaster.stem, commanderStem) : null;
  const context = { dayMaster, monthPillar, monthCommander, monthCommanderTenGod };
  const candidates = REGULAR_PATTERN_REGISTRY.map((rule3) => {
    const matched = Boolean(rule3.match(context));
    return {
      id: rule3.id,
      name: rule3.name,
      displayName: rule3.displayName,
      aliases: rule3.aliases,
      tradition: rule3.tradition,
      conceptType: rule3.conceptType,
      patternType: rule3.patternType,
      ruleFamily: rule3.ruleFamily,
      baseOn: rule3.baseOn,
      scope: rule3.scope,
      category: rule3.category,
      confidence: rule3.confidence,
      ruleId: rule3.ruleId,
      version: rule3.version,
      references: rule3.references,
      description: rule3.description,
      variants: rule3.variants,
      researchNotes: rule3.researchNotes,
      status: rule3.status,
      preliminary: true,
      matched,
      finalDecision: false,
      evidence: rule3.evidence(context)
    };
  });
  return {
    modelId: "regular-pattern-candidate-engine",
    version: REGULAR_PATTERN_VERSION,
    status: "candidate-only",
    candidates,
    evidence: {
      matched: true,
      candidateCount: candidates.filter((item) => item.matched).length,
      ruleCount: candidates.length,
      dayMaster: dayMaster?.stem || null,
      monthPillar: monthPillar?.ganzhi || null,
      monthCommanderStem: commanderStem,
      monthCommanderTenGod: monthCommanderTenGod?.full || null,
      reason: "\u53EA\u7522\u751F\u6B63\u683C\u7D50\u69CB\u5019\u9078\uFF1B\u6210\u683C\uFF0F\u7834\u683C\u8207\u7279\u6B8A\u683C\u4E0D\u7531\u6B64\u7D50\u679C\u76F4\u63A5\u5BA3\u544A\u3002"
    }
  };
}
function validateRegularPatternRegistry(registry = REGULAR_PATTERN_REGISTRY) {
  const errors = [];
  const ids = /* @__PURE__ */ new Set();
  const ruleIds = /* @__PURE__ */ new Set();
  for (const rule3 of registry) {
    if (!rule3.id || ids.has(rule3.id)) errors.push(`duplicate id: ${rule3.id || "(empty)"}`);
    ids.add(rule3.id);
    if (!rule3.ruleId || ruleIds.has(rule3.ruleId)) errors.push(`duplicate ruleId: ${rule3.ruleId || "(empty)"}`);
    ruleIds.add(rule3.ruleId);
    for (const field of ["name", "tradition", "conceptType", "patternType", "ruleFamily", "scope", "category", "confidence", "ruleId", "version", "description"]) {
      if (!rule3[field]) errors.push(`${rule3.id}: ${field} is required`);
    }
    if (!Array.isArray(rule3.baseOn) || rule3.baseOn.length === 0) errors.push(`${rule3.id}: baseOn is required`);
    if (typeof rule3.match !== "function" || typeof rule3.evidence !== "function") errors.push(`${rule3.id}: match/evidence are required`);
    if (!Array.isArray(rule3.references) || rule3.references.length === 0) errors.push(`${rule3.id}: references is required`);
  }
  return { valid: errors.length === 0, errors, count: registry.length };
}
var validation4 = validateRegularPatternRegistry();
if (!validation4.valid) throw new Error(`Regular pattern registry invalid: ${validation4.errors.join("; ")}`);

// src/patterns/index.js
function getSpecialPattern(id) {
  return (SPECIAL_PATTERN_REGISTRY || []).find((rule3) => rule3.id === id) || null;
}
function listResearchPatterns() {
  return SPECIAL_PATTERN_REGISTRY.map((rule3) => ({
    id: rule3.id,
    name: rule3.name,
    conceptType: rule3.conceptType,
    patternType: rule3.patternType,
    ruleFamily: rule3.ruleFamily,
    implemented: rule3.implemented,
    status: rule3.status,
    references: rule3.references
  }));
}
function calculatePatterns(options = {}) {
  const regular = calculateRegularPatterns(options);
  const special = SPECIAL_PATTERN_REGISTRY.map((rule3) => ({
    id: rule3.id,
    name: rule3.name,
    displayName: rule3.displayName || rule3.name,
    conceptType: rule3.conceptType,
    patternType: rule3.patternType,
    ruleFamily: rule3.ruleFamily,
    baseOn: rule3.baseOn,
    scope: rule3.scope,
    category: rule3.category,
    confidence: rule3.confidence,
    ruleId: rule3.ruleId,
    version: rule3.version,
    references: rule3.references,
    description: rule3.description,
    variants: rule3.variants || [],
    researchNotes: rule3.researchNotes || {},
    status: "research-only",
    preliminary: false,
    matched: false,
    finalDecision: false,
    evidence: rule3.evidence()
  }));
  return {
    modelId: "patterns-candidate-registry",
    version: "0.2.0",
    status: "candidate-and-research",
    regular,
    special,
    candidates: [...regular.candidates, ...special],
    evidence: {
      matched: true,
      regularCandidateCount: regular.evidence.candidateCount,
      specialResearchCount: special.length,
      note: "\u6B63\u683C\u53EA\u8F38\u51FA\u7D50\u69CB\u5019\u9078\uFF1B\u58EC\u9A0E\u9F8D\u80CC\u7B49\u7279\u6B8A\u683C\u4ECD\u7DAD\u6301 research-only\uFF0C\u4E0D\u6DF7\u5165 ShenSha\u3002"
    }
  };
}

// src/validation/index.js
var validation_exports2 = {};
__export(validation_exports2, {
  VALIDATION_MANIFEST_VERSION: () => VALIDATION_MANIFEST_VERSION2,
  getValidationManifest: () => getValidationManifest,
  summarizeValidationDataset: () => summarizeValidationDataset,
  summarizeValidationDatasets: () => summarizeValidationDatasets
});
var VALIDATION_MANIFEST = {
  schemaVersion: "1.0.0",
  manifestId: "bazi-js-validation-manifest",
  manifestVersion: "1.0.0",
  generatedAt: "2026-09-10",
  datasets: [
    {
      datasetId: "bazi-js-independent-boundary-round-03",
      label: "\u7B2C\u4E00\u8F2A\u8DE8\u908A\u754C\u4EA4\u53C9\u9A57\u8B49",
      capturedAt: "2026-09-10",
      fixture: "validation/external/round-03-boundary-samples.json",
      report: "validation/reports/round-03-boundary-cross-validation.md",
      sourceIds: ["openfate-bazi-engine"],
      scope: ["pillars", "solar-term-boundary", "timezone", "zi-hour", "true-solar-time"],
      cases: 34,
      classifications: { match: 28, difference: 6, undetermined: 0 },
      canonicalChangeRequired: 0,
      status: "pinned-observation"
    },
    {
      datasetId: "bazi-js-independent-second-engine-round-04",
      label: "\u7B2C\u4E8C\u7368\u7ACB\u5F15\u64CE\u4EA4\u53C9\u9A57\u8B49",
      capturedAt: "2026-09-10",
      fixture: "validation/external/round-04-second-engine.json",
      report: "validation/reports/round-04-second-engine.md",
      sourceIds: ["baziflow-core"],
      scope: ["pillars", "true-solar-time"],
      cases: 16,
      classifications: { match: 16, difference: 0, undetermined: 0 },
      canonicalChangeRequired: 0,
      status: "pinned-observation"
    },
    {
      datasetId: "bazi-js-public-figure-round-05",
      label: "UTC+08 \u83EF\u4EBA\u516C\u958B\u4EBA\u7269\u547D\u76E4\u4EA4\u53C9\u9A57\u8B49",
      capturedAt: "2026-09-10",
      fixture: "validation/external/round-05-celebrity-cases.json",
      report: "validation/reports/round-05-celebrity-cross-validation.md",
      sourceIds: [
        "deeporacle-gao-xingjian",
        "deeporacle-yao-ming",
        "deeporacle-jackie-chan",
        "deeporacle-yuen-biao",
        "deeporacle-brigitte-lin",
        "nobel-gao-xingjian",
        "fiba-yao-ming",
        "hkfa-jackie-chan",
        "hkfa-yuen-biao",
        "moc-brigitte-lin"
      ],
      scope: ["public-figure-birth-data", "pillars", "utc+08", "unknown-birth-time"],
      cases: 5,
      classifications: { match: 5, difference: 0, undetermined: 0 },
      canonicalChangeRequired: 0,
      status: "pinned-observation"
    }
  ],
  totals: {
    cases: 55,
    classifications: { match: 49, difference: 6, undetermined: 0 },
    sources: 12
  }
};
function clone2(value) {
  return JSON.parse(JSON.stringify(value));
}
function increment(target, key) {
  target[key] = (target[key] || 0) + 1;
}
function getValidationManifest() {
  return clone2(VALIDATION_MANIFEST);
}
function summarizeValidationDataset(dataset) {
  const cases = Array.isArray(dataset?.cases) ? dataset.cases : [];
  const classifications = { match: 0, difference: 0, undetermined: 0 };
  const groups = {};
  const sourceIds = /* @__PURE__ */ new Set();
  let observations = 0;
  for (const item of cases) {
    const classification = item?.adjudication?.classification;
    if (Object.prototype.hasOwnProperty.call(classifications, classification)) increment(classifications, classification);
    increment(groups, item?.group || "ungrouped");
    const observationsForCase = Array.isArray(item?.observations) ? item.observations : item?.externalObservation ? [item.externalObservation] : [];
    for (const observation of observationsForCase) {
      observations++;
      if (observation.sourceId) sourceIds.add(observation.sourceId);
    }
  }
  return {
    datasetId: dataset?.datasetId || null,
    capturedAt: dataset?.capturedAt || null,
    totalCases: cases.length,
    observations,
    classifications,
    groups,
    sourceIds: Array.from(sourceIds).sort()
  };
}
function summarizeValidationDatasets(datasets) {
  const list = Array.isArray(datasets) ? datasets.map(summarizeValidationDataset) : [];
  const total = {
    cases: 0,
    observations: 0,
    classifications: { match: 0, difference: 0, undetermined: 0 },
    groups: {},
    sourceIds: /* @__PURE__ */ new Set()
  };
  for (const item of list) {
    total.cases += item.totalCases;
    total.observations += item.observations;
    for (const key of Object.keys(total.classifications)) total.classifications[key] += item.classifications[key] || 0;
    for (const [group, count] of Object.entries(item.groups)) total.groups[group] = (total.groups[group] || 0) + count;
    item.sourceIds.forEach((sourceId) => total.sourceIds.add(sourceId));
  }
  return {
    datasets: list,
    totalCases: total.cases,
    totalObservations: total.observations,
    classifications: total.classifications,
    groups: total.groups,
    sourceIds: Array.from(total.sourceIds).sort()
  };
}
var VALIDATION_MANIFEST_VERSION2 = VALIDATION_MANIFEST.manifestVersion;

// src/chart/index.js
function formatTimezoneOffset2(offsetHours) {
  const sign = offsetHours < 0 ? "-" : "+";
  const absolute = Math.abs(offsetHours);
  const hours = Math.floor(absolute);
  const minutes = Math.round((absolute - hours) * 60);
  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
function calculate(input, options = {}) {
  validateInput(input);
  const profileId = input.profile || options.profile || "canonical";
  const profile = RuleRegistry.require(profileId);
  const analysisRules = profile.rules.analysis || {};
  const yearBoundary = input.yearBoundary || profile.rules.yearBoundary.value;
  const monthBoundary = input.monthBoundary || profile.rules.monthBoundary.value;
  const dayBoundary = input.dayBoundary || profile.rules.dayBoundary.value;
  const enableTrueSolarTime = input.trueSolarTime !== void 0 ? input.trueSolarTime : profile.rules.trueSolarTime.value;
  const timezone = input.timezone || "+08:00";
  const timezoneOffsetHours = parseTimezoneOffset(timezone);
  const dstRequested = input.dstOffset !== void 0;
  const [inYear, inMonth, inDay] = input.birthDate.split("-").map(Number);
  const birthTimeMode = input.birthTimeMode || (input.birthTime ? "exact" : "unknown");
  let inHour = 12;
  let inMinute = 0;
  if (birthTimeMode === "exact" && input.birthTime) {
    const [h, m] = input.birthTime.split(":").map(Number);
    inHour = h;
    inMinute = m;
  }
  let calcYear = inYear;
  let calcMonth = inMonth;
  let calcDay = inDay;
  let calcHour = inHour;
  let calcMinute = inMinute;
  let trueSolarInfo = null;
  if (enableTrueSolarTime && birthTimeMode === "exact") {
    const longitude = input.location && typeof input.location.longitude === "number" ? input.location.longitude : timezoneOffsetHours * 15;
    trueSolarInfo = calculateTrueSolarTime({
      year: inYear,
      month: inMonth,
      day: inDay,
      hour: inHour,
      minute: inMinute,
      longitude,
      timezoneOffsetHours
    });
    calcYear = trueSolarInfo.trueYear;
    calcMonth = trueSolarInfo.trueMonth;
    calcDay = trueSolarInfo.trueDay;
    calcHour = trueSolarInfo.trueHour;
    calcMinute = trueSolarInfo.trueMinute;
  }
  const lunarInfo = solarToLunar(calcYear, calcMonth, calcDay);
  const currentJD = gregorianToJulianDay(calcYear, calcMonth, calcDay + (calcHour + calcMinute / 60) / 24) - timezoneOffsetHours / 24;
  const surroundingJieInfo = getSurroundingJie(currentJD, timezoneOffsetHours);
  const pillars = calculateFourPillars({
    year: calcYear,
    month: calcMonth,
    day: calcDay,
    hour: calcHour,
    minute: calcMinute,
    birthTimeMode,
    birthHourBranch: input.birthHourBranch,
    timezoneOffsetHours,
    yearBoundary,
    monthBoundary,
    lunarYear: lunarInfo.year,
    lunarMonth: lunarInfo.month,
    dayBoundary
  });
  const tenGods = calculateChartTenGods(pillars);
  const hiddenStems = calculateChartHiddenStems(pillars);
  const nayin = calculateChartNayin(pillars);
  const twelveStages = calculateChartTwelveStages(pillars);
  const kongWang = calculateChartKongWang(pillars);
  const auxiliary = calculateChartAuxiliary(pillars, {
    solarYear: calcYear,
    yearPillar: pillars.year,
    gender: input.gender,
    yearBoundary,
    auxiliaryModel: analysisRules.auxiliary?.value
  });
  const interactions = calculateInteractions(pillars);
  const strength = calculateStrength(pillars, interactions, {
    currentJD,
    prevJie: surroundingJieInfo.prevJie,
    fiveCategoryMethod: profile.rules.strength.categoryMethod,
    monthCommanderModel: analysisRules.monthCommander?.value,
    useGodModel: analysisRules.useGod?.value
  });
  const shenshaPreset = input.shenshaPreset || input.shenShaPreset || options.shenshaPreset || options.shenShaPreset || "classical";
  if (!["minimal", "classical", "full"].includes(shenshaPreset)) {
    throw new BaziRuleError(`\u627E\u4E0D\u5230 ShenSha preset\uFF1A${shenshaPreset}`, "SHENSHA_PRESET_NOT_FOUND", { preset: shenshaPreset });
  }
  const shenSha = calculateShenSha(pillars, { preset: shenshaPreset, gender: input.gender });
  const specialRules = calculateSpecialRules(pillars, { gender: input.gender, input });
  const patterns = calculatePatterns({ pillars, monthCommander: strength.monthCommander });
  const appliedRule = (profileRule, value, overridden = false, ruleId = profileRule.ruleId) => ({
    ...profileRule,
    value,
    ruleId,
    overridden: overridden || value !== profileRule.value
  });
  const luckCycles = calculateLuckCycles({
    pillars,
    gender: input.gender,
    birthDate: input.birthDate,
    birthTime: input.birthTime,
    birthTimeMode,
    birthHourBranch: input.birthHourBranch,
    timingDate: `${calcYear}-${String(calcMonth).padStart(2, "0")}-${String(calcDay).padStart(2, "0")}`,
    timingTime: birthTimeMode === "exact" ? `${String(calcHour).padStart(2, "0")}:${String(calcMinute).padStart(2, "0")}` : void 0,
    timezoneOffsetHours,
    directionRule: profile.rules.luckCycle.directionRule.value,
    startAgeMethod: profile.rules.luckCycle.startAgeMethod.value,
    yearBoundary,
    monthBoundary,
    dayBoundary,
    includeAnnualDetails: options.includeLuckAnnualDetails === true,
    shenshaPreset,
    includeAnnualShenSha: options.includeAnnualLuckShenSha !== false
  });
  const now = /* @__PURE__ */ new Date();
  const currentTransitDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T12:00:00${formatTimezoneOffset2(timezoneOffsetHours)}`;
  const transitDate = options.transitDatetime || currentTransitDate;
  const transits = calculateTransit(pillars, {
    datetime: transitDate,
    yearBoundary,
    monthBoundary,
    dayBoundary
  });
  if (luckCycles && Array.isArray(luckCycles.cycles)) {
    luckCycles.cycles.forEach((cyc, idx) => {
      cyc.shenSha = calculateShenShaOnPillar(pillars, cyc.stem, cyc.branch, `luck-${idx + 1}`, { preset: shenshaPreset, gender: input.gender });
    });
  }
  if (transits && transits.year) {
    const transitShenSha = calculateTransitShenSha(pillars, transits, { preset: shenshaPreset, gender: input.gender });
    transits.shenShaYear = transitShenSha.shenSha;
    transits.shenSha = transitShenSha;
    transits.year.shenSha = transitShenSha.shenSha;
  }
  transits.transitGraph = buildTransitGraph({ pillars, luckCycles, transits });
  const result = {
    meta: {
      ...VERSIONS,
      profileId: profile.id,
      profileName: profile.name,
      profileStatus: profile.status || (profile.id === "canonical" ? "default" : "custom"),
      profileVersion: profile.version,
      shenshaPreset,
      profile: {
        id: profile.id,
        name: profile.name,
        status: profile.status || (profile.id === "canonical" ? "default" : "custom"),
        profileType: profile.profileType || (profile.id === "canonical" ? "reference" : null),
        tradition: profile.tradition || "classical-ziping",
        version: profile.version,
        baseId: profile.baseId || null,
        diff: profile.diff || {},
        rules: profile.rules,
        references: profile.references || ["docs/governance/authority-model.md"],
        validationManifestVersion: VALIDATION_MANIFEST_VERSION2
      }
    },
    input: {
      ...input,
      timezone
    },
    accuracy: {
      timeKnown: birthTimeMode !== "unknown",
      hourPillarAvailable: pillars.hour.available,
      trueSolarTimeUsed: Boolean(enableTrueSolarTime && birthTimeMode === "exact"),
      boundaryRules: {
        year: yearBoundary,
        month: monthBoundary,
        day: dayBoundary
      },
      assumptions: {
        unknownTime: birthTimeMode === "unknown" ? "\u6642\u67F1\u3001\u547D\u5BAE\u3001\u8EAB\u5BAE\u8207\u8D77\u904B\u6642\u523B\u63A1\u4E0D\u53EF\u78BA\u5B9A\u8655\u7406\uFF1B\u8D77\u904B\u65E5\u671F\u4EE5\u6C11\u7528\u4E2D\u5348\u4F5C\u70BA\u8A08\u6642\u5047\u8A2D\u3002" : null,
        branchTime: birthTimeMode === "branch" ? "\u6642\u8FB0\u6A21\u5F0F\u53EA\u78BA\u5B9A\u6642\u652F\uFF1B\u8D77\u904B\u65E5\u671F\u4EE5\u8A72\u6642\u8FB0\u4E2D\u9EDE\u4F30\u7B97\u3002" : null,
        trueSolarTime: enableTrueSolarTime && birthTimeMode === "exact" ? "\u56DB\u67F1\u8207\u8D77\u904B\u8A08\u6642\u4F7F\u7528\u771F\u592A\u967D\u6642\u4FEE\u6B63\u5F8C\u6642\u523B\u3002" : null
      },
      precision: {
        solarTerms: "Meeus low-precision solar longitude; typical boundary uncertainty is approximately \xB110 minutes.",
        lunarCalendar: "1900-2100 encoded lunisolar table.",
        solarTermsModel: {
          modelId: "meeus-solar-longitude-low-precision",
          ruleVersion: VERSIONS.calendarRuleVersion,
          class: "approximate",
          boundaryUncertaintyMinutes: 10,
          externalValidation: "round-03",
          note: "\u7BC0\u6C23\u5206\u9418\u908A\u754C\u61C9\u4FDD\u7559\u524D\u5F8C\u7BC0\u6C23 evidence\uFF1B\u4E0D\u53EF\u8996\u70BA\u79D2\u7D1A\u5929\u6587\u5E74\u66C6\u3002"
        },
        timezone: {
          modelId: "fixed-utc-offset",
          offsetHours: timezoneOffsetHours,
          input: timezone,
          dstSupported: false,
          dstRequested,
          note: dstRequested ? "\u76EE\u524D\u53EA\u4FDD\u5B58\u56FA\u5B9A UTC offset\uFF1B\u672A\u81EA\u52D5\u5957\u7528\u653F\u6CBB\u6642\u5340\u6216\u6B77\u53F2\u590F\u4EE4\u6642\u9593\u3002" : "\u672A\u63D0\u4F9B\u653F\u6CBB\u6642\u5340\u8CC7\u6599\u5EAB\uFF1B\u56FA\u5B9A UTC offset \u53EF\u91CD\u73FE\u3002"
        },
        trueSolarTime: {
          modelId: "longitude-plus-equation-of-time",
          used: Boolean(enableTrueSolarTime && birthTimeMode === "exact"),
          longitude: trueSolarInfo?.corrections ? input.location?.longitude ?? timezoneOffsetHours * 15 : null,
          correctionMinutes: trueSolarInfo?.corrections?.totalCorrectionMinutes ?? 0,
          note: "\u4F9D\u7D93\u5EA6\u5DEE\u8207\u5747\u6642\u5DEE\u4FEE\u6B63\uFF1B\u82E5\u9700\u5176\u4ED6\u5929\u6587\u6A21\u578B\uFF0C\u61C9\u900F\u904E Profile\uFF0F\u7248\u672C\u660E\u78BA\u6307\u5B9A\u3002"
        }
      },
      limitations: [
        ...dstRequested ? [{ id: "historical-dst", status: "unsupported", affects: "civil-time-normalization" }] : [],
        { id: "solar-term-minute-precision", status: "approximate", affects: "jieqi-boundary" }
      ]
    },
    calendar: {
      solar: {
        year: inYear,
        month: inMonth,
        day: inDay,
        time: input.birthTime || null,
        effectiveDate: `${calcYear}-${String(calcMonth).padStart(2, "0")}-${String(calcDay).padStart(2, "0")}`,
        effectiveTime: birthTimeMode === "unknown" ? null : `${String(calcHour).padStart(2, "0")}:${String(calcMinute).padStart(2, "0")}`
      },
      lunar: lunarInfo,
      zodiac: getZodiacAnimal(pillars.year.branch),
      constellation: getWesternConstellation(inMonth, inDay),
      solarTerms: {
        prevJie: surroundingJieInfo.prevJie ? {
          name: surroundingJieInfo.prevJie.name,
          monthBranch: surroundingJieInfo.prevJie.monthBranch,
          local: surroundingJieInfo.prevJie.local
        } : null,
        nextJie: surroundingJieInfo.nextJie ? {
          name: surroundingJieInfo.nextJie.name,
          monthBranch: surroundingJieInfo.nextJie.monthBranch,
          local: surroundingJieInfo.nextJie.local
        } : null
      },
      time: {
        civilTime: input.birthTime || null,
        trueSolarTime: trueSolarInfo ? trueSolarInfo.trueSolarTime : null,
        correctionMinutes: trueSolarInfo ? trueSolarInfo.corrections.totalCorrectionMinutes : 0,
        usedTrueSolarTime: Boolean(enableTrueSolarTime && birthTimeMode === "exact"),
        effectiveDate: `${calcYear}-${String(calcMonth).padStart(2, "0")}-${String(calcDay).padStart(2, "0")}`,
        effectiveTime: birthTimeMode === "unknown" ? null : `${String(calcHour).padStart(2, "0")}:${String(calcMinute).padStart(2, "0")}`
      }
    },
    pillars: {
      year: {
        ganzhi: pillars.year.ganzhi,
        stem: pillars.year.stem,
        branch: pillars.year.branch,
        sexagenaryIndex: pillars.year.sexagenaryIndex
      },
      month: {
        ganzhi: pillars.month.ganzhi,
        stem: pillars.month.stem,
        branch: pillars.month.branch,
        sexagenaryIndex: pillars.month.sexagenaryIndex
      },
      day: {
        ganzhi: pillars.day.ganzhi,
        stem: pillars.day.stem,
        branch: pillars.day.branch,
        sexagenaryIndex: pillars.day.sexagenaryIndex,
        switchedNextDay: pillars.day.switchedNextDay
      },
      hour: pillars.hour.available ? {
        available: true,
        ganzhi: pillars.hour.ganzhi,
        stem: pillars.hour.stem,
        branch: pillars.hour.branch,
        sexagenaryIndex: pillars.hour.sexagenaryIndex
      } : {
        available: false,
        ganzhi: null,
        stem: null,
        branch: null,
        sexagenaryIndex: null
      }
    },
    tenGods,
    hiddenStems,
    nayin,
    twelveStages,
    kongWang,
    auxiliary,
    interactions,
    strength,
    analysis: buildAnalysisResult({ profile, strength, auxiliary, patterns }),
    patterns,
    shenSha,
    specialRules,
    luckCycles,
    transits,
    rules: {
      applied: [
        appliedRule(profile.rules.yearBoundary, yearBoundary, input.yearBoundary !== void 0, `YEAR_BOUNDARY_${yearBoundary.toUpperCase()}`),
        appliedRule(profile.rules.monthBoundary, monthBoundary, input.monthBoundary !== void 0, `MONTH_BOUNDARY_${monthBoundary.toUpperCase()}`),
        appliedRule(profile.rules.dayBoundary, dayBoundary, input.dayBoundary !== void 0, dayBoundary === "00:00" ? "DAY_BOUNDARY_MIDNIGHT_0000" : "DAY_BOUNDARY_ZISHI_2300"),
        profile.rules.luckCycle.directionRule,
        profile.rules.luckCycle.startAgeMethod,
        {
          ruleId: profile.rules.strength.ruleId,
          version: profile.rules.strength.version,
          categoryMethod: profile.rules.strength.categoryMethod
        },
        ...Object.entries(profile.rules.analysis || {}).map(([dimension2, profileRule]) => ({
          ...profileRule,
          domain: "analysis",
          dimension: dimension2,
          value: profileRule.value
        }))
      ]
    },
    debug: options.debug ? pillars.debug : void 0
  };
  result.classicalSummary = buildClassicalSummary(result);
  return result;
}
function calculateSafe(input, options = {}) {
  try {
    const res = calculate(input, options);
    return {
      success: true,
      data: res
    };
  } catch (err) {
    return {
      success: false,
      error: {
        code: err.code || "BAZI_ERROR",
        message: err.message,
        field: err.field || null,
        details: err.details || {}
      }
    };
  }
}
var Chart = class {
  constructor(input, options = {}) {
    this.rawInput = input;
    this.options = options;
    this.result = calculate(input, options);
  }
  getPillars() {
    return this.result.pillars;
  }
  getShenSha() {
    return this.result.shenSha;
  }
  getSpecialRules() {
    return this.result.specialRules;
  }
  getStrength() {
    return this.result.strength;
  }
  getLuckCycles() {
    return this.result.luckCycles;
  }
  getInteractions() {
    return this.result.interactions;
  }
  toAIContext(options) {
    return toContext(this.result, options);
  }
};

// src/reference/index.js
var reference_exports = {};
__export(reference_exports, {
  CANONICAL_RULES: () => CANONICAL_RULES,
  CONCEPTS: () => CONCEPTS,
  RULES: () => RULES,
  SYSTEM_CONCEPTS: () => SYSTEM_CONCEPTS,
  findConcept: () => findConcept,
  getConcept: () => getConcept,
  getCoverage: () => getCoverage,
  getCoverageReport: () => getCoverageReport,
  getRule: () => getRule,
  getRulesFromSource: () => getRulesFromSource,
  getSource: () => getSource,
  getSourcesForRule: () => getSourcesForRule,
  getTaxonomy: () => getTaxonomy,
  getVariants: () => getVariants,
  toContext: () => toContext2,
  validateReferenceIndex: () => validateReferenceIndex
});

// sources/classical-texts.json
var classical_texts_default = {
  schemaVersion: "1.0.0",
  catalogId: "bazi-js-classical-evidence",
  catalogVersion: "2026.09",
  textStatus: "bibliographic-and-rule-evidence-index",
  disclaimer: "\u672C\u76EE\u9304\u63D0\u4F9B\u5377\u6B21\u8207\u5224\u5B9A\u4F9D\u64DA\u7D22\u5F15\uFF0C\u4E0D\u5BA3\u7A31\u5DF2\u5B8C\u6210\u6240\u6709\u50B3\u672C\u7684\u6821\u52D8\u6216\u5168\u6587\u6578\u4F4D\u5316\u3002",
  evidenceLedger: "sources/evidence-ledger.json",
  sources: [
    {
      sourceId: "san-ming-tong-hui",
      title: "\u4E09\u547D\u901A\u6703",
      author: "\u842C\u6C11\u82F1",
      period: "\u660E",
      sourceStatus: "primary",
      sourceType: "classical-text",
      editionNote: "\u4EE5\u53EF\u6838\u5C0D\u7684\u5377\u6B21\u8207\u7BC7\u540D\u4F5C\u70BA\u7D22\u5F15\uFF1B\u7248\u672C\u3001\u6A19\u9EDE\u8207\u5217\u6578\u5DEE\u7570\u53E6\u8A18\u65BC evidenceRecords\u3002",
      locators: ["\u5377\u4E8C\uFF1A\u4EBA\u5143\u53F8\u4E8B\u3001\u80CE\u5143\u3001\u5750\u547D\u5B98", "\u5377\u4E09\uFF1A\u795E\u715E\u8207\u65E5\u4F8B\u3001\u8AD6\u7A7A\u4EA1", "\u5377\u4E94\uFF1A\u5341\u60E1\u5927\u6557\u65E5", "\u5377\u516D\uFF1A\u7279\u6B8A\u683C\u8207\u7279\u6B8A\u65E5\u67F1"],
      references: [
        "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u4E8C",
        "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D",
        "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703_(\u56DB\u5EAB\u5168\u66F8\u672C)/\u537703"
      ]
    },
    {
      sourceId: "yuan-hai-zi-ping",
      title: "\u6DF5\u6D77\u5B50\u5E73",
      author: "\u5F90\u5927\u5347\u50B3\u3001\u5F8C\u4E16\u589E\u8A02\u50B3\u672C",
      period: "\u5B8B\u5143\u4EE5\u964D\u50B3\u672C",
      sourceStatus: "primary",
      sourceType: "classical-text",
      editionNote: "\u66F8\u540D\u8207\u7BC7\u7AE0\u5728\u4E0D\u540C\u50B3\u672C\u6709\u7DE8\u6B21\u5DEE\u7570\uFF1B\u672C\u5C08\u6848\u53EA\u4FDD\u5B58\u53EF\u56DE\u67E5\u7684\u7BC7\u540D\uFF0C\u4E0D\u628A\u5F8C\u4E16\u6458\u8981\u7576\u539F\u6587\u3002",
      locators: ["\u9B41\u7F61", "\u5341\u60E1\u5927\u6557", "\u65E5\u8CB4\u3001\u65E5\u5FB7", "\u516B\u5C08\u3001\u91D1\u795E", "\u5929\u8D66\u3001\u56DB\u5EE2"],
      references: ["https://zh.wikisource.org/zh-hant/\u6DF5\u6D77\u5B50\u5E73"]
    },
    {
      sourceId: "xie-ji-bian-fang-shu",
      title: "\u6B3D\u5B9A\u5354\u7D00\u8FA8\u65B9\u66F8",
      author: "\u6E05\u5EF7\u7E82\u4FEE",
      period: "\u6E05",
      sourceStatus: "primary-reference",
      sourceType: "reference-text",
      editionNote: "\u4F5C\u70BA\u5929\u8D66\u7B49\u64C7\u65E5\u985E\u689D\u76EE\u7684\u4EA4\u53C9\u4F86\u6E90\uFF1B\u5B83\u8207\u5B50\u5E73\u547D\u7406\u7684\u4F7F\u7528\u76EE\u7684\u4E0D\u540C\u3002",
      locators: ["\u5377\u4E94\uFF1A\u5929\u8D66"],
      references: ["https://zh.wikisource.org/wiki/\u6B3D\u5B9A\u5354\u7D00\u8FA8\u65B9\u66F8_(\u56DB\u5EAB\u5168\u66F8\u672C)/\u537705"]
    },
    {
      sourceId: "di-tian-sui-yan-wei",
      title: "\u6EF4\u5929\u9AD3\u95E1\u5FAE",
      author: "\u4EFB\u9435\u6A35\u6CE8",
      period: "\u6E05",
      sourceStatus: "commentary",
      sourceType: "commentary",
      editionNote: "\u4F5C\u70BA\u4EBA\u5143\u53F8\u4EE4\u3001\u6708\u4EE4\u8207\u5168\u5C40\u53D6\u7528\u7684\u7406\u8AD6\u53C3\u8003\uFF0C\u4E0D\u7528\u4F86\u66FF\u4EE3\u56FA\u5B9A\u65E5\u67F1\u539F\u59CB\u689D\u6587\u3002",
      locators: ["\u4EBA\u5143\u53F8\u4EE4", "\u6708\u4EE4\u8207\u5168\u5C40\u53D6\u7528"],
      references: ["https://zh.wikisource.org/zh-hant/\u6EF4\u5929\u9AD3\u95E1\u5FAE", "docs/references/sample1-audit.md"]
    },
    {
      sourceId: "zi-ping-zhen-quan",
      title: "\u5B50\u5E73\u771F\u8A6E",
      author: "\u6C88\u5B5D\u77BB",
      period: "\u6E05",
      sourceStatus: "classical-commentary",
      sourceType: "commentary",
      editionNote: "\u7528\u65BC\u6708\u4EE4\u3001\u683C\u5C40\u6982\u5FF5\u7684\u80CC\u666F\u5C0D\u8B80\uFF1B\u4E0D\u5C07\u683C\u5C40\u689D\u4EF6\u7C21\u5316\u6210\u795E\u715E\u547D\u4E2D\u3002",
      locators: ["\u6708\u4EE4\u53D6\u683C", "\u683C\u5C40\u8207\u7528\u795E"],
      references: ["docs/references/rule-differences.md"]
    },
    {
      sourceId: "gu-jin-tu-shu-ji-cheng",
      title: "\u6B3D\u5B9A\u53E4\u4ECA\u5716\u66F8\u96C6\u6210",
      author: "\u6E05\u5EF7\u7E82\u4FEE",
      period: "\u6E05",
      sourceStatus: "reference-index",
      sourceType: "reference-encyclopedia",
      editionNote: "\u50C5\u4F5C\u73FE\u6709\u795E\u715E\u689D\u76EE\u7684\u66F8\u76EE\u5B9A\u4F4D\uFF1B\u5C1A\u672A\u5C07\u767E\u79D1\u689D\u6587\u9010\u689D\u6821\u52D8\u70BA BaziJS canonical \u898F\u5247\u3002",
      locators: ["\u85DD\u8853\u5178\u7B2C728\u5377"],
      references: ["\u672A\u5EFA\u7ACB\u53EF\u5B9A\u4F4D\u516C\u958B\u9023\u7D50"]
    }
  ],
  evidenceRecords: [
    {
      evidenceId: "EV-SP-KUIGANG-001",
      sourceIds: ["san-ming-tong-hui", "yuan-hai-zi-ping"],
      ruleIds: ["SP_KUIGANG_001"],
      citation: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D\u3008\u9B41\u7F61\u3009\uFF1B\u300A\u6DF5\u6D77\u5B50\u5E73\u300B\u3008\u9B41\u7F61\u3009",
      originalBasis: "\u65E5\u67F1\u70BA\u5E9A\u8FB0\u3001\u58EC\u8FB0\u3001\u620A\u620C\u3001\u5E9A\u620C\u4E4B\u4E00\uFF1B\u6B64\u8A18\u9304\u56FA\u5B9A\u65E5\u67F1\u689D\u4EF6\uFF0C\u4E0D\u7B49\u540C\u5B8C\u6574\u9B41\u7F61\u683C\u6210\u683C\u3002",
      scope: "dayPillar",
      evidenceStatus: "implemented",
      variants: [],
      researchNotes: "\u56FA\u5B9A\u65E5\u67F1\u8207\u6574\u5C40\u6210\u683C\u5206\u96E2\u3002"
    },
    {
      evidenceId: "EV-SP-SHIEDABAI-002",
      sourceIds: ["san-ming-tong-hui", "yuan-hai-zi-ping"],
      ruleIds: ["SP_SHIEDABAI_002"],
      citation: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E94\u3008\u5341\u60E1\u5927\u6557\u65E5\u3009\uFF1B\u300A\u6DF5\u6D77\u5B50\u5E73\u300B\u3008\u5341\u60E1\u5927\u6557\u3009",
      originalBasis: "\u7532\u8FB0\u3001\u4E59\u5DF3\u3001\u4E19\u7533\u3001\u4E01\u4EA5\u3001\u620A\u620C\u3001\u5DF1\u4E11\u3001\u5E9A\u8FB0\u3001\u8F9B\u5DF3\u3001\u58EC\u7533\u3001\u7678\u4EA5\u5341\u65E5\u3002",
      scope: "dayPillar",
      evidenceStatus: "implemented",
      variants: [],
      researchNotes: "\u540D\u7A31\u8207\u5409\u51F6\u89E3\u8B80\u4E0D\u4EE3\u8868\u6574\u5C40\u5FC5\u7136\u51F6\u6557\u3002"
    },
    {
      evidenceId: "EV-SP-RIGUI-003",
      sourceIds: ["san-ming-tong-hui", "yuan-hai-zi-ping"],
      ruleIds: ["SP_RIGUI_003"],
      citation: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D\u3008\u65E5\u8CB4\u3009\uFF1B\u300A\u6DF5\u6D77\u5B50\u5E73\u300B\u3008\u65E5\u8CB4\u3009",
      originalBasis: "\u4E01\u9149\u3001\u4E01\u4EA5\u3001\u7678\u5DF3\u3001\u7678\u536F\u56DB\u65E5\u3002\u665D\u8CB4\u3001\u591C\u8CB4\u5206\u914D\u53E6\u6709\u7248\u672C\u5DEE\u7570\u3002",
      scope: "dayPillar",
      evidenceStatus: "implemented",
      variants: [{ id: "day-night", note: "\u665D\u8CB4/\u591C\u8CB4\u5206\u914D\u9700\u6309\u7248\u672C\u4FDD\u5B58\u3002" }],
      researchNotes: "\u76EE\u524D\u53EA\u8B58\u5225\u65E5\u67F1\uFF0C\u4E0D\u4EE3\u66FF\u5B8C\u6574\u65E5\u8CB4\u683C\u5224\u5B9A\u3002"
    },
    {
      evidenceId: "EV-SP-RIDE-004",
      sourceIds: ["san-ming-tong-hui", "yuan-hai-zi-ping"],
      ruleIds: ["SP_RIDE_004"],
      citation: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D\u3008\u65E5\u5FB7\u3009\uFF1B\u300A\u6DF5\u6D77\u5B50\u5E73\u300B\u3008\u65E5\u5FB7\u3009",
      originalBasis: "\u7532\u5BC5\u3001\u4E19\u8FB0\u3001\u620A\u8FB0\u3001\u5E9A\u8FB0\u3001\u58EC\u620C\u4E94\u65E5\u3002",
      scope: "dayPillar",
      evidenceStatus: "implemented",
      variants: [],
      researchNotes: "\u5B8C\u6574\u65E5\u5FB7\u683C\u4ECD\u9808\u6574\u5C40\u8003\u5BDF\u3002"
    },
    {
      evidenceId: "EV-SP-BAZHUAN-005",
      sourceIds: ["san-ming-tong-hui", "yuan-hai-zi-ping"],
      ruleIds: ["SP_BAZHUAN_005"],
      citation: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D\u3008\u516B\u5C08\u797F\u65FA\u3009\uFF1B\u300A\u6DF5\u6D77\u5B50\u5E73\u300B\u3008\u516B\u5C08\u3009",
      originalBasis: "\u7532\u5BC5\u3001\u4E59\u536F\u3001\u5DF1\u672A\u3001\u4E01\u672A\u3001\u5E9A\u7533\u3001\u8F9B\u9149\u3001\u620A\u620C\u3001\u7678\u4E11\u516B\u65E5\u3002",
      scope: "dayPillar",
      evidenceStatus: "implemented",
      variants: [{ id: "four-day-core", note: "\u90E8\u5206\u50B3\u672C\u6216\u8A3B\u5BB6\u53EA\u53D6\u7532\u5BC5\u3001\u4E59\u536F\u3001\u5E9A\u7533\u3001\u8F9B\u9149\u56DB\u65E5\u3002" }],
      researchNotes: "\u56DB\u65E5\u6838\u5FC3\u8207\u516B\u65E5\u64F4\u5C55\u4E0D\u53EF\u8996\u70BA\u6C92\u6709\u5DEE\u7570\u3002"
    },
    {
      evidenceId: "EV-SP-JIUCHOU-006",
      sourceIds: ["san-ming-tong-hui"],
      ruleIds: ["SP_JIUCHOU_006"],
      citation: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09\u3008\u4E5D\u919C\u65E5\u3009",
      originalBasis: "\u620A\u5B50\u3001\u620A\u5348\u3001\u5DF1\u536F\u3001\u5DF1\u9149\u3001\u8F9B\u536F\u3001\u8F9B\u9149\u3001\u58EC\u5B50\u3001\u58EC\u5348\u3001\u4E01\u9149\u3001\u4E59\u536F\u5341\u65E5\u3002",
      scope: "dayPillar",
      evidenceStatus: "implemented",
      variants: [{ id: "later-nine-day-list", note: "\u5F8C\u4E16\u5E38\u898B\u4E5D\u65E5\u8868\u6709\u522A\u6E1B\u6216\u6539\u5217\u3002" }],
      researchNotes: "\u4E5D\u919C\u4E4B\u540D\u8207\u539F\u6587\u5341\u65E5\u5217\u6CD5\u6709\u6578\u76EE\u885D\u7A81\uFF0C\u9810\u8A2D\u63A1\u53EF\u56DE\u67E5\u7684\u5377\u4E09\u5217\u6CD5\u3002"
    },
    {
      evidenceId: "EV-SP-GULUAN-007",
      sourceIds: ["san-ming-tong-hui"],
      ruleIds: ["SP_GULUAN_007"],
      citation: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09\u3008\u5B64\u9E1E\u715E\u3009\u3001\u5377\u516D\u3008\u5B64\u9E1E\u3009",
      originalBasis: "\u4E59\u5DF3\u3001\u4E01\u5DF3\u3001\u8F9B\u4EA5\u3001\u620A\u7533\u3001\u7532\u5BC5\u3001\u4E19\u5348\u3001\u620A\u5348\u3001\u58EC\u5B50\u516B\u65E5\u3002",
      scope: "dayPillar",
      evidenceStatus: "implemented",
      variants: [{ id: "legacy-conservative-five", note: "\u820A BaziJS vNext \u66FE\u63A1\u4E94\u67F1\u3002" }],
      researchNotes: "\u672C\u7248\u9810\u8A2D\u539F\u5178\u516B\u65E5\uFF0C\u4FDD\u7559\u820A\u7248\u4E94\u67F1\u5DEE\u7570\u3002"
    },
    {
      evidenceId: "EV-SP-YYCC-008",
      sourceIds: ["san-ming-tong-hui", "yuan-hai-zi-ping"],
      ruleIds: ["SP_YYCC_008"],
      citation: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09\u3008\u9670\u967D\u5DEE\u932F\u3009\uFF1B\u300A\u6DF5\u6D77\u5B50\u5E73\u300B\u3008\u9670\u967D\u5DEE\u932F\u3009",
      originalBasis: "\u4E19\u5B50\u3001\u4E01\u4E11\u3001\u620A\u5BC5\u3001\u8F9B\u536F\u3001\u58EC\u8FB0\u3001\u7678\u5DF3\u3001\u4E19\u5348\u3001\u4E01\u672A\u3001\u620A\u7533\u3001\u8F9B\u9149\u3001\u58EC\u620C\u3001\u7678\u4EA5\u5341\u4E8C\u65E5\u3002",
      scope: "dayPillar",
      evidenceStatus: "implemented",
      variants: [],
      researchNotes: "\u56FA\u5B9A\u65E5\u67F1\u8B58\u5225\uFF0C\u4E0D\u76F4\u63A5\u8F38\u51FA\u5A5A\u59FB\u7D50\u8AD6\u3002"
    },
    {
      evidenceId: "EV-SP-JINSHEN-009",
      sourceIds: ["yuan-hai-zi-ping", "san-ming-tong-hui"],
      ruleIds: ["SP_JINSHEN_009"],
      citation: "\u300A\u6DF5\u6D77\u5B50\u5E73\u300B\u3008\u91D1\u795E\u3009\uFF1B\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D\u3008\u91D1\u795E\u3009",
      originalBasis: "\u6642\u67F1\u70BA\u7678\u9149\u3001\u5DF1\u5DF3\u3001\u4E59\u4E11\u4E4B\u4E00\uFF1B\u706B\u5236\u3001\u6708\u4EE4\u8207\u5168\u5C40\u53D6\u7528\u53E6\u884C\u5224\u65B7\u3002",
      scope: "hourPillar",
      evidenceStatus: "implemented",
      variants: [],
      researchNotes: "\u91D1\u795E\u6642\u8B58\u5225\u8207\u5B8C\u6574\u91D1\u795E\u683C\u53D6\u7528\u5206\u96E2\u3002"
    },
    {
      evidenceId: "EV-SE-TIANSHE-001",
      sourceIds: ["yuan-hai-zi-ping", "xie-ji-bian-fang-shu"],
      ruleIds: ["SE_TIANSHE_001"],
      citation: "\u300A\u6DF5\u6D77\u5B50\u5E73\u300B\u3008\u5929\u8D66\u3009\uFF1B\u300A\u6B3D\u5B9A\u5354\u7D00\u8FA8\u65B9\u66F8\u300B\u5377\u4E94\u3008\u5929\u8D66\u3009",
      originalBasis: "\u6625\u620A\u5BC5\u3001\u590F\u7532\u5348\u3001\u79CB\u620A\u7533\u3001\u51AC\u7532\u5B50\uFF1B\u5B63\u7BC0\u4F9D\u7BC0\u4EE4\u6708\u652F\uFF0C\u4E0D\u4F9D\u570B\u66C6\u6708\u4EFD\u786C\u5207\u3002",
      scope: "season + dayPillar",
      evidenceStatus: "implemented",
      variants: [{ id: "calendar-variants", note: "\u5176\u4ED6\u66C6\u66F8\u65E5\u4F8B\u6216\u5B63\u7BC0\u754C\u7DDA\u53EF\u80FD\u6709\u7570\u6587\u3002" }],
      researchNotes: "evidence \u5FC5\u9808\u4FDD\u7559 season\u3001seasonSource\u3001monthBranch\u3002"
    },
    {
      evidenceId: "EV-SE-SIFEI-002",
      sourceIds: ["san-ming-tong-hui", "yuan-hai-zi-ping"],
      ruleIds: ["SE_SIFEI_002"],
      citation: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D\u3008\u56DB\u5EE2\u65E5\u4F8B\u3009\uFF1B\u300A\u6DF5\u6D77\u5B50\u5E73\u300B\u3008\u56DB\u5EE2\u3009",
      originalBasis: "\u6625\u5E9A\u7533\u8F9B\u9149\u3001\u590F\u58EC\u5B50\u7678\u4EA5\u3001\u79CB\u7532\u5BC5\u4E59\u536F\u3001\u51AC\u4E19\u5348\u4E01\u5DF3\u3002",
      scope: "season + dayPillar",
      evidenceStatus: "implemented",
      variants: [{ id: "season-boundary", note: "\u5B63\u7BC0\u4EE5\u5BC5\u536F\u8FB0\u3001\u5DF3\u5348\u672A\u3001\u7533\u9149\u620C\u3001\u4EA5\u5B50\u4E11\u6B78\u985E\u3002" }],
      researchNotes: "\u4E0D\u80FD\u53EA\u7528 dayPillar \u5224\u5B9A\u3002"
    },
    {
      evidenceId: "EV-PT-CLASSICAL-006",
      sourceIds: ["san-ming-tong-hui", "zi-ping-zhen-quan", "di-tian-sui-yan-wei"],
      ruleIds: ["PT_RENQILONG_001", "PT_LIUYIN_002", "PT_LIUYI_003", "PT_RILUGUI_004", "PT_GONGLU_005", "PT_GONGGUI_006", "PT_FUDE_007"],
      citation: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u516D\u5404\u7279\u6B8A\u683C\u689D\u76EE\uFF1B\u4E26\u4EE5\u5B50\u5E73\u683C\u5C40\u6CE8\u5BB6\u4F5C\u6982\u5FF5\u5C0D\u8B80",
      originalBasis: "\u58EC\u9A0E\u9F8D\u80CC\u3001\u516D\u9670\u671D\u967D\u3001\u516D\u4E59\u9F20\u8CB4\u3001\u65E5\u797F\u6B78\u6642\u3001\u62F1\u797F\u3001\u62F1\u8CB4\u3001\u798F\u5FB7\u79C0\u6C23\u5747\u9700\u65E5\u6642\u3001\u6708\u4EE4\u3001\u900F\u5E72\u3001\u5408\u5C40\u3001\u5211\u6C96\u7834\u5BB3\u7B49\u5168\u5C40\u689D\u4EF6\u3002",
      scope: "wholeChart",
      evidenceStatus: "research-only",
      variants: [{ id: "textual-and-school-variants", note: "\u5404\u683C\u7684\u6838\u5FC3\u65E5\u5E72\u3001\u6642\u67F1\u3001\u865B\u795E\u8207\u7834\u683C\u689D\u4EF6\u9700\u9010\u689D\u6821\u52D8\u3002" }],
      researchNotes: "\u9019\u4E9B\u662F SpecialPatterns\uFF0C\u4E0D\u5F97\u653E\u5165 ShenSha Catalog\uFF1B\u76EE\u524D\u53EA\u767B\u9304\u67B6\u69CB\u3002"
    },
    {
      evidenceId: "EV-FC-CLASSICAL-007",
      sourceIds: ["di-tian-sui-yan-wei"],
      ruleIds: ["STR_FIVE_CATEGORY_CANONICAL_DERIVED"],
      citation: "\u300A\u6EF4\u5929\u9AD3\u95E1\u5FAE\u300B\u559C\u795E\u3001\u5FCC\u795E\u3001\u4EC7\u795E\u3001\u9592\u795E\u76F8\u95DC\u6CE8\u89E3\uFF1B\u73FE\u4EE3\u8853\u8A9E\u5B9A\u7FA9\u4F5C\u70BA\u5C0D\u7167\u3002",
      originalBasis: "\u5148\u7531\u672C\u6B21\u6276\u6291 Profile \u9078\u51FA\u7528\u795E\uFF0C\u518D\u4F9D\u4E94\u884C\u751F\u524B\u95DC\u4FC2\u5C55\u958B\u559C\u3001\u9592\u3001\u4EC7\u3001\u5FCC\uFF1B\u9019\u662F SDK \u7684\u53EF\u91CD\u73FE\u63A8\u5C0E\uFF0C\u4E0D\u662F\u53E4\u7C4D\u56FA\u5B9A\u6392\u5E8F\u3002",
      scope: "wholeChart",
      evidenceStatus: "implemented",
      variants: [{ id: "profile-selected-use", note: "\u8ABF\u5019\u3001\u683C\u5C40\u3001\u901A\u95DC\u6216\u900F\u5E72\u53D6\u7528\u6703\u4F7F\u4E94\u5206\u985E\u6539\u8B8A\u3002" }],
      researchNotes: "\u53E4\u7C4D\u63D0\u4F9B\u8853\u8A9E\u8207\u53D6\u7528\u601D\u8DEF\uFF0C\u672A\u63D0\u4F9B\u53EF\u8DE8\u6D41\u6D3E\u76F4\u63A5\u5957\u7528\u7684\u55AE\u4E00\u4E94\u5206\u985E\u6F14\u7B97\u6CD5\u3002"
    },
    {
      evidenceId: "EV-MC-REN-YUAN-008",
      sourceIds: ["san-ming-tong-hui", "di-tian-sui-yan-wei"],
      ruleIds: ["STR_MONTH_COMMANDER_001"],
      citation: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E8C\u3008\u8AD6\u4EBA\u5143\u53F8\u4E8B\u3009\u3001\u3008\u8AD6\u56DB\u6642\u7BC0\u6C23\u3009\uFF1B\u300A\u6EF4\u5929\u9AD3\u95E1\u5FAE\u300B\u6708\u4EE4\u8207\u4EBA\u5143\u6CE8\u89E3\u3002",
      originalBasis: "\u4EE5\u6708\u652F\u70BA\u63D0\u7DB1\uFF0C\u6309\u7BC0\u5F8C\u7D93\u904E\u65E5\u6578\u843D\u5165\u672C\u5C08\u6848\u7684\u5206\u6BB5\u8868\uFF0C\u9078\u51FA\u7576\u6708\u503C\u4EE4\u85CF\u5E72\uFF1B\u65E5\u6578\u53D6\u6CD5\u8207\u5206\u6BB5\u8868\u53E6\u6709\u50B3\u672C\u5DEE\u7570\u3002",
      scope: "seasonalMonth",
      evidenceStatus: "implemented",
      variants: [{ id: "phase-table", note: "\u5404\u5BB6\u4EBA\u5143\u53F8\u4EE4\u5206\u65E5\u6BD4\u4F8B\u4E0D\u540C\u3002" }, { id: "day-rounding", note: "\u7BC0\u5F8C\u6574\u65E5\u8207\u7CBE\u78BA\u6642\u523B\u53D6\u6CD5\u4E0D\u540C\u3002" }],
      researchNotes: "\u4FDD\u5B58\u672C\u7248\u672C\u6F14\u7B97\u6CD5\u8207\u5DEE\u7570\uFF0C\u4E0D\u628A\u5206\u65E5\u8868\u5BA3\u7A31\u70BA\u552F\u4E00\u53E4\u6CD5\u3002"
    },
    {
      evidenceId: "EV-KW-XUN-009",
      sourceIds: ["san-ming-tong-hui"],
      ruleIds: ["AUX_KONGWANG_SIX_XUN_001"],
      citation: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E09\u3008\u8AD6\u7A7A\u4EA1\u3009\u3002",
      originalBasis: "\u7532\u65EC\u76E1\u8655\u70BA\u7A7A\u4EA1\uFF1B\u516D\u5341\u7532\u5B50\u5206\u516D\u65EC\uFF0C\u6BCF\u65EC\u5341\u652F\uFF0C\u9918\u4E0B\u5169\u652F\u70BA\u65EC\u7A7A\u3002",
      scope: "dayPillarAndYearPillar",
      evidenceStatus: "implemented",
      variants: [{ id: "day-xun", note: "\u65E5\u7A7A\u8207\u5E74\u7A7A\u61C9\u5206\u6B04\u4FDD\u5B58\u3002" }],
      researchNotes: "\u53EA\u6838\u7B97\u65EC\u7A7A\u5730\u652F\u8207\u547D\u76E4\u547D\u4E2D\u77E9\u9663\uFF0C\u4E0D\u7531\u6B64\u6B04\u76F4\u63A5\u5224\u5409\u51F6\u3002"
    },
    {
      evidenceId: "EV-AUX-PALACE-010",
      sourceIds: ["san-ming-tong-hui"],
      ruleIds: ["AUX_TAIYUAN_001", "AUX_TAIXI_002", "AUX_MINGGONG_003", "AUX_SHENGONG_004", "AUX_CLASSICAL_AUXILIARY_001"],
      citation: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E8C\u3008\u8AD6\u80CE\u5143\u3009\u3001\u3008\u8AD6\u5750\u547D\u5B98\u3009\u53CA\u76F8\u95DC\u80CE\u606F\u3001\u547D\u5BAE\u3001\u8EAB\u5BAE\u8CC7\u6599\u3002",
      originalBasis: "\u80CE\u5143\u3001\u80CE\u606F\u3001\u547D\u5BAE\u3001\u8EAB\u5BAE\u4F9D\u76EE\u524D canonical \u516C\u5F0F\u96C6\u4E2D\u8F38\u51FA\uFF1B\u547D\u5BAE\u8EAB\u5BAE\u53E6\u6709\u4E2D\u6C23\u904E\u5BAE\u3001\u6708\u5EFA\u8207\u5B50\u6642\u5206\u754C\u5DEE\u7570\u3002",
      scope: "wholeChartAuxiliary",
      evidenceStatus: "implemented",
      variants: [{ id: "solar-term-over-month", note: "\u4E2D\u6C23\u904E\u5BAE\u53EF\u80FD\u6539\u8B8A\u547D\u5BAE\u8EAB\u5BAE\u3002" }, { id: "zi-hour-boundary", note: "\u5B50\u6642\u63DB\u65E5\u53EF\u80FD\u6539\u8B8A\u7D50\u679C\u3002" }],
      researchNotes: "\u8CC7\u6599\u96C6\u4E2D\u5448\u73FE\u53EF\u9A57\u8B49\u7684\u8A08\u7B97\u7D50\u679C\uFF0C\u4E0D\u628A\u8F14\u52A9\u5BAE\u4F4D\u7576\u6210\u5B50\u5E73\u683C\u5C40\u6216\u795E\u715E\u3002"
    }
  ]
};

// sources/evidence-ledger.json
var evidence_ledger_default = {
  schemaVersion: "1.0.0",
  catalogId: "bazi-js-classical-evidence-ledger",
  catalogVersion: "2026.09",
  purpose: "\u53EF\u5B9A\u4F4D\u7684\u53E4\u7C4D\u6458\u9304\u3001\u7248\u672C\u8207\u6821\u52D8\u72C0\u614B\uFF1B\u4E0D\u628A\u672A\u6838\u5BE6\u7684\u9801\u78BC\u6216\u50B3\u672C\u5DEE\u7570\u5BEB\u6210\u78BA\u5B9A\u4E8B\u5BE6\u3002",
  editionRecords: [
    {
      editionId: "wikisource-san-ming-tong-hui",
      sourceId: "san-ming-tong-hui",
      title: "\u300A\u4E09\u547D\u901A\u6703\u300B\u7DAD\u57FA\u6587\u5EAB\u6578\u4F4D\u8F49\u9304\u672C",
      provider: "Wikisource",
      editionStatus: "digital-transcription",
      publicationYear: null,
      notes: "\u6B64\u70BA\u53EF\u516C\u958B\u5B9A\u4F4D\u7684\u6578\u4F4D\u8F49\u9304\uFF1B\u4E0D\u662F\u5F71\u50CF\u7248\uFF0C\u9801\u78BC\u4E0D\u5F37\u884C\u63A8\u5B9A\u3002"
    },
    {
      editionId: "wikisource-di-tian-sui-yan-wei",
      sourceId: "di-tian-sui-yan-wei",
      title: "\u300A\u6EF4\u5929\u9AD3\u95E1\u5FAE\u300B\u7DAD\u57FA\u6587\u5EAB\u6578\u4F4D\u8F49\u9304\u672C",
      provider: "Wikisource",
      editionStatus: "digital-transcription",
      publicationYear: null,
      notes: "\u4F5C\u70BA\u7406\u8AD6\u80CC\u666F\u7D22\u5F15\uFF1B\u5BE6\u969B\u898F\u5247\u4ECD\u9700\u9010\u689D\u4FDD\u5B58\u539F\u6587\u8207\u8B8A\u9AD4\u3002"
    }
  ],
  citations: [
    {
      evidenceId: "EV-MC-SANMING-001",
      sourceId: "san-ming-tong-hui",
      ruleIds: ["STR_MONTH_COMMANDER_SANMING_002"],
      edition: "wikisource-san-ming-tong-hui",
      locator: {
        type: "section",
        section: "\u5377\u4E8C\u3008\u8AD6\u4EBA\u5143\u53F8\u4E8B\u3009",
        page: null,
        url: "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u4E8C",
        accessedAt: "2026-09-09"
      },
      originalExcerpt: "\u5BC5\u4E2D\u6709\u826E\u571F\u7528\u4E8B\u4E94\u65E5\uFF0C\u4E19\u706B\u9577\u751F\u4E94\u65E5\uFF0C\u7532\u6728\u4E8C\u5341\u65E5",
      transcription: "\u5BC5\uFF1A\u620A\u4E94\u65E5\u3001\u4E19\u4E94\u65E5\u3001\u7532\u4E8C\u5341\u65E5\uFF1B\u5176\u9918\u6708\u4F9D\u539F\u689D\u6587\u8868\u5217\u3002",
      ocrNotes: "\u6B64\u70BA\u6578\u4F4D\u8F49\u9304\uFF0C\u7121 OCR \u5F71\u50CF\u5C64\u3002",
      collationNotes: "\u76EE\u524D\u53EA\u63A1\u53EF\u5B9A\u4F4D\u689D\u6587\uFF1B\u5B8C\u6574\u5206\u65E5\u8868\u8207\u5176\u4ED6\u50B3\u672C\u7684\u5DEE\u7570\u4FDD\u7559\u5728 SAN_MING_MONTH_COMMAND_PHASES \u8207 variants\u3002",
      verificationStatus: "source-located",
      variants: [{ id: "bazi-js-human-element", note: "BaziJS canonical \u63A1\u53E6\u4E00\u5957\u53EF\u91CD\u73FE\u5206\u6BB5\u8868\u3002" }],
      researchNotes: "\u53E4\u7C4D\u5206\u65E5\u8207\u5F8C\u4E16\u4EBA\u5143\u53F8\u4EE4\u8868\u4E0D\u53EF\u76F4\u63A5\u8996\u70BA\u540C\u4E00\u898F\u5247\u3002"
    },
    {
      evidenceId: "EV-SP-RILU-002",
      sourceId: "san-ming-tong-hui",
      ruleIds: ["PATTERN_RILU_GUI_SHI_RESEARCH_001"],
      edition: "wikisource-san-ming-tong-hui",
      locator: {
        type: "section",
        section: "\u5377\u516D\u3008\u65E5\u797F\u6B78\u6642\u3009",
        page: null,
        url: "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D",
        accessedAt: "2026-09-09"
      },
      originalExcerpt: "\u65E5\u797F\u6B78\u6642\u6C92\u5B98\u661F\uFF0C\u865F\u9752\u96F2\u5F97\u8DEF\u3002",
      transcription: "\u6642\u67F1\u8207\u65E5\u797F\u6B78\u6642\u76F8\u95DC\uFF0C\u4ECD\u9808\u914D\u5408\u5168\u5C40\u6210\u683C\u689D\u4EF6\u3002",
      ocrNotes: "\u6B64\u70BA\u6578\u4F4D\u8F49\u9304\uFF0C\u7121 OCR \u5F71\u50CF\u5C64\u3002",
      collationNotes: "\u77ED\u6458\u9304\u53EA\u8B49\u660E\u53E4\u7C4D\u689D\u540D\u8207\u6982\u5FF5\uFF0C\u4E0D\u8DB3\u4EE5\u63A8\u51FA\u5B8C\u6574\u6210\u683C\u7B97\u6CD5\u3002",
      verificationStatus: "source-located",
      variants: [],
      researchNotes: "\u5217\u5165 Patterns \u7814\u7A76\uFF0C\u4E0D\u5217\u5165\u4E00\u822C\u795E\u715E\u3002"
    },
    {
      evidenceId: "EV-SP-GONGLU-003",
      sourceId: "san-ming-tong-hui",
      ruleIds: ["PATTERN_GONGLU_RESEARCH_001"],
      edition: "wikisource-san-ming-tong-hui",
      locator: {
        type: "section",
        section: "\u5377\u516D\u3008\u62F1\u797F\u62F1\u8CB4\u3009",
        page: null,
        url: "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D",
        accessedAt: "2026-09-09"
      },
      originalExcerpt: "\u62F1\u797F\u62F1\u8CB4\uFF0C\u586B\u5BE6\u5247\u51F6\u3002",
      transcription: "\u62F1\u797F\u3001\u62F1\u8CB4\u4EE5\u5169\u67F1\u593E\u62F1\u689D\u4EF6\u7814\u7A76\uFF0C\u4E0D\u80FD\u53EA\u7528\u55AE\u67F1\u547D\u4E2D\u3002",
      ocrNotes: "\u6B64\u70BA\u6578\u4F4D\u8F49\u9304\uFF0C\u7121 OCR \u5F71\u50CF\u5C64\u3002",
      collationNotes: "\u5C1A\u672A\u5C07\u6240\u6709\u586B\u5BE6\u3001\u6C96\u7834\u8207\u6708\u4EE4\u689D\u4EF6\u6574\u7406\u6210 canonical predicate\u3002",
      verificationStatus: "source-located",
      variants: [],
      researchNotes: "\u5217\u5165 Patterns \u7814\u7A76\uFF0C\u4E0D\u5217\u5165\u4E00\u822C\u795E\u715E\u3002"
    },
    {
      evidenceId: "EV-SP-LIUYI-004",
      sourceId: "san-ming-tong-hui",
      ruleIds: ["PATTERN_LIUYI_SHUGUI_RESEARCH_001"],
      edition: "wikisource-san-ming-tong-hui",
      locator: {
        type: "section",
        section: "\u5377\u516D\u3008\u516D\u4E59\u9F20\u8CB4\u3009",
        page: null,
        url: "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u516D",
        accessedAt: "2026-09-09"
      },
      originalExcerpt: "\u9670\u6728\u7368\u9047\u5B50\u6642\uFF0C\u70BA\u516D\u4E59\u9F20\u8CB4\u4E4B\u5730\u3002",
      transcription: "\u516D\u4E59\u9F20\u8CB4\u81F3\u5C11\u6D89\u53CA\u4E59\u65E5\u8207\u5B50\u6642\uFF0C\u5B8C\u6574\u6210\u683C\u689D\u4EF6\u5F85\u7814\u7A76\u3002",
      ocrNotes: "\u6B64\u70BA\u6578\u4F4D\u8F49\u9304\uFF0C\u7121 OCR \u5F71\u50CF\u5C64\u3002",
      collationNotes: "\u4E0D\u628A\u689D\u540D\u6216\u55AE\u4E00\u65E5\u6642\u689D\u4EF6\u76F4\u63A5\u8F49\u6210\u795E\u715E\u547D\u4E2D\u3002",
      verificationStatus: "source-located",
      variants: [],
      researchNotes: "\u5217\u5165 Patterns \u7814\u7A76\uFF0C\u4E0D\u5217\u5165\u4E00\u822C\u795E\u715E\u3002"
    },
    {
      evidenceId: "EV-AUX-MINGGONG-005",
      sourceId: "san-ming-tong-hui",
      ruleIds: ["AUX_CANONICAL_PALM_001"],
      edition: "wikisource-san-ming-tong-hui",
      locator: {
        type: "section",
        section: "\u5377\u4E8C\u3008\u8AD6\u5750\u547D\u5B98\u3009",
        page: null,
        url: "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u4E8C",
        accessedAt: "2026-09-09"
      },
      originalExcerpt: "\u6B64\u6CD5\u770B\u662F\u4F55\u6708\u751F\u4EBA\u5750\u65BC\u4F55\u6642\uFF0C\u7136\u5F8C\u65B9\u5B9A\u547D\u5750\u4F55\u5BAE\u3002",
      transcription: "\u547D\u5BAE\u7B97\u6CD5\u4EE5\u51FA\u751F\u6708\u652F\u8207\u6642\u652F\u70BA\u57FA\u790E\uFF0C\u518D\u4F9D\u4E94\u864E\u9041\u53D6\u547D\u5BAE\u5929\u5E72\u3002",
      ocrNotes: "\u6B64\u70BA\u6578\u4F4D\u8F49\u9304\uFF0C\u7121 OCR \u5F71\u50CF\u5C64\u3002",
      collationNotes: "\u5B8C\u6574\u638C\u8A23\u3001\u8D77\u6CD5\u8207\u4E0D\u540C\u8853\u6D3E\u7B97\u6CD5\u5C1A\u672A\u5168\u90E8\u5C0D\u8B80\uFF1Bcanonical \u516C\u5F0F\u8207\u7814\u7A76 Profile \u5206\u96E2\u3002",
      verificationStatus: "source-located",
      variants: [{ id: "san-ming-palm-research", note: "\u9810\u7559\u5B8C\u6574\u8B8A\u9AD4\u7814\u7A76\uFF0C\u4E0D\u8986\u84CB canonical\u3002" }],
      researchNotes: "\u6B64\u8B49\u64DA\u53EA\u652F\u63F4\u6708\u6642\u53D6\u547D\u5BAE\u7684\u4F86\u6E90\u65B9\u5411\uFF0C\u4E0D\u5BA3\u7A31\u76EE\u524D\u516C\u5F0F\u662F\u552F\u4E00\u50B3\u627F\u3002"
    },
    {
      evidenceId: "EV-LUCK-006",
      sourceId: "san-ming-tong-hui",
      ruleIds: ["LUCK_START_DIFF_DIV_3"],
      edition: "wikisource-san-ming-tong-hui",
      locator: {
        type: "section",
        section: "\u5377\u4E8C\u3008\u8AD6\u5927\u904B\u3009",
        page: null,
        url: "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u4E8C",
        accessedAt: "2026-09-09"
      },
      originalExcerpt: "\u53E4\u4EBA\u4EE5\u5927\u904B\u5247\u4E00\u8FB0\u5341\u6B72\uFF0C\u6298\u9664\u4EE5\u4E09\u65E5\u70BA\u5E74\u8005\u4F55\uFF1F",
      transcription: "\u5927\u904B\u8D77\u904B\u7684\u7BC0\u6C23\u8DDD\u96E2\u8207\u4E09\u65E5\u4E00\u6B72\u63DB\u7B97\uFF0C\u4FDD\u7559\u70BA\u53EF\u8FFD\u6EAF\u65B9\u6CD5\u3002",
      ocrNotes: "\u6B64\u70BA\u6578\u4F4D\u8F49\u9304\uFF0C\u7121 OCR \u5F71\u50CF\u5C64\u3002",
      collationNotes: "\u4E0D\u540C\u8D77\u904B\u6298\u7B97\u6CD5\u53E6\u4EE5 luckCycles.variants \u4FDD\u5B58\uFF0C\u4E0D\u5728\u6B64\u689D\u6587\u4E0B\u5047\u5B9A\u552F\u4E00\u3002",
      verificationStatus: "source-located",
      variants: [{ id: "jieqi-whole-days-divide-3", note: "\u7BC0\u6C23\u5DEE\u5148\u53D6\u6574\u65E5\u518D\u9664\u4E09\u7684\u6BD4\u8F03\u65B9\u6CD5\u3002" }],
      researchNotes: "\u53E4\u7C4D\u5F15\u6587\u8207\u672C SDK \u5BE6\u4F5C\u65B9\u6CD5\u9700\u4FDD\u6301\u53EF\u5340\u5206\u3002"
    }
  ]
};

// sources/variants.json
var variants_default = {
  schemaVersion: "1.0.0",
  catalogId: "bazi-js-rule-variants",
  catalogVersion: "2026.09",
  purpose: "\u8A18\u9304\u53EF\u91CD\u73FE\u7684\u6D41\u6D3E\u3001\u7B97\u6CD5\u8207\u8CC7\u6599\u7D04\u5B9A\u5DEE\u7570\uFF1B\u4E0D\u628A\u5DEE\u7570\u88C1\u6C7A\u6210\u8DE8\u6D41\u6D3E\u552F\u4E00\u771F\u503C\u3002",
  variants: [
    {
      variantId: "VAR_YEAR_BOUNDARY_LUNAR_NEW_YEAR",
      conceptId: "profile.year-boundary",
      tradition: "calendar-convention",
      sourceIds: [],
      status: "comparison",
      condition: "\u5E74\u67F1\u4EE5\u6B63\u6708\u521D\u4E00\u5207\u63DB\uFF0C\u800C\u975E\u4EE5\u7ACB\u6625\u5207\u63DB\u3002",
      algorithm: "yearBoundary=lunar_new_year",
      profileIds: ["lunar-calendar"],
      differencesFromCanonical: "\u53EF\u80FD\u6539\u8B8A\u7ACB\u6625\u524D\u570B\u66C6\u65E5\u671F\u7684\u5E74\u67F1\u8207\u5F8C\u7E8C\u5E74\u652F\u67E5\u6CD5\u3002",
      evidence: "Profile differential fixtures \u5DF2\u56FA\u5B9A\u5E74\u754C\u5DEE\u7570\uFF1B\u4E0D\u5BA3\u7A31\u67D0\u4E00\u7D04\u5B9A\u662F\u552F\u4E00\u6D41\u6D3E\u7B54\u6848\u3002"
    },
    {
      variantId: "VAR_MONTH_BOUNDARY_LUNAR_MONTH",
      conceptId: "profile.month-boundary",
      tradition: "calendar-convention",
      sourceIds: [],
      status: "comparison",
      condition: "\u6708\u67F1\u4F9D\u8FB2\u66C6\u6708\u754C\uFF0C\u800C\u975E\u7BC0\u6C23\u6708\u754C\u3002",
      algorithm: "monthBoundary=lunar_month",
      profileIds: ["lunar-calendar"],
      differencesFromCanonical: "\u7BC0\u6C23\u524D\u5F8C\u53EF\u80FD\u5F97\u5230\u4E0D\u540C\u6708\u67F1\u3002",
      evidence: "Profile differential fixtures \u5DF2\u56FA\u5B9A\u6708\u754C\u5DEE\u7570\u3002"
    },
    {
      variantId: "VAR_DAY_BOUNDARY_CIVIL_MIDNIGHT",
      conceptId: "profile.day-boundary",
      tradition: "day-boundary-convention",
      sourceIds: [],
      status: "comparison",
      condition: "\u4EE5\u6C11\u7528\u5348\u591C 00:00 \u5207\u63DB\u65E5\u67F1\uFF0C\u800C\u975E canonical \u7684\u665A\u5B50 23:00\u3002",
      algorithm: "dayBoundary=00:00",
      profileIds: ["civil-midnight"],
      differencesFromCanonical: "23:00\u201323:59 \u7684\u65E5\u671F\u8207\u65E5\u67F1\u53EF\u80FD\u4E0D\u540C\u3002",
      evidence: "Profile differential fixtures \u8207\u5B50\u6642\u908A\u754C\u62BD\u6A23\u53EF\u91CD\u8DD1\u3002"
    },
    {
      variantId: "VAR_TRUE_SOLAR_TIME_LONGITUDE",
      conceptId: "profile.true-solar-time",
      tradition: "astronomical-time-convention",
      sourceIds: [],
      status: "comparison",
      condition: "\u4EE5\u51FA\u751F\u5730\u7D93\u5EA6\u4FEE\u6B63\u5730\u65B9\u771F\u592A\u967D\u6642\u5F8C\u518D\u5224\u5B9A\u6642\u67F1\u3002",
      algorithm: "trueSolarTime=true",
      profileIds: ["true-solar"],
      differencesFromCanonical: "\u6642\u67F1\u8207\u65E5\u754C\u908A\u754C\u6848\u4F8B\u53EF\u80FD\u6539\u8B8A\uFF1B\u9700\u8981\u7D93\u5EA6\u8CC7\u6599\u3002",
      evidence: "round-03\u3001round-04 \u5DF2\u4FDD\u5B58\u8DE8\u7D93\u5EA6\u771F\u592A\u967D\u6642\u89C0\u5BDF\uFF1B\u4E0D\u628A\u5916\u90E8\u5F15\u64CE\u5DEE\u7570\u76F4\u63A5\u7576\u4F5C BaziJS \u932F\u8AA4\u3002"
    },
    {
      variantId: "VAR_HUMAN_ELEMENT_SANMING_PHASES",
      conceptId: "month-commander.human-element",
      tradition: "classical-ziping",
      sourceIds: ["san-ming-tong-hui"],
      status: "comparison",
      condition: "\u4F9D\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E8C\u7684\u5206\u65E5\uFF0F\u4EBA\u5143\u53F8\u4EE4\u8AAA\u660E\u4FDD\u5B58\u4E00\u5957\u6BD4\u8F03\u8868\u3002",
      algorithm: "monthCommanderModel=san-ming-volume-2",
      profileIds: ["classical-sanming"],
      differencesFromCanonical: "\u5206\u6BB5\u5929\u6578\u8207\u53F8\u4EE4\u5929\u5E72\u53EF\u80FD\u4E0D\u540C\uFF1Bcanonical \u8207\u53E4\u7C4D\u6BD4\u8F03\u8868\u4E26\u5217\u3002",
      evidence: "EV-MC-SANMING-001\uFF1B\u539F\u6587\u6458\u9304\u3001\u9801\u78BC\u72C0\u614B\u8207 BaziJS \u5206\u6BB5\u5DEE\u7570\u898B evidence-ledger\u3002"
    },
    {
      variantId: "VAR_LUCK_START_WHOLE_DAY",
      conceptId: "luck.start-age",
      tradition: "classical-ziping",
      sourceIds: ["san-ming-tong-hui"],
      status: "comparison",
      condition: "\u7BC0\u6C23\u8DDD\u96E2\u5148\u53D6\u6574\u65E5\uFF0C\u518D\u4EE5\u4E09\u65E5\u4E00\u6B72\u63DB\u7B97\u8D77\u904B\u3002",
      algorithm: "luckStartMethod=jieqi-whole-day",
      profileIds: ["jieqi-whole-day"],
      differencesFromCanonical: "\u8D77\u904B\u65E5\u671F\u53EF\u80FD\u8207\u7CBE\u78BA\u7BC0\u6C23\u5DEE\u9664\u4E09\u4E0D\u540C\u3002",
      evidence: "EV-LUCK-006\uFF1B\u4FDD\u7559\u7CBE\u78BA\u6CD5\u8207\u6574\u65E5\u6BD4\u8F03\u6CD5\uFF0C\u4E0D\u6697\u793A\u53E4\u7C4D\u53EA\u6709\u55AE\u4E00\u5BE6\u4F5C\u3002"
    },
    {
      variantId: "VAR_PALACE_SANMING_PALM",
      conceptId: "auxiliary.palace",
      tradition: "classical-ziping",
      sourceIds: ["san-ming-tong-hui"],
      status: "comparison",
      condition: "\u4EE5\u51FA\u751F\u6708\u652F\u8207\u6642\u652F\u4F9D\u53E4\u6CD5\u638C\u8A23\u63A8\u547D\u5BAE\u3001\u8EAB\u5BAE\uFF0C\u4E26\u914D\u5408\u4E94\u864E\u9041\u53D6\u5929\u5E72\u3002",
      algorithm: "palaceModel=san-ming-palm",
      profileIds: ["classical-sanming"],
      differencesFromCanonical: "\u638C\u8A23\u3001\u9806\u9006\u8207\u8D77\u5E72\u7D30\u7BC0\u4ECD\u53EF\u80FD\u6709\u50B3\u627F\u5DEE\u7570\u3002",
      evidence: "EV-AUX-MINGGONG-005\uFF1B\u76EE\u524D canonical \u516C\u5F0F\u8207\u7814\u7A76 Profile \u5206\u96E2\u3002"
    },
    {
      variantId: "VAR_SHENSHA_TRADITIONAL_LIST",
      conceptId: "shensha.catalog",
      tradition: "classical-ziping",
      sourceIds: ["san-ming-tong-hui", "yuan-hai-zi-ping"],
      status: "comparison",
      condition: "\u4E0D\u540C\u50B3\u672C\uFF0F\u8A3B\u5BB6\u53EF\u80FD\u589E\u6E1B\u795E\u715E\u3001\u6539\u540D\u6216\u63A1\u7528\u4E0D\u540C\u67E5\u6CD5\u3002",
      algorithm: "shenshaPreset=classical|full|minimal",
      profileIds: [],
      differencesFromCanonical: "\u795E\u715E\u6578\u91CF\u4E0D\u4F5C\u6B0A\u5A01\u7A0B\u5EA6\u6307\u6A19\uFF1B\u6BCF\u689D\u898F\u5247\u4ECD\u9700\u7368\u7ACB source\u3001ruleId \u8207 evidence\u3002",
      evidence: "\u898F\u5247 registry \u7684 references\u3001variants \u8207 researchNotes\uFF1B\u7279\u6B8A\u67F1\u4F4D\u4E0D\u5F97\u56DE\u585E\u4E00\u822C ShenSha\u3002"
    },
    {
      variantId: "VAR_USE_GOD_MODEL_FUYI",
      conceptId: "use-god.model",
      tradition: "analysis-model",
      sourceIds: [],
      status: "comparison",
      condition: "\u4EE5\u6276\u6291\u6A21\u578B\u7684\u559C\u7528\u4E94\u884C\u7B2C\u4E00\u9806\u4F4D\u4F5C\u70BA canonical-use-derived\u3002",
      algorithm: "useGodModel=fuyi-canonical",
      profileIds: ["canonical"],
      differencesFromCanonical: "\u8ABF\u5019\u3001\u901A\u95DC\u3001\u683C\u5C40\u3001\u5F9E\u5316\u7B49\u6A21\u578B\u53EF\u80FD\u7522\u751F\u4E0D\u540C\u5019\u9078\uFF0C\u4E0D\u61C9\u5728\u672A\u5B8C\u6210\u6642\u8986\u5BEB canonical\u3002",
      evidence: "result.analysis.useGodResolver \u4FDD\u7559 candidates\u3001conflicts\u3001finalDecision \u8207 model evidence\u3002"
    }
  ]
};

// src/reference/system-concepts.js
var sdkReference = (module, note) => ({
  type: "sdk",
  module,
  locator: module,
  note
});
var feature = ({
  conceptId,
  name,
  aliases,
  conceptType,
  ruleId,
  version,
  ruleFamily,
  baseOn,
  scope,
  description,
  module,
  api,
  outputFields,
  sourceIds = [],
  references = [],
  evidence,
  variants = []
}) => ({
  conceptId,
  ruleId,
  name,
  displayName: name,
  aliases,
  tradition: "bazi-js-sdk",
  conceptType,
  ruleFamily,
  baseOn,
  scope,
  category: "neutral",
  confidence: "implemented-contract",
  status: "implemented",
  version,
  sourceIds,
  references: references.length ? references : [sdkReference(module, "\u529F\u80FD\u5951\u7D04\u8207\u5BE6\u4F5C\u4F4D\u7F6E\uFF1B\u4E0D\u7B49\u540C\u53E4\u7C4D\u539F\u6587\u8B49\u64DA\u3002")],
  description,
  variants,
  researchNotes: {
    sourceCoverage: sourceIds.length ? "classical-source-linked" : "sdk-contract-only",
    note: sourceIds.length ? "\u529F\u80FD\u5DF2\u6709\u76F8\u95DC\u53E4\u7C4D\u4F86\u6E90\u7D22\u5F15\uFF0C\u4F46\u5BE6\u969B SDK \u7B97\u6CD5\u4ECD\u4EE5\u8F38\u51FA evidence \u8207\u7248\u672C\u5951\u7D04\u70BA\u6E96\u3002" : "\u76EE\u524D\u5DF2\u5347\u683C\u70BA\u53EF\u67E5\u8A62\u7684\u5BE6\u4F5C\u6982\u5FF5\uFF1B\u5C08\u5C6C\u53E4\u7C4D\u7248\u672C\u3001\u9801\u78BC\u8207\u539F\u6587\u4ECD\u5F85\u88DC\u9F4A\u3002"
  },
  evidence: {
    kind: "implementation-contract",
    matched: true,
    basedOn: ["module", "version", "public-api", "output-schema"],
    status: evidence?.status || "implemented",
    note: evidence?.note || "\u6B64\u6982\u5FF5\u63CF\u8FF0\u5DF2\u5B58\u5728\u7684 SDK \u529F\u80FD\uFF0C\u4E0D\u5BA3\u7A31\u984D\u5916\u547D\u7406\u7D50\u8AD6\u3002"
  },
  implementation: {
    status: "implemented",
    module,
    api,
    outputFields
  }
});
var SYSTEM_CONCEPTS = Object.freeze([
  feature({
    conceptId: "calendar.engine",
    name: "\u66C6\u6CD5\u8207\u7BC0\u6C23",
    aliases: ["Calendar", "Calendar Engine", "\u7BC0\u6C23\u8A08\u7B97"],
    conceptType: "calendar",
    ruleId: "CALENDAR_ENGINE_001",
    version: VERSIONS.calendarRuleVersion,
    ruleFamily: "calendar-and-solar-terms",
    baseOn: ["birthDate", "birthTime", "timezone", "solarTerms"],
    scope: "calendar",
    module: "src/calendar",
    api: ["Bazi.Calendar", "Bazi.Solar", "Bazi.Lunar", "Bazi.TrueSolarTime"],
    outputFields: ["calendar.solar", "calendar.lunar", "calendar.solarTerms", "calendar.time", "accuracy.precision"],
    description: "\u8655\u7406\u516C\u66C6\u3001\u8FB2\u66C6\u3001\u5112\u7565\u65E5\u3001\u7BC0\u6C23\u3001\u751F\u8096\u3001\u661F\u5EA7\u8207\u771F\u592A\u967D\u6642\u4FEE\u6B63\uFF0C\u4E26\u628A\u6642\u9593\u7CBE\u5EA6\u8207\u5047\u8A2D\u7559\u5728\u7D50\u679C\u4E2D\u3002"
  }),
  feature({
    conceptId: "ten-god.relation",
    name: "\u5341\u795E\u95DC\u4FC2",
    aliases: ["TenGod", "Ten Gods", "\u5341\u795E\u8A08\u7B97"],
    conceptType: "ten-god",
    ruleId: "TENGOD_RELATION_001",
    version: VERSIONS.tenGodRuleVersion,
    ruleFamily: "day-master-relation",
    baseOn: ["dayMaster", "stems", "hiddenStems"],
    scope: "natal",
    module: "src/tengods",
    api: ["Bazi.TenGods"],
    outputFields: ["tenGods.dayMaster", "tenGods.stems", "tenGods.hidden"],
    description: "\u4EE5\u65E5\u4E3B\u5929\u5E72\u70BA\u57FA\u6E96\uFF0C\u8A08\u7B97\u56DB\u67F1\u5929\u5E72\u8207\u5730\u652F\u85CF\u5E72\u7684\u5341\u795E\u95DC\u4FC2\uFF0C\u4E26\u4FDD\u7559\u89D2\u8272\u8207\u89E3\u91CB\u6B04\u4F4D\u3002"
  }),
  feature({
    conceptId: "hidden-stem.registry",
    name: "\u5730\u652F\u85CF\u5E72",
    aliases: ["HiddenStem", "Hidden Stems", "\u85CF\u5E72"],
    conceptType: "hidden-stem",
    ruleId: "HIDDEN_STEM_REGISTRY_001",
    version: VERSIONS.hiddenStemRuleVersion,
    ruleFamily: "branch-hidden-stems",
    baseOn: ["branch"],
    scope: "pillar",
    module: "src/core/constants/hidden-stems-data.js",
    api: ["Bazi.TenGods", "Bazi.calculate"],
    outputFields: ["hiddenStems.year", "hiddenStems.month", "hiddenStems.day", "hiddenStems.hour", "tenGods.hidden"],
    description: "\u63D0\u4F9B\u6BCF\u500B\u5730\u652F\u6240\u85CF\u5929\u5E72\u3001\u672C\u6C23\uFF0F\u4E2D\u6C23\uFF0F\u9918\u6C23\u89D2\u8272\u3001\u65E5\u6578\u8207\u6BD4\u4F8B\uFF1B\u4E0D\u628A\u85CF\u5E72\u672C\u8EAB\u8AA4\u7576\u6210\u900F\u5E72\u3002"
  }),
  feature({
    conceptId: "interaction.chart-relationships",
    name: "\u5929\u5E72\u5730\u652F\u4E92\u52D5",
    aliases: ["Interactions", "Interactions Engine", "\u5408\u6C96\u5211\u5BB3\u7834"],
    conceptType: "interaction",
    ruleId: "INTERACTIONS_ENGINE_001",
    version: VERSIONS.interactionRuleVersion,
    ruleFamily: "chart-relationship",
    baseOn: ["pillars", "stemPairs", "branchGroups"],
    scope: "whole-chart",
    module: "src/interactions",
    api: ["Bazi.Interactions"],
    outputFields: ["interactions.stems", "interactions.branches", "interactions.formation", "interactions.transformability", "interactions.evidence"],
    description: "\u8FA8\u8B58\u5929\u5E72\u4E94\u5408\uFF0F\u76F8\u6C96\u8207\u5730\u652F\u5408\u3001\u6C96\u3001\u5211\u3001\u5BB3\u3001\u7834\u3001\u4E09\u5408\u3001\u4E09\u6703\u3001\u534A\u5408\u3001\u62F1\u5408\uFF0C\u4E26\u5C07\u89C0\u6E2C\u5230\u7684\u7D50\u69CB\u8207\u6210\u5316\u5019\u9078\u5206\u958B\u3002"
  }),
  feature({
    conceptId: "strength.engine",
    name: "\u4E94\u884C\u5F37\u5F31\u8207\u6C23\u6578",
    aliases: ["Strength", "Strength Engine", "\u6276\u6291\u5F37\u5F31"],
    conceptType: "strength",
    ruleId: "STRENGTH_ENGINE_001",
    version: VERSIONS.strengthRuleVersion,
    ruleFamily: "whole-chart-strength",
    baseOn: ["dayMaster", "monthCommander", "hiddenStems", "interactions"],
    scope: "whole-chart",
    module: "src/strength",
    api: ["Bazi.Strength", "Bazi.calculate"],
    outputFields: ["strength.score", "strength.level", "strength.distribution", "strength.rawQi", "strength.effectiveQi", "strength.transformations", "strength.assessment", "strength.evidence"],
    sourceIds: ["di-tian-sui-yan-wei"],
    references: [{ type: "classical", sourceId: "di-tian-sui-yan-wei", title: "\u300A\u6EF4\u5929\u9AD3\u95E1\u5FAE\u300B", locator: "\u4EBA\u5143\u53F8\u4EE4\u3001\u6708\u4EE4\u8207\u5168\u5C40\u53D6\u7528\u76F8\u95DC\u6CE8\u89E3", url: "https://zh.wikisource.org/zh-hant/\u6EF4\u5929\u9AD3\u95E1\u5FAE" }],
    description: "\u4EE5\u5F97\u4EE4\u3001\u5F97\u5730\u3001\u5F97\u52E2\u3001\u540C\u9EE8\u7570\u9EE8\u3001\u4E92\u52D5\u6298\u640D\u8207\u8F49\u5316\u5019\u9078\u5EFA\u7ACB\u53EF\u8FFD\u6EAF\u5F37\u5F31\u6A21\u578B\uFF1B\u5206\u6578\u662F SDK \u6A21\u578B\u8F38\u51FA\uFF0C\u4E0D\u662F\u79D1\u5B78\u6E2C\u91CF\u3002"
  }),
  feature({
    conceptId: "luck.cycles",
    name: "\u5927\u904B\u8207\u8D77\u904B",
    aliases: ["Luck", "Luck Cycles", "\u5927\u904B"],
    conceptType: "luck",
    ruleId: "LUCK_CYCLES_ENGINE_001",
    version: VERSIONS.luckRuleVersion,
    ruleFamily: "luck-cycle-calculation",
    baseOn: ["gender", "yearStem", "monthPillar", "solarTerms"],
    scope: "natal-to-luck",
    module: "src/luck",
    api: ["Bazi.Luck", "Bazi.calculate"],
    outputFields: ["luckCycles.direction", "luckCycles.startAge", "luckCycles.variants", "luckCycles.cycles", "luckCycles.cycles[].annuals"],
    sourceIds: ["san-ming-tong-hui"],
    references: [{ type: "classical", sourceId: "san-ming-tong-hui", title: "\u300A\u4E09\u547D\u901A\u6703\u300B", locator: "\u5377\u4E8C\u3008\u8AD6\u5927\u904B\u3009", url: "https://zh.wikisource.org/zh-hant/\u4E09\u547D\u901A\u6703/\u5377\u4E8C" }],
    description: "\u4F9D Profile \u8207\u8D77\u904B\u65B9\u6CD5\u8A08\u7B97\u9806\u9006\u3001\u8D77\u904B\u6B72\u6578\u3001\u5927\u904B\u5E72\u652F\u8207\u53EF\u9078\u9010\u5E74\u8CC7\u6599\uFF0C\u4E26\u4FDD\u7559\u7CBE\u78BA\u7BC0\u6C23\u6CD5\u8207\u6574\u65E5\u6BD4\u8F03\u6CD5\u3002"
  }),
  feature({
    conceptId: "transit.graph",
    name: "\u6D41\u5E74\u8207\u6642\u9593\u904B",
    aliases: ["Transit", "Transit Engine", "\u6D41\u5E74\u6D41\u6708\u6D41\u65E5\u6D41\u6642"],
    conceptType: "transit",
    ruleId: "TRANSIT_ENGINE_001",
    version: VERSIONS.transitGraphVersion,
    ruleFamily: "time-layer-transit",
    baseOn: ["datetime", "timezone", "yearBoundary", "monthBoundary", "dayBoundary"],
    scope: "time-layer",
    module: "src/transit",
    api: ["Bazi.Transit", "Bazi.calculate"],
    outputFields: ["transits.year", "transits.month", "transits.day", "transits.hour", "transits.interactions", "transits.shenShaYear", "transits.transitGraph"],
    description: "\u8A08\u7B97\u6307\u5B9A\u6642\u9593\u7684\u6D41\u5E74\u3001\u6D41\u6708\u3001\u6D41\u65E5\u3001\u6D41\u6642\uFF0C\u4E26\u4EE5 transit graph \u4FDD\u5B58\u6642\u9593\u5C64\u7BC0\u9EDE\u3001\u4E92\u52D5\u8207\u7D50\u69CB\u4E8B\u4EF6\uFF1B\u4E8B\u4EF6\u4E0D\u76F4\u63A5\u7B49\u540C\u5409\u51F6\u3002"
  }),
  feature({
    conceptId: "use-god.resolver",
    name: "\u7528\u795E\u6A21\u578B\u8207\u5019\u9078\u89E3\u6790",
    aliases: ["UseGod", "Use God", "\u7528\u795E"],
    conceptType: "use-god",
    ruleId: "USE_GOD_RESOLVER_001",
    version: VERSIONS.useGodResolverVersion,
    ruleFamily: "multi-model-analysis",
    baseOn: ["strength", "patterns", "profile"],
    scope: "whole-chart-analysis",
    module: "src/analysis",
    api: ["Bazi.Analysis", "Bazi.AI", "Bazi.calculate"],
    outputFields: ["analysis.useGodResolver.candidates", "analysis.useGodResolver.conflicts", "analysis.useGodResolver.finalDecision", "analysis.selected.useGod"],
    sourceIds: ["di-tian-sui-yan-wei"],
    references: [{ type: "classical", sourceId: "di-tian-sui-yan-wei", title: "\u300A\u6EF4\u5929\u9AD3\u95E1\u5FAE\u300B", locator: "\u7528\u795E\u3001\u559C\u795E\u3001\u5FCC\u795E\u3001\u4EC7\u795E\u3001\u9592\u795E\u76F8\u95DC\u6CE8\u89E3", url: "https://zh.wikisource.org/zh-hant/\u6EF4\u5929\u9AD3\u95E1\u5FAE" }],
    description: "\u96C6\u4E2D\u4FDD\u5B58\u6276\u6291\u3001\u683C\u5C40\u3001\u8ABF\u5019\u3001\u901A\u95DC\u8207\u5F9E\u5316\u5019\u9078\uFF1B\u76EE\u524D\u53EA\u6709\u5DF2\u5BE6\u4F5C\u6A21\u578B\u53EF\u4F5C\u6C7A\u5B9A\uFF0C\u5176\u9918\u4FDD\u7559 research-only \u8207 conflict evidence\u3002"
  })
]);

// src/reference/taxonomy.js
var TAXONOMY_VERSION = "0.1.0";
var TAXONOMY_ID = "bazi-js-reference-ontology";
var CONCEPT_TYPES = Object.freeze([
  "calendar",
  "pillar",
  "stem-branch",
  "five-element",
  "ten-god",
  "hidden-stem",
  "nayin",
  "twelve-stage",
  "kongwang",
  "interaction",
  "strength",
  "month-commander",
  "pattern",
  "use-god",
  "shensha",
  "special-rule",
  "auxiliary",
  "luck",
  "transit",
  "profile"
]);
var PATTERN_TYPES = Object.freeze([
  "regular",
  "special",
  "conformity",
  "transformation",
  "other"
]);
var CONCEPT_STATUSES = Object.freeze([
  "canonical",
  "implemented",
  "candidate-only",
  "research-only",
  "conflicted",
  "deprecated"
]);
var REGULAR_CONCEPT_IDS = Object.freeze({
  direct_officer: "pattern.zheng-guan",
  seven_killings: "pattern.qi-sha",
  direct_wealth: "pattern.zheng-cai",
  indirect_wealth: "pattern.pian-cai",
  direct_resource: "pattern.zheng-yin",
  indirect_resource: "pattern.pian-yin",
  eating_god: "pattern.shi-shen",
  hurting_officer: "pattern.shang-guan",
  built_lu: "pattern.jian-lu",
  month_blade: "pattern.yang-ren"
});
var LEGACY_TYPE_MAP = Object.freeze({
  "special-pattern": { conceptType: "pattern", patternType: "special" },
  "special-pillar": { conceptType: "special-rule" },
  "seasonal-special": { conceptType: "special-rule" },
  pattern: { conceptType: "pattern", patternType: "special" }
});
var slug = (value) => String(value || "").trim().replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-+|-+$/g, "").toLowerCase();
function getCanonicalTaxonomy(rule3 = {}) {
  const legacyConceptType = rule3.conceptType || null;
  const mapped = LEGACY_TYPE_MAP[legacyConceptType] || { conceptType: legacyConceptType || "auxiliary" };
  const conceptType = mapped.conceptType;
  const patternType = conceptType === "pattern" ? rule3.patternType || mapped.patternType || (rule3.ruleFamily === "month-commander-pattern" ? "regular" : "special") : void 0;
  return {
    conceptType,
    ...patternType ? { patternType } : {},
    ...legacyConceptType && legacyConceptType !== conceptType ? { legacyConceptType } : {}
  };
}
function getConceptId(rule3 = {}) {
  if (rule3.conceptId) return rule3.conceptId;
  if (REGULAR_CONCEPT_IDS[rule3.id]) return REGULAR_CONCEPT_IDS[rule3.id];
  const taxonomy = getCanonicalTaxonomy(rule3);
  return `${taxonomy.conceptType}.${slug(rule3.id || rule3.name || rule3.ruleId)}`;
}
function getConceptStatus(rule3 = {}) {
  if (CONCEPT_STATUSES.includes(rule3.status)) return rule3.status;
  if (rule3.implemented === false || rule3.tier === "research") return "research-only";
  if (rule3.tier === "candidate") return "candidate-only";
  return "canonical";
}
function canonicalizeRuleTaxonomy(rule3 = {}) {
  const taxonomy = getCanonicalTaxonomy(rule3);
  return {
    ...taxonomy,
    conceptId: getConceptId(rule3),
    status: getConceptStatus(rule3)
  };
}
function validateTaxonomy(rules = [], concepts = []) {
  const errors = [];
  const conceptIds = /* @__PURE__ */ new Set();
  for (const rule3 of rules) {
    const taxonomy = canonicalizeRuleTaxonomy(rule3);
    if (!CONCEPT_TYPES.includes(taxonomy.conceptType)) {
      errors.push(`${rule3.ruleId || rule3.id}: invalid conceptType ${taxonomy.conceptType}`);
    }
    if (taxonomy.conceptType === "pattern" && !PATTERN_TYPES.includes(taxonomy.patternType)) {
      errors.push(`${rule3.ruleId || rule3.id}: invalid patternType ${taxonomy.patternType}`);
    }
    if (!taxonomy.conceptId) errors.push(`${rule3.ruleId || rule3.id}: conceptId is required`);
  }
  for (const concept of concepts) {
    if (!concept.conceptId) errors.push("concept: conceptId is required");
    if (conceptIds.has(concept.conceptId)) errors.push(`duplicate conceptId: ${concept.conceptId}`);
    conceptIds.add(concept.conceptId);
    if (!CONCEPT_TYPES.includes(concept.conceptType)) errors.push(`${concept.conceptId}: invalid conceptType`);
    if (concept.conceptType === "pattern" && !PATTERN_TYPES.includes(concept.patternType)) {
      errors.push(`${concept.conceptId}: patternType is required`);
    }
  }
  return { valid: errors.length === 0, errors, ruleCount: rules.length, conceptCount: concepts.length };
}
function getTaxonomy() {
  return {
    schemaVersion: "1.0.0",
    taxonomyId: TAXONOMY_ID,
    version: TAXONOMY_VERSION,
    conceptTypes: CONCEPT_TYPES.slice(),
    patternTypes: PATTERN_TYPES.slice(),
    statuses: CONCEPT_STATUSES.slice(),
    legacyMappings: Object.fromEntries(Object.entries(LEGACY_TYPE_MAP).map(([key, value]) => [key, { ...value }]))
  };
}

// src/reference/index.js
var RULES = Object.freeze([
  ...SHENSHA_REGISTRY,
  ...SPECIAL_RULE_REGISTRY,
  ...REGULAR_PATTERN_REGISTRY,
  ...SPECIAL_PATTERN_REGISTRY
]);
var SOURCE_HINTS = Object.freeze([
  ["san-ming-tong-hui", ["\u4E09\u547D\u901A\u6703", "\u4E09\u547D\u901A\u4F1A"]],
  ["yuan-hai-zi-ping", ["\u6DF5\u6D77\u5B50\u5E73", "\u6E0A\u6D77\u5B50\u5E73"]],
  ["xie-ji-bian-fang-shu", ["\u5354\u7D00\u8FA8\u65B9\u66F8", "\u534F\u7EAA\u8FA8\u65B9\u4E66"]],
  ["di-tian-sui-yan-wei", ["\u6EF4\u5929\u9AD3\u95E1\u5FAE", "\u6EF4\u5929\u9AD3\u9610\u5FAE"]],
  ["zi-ping-zhen-quan", ["\u5B50\u5E73\u771F\u8A6E", "\u5B50\u5E73\u771F\u8BE0"]],
  ["gu-jin-tu-shu-ji-cheng", ["\u53E4\u4ECA\u5716\u66F8\u96C6\u6210", "\u53E4\u4ECA\u56FE\u4E66\u96C6\u6210"]]
]);
var clone3 = (value) => {
  if (typeof value === "function" || value === void 0) return void 0;
  if (Array.isArray(value)) return value.map(clone3).filter((item) => item !== void 0);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone3(item)]).filter(([, item]) => item !== void 0));
  }
  return value;
};
var sourceRecords = Array.isArray(classical_texts_default.sources) ? classical_texts_default.sources : [];
var sourceMap = new Map(sourceRecords.map((source) => [source.sourceId, source]));
var catalogEvidence = Array.isArray(classical_texts_default.evidenceRecords) ? classical_texts_default.evidenceRecords : [];
var ledgerCitations = Array.isArray(evidence_ledger_default.citations) ? evidence_ledger_default.citations : [];
var editionRecords = Array.isArray(evidence_ledger_default.editionRecords) ? evidence_ledger_default.editionRecords : [];
var catalogVariants = Array.isArray(variants_default.variants) ? variants_default.variants : [];
function ruleText(rule3) {
  return [
    rule3.name,
    rule3.displayName,
    ...rule3.aliases || [],
    rule3.reference,
    ...(rule3.references || []).flatMap((ref) => [ref.title, ref.locator, ref.note])
  ].filter(Boolean).join(" ");
}
function inferSourceIds(rule3) {
  const text = ruleText(rule3);
  const explicit = new Set(rule3.sourceIds || []);
  for (const [sourceId, hints] of SOURCE_HINTS) {
    if (hints.some((hint) => text.includes(hint))) explicit.add(sourceId);
  }
  return [...explicit].filter((sourceId) => sourceMap.has(sourceId));
}
function ruleEvidence(rule3) {
  const ruleIds = [rule3.ruleId, rule3.id].filter(Boolean);
  return [
    ...catalogEvidence.filter((record) => ruleIds.some((id) => (record.ruleIds || []).includes(id))),
    ...ledgerCitations.filter((record) => ruleIds.some((id) => (record.ruleIds || []).includes(id)))
  ];
}
function sourceIdsForRule(rule3) {
  const ids = new Set(inferSourceIds(rule3));
  for (const record of ruleEvidence(rule3)) {
    for (const sourceId of record.sourceIds || [record.sourceId]) {
      if (sourceMap.has(sourceId)) ids.add(sourceId);
    }
  }
  return [...ids];
}
function canonicalRule(rule3) {
  const taxonomy = canonicalizeRuleTaxonomy(rule3);
  const sourceIds = sourceIdsForRule(rule3);
  const evidence = ruleEvidence(rule3);
  return clone3({
    id: rule3.id,
    ruleId: rule3.ruleId,
    conceptId: taxonomy.conceptId,
    name: rule3.name,
    displayName: rule3.displayName || rule3.name,
    aliases: rule3.aliases || [],
    tradition: rule3.tradition,
    conceptType: taxonomy.conceptType,
    ...taxonomy.patternType ? { patternType: taxonomy.patternType } : {},
    ...taxonomy.legacyConceptType ? { legacyConceptType: taxonomy.legacyConceptType } : {},
    ruleFamily: rule3.ruleFamily,
    baseOn: rule3.baseOn || rule3.basedOn || [],
    scope: rule3.scope,
    category: rule3.category,
    confidence: rule3.confidence,
    status: getConceptStatus(rule3),
    version: rule3.version,
    sourceIds,
    references: rule3.references || [],
    description: rule3.description || "",
    interpretation: rule3.interpretation || "",
    variants: rule3.variants || [],
    researchNotes: rule3.researchNotes || {},
    evidence: evidence.length ? evidence : [],
    implementation: {
      status: rule3.implemented === false ? "not-implemented" : "implemented",
      runtimeRegistry: RULES.includes(rule3),
      module: rule3.conceptType === "shensha" ? "src/shensha" : taxonomy.conceptType === "special-rule" ? "src/special-rules" : "src/patterns"
    }
  });
}
function canonicalSystemRule(concept) {
  return clone3({
    id: concept.conceptId,
    ruleId: concept.ruleId,
    conceptId: concept.conceptId,
    name: concept.name,
    displayName: concept.displayName || concept.name,
    aliases: concept.aliases || [],
    tradition: concept.tradition,
    conceptType: concept.conceptType,
    ruleFamily: concept.ruleFamily,
    baseOn: concept.baseOn || [],
    scope: concept.scope,
    category: concept.category || "neutral",
    confidence: concept.confidence,
    status: concept.status,
    version: concept.version,
    sourceIds: concept.sourceIds || [],
    references: concept.references || [],
    description: concept.description || "",
    variants: concept.variants || [],
    researchNotes: concept.researchNotes || {},
    evidence: concept.evidence || [],
    referenceKind: "system-concept",
    api: concept.implementation?.api || [],
    outputFields: concept.implementation?.outputFields || [],
    implementation: {
      ...concept.implementation || {},
      runtimeRegistry: true
    }
  });
}
var SYSTEM_RULES = Object.freeze(SYSTEM_CONCEPTS.map(canonicalSystemRule));
var CANONICAL_RULES = Object.freeze([...RULES.map(canonicalRule), ...SYSTEM_RULES]);
var RULE_BY_ID = new Map(CANONICAL_RULES.flatMap((rule3) => [[rule3.ruleId, rule3], [rule3.id, rule3]]));
function conceptDescription(rules) {
  return rules.find((rule3) => rule3.description)?.description || "";
}
function buildConcept(rules) {
  const first = rules[0];
  const sourceIds = [...new Set(rules.flatMap((rule3) => rule3.sourceIds || []))];
  const aliases = [...new Set(rules.flatMap((rule3) => rule3.aliases || []))];
  return clone3({
    conceptId: first.conceptId,
    name: first.name,
    aliases,
    conceptType: first.conceptType,
    ...first.patternType ? { patternType: first.patternType } : {},
    traditions: [...new Set(rules.map((rule3) => rule3.tradition).filter(Boolean))],
    status: rules.some((rule3) => rule3.status === "canonical") ? "canonical" : first.status,
    ruleIds: rules.map((rule3) => rule3.ruleId),
    sourceIds,
    description: conceptDescription(rules),
    version: [...new Set(rules.map((rule3) => rule3.version).filter(Boolean))].join(", "),
    ruleFamily: [...new Set(rules.map((rule3) => rule3.ruleFamily).filter(Boolean))],
    confidence: [...new Set(rules.map((rule3) => rule3.confidence).filter(Boolean))],
    api: [...new Set(rules.flatMap((rule3) => rule3.api || []))],
    outputFields: [...new Set(rules.flatMap((rule3) => rule3.outputFields || []))],
    evidenceStatus: [...new Set(rules.map((rule3) => rule3.evidence?.status).filter(Boolean))],
    implementation: {
      status: rules.every((rule3) => rule3.implementation?.status === "not-implemented") ? "not-implemented" : "registered",
      modules: [...new Set(rules.map((rule3) => rule3.implementation?.module).filter(Boolean))]
    }
  });
}
var conceptMap = /* @__PURE__ */ new Map();
for (const rule3 of CANONICAL_RULES) {
  const list = conceptMap.get(rule3.conceptId) || [];
  list.push(rule3);
  conceptMap.set(rule3.conceptId, list);
}
var CONCEPTS = Object.freeze([...conceptMap.values()].map(buildConcept));
var CONCEPT_BY_ID = new Map(CONCEPTS.map((concept) => [concept.conceptId, concept]));
function getConcept(query) {
  if (!query) return null;
  const value = String(query).trim().toLowerCase();
  const concept = CONCEPTS.find((item) => [item.conceptId, item.name, ...item.aliases || []].some((field) => String(field).toLowerCase() === value));
  if (!concept) return null;
  return clone3({
    ...concept,
    rules: concept.ruleIds.map((ruleId) => getRule(ruleId)),
    sources: concept.sourceIds.map((sourceId) => getSource(sourceId)),
    variants: getVariants(concept.conceptId)
  });
}
function findConcept(query = "") {
  const value = String(query).trim().toLowerCase();
  if (!value) return CONCEPTS.map(clone3);
  return CONCEPTS.filter((concept) => [concept.conceptId, concept.name, ...concept.aliases || [], concept.description].some((field) => String(field).toLowerCase().includes(value))).map(clone3);
}
function getRule(query) {
  const raw = RULE_BY_ID.get(query) || RULE_BY_ID.get(String(query || "").trim());
  if (!raw) return null;
  return clone3({
    ...raw,
    sources: raw.sourceIds.map((sourceId) => getSource(sourceId))
  });
}
function getSource(sourceId) {
  const source = sourceMap.get(sourceId);
  if (!source) return null;
  const citations = [
    ...catalogEvidence.filter((record) => (record.sourceIds || []).includes(sourceId)),
    ...ledgerCitations.filter((record) => record.sourceId === sourceId)
  ];
  return clone3({
    ...source,
    editionRecords: editionRecords.filter((record) => record.sourceId === sourceId),
    citations
  });
}
function getSourcesForRule(ruleQuery) {
  const rule3 = getRule(ruleQuery);
  return rule3 ? rule3.sourceIds.map(getSource).filter(Boolean) : [];
}
function getRulesFromSource(sourceId) {
  return CANONICAL_RULES.filter((rule3) => rule3.sourceIds.includes(sourceId)).map((rule3) => getRule(rule3.ruleId));
}
function getVariants(query) {
  const ruleIds = CONCEPT_BY_ID.has(query) ? CONCEPT_BY_ID.get(query).ruleIds : [getRule(query)?.ruleId].filter(Boolean);
  const variants = [];
  for (const variant of catalogVariants.filter((item) => !query || item.variantId === query || item.conceptId === query)) {
    variants.push({
      ...clone3(variant),
      sourceIds: variant.sourceIds || [],
      status: variant.status || "comparison",
      variantId: variant.variantId,
      condition: variant.condition || ""
    });
  }
  for (const ruleId of ruleIds) {
    const rule3 = RULE_BY_ID.get(ruleId);
    if (!rule3) continue;
    for (const variant of rule3.variants || []) {
      variants.push({
        variantId: `${rule3.ruleId}:${variant.id || variants.length + 1}`,
        conceptId: rule3.conceptId,
        ruleId: rule3.ruleId,
        tradition: rule3.tradition,
        sourceIds: rule3.sourceIds,
        status: "research-only",
        condition: variant.condition || variant.description || variant.note || "",
        ...clone3(variant)
      });
    }
    for (const record of ruleEvidence(rule3)) {
      for (const variant of record.variants || []) {
        variants.push({
          variantId: `${rule3.ruleId}:${variant.id || record.evidenceId}`,
          conceptId: rule3.conceptId,
          ruleId: rule3.ruleId,
          tradition: rule3.tradition,
          sourceIds: record.sourceIds || [record.sourceId],
          status: "research-only",
          condition: variant.condition || variant.description || variant.note || "",
          ...clone3(variant)
        });
      }
    }
  }
  const unique = new Map(variants.map((variant) => [variant.variantId, variant]));
  return [...unique.values()];
}
function coverageEntry(concept) {
  const rules = concept.ruleIds.map((ruleId) => RULE_BY_ID.get(ruleId)).filter(Boolean);
  const hasSource = concept.sourceIds.length > 0;
  const hasLocator = concept.sourceIds.some((sourceId) => {
    const source = getSource(sourceId);
    return source?.citations?.some((citation) => citation.locator || citation.scope || citation.originalBasis);
  });
  return {
    conceptId: concept.conceptId,
    conceptType: concept.conceptType,
    status: concept.status,
    ruleCount: rules.length,
    sourceLinked: hasSource,
    locatorBacked: hasLocator,
    variantsDocumented: rules.some((rule3) => {
      const evidenceVariants = Array.isArray(rule3.evidence) ? rule3.evidence.some((item) => (item.variants || []).length > 0) : false;
      return (rule3.variants || []).length > 0 || evidenceVariants;
    }),
    machineReadable: true,
    implemented: rules.some((rule3) => rule3.implementation?.status === "implemented"),
    testStatus: "not-collected",
    externalStatus: "not-collected"
  };
}
function dimension(entries, key) {
  const total = entries.length;
  const covered = entries.filter((entry) => entry[key]).length;
  return { covered, total, percent: total ? Number((covered / total * 100).toFixed(1)) : 0 };
}
function getCoverage(type = null) {
  const entries = CONCEPTS.filter((concept) => !type || concept.conceptType === type).map(coverageEntry);
  return {
    coverageVersion: "0.1.0",
    catalogVersion: classical_texts_default.catalogVersion,
    scope: type || "all",
    totals: { concepts: entries.length, rules: entries.reduce((sum, entry) => sum + entry.ruleCount, 0) },
    dimensions: {
      sourceLinked: dimension(entries, "sourceLinked"),
      locatorBacked: dimension(entries, "locatorBacked"),
      variantsDocumented: dimension(entries, "variantsDocumented"),
      machineReadable: dimension(entries, "machineReadable"),
      implemented: dimension(entries, "implemented"),
      tests: { covered: 0, total: entries.length, status: "not-collected" },
      external: { covered: 0, total: entries.length, status: "not-collected" },
      documentation: { covered: entries.filter((entry) => entry.sourceLinked && entry.machineReadable).length, total: entries.length, percent: entries.length ? Number((entries.filter((entry) => entry.sourceLinked && entry.machineReadable).length / entries.length * 100).toFixed(1)) : 0 }
    },
    entries
  };
}
function getCoverageReport() {
  return {
    coverageVersion: "0.1.0",
    taxonomyVersion: TAXONOMY_VERSION,
    catalogVersion: classical_texts_default.catalogVersion,
    scopes: ["all", ...CONCEPT_TYPES].map((scope) => getCoverage(scope === "all" ? null : scope))
  };
}
function toContext2(options = {}) {
  const requested = options.conceptIds || options.concepts || null;
  const concepts = requested ? requested.map((id) => getConcept(id)).filter(Boolean) : CONCEPTS.map((concept) => getConcept(concept.conceptId));
  const rules = concepts.flatMap((concept) => concept.rules || []);
  const sources = options.includeSources === false ? [] : [...new Map(concepts.flatMap((concept) => concept.sources || []).map((source) => [source.sourceId, source])).values()];
  const variants = options.includeVariants === false ? [] : concepts.flatMap((concept) => concept.variants || []);
  return clone3({
    contextType: "bazi-js-reference-context",
    taxonomy: getTaxonomy(),
    concepts: concepts.map((concept) => ({ ...concept, rules: void 0, sources: void 0, variants: void 0 })),
    rules,
    ...options.includeSources === false ? {} : { sources },
    ...options.includeVariants === false ? {} : { variants },
    ...options.includeExamples === false ? {} : { examples: [] },
    ...options.includeResearchNotes === false ? {} : { researchNotes: rules.flatMap((rule3) => rule3.researchNotes ? [{ ruleId: rule3.ruleId, ...rule3.researchNotes }] : []) },
    claimPolicy: {
      mayStateAsImplemented: rules.filter((rule3) => rule3.implementation?.status === "implemented").map((rule3) => rule3.ruleId),
      mayStateAsCanonical: rules.filter((rule3) => rule3.status === "canonical").map((rule3) => rule3.ruleId),
      mustMentionVariant: variants.map((variant) => variant.variantId),
      mustCiteSource: rules.map((rule3) => rule3.ruleId)
    }
  });
}
function validateReferenceIndex() {
  const errors = [];
  const ruleIds = /* @__PURE__ */ new Set();
  for (const rule3 of CANONICAL_RULES) {
    if (ruleIds.has(rule3.ruleId)) errors.push(`duplicate ruleId: ${rule3.ruleId}`);
    ruleIds.add(rule3.ruleId);
    if (!rule3.sourceIds.length && rule3.referenceKind !== "system-concept") errors.push(`${rule3.ruleId}: no linked source`);
    for (const sourceId of rule3.sourceIds) if (!sourceMap.has(sourceId)) errors.push(`${rule3.ruleId}: unknown source ${sourceId}`);
    if (!CONCEPT_TYPES.includes(rule3.conceptType)) errors.push(`${rule3.ruleId}: invalid canonical conceptType`);
    if (rule3.conceptType === "pattern" && !rule3.patternType) errors.push(`${rule3.ruleId}: patternType is required`);
  }
  const taxonomy = validateTaxonomy(RULES, CONCEPTS);
  errors.push(...taxonomy.errors);
  for (const concept of CONCEPTS) {
    if (concept.ruleIds.length === 0) errors.push(`${concept.conceptId}: orphan concept`);
    if (concept.sourceIds.some((sourceId) => !sourceMap.has(sourceId))) errors.push(`${concept.conceptId}: unknown source link`);
  }
  const variantIds = /* @__PURE__ */ new Set();
  for (const variant of catalogVariants) {
    if (variantIds.has(variant.variantId)) errors.push(`duplicate variantId: ${variant.variantId}`);
    variantIds.add(variant.variantId);
    for (const sourceId of variant.sourceIds || []) if (!sourceMap.has(sourceId)) errors.push(`${variant.variantId}: unknown source ${sourceId}`);
  }
  return {
    valid: errors.length === 0,
    errors,
    counts: { rules: CANONICAL_RULES.length, concepts: CONCEPTS.length, sources: sourceRecords.length, variants: catalogVariants.length, catalogEvidence: catalogEvidence.length, ledgerCitations: ledgerCitations.length }
  };
}

// src/renderer/themes/index.js
var THEMES = {
  "modern-oriental": {
    id: "modern-oriental",
    name: "\u73FE\u4EE3\u6771\u65B9",
    background: "#faf8f5",
    cardBg: "#ffffff",
    textPrimary: "#1f1f1f",
    textSecondary: "#3d3d3d",
    textMuted: "#5c5c5c",
    accent: "#a9321f",
    // 朱砂紅（加深，確保小字對比）
    gold: "#7d5f16",
    // 雅金（加深，淺金在白底上對比不足）
    border: "#d9cfbf",
    borderDark: "#b8a88f",
    gridBg: "#f5f1eb",
    tagBg: "#f2eee9",
    shenShaColors: {
      auspicious: "#2f7d4a",
      inauspicious: "#b33b32",
      neutral: "#7d5f16"
    },
    elementColors: {
      "\u6728": "#2d6a4f",
      "\u706B": "#b23a22",
      "\u571F": "#9c6644",
      "\u91D1": "#b38d38",
      "\u6C34": "#1d3557"
    }
  },
  "classic": {
    id: "classic",
    name: "\u53E4\u5178\u4EFF\u5BA3",
    background: "#f4ede1",
    cardBg: "#fdfbf7",
    textPrimary: "#1a1816",
    textSecondary: "#3f3830",
    textMuted: "#5f574a",
    accent: "#8a2b19",
    gold: "#7a5c14",
    border: "#d3c4ab",
    borderDark: "#b09a78",
    gridBg: "#ece3d2",
    tagBg: "#e6dcce",
    shenShaColors: {
      auspicious: "#2d6a4f",
      inauspicious: "#9d2f24",
      neutral: "#7a5c14"
    },
    elementColors: {
      "\u6728": "#26543d",
      "\u706B": "#992d19",
      "\u571F": "#845334",
      "\u91D1": "#997327",
      "\u6C34": "#162942"
    }
  },
  "dark": {
    id: "dark",
    name: "\u7384\u9ED1\u5E7D\u9083",
    background: "#121417",
    cardBg: "#1c1f24",
    textPrimary: "#f2f4f7",
    textSecondary: "#d1d7df",
    textMuted: "#aab3bf",
    accent: "#e06c53",
    gold: "#dfb15b",
    border: "#414955",
    borderDark: "#626d7d",
    gridBg: "#20252c",
    tagBg: "#2b313a",
    shenShaColors: {
      auspicious: "#65c18c",
      inauspicious: "#f07961",
      neutral: "#dfb15b"
    },
    elementColors: {
      "\u6728": "#40916c",
      "\u706B": "#e06c53",
      "\u571F": "#b08968",
      "\u91D1": "#dfb15b",
      "\u6C34": "#457b9d"
    }
  }
};
function getTheme(themeName = "modern-oriental") {
  return THEMES[themeName] || THEMES["modern-oriental"];
}

// src/renderer/presets/index.js
var PRESETS = {
  "full": {
    id: "full",
    name: "\u5168\u89BD\u4E3B\u76E4",
    width: 960,
    height: 1160,
    includePillars: true,
    includeStrength: true,
    includeInteractions: true,
    includeShenSha: true,
    includeLuckCycles: true,
    includeAuxiliary: true
  },
  "mobile-share": {
    id: "mobile-share",
    name: "\u793E\u7FA4\u76F4\u5F0F\u5206\u4EAB",
    width: 640,
    height: 1220,
    includePillars: true,
    includeStrength: true,
    includeInteractions: false,
    includeShenSha: true,
    includeLuckCycles: true,
    includeAuxiliary: true
  },
  "a4": {
    id: "a4",
    name: "A4 \u5217\u5370\u7248\u5F0F",
    width: 800,
    height: 1200,
    includePillars: true,
    includeStrength: true,
    includeInteractions: true,
    includeShenSha: true,
    includeLuckCycles: true,
    includeAuxiliary: true
  },
  "compact": {
    id: "compact",
    name: "\u7CBE\u7C21\u5FAE\u5361",
    width: 600,
    height: 480,
    includePillars: true,
    includeStrength: true,
    includeInteractions: false,
    includeShenSha: false,
    includeLuckCycles: false,
    includeAuxiliary: false
  }
};
function getPreset(presetName = "full") {
  return PRESETS[presetName] || PRESETS["full"];
}

// src/renderer/svg/index.js
var PILLAR_LABELS2 = {
  year: "\u5E74\u67F1",
  month: "\u6708\u67F1",
  day: "\u65E5\u67F1",
  hour: "\u6642\u67F1",
  "transit-year": "\u6D41\u5E74"
};
var BASE_LABELS = {
  yearStem: "\u5E74\u5E72",
  monthStem: "\u6708\u5E72",
  dayStem: "\u65E5\u5E72",
  yearBranch: "\u5E74\u652F",
  monthBranch: "\u6708\u652F",
  dayBranch: "\u65E5\u652F",
  yearPillar: "\u5E74\u67F1",
  dayPillar: "\u65E5\u67F1",
  hourPillar: "\u6642\u67F1",
  wholeChart: "\u6574\u5C40"
};
var CATEGORY_LABELS = { auspicious: "\u5409", inauspicious: "\u51F6", neutral: "\u4E2D\u6027" };
var CONFIDENCE_LABELS = {
  classical: "\u7D93\u5178",
  traditional: "\u50B3\u7D71",
  "modern-common": "\u901A\u884C",
  "school-specific": "\u6D41\u6D3E",
  folk: "\u6C11\u4FD7",
  experimental: "\u5BE6\u9A57"
};
function escapeXml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  })[char]);
}
function formatPillarLabel2(value) {
  if (PILLAR_LABELS2[value]) return PILLAR_LABELS2[value];
  const luckMatch = String(value ?? "").match(/^luck-(\d+)$/);
  if (luckMatch) return `\u521D\u904B\u7B2C${luckMatch[1]}\u6B65`;
  return value || "\u2014";
}
function formatBasedOn(values = []) {
  return values.map((value) => BASE_LABELS[value] || formatPillarLabel2(value)).join("\u3001");
}
function displayName(item) {
  return item && (item.displayName || item.name) || "\u2014";
}
function formatHitOn(hitOn = []) {
  return hitOn.map(formatPillarLabel2).join("\uFF0F");
}
function formatShenShaName(item) {
  const hitOn = item && item.hitOn && item.hitOn.length ? `\uFF08${formatHitOn(item.hitOn)}\uFF09` : "";
  return `${displayName(item)}${hitOn}`;
}
function shenShaToneClass(category) {
  if (category === "auspicious") return "shensha-auspicious";
  if (category === "inauspicious") return "shensha-inauspicious";
  if (category === "neutral") return "shensha-neutral";
  return "body-strong";
}
function formatShenShaList(list = []) {
  return list.length ? list.map(formatShenShaName).join("\u3001 ") : "\u2014";
}
function wrapText(value, maxUnits = 44) {
  const text = String(value ?? "\u2014");
  const lines = [];
  let line = "";
  let units = 0;
  for (const char of text) {
    if (char === "\n") {
      lines.push(line || "\u2014");
      line = "";
      units = 0;
      continue;
    }
    const charUnits = /[\u0000-\u00ff]/.test(char) ? 0.58 : 1;
    if (line && units + charUnits > maxUnits) {
      lines.push(line);
      line = char;
      units = charUnits;
    } else {
      line += char;
      units += charUnits;
    }
  }
  if (line || !lines.length) lines.push(line || "\u2014");
  return lines;
}
function textNode(x, y, value, className, extra = "") {
  return `<text x="${x}" y="${y}" class="${className}"${extra ? ` ${extra}` : ""}>${escapeXml(value)}</text>`;
}
function wrappedText(nodes, value, options = {}) {
  const {
    x = 0,
    y = 0,
    maxUnits = 44,
    lineHeight = 24,
    className = "body",
    extra = ""
  } = options;
  const lines = wrapText(value, maxUnits);
  lines.forEach((line, index) => nodes.push(textNode(x, y + index * lineHeight, line, className, extra)));
  return y + lines.length * lineHeight;
}
function addLabelValue(nodes, label, value, options = {}) {
  const {
    x = 0,
    y = 0,
    labelWidth = 86,
    maxUnits = 34,
    lineHeight = 23,
    labelClass = "label",
    valueClass = "value"
  } = options;
  nodes.push(textNode(x, y, label, labelClass));
  const lines = wrapText(value, maxUnits);
  lines.forEach((line, index) => {
    nodes.push(textNode(x + labelWidth, y + index * lineHeight, line, valueClass));
  });
  return y + Math.max(1, lines.length) * lineHeight;
}
function sectionFrame(width, height, title, innerNodes) {
  return `<g>
    <rect x="0" y="0" width="${width}" height="${height}" class="card" />
    ${textNode(24, 32, title, "section-title")}
    <g transform="translate(24, 58)">${innerNodes.join("")}</g>
  </g>`;
}
function getPillarColumns(result) {
  const p = result.pillars;
  return [
    { key: "hour", title: "\u6642\u67F1", data: p.hour, tenGod: result.tenGods.stems.hour, hidden: result.tenGods.hidden.hour, nayin: result.nayin.hour, stage: result.twelveStages.byDayMaster.hour, selfStage: result.twelveStages.selfSeated.hour },
    { key: "day", title: "\u65E5\u67F1", data: p.day, tenGod: { full: "\u65E5\u4E3B" }, hidden: result.tenGods.hidden.day, nayin: result.nayin.day, stage: result.twelveStages.byDayMaster.day, selfStage: result.twelveStages.selfSeated.day },
    { key: "month", title: "\u6708\u67F1", data: p.month, tenGod: result.tenGods.stems.month, hidden: result.tenGods.hidden.month, nayin: result.nayin.month, stage: result.twelveStages.byDayMaster.month, selfStage: result.twelveStages.selfSeated.month },
    { key: "year", title: "\u5E74\u67F1", data: p.year, tenGod: result.tenGods.stems.year, hidden: result.tenGods.hidden.year, nayin: result.nayin.year, stage: result.twelveStages.byDayMaster.year, selfStage: result.twelveStages.selfSeated.year }
  ];
}
function renderEvidence(nodes, item, startY, maxUnits) {
  const evidence = item && item.evidence || {};
  let y = startY;
  const details = Array.isArray(evidence.details) ? evidence.details : [];
  if (details.length) {
    nodes.push(textNode(20, y, `\u5224\u5B9A\u8B49\u64DA\uFF08${details.length} \u7B46\uFF09`, "evidence-title"));
    y += 21;
    details.forEach((detail) => {
      const detailText = [
        detail.baseValue ? `\u57FA\u6E96 ${detail.baseValue}` : "",
        detail.targetValue ? `\u547D\u4E2D ${detail.targetValue}` : "",
        detail.reason || ""
      ].filter(Boolean).join(" \xB7 ") || "\u7B26\u5408\u898F\u5247";
      y = wrappedText(nodes, `\u2022 ${detailText}`, { x: 20, y, maxUnits, lineHeight: 19, className: "evidence" });
    });
  }
  return y;
}
function renderPillar(result, col, shenSha, width, theme) {
  const nodes = [];
  const available = col.data && col.data.available !== false;
  const stem = available ? col.data.stem : "\uFF1F";
  const branch = available ? col.data.branch : "\uFF1F";
  let y = 30;
  nodes.push(`<rect x="0" y="0" width="${width}" height="1" fill="${theme.border}" />`);
  nodes.push(textNode(width / 2, y, col.title, "pillar-title", 'text-anchor="middle"'));
  y += 32;
  y = addLabelValue(nodes, "\u4E3B\u661F", col.tenGod && (col.tenGod.full || col.tenGod.short), { y, maxUnits: 42, valueClass: "value-accent" });
  y += 7;
  nodes.push(`<g class="character-box"><rect x="0" y="${y - 20}" width="${width}" height="78" rx="6" fill="${theme.gridBg}" stroke="${theme.border}" />`);
  nodes.push(textNode(24, y, "\u5929\u5E72", "label"));
  nodes.push(textNode(132, y + 6, stem, "character"));
  nodes.push(textNode(width / 2 + 24, y, "\u5730\u652F", "label"));
  nodes.push(textNode(width / 2 + 132, y + 6, branch, "character"));
  nodes.push("</g>");
  y += 75;
  nodes.push(textNode(0, y, "\u85CF\u5E79", "label"));
  y += 21;
  const hidden = col.hidden || [];
  if (hidden.length) {
    hidden.forEach((item) => {
      const line = `${item.stem}  ${item.tenGod && item.tenGod.full || ""} \xB7 ${item.role || ""} \xB7 ${item.days || ""}\u65E5/${Math.round((Number(item.weight) || 0) * 100)}%`;
      y = wrappedText(nodes, line, { x: 20, y, maxUnits: 50, lineHeight: 20, className: "body" });
    });
  } else {
    y = wrappedText(nodes, "\u2014", { x: 20, y, maxUnits: 50, lineHeight: 20, className: "body" });
  }
  y += 10;
  nodes.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${theme.border}" />`);
  y += 24;
  y = addLabelValue(nodes, "\u5730\u52E2", col.stage && col.stage.name, { y, maxUnits: 40 });
  y = addLabelValue(nodes, "\u81EA\u5750", col.selfStage && col.selfStage.name, { y, maxUnits: 40 });
  const xunkong = available && col.data.ganzhi ? calculateXunKong(col.data.ganzhi).emptyBranches.join("") : "\u2014";
  y = addLabelValue(nodes, "\u7A7A\u4EA1", xunkong, { y, maxUnits: 40 });
  y = addLabelValue(nodes, "\u7D0D\u97F3", col.nayin, { y, maxUnits: 40 });
  y += 12;
  nodes.push(`<rect x="0" y="${y - 8}" width="${width}" height="1" fill="${theme.border}" />`);
  y += 18;
  nodes.push(textNode(0, y, `\u795E\u715E\uFF08${shenSha.length}\uFF09`, "subsection-title"));
  y += 25;
  if (!shenSha.length) {
    y = wrappedText(nodes, "\u2014 \u6B64\u67F1\u7121\u547D\u4E2D\u795E\u715E", { x: 20, y, maxUnits: 50, lineHeight: 20, className: "muted" });
  } else {
    shenSha.forEach((item) => {
      const itemStart = y;
      const category = CATEGORY_LABELS[item.category] || item.category || "\u2014";
      const confidence = CONFIDENCE_LABELS[item.confidence] || item.confidence || "\u2014";
      const head = `${formatShenShaName(item)}\u3000${category} \xB7 ${confidence}`;
      y = wrappedText(nodes, head, { x: 20, y, maxUnits: 50, lineHeight: 21, className: shenShaToneClass(item.category) });
      y = addLabelValue(nodes, "\u57FA\u6E96", formatBasedOn(item.basedOn || []), { x: 20, y, labelWidth: 58, maxUnits: 43, lineHeight: 19, labelClass: "meta", valueClass: "meta" });
      y = addLabelValue(nodes, "\u4F9D\u64DA", item.reference || "\u672A\u63D0\u4F9B", { x: 20, y, labelWidth: 58, maxUnits: 43, lineHeight: 19, labelClass: "meta", valueClass: "meta" });
      y = renderEvidence(nodes, item, y + 2, 43);
      y = Math.max(y, itemStart + 28) + 13;
    });
  }
  const height = y + 16;
  return { height, nodes: [`<g><rect x="0" y="0" width="${width}" height="${height}" rx="8" fill="${theme.cardBg}" stroke="${theme.border}" />${nodes.join("")}</g>`] };
}
function renderBasicInfo(result, width, theme) {
  const nodes = [];
  const dayMasterStem = result.pillars.day.stem;
  const stem = STEMS[STEM_INDEX[dayMasterStem]] || {};
  const yearStem = STEMS[STEM_INDEX[result.pillars.year.stem]] || {};
  const zodiac = result.calendar.zodiac && result.calendar.zodiac.name || "\u2014";
  const constellation = result.calendar.constellation && result.calendar.constellation.name || "\u2014";
  const prevJie = result.calendar.solarTerms && result.calendar.solarTerms.prevJie;
  const seasonNames = { \u5BC5: "\u6625", \u536F: "\u6625", \u8FB0: "\u6625", \u5DF3: "\u590F", \u5348: "\u590F", \u672A: "\u590F", \u7533: "\u79CB", \u9149: "\u79CB", \u620C: "\u79CB", \u4EA5: "\u51AC", \u5B50: "\u51AC", \u4E11: "\u51AC" };
  const infoItems = [
    ["\u516C\u66C6", `${result.calendar.solar.year}\u5E74${result.calendar.solar.month}\u6708${result.calendar.solar.day}\u65E5 ${result.input.birthTime || "\u672A\u77E5"}`],
    ["\u8FB2\u66C6", `${result.calendar.lunar.monthName}${result.calendar.lunar.dayName}`],
    ["\u9020\u5411", result.input.gender === "male" ? "\u4E7E\u9020\uFF08\u7537\uFF09" : "\u5764\u9020\uFF08\u5973\uFF09"],
    ["\u9670\u967D", yearStem.yinYang === "yang" ? "\u967D" : "\u9670"],
    ["\u751F\u8096", zodiac],
    ["\u661F\u5EA7", constellation],
    ["\u7BC0\u6C23", prevJie ? prevJie.name : "\u2014"],
    ["\u5B63\u7BC0", seasonNames[result.pillars.month.branch] || "\u2014"],
    ["\u53F8\u4EE4", result.strength.monthCommander ? `${result.strength.monthCommander.stem}${result.strength.monthCommander.element}` : "\u2014"],
    ["\u65E5\u4E3B", `${dayMasterStem}${stem.element || ""}\uFF08${result.strength.level}\uFF09`],
    ["\u6708\u4EE4\u683C\u5C40", `${result.tenGods.stems.month ? result.tenGods.stems.month.full : "\u2014"}\u683C`],
    ["\u5F37\u5F31\u5206\u6578", `${result.strength.score} \u5206`],
    ["\u6708\u4EE4\u65FA\u8870", result.strength.monthState ? result.strength.monthState.name : "\u2014"],
    ["\u547D\u5BAE\uFF0F\u8EAB\u5BAE", `${result.auxiliary.mingGong ? result.auxiliary.mingGong.ganzhi : "\u2014"}\uFF0F${result.auxiliary.shenGong ? result.auxiliary.shenGong.ganzhi : "\u2014"}`],
    ["\u547D\u5366", result.auxiliary.mingGua ? `${result.auxiliary.mingGua.trigram.name}\uFF08${result.auxiliary.mingGua.groupName}\uFF09` : "\u2014"],
    ["\u80CE\u5143\uFF0F\u80CE\u606F", `${result.auxiliary.taiYuan ? result.auxiliary.taiYuan.ganzhi : "\u2014"}\uFF0F${result.auxiliary.taiXi ? result.auxiliary.taiXi.ganzhi : "\u2014"}`],
    ["\u8D77\u904B", result.luckCycles && result.luckCycles.startAge ? `${result.luckCycles.startAge.display}${result.luckCycles.startAge.startDateTime ? `\uFF08${result.luckCycles.startAge.startDateTime}\uFF09` : ""}` : "\u2014"],
    ["\u898F\u5247\u7248\u672C", `\u795E\u715E ${result.meta.shenShaRuleVersion || "\u2014"}`]
  ];
  const columns = width >= 700 ? 2 : 1;
  const cellWidth = (width - (columns - 1) * 24) / columns;
  const cellUnits = columns === 2 ? 40 : Math.max(26, Math.floor(cellWidth / 10));
  const rows = Math.ceil(infoItems.length / columns);
  const rowHeight = 38;
  infoItems.forEach(([label, value], index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = col * (cellWidth + 24);
    const y = row * rowHeight + 24;
    nodes.push(`<rect x="${x}" y="${y - 22}" width="${cellWidth}" height="30" rx="5" fill="${theme.gridBg}" />`);
    nodes.push(textNode(x + 12, y - 2, label, "label"));
    const lines = wrapText(value, cellUnits);
    nodes.push(textNode(x + 92, y - 2, lines[0], "value"));
    if (lines.length > 1) nodes.push(textNode(x + 92, y + 16, lines.slice(1).join(""), "value"));
  });
  return { height: rows * rowHeight + 30, nodes };
}
function renderSpecialRules(result) {
  const nodes = [];
  let y = 0;
  const rules = result.specialRules || [];
  if (!rules.length) return { height: 76, nodes: [textNode(0, 24, "\u2014 \u672C\u547D\u76E4\u6C92\u6709\u547D\u4E2D\u7279\u6B8A\u67F1\u4F4D\u6216\u5B63\u7BC0\u689D\u4EF6", "muted")] };
  rules.forEach((item) => {
    const evidence = item.evidence || {};
    const seasonNames = { spring: "\u6625", summer: "\u590F", autumn: "\u79CB", winter: "\u51AC" };
    const evidenceText = [
      `\u57FA\u6E96\uFF1A${formatBasedOn(item.baseOn || item.basedOn || [])}`,
      evidence.targetValue ? `\u547D\u4E2D\uFF1A${evidence.targetValue}` : "",
      evidence.season ? `\u5B63\u7BC0\uFF1A${seasonNames[evidence.season] || evidence.season}\uFF08\u6708\u4EE4${evidence.monthBranch || "\u2014"}\uFF09` : ""
    ].filter(Boolean).join(" \xB7 ");
    nodes.push(textNode(0, y, `${item.name || displayName(item)}`, "body-strong"));
    y += 23;
    y = wrappedText(nodes, evidenceText, { x: 18, y, maxUnits: 50, lineHeight: 20, className: "meta" });
    y = wrappedText(nodes, item.description || "\u2014", { x: 18, y: y + 2, maxUnits: 50, lineHeight: 20, className: "body" });
    y += 13;
  });
  return { height: y + 10, nodes };
}
function renderStrength(result, width, theme) {
  const nodes = [];
  let y = 0;
  y = addLabelValue(nodes, "\u65E5\u4E3B\u65FA\u8870\u5F97\u5206", `${result.strength.score} \u5206 \xB7 \u3010${result.strength.level}\u3011`, { y, maxUnits: 48, valueClass: "value-accent" });
  y = addLabelValue(nodes, "\u559C\u7528\u4E94\u884C", (result.strength.favorableElements || []).join("\u3001") || "\u7121\u7279\u5225\u6A19\u8A18", { y, maxUnits: 48 });
  y = addLabelValue(nodes, "\u5FCC\u4EC7\u4E94\u884C", (result.strength.unfavorableElements || []).join("\u3001") || "\u7121\u7279\u5225\u6A19\u8A18", { y, maxUnits: 48 });
  if (result.strength.monthState) {
    y = addLabelValue(nodes, "\u6708\u4EE4\u65FA\u8870", `\u6708\u652F ${result.strength.monthState.branch}\uFF1A${result.strength.monthState.name}\uFF08\u4FC2\u6578 ${result.strength.monthState.factor}\uFF09`, { y, maxUnits: 48 });
  }
  y += 12;
  nodes.push(textNode(0, y, "\u4E94\u884C\u6BD4\u4F8B", "subsection-title"));
  y += 28;
  const colors = theme.elementColors || {};
  ["\u6728", "\u706B", "\u571F", "\u91D1", "\u6C34"].forEach((element) => {
    const data = result.strength.distribution[element] || { percentage: 0 };
    const state = result.strength.seasonalStates && result.strength.seasonalStates[element];
    const percentage = Number(data.percentage) || 0;
    nodes.push(textNode(0, y + 13, `${element} ${state ? state.name : ""}`, "label", `fill="${colors[element] || theme.textPrimary}"`));
    nodes.push(`<rect x="86" y="${y + 3}" width="${Math.max(120, width - 190)}" height="13" rx="6" fill="${theme.gridBg}" />`);
    nodes.push(`<rect x="86" y="${y + 3}" width="${Math.max(0, Math.min(width - 190, (width - 190) * percentage / 100))}" height="13" rx="6" fill="${colors[element] || theme.textPrimary}" />`);
    nodes.push(textNode(width - 62, y + 14, `${percentage}%`, "value", 'text-anchor="end"'));
    y += 29;
  });
  if (result.strength.evidence && result.strength.evidence.length) {
    y += 12;
    nodes.push(textNode(0, y, `\u5F37\u5F31\u5224\u5B9A evidence\uFF08${result.strength.evidence.length} \u7B46\uFF09`, "subsection-title"));
    y += 24;
    result.strength.evidence.forEach((item) => {
      y = wrappedText(nodes, `${item.ruleId || "\u898F\u5247"}\uFF1A${item.reason || ""}`, { x: 18, y, maxUnits: 50, lineHeight: 19, className: "evidence" });
    });
  }
  return { height: y + 12, nodes };
}
function renderUseGod(result) {
  const nodes = [];
  let y = 0;
  y = wrappedText(nodes, "\u4EE5\u4E0B\u70BA BaziJS \u6276\u6291\u6A21\u578B\u7684\u53EF\u8FFD\u6EAF\u6458\u8981\uFF1B\u6B64\u5340\u50C5\u5448\u73FE\u898F\u5247\u63A8\u5C0E\uFF0C\u4E0D\u63D0\u4F9B\u56FA\u5B9A\u65B7\u8A9E\u6216\u91AB\u7642\u3001\u8CA1\u52D9\u5EFA\u8B70\u3002", { y, maxUnits: 52, lineHeight: 21, className: "meta" });
  y += 10;
  y = addLabelValue(nodes, "\u6276\u52A9\u65B9\u5411", (result.strength.favorableElements || []).join("\u3001") || "\u2014", { y, maxUnits: 46 });
  y = addLabelValue(nodes, "\u5FCC\u4EC7\u65B9\u5411", (result.strength.unfavorableElements || []).join("\u3001") || "\u2014", { y, maxUnits: 46 });
  y = addLabelValue(nodes, "\u5F97\u4EE4\uFF0F\u5F97\u5730\uFF0F\u5F97\u52E2", [result.strength.deLing ? "\u5F97\u4EE4" : "\u4E0D\u5F97\u4EE4", result.strength.deDi ? "\u5F97\u5730" : "\u4E0D\u5F97\u5730", result.strength.deShi ? "\u5F97\u52E2" : "\u4E0D\u5F97\u52E2"].join("\u3001"), { y, maxUnits: 46 });
  y = addLabelValue(nodes, "\u6708\u4EE4\u53F8\u4EE4", result.strength.monthCommander ? `${result.strength.monthCommander.stem}${result.strength.monthCommander.element}\uFF08\u7B2C${result.strength.monthCommander.phase}\u6BB5\uFF09` : "\u2014", { y, maxUnits: 46 });
  if (result.strength.fiveCategory) {
    const groups = result.strength.fiveCategory.groups || {};
    y = addLabelValue(nodes, "\u4E94\u5206\u985E", `\u7528\uFF1A${(groups.use || []).join("\u3001")}\uFF1B\u559C\uFF1A${(groups.joy || []).join("\u3001")}\uFF1B\u9592\uFF1A${(groups.idle || []).join("\u3001")}\uFF1B\u4EC7\uFF1A${(groups.adversary || []).join("\u3001")}\uFF1B\u5FCC\uFF1A${(groups.taboo || []).join("\u3001")}`, { y, maxUnits: 46, lineHeight: 20 });
  }
  return { height: y + 10, nodes };
}
function renderLuckCycles(result, width, theme) {
  const nodes = [];
  let y = 0;
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const cycles = (result.luckCycles && result.luckCycles.cycles || []).slice(0, 8);
  cycles.forEach((cycle, index) => {
    const cardNodes = [];
    let cy = 25;
    cardNodes.push(textNode(18, cy, `${cycle.nominalFromAge ?? cycle.fromAge}\u6B72\u8D77\u3000${cycle.ganzhi}\u3000${cycle.tenGodStem && cycle.tenGodStem.full || cycle.tenGodStem && cycle.tenGodStem.short || ""}`, "body-strong"));
    cy += 23;
    cy = addLabelValue(cardNodes, "\u5E74\u4EFD", `${cycle.fromYear}\u2013${cycle.toYear}`, { x: 18, y: cy, labelWidth: 58, maxUnits: 44, labelClass: "meta", valueClass: "meta" });
    cy = addLabelValue(cardNodes, "\u5927\u904B\u795E\u715E", formatShenShaList(cycle.shenSha || []), { x: 18, y: cy, labelWidth: 78, maxUnits: 39, lineHeight: 20, labelClass: "meta", valueClass: "meta" });
    const annuals = Array.isArray(cycle.annuals) ? cycle.annuals : [];
    if (annuals.length) {
      cy += 8;
      cardNodes.push(textNode(18, cy, `\u9010\u5E74\u8CC7\u6599\uFF08${annuals.length} \u5E74\uFF09`, "subsection-title"));
      cy += 24;
      annuals.forEach((annual) => {
        const isCurrentYear = Number(annual.year) === currentYear;
        const annualStartY = cy;
        const annualNodes = [];
        const headline = `${annual.age}\u6B72 \xB7 ${annual.year}\u5E74 \xB7 ${annual.ganzhi} \xB7 ${annual.tenGod && (annual.tenGod.full || annual.tenGod.short) || ""}`;
        annualNodes.push(`<line x1="18" y1="${cy - 17}" x2="${width - 42}" y2="${cy - 17}" stroke="${theme.border}" />`);
        cy = wrappedText(annualNodes, headline, { x: 24, y: cy, maxUnits: 49, lineHeight: 19, className: "body-strong" });
        const detail = [
          annual.stage && annual.stage.name ? `\u5730\u52E2 ${annual.stage.name}` : "",
          annual.nayin ? `\u7D0D\u97F3 ${annual.nayin}` : "",
          annual.xunKong && annual.xunKong.emptyBranches ? `\u65EC\u7A7A ${annual.xunKong.emptyBranches.join("")}` : ""
        ].filter(Boolean).join(" \xB7 ");
        cy = wrappedText(annualNodes, detail || "\u2014", { x: 24, y: cy, maxUnits: 49, lineHeight: 18, className: "meta" });
        const interactionText = (annual.interactions || []).map((item) => item.description || item.name).filter(Boolean).join("\u3001");
        if (interactionText) {
          cy = wrappedText(annualNodes, `\u4E92\u52D5\uFF1A${interactionText}`, { x: 24, y: cy, maxUnits: 49, lineHeight: 18, className: "body" });
        }
        cy = wrappedText(annualNodes, `\u795E\u715E\uFF1A${formatShenShaList(annual.shenSha || [])}`, { x: 24, y: cy, maxUnits: 49, lineHeight: 18, className: "body" });
        if (isCurrentYear) {
          const annualHeight = cy - annualStartY + 14;
          cardNodes.push(`<rect x="18" y="${annualStartY - 17}" width="${width - 60}" height="${annualHeight}" rx="5" fill="${theme.accent}" fill-opacity="0.06" stroke="${theme.accent}" stroke-width="2" />`);
          cardNodes.push(textNode(width - 74, annualStartY + 2, "\u4ECA\u5E74", "current-badge", 'text-anchor="end"'));
        }
        cardNodes.push(...annualNodes);
        cy += 8;
      });
    }
    const cardHeight = cy + 16;
    nodes.push(`<g transform="translate(0, ${y})"><rect x="0" y="0" width="${width}" height="${cardHeight}" rx="7" fill="${theme.gridBg}" stroke="${theme.border}" />${cardNodes.join("")}</g>`);
    y += cardHeight + (index < cycles.length - 1 ? 14 : 0);
  });
  return { height: Math.max(78, y + 4), nodes };
}
function renderTransit(result) {
  const nodes = [];
  const transit = result.transits && result.transits.year;
  if (!transit) return { height: 60, nodes: [textNode(0, 24, "\u2014 \u7121\u6D41\u5E74\u8CC7\u6599", "muted")] };
  const events = [...new Set((result.transits && result.transits.transitGraph && result.transits.transitGraph.events || []).map((event) => event && event.type).filter(Boolean))];
  let y = 0;
  y = addLabelValue(nodes, "\u6D41\u5E74", transit.ganzhi, { y, maxUnits: 45 });
  y = addLabelValue(nodes, "\u5341\u795E", transit.tenGod && (transit.tenGod.full || transit.tenGod.short), { y, maxUnits: 45 });
  y = addLabelValue(nodes, "\u5730\u52E2\uFF0F\u7D0D\u97F3", `${transit.stage && transit.stage.name || "\u2014"} \xB7 ${transit.nayin || "\u2014"}`, { y, maxUnits: 45 });
  if (events.length) y = addLabelValue(nodes, "\u7D50\u69CB\u4E8B\u4EF6", events.join("\u3001"), { y: y + 4, maxUnits: 37, lineHeight: 20 });
  const list = result.transits.shenShaYear || transit.shenSha || [];
  y = addLabelValue(nodes, `\u6D41\u5E74\u795E\u715E\uFF08${list.length}\uFF09`, formatShenShaList(list), { y: y + 4, labelWidth: 108, maxUnits: 37, lineHeight: 20 });
  return { height: y + 10, nodes };
}
function renderInteractions(result) {
  const nodes = [];
  const items = [
    ...(result.interactions && result.interactions.stems || []).map((item) => `\u5929\u5E72\uFF1A${item.name}`),
    ...(result.interactions && result.interactions.branches || []).map((item) => `\u5730\u652F\uFF1A${item.name}`)
  ];
  if (!items.length) return { height: 60, nodes: [textNode(0, 24, "\u2014 \u7121\u660E\u986F\u4E92\u52D5", "muted")] };
  let y = 0;
  items.forEach((item) => {
    y = wrappedText(nodes, `\u2022 ${item}`, { x: 8, y, maxUnits: 52, lineHeight: 23, className: "body" });
  });
  return { height: y + 10, nodes };
}
function renderShenShaSummary(result) {
  const nodes = [];
  let y = 0;
  const rows = [
    ["\u539F\u5C40\u795E\u715E", result.shenSha || []],
    ["\u6D41\u5E74\u795E\u715E", result.transits && result.transits.shenShaYear || []],
    ["\u521D\u904B\u795E\u715E", result.luckCycles && result.luckCycles.cycles[0] && result.luckCycles.cycles[0].shenSha || []]
  ];
  rows.forEach(([label, list]) => {
    y = addLabelValue(nodes, label, formatShenShaList(list), { y, labelWidth: 92, maxUnits: 42, lineHeight: 21 });
    y += 4;
  });
  const auxiliary = result.auxiliary || {};
  y = addLabelValue(nodes, "\u80CE\u5143\u547D\u5BAE", `\u80CE\u5143\uFF1A${auxiliary.taiYuan && auxiliary.taiYuan.ganzhi || "\u2014"} \uFF5C \u80CE\u606F\uFF1A${auxiliary.taiXi && auxiliary.taiXi.ganzhi || "\u2014"} \uFF5C \u547D\u5BAE\uFF1A${auxiliary.mingGong && auxiliary.mingGong.ganzhi || "\u2014"} \uFF5C \u8EAB\u5BAE\uFF1A${auxiliary.shenGong && auxiliary.shenGong.ganzhi || "\u2014"}`, { y, labelWidth: 92, maxUnits: 42, lineHeight: 21 });
  y = addLabelValue(nodes, "\u547D\u5366", auxiliary.mingGua ? `${auxiliary.mingGua.trigram.name}\uFF08${auxiliary.mingGua.groupName}\uFF09` : "\u2014", { y, labelWidth: 92, maxUnits: 42, lineHeight: 21 });
  return { height: y + 10, nodes };
}
function renderSvg(chartResult, options = {}) {
  const theme = getTheme(options.theme || "modern-oriental");
  const preset = getPreset(options.preset || "full");
  const result = chartResult;
  const width = preset.width;
  const contentWidth = width - 80;
  const body = [];
  let y = 36;
  body.push(textNode(40, y, "\u516B\u5B57\u547D\u76E4 \xB7 \u5B50\u5E73\u56DB\u67F1", "title"));
  body.push(textNode(40, y + 29, `BaziJS \u547D\u7406\u5F15\u64CE v${result.meta.engineVersion} \xB7 \u898F\u7BC4\u6D41\u6D3E\uFF1A${result.meta.profileName}`, "subtitle"));
  y += 86;
  const addSection = (title, builder) => {
    const built = builder(contentWidth);
    const height2 = Math.max(76, built.height + 64);
    body.push(`<g transform="translate(40, ${y})">${sectionFrame(contentWidth, height2, title, built.nodes)}</g>`);
    y += height2 + 24;
  };
  addSection("\u57FA\u672C\u8CC7\u6599", (innerWidth) => renderBasicInfo(result, innerWidth, theme));
  if (preset.includePillars) {
    addSection("\u56DB\u67F1\u4E3B\u76E4", (innerWidth) => {
      const group = groupShenShaByPillar(result.shenSha || []);
      const nodes = [];
      let innerY = 0;
      getPillarColumns(result).forEach((col) => {
        const rendered = renderPillar(result, col, group[col.key] || [], innerWidth, theme);
        nodes.push(`<g transform="translate(0, ${innerY})">${rendered.nodes.join("")}</g>`);
        innerY += rendered.height + 14;
      });
      return { height: innerY, nodes };
    });
  }
  if (preset.includeShenSha) addSection("\u7279\u6B8A\u67F1\u4F4D\u8207\u5B63\u7BC0\u689D\u4EF6", (innerWidth) => renderSpecialRules(result, innerWidth, theme));
  if (preset.includeStrength) {
    addSection("\u4E94\u884C\u5206\u6790 \xB7 \u6C23\u6578\u8207\u5F37\u5F31\u5E73\u8861", (innerWidth) => renderStrength(result, innerWidth, theme));
    addSection("\u7528\u795E\u6A21\u578B", (innerWidth) => renderUseGod(result, innerWidth, theme));
  }
  if (preset.includeLuckCycles && result.luckCycles) {
    addSection(`\u8D77\u904B\u8D70\u52E2\uFF08${result.luckCycles.directionText} \xB7 ${result.luckCycles.startAge.display}\u8D77\u904B\uFF09`, (innerWidth) => renderLuckCycles(result, innerWidth, theme));
  }
  if (preset.includeShenSha) addSection("\u6D41\u5E74\u8A73\u7D30", (innerWidth) => renderTransit(result, innerWidth, theme));
  if (preset.includeInteractions) addSection("\u5929\u5E72\u5730\u652F\u4E92\u52D5", (innerWidth) => renderInteractions(result, innerWidth, theme));
  if (preset.includeShenSha) addSection("\u795E\u715E\u5409\u51F6\u8207\u547D\u5BAE\u8EAB\u5BAE", (innerWidth) => renderShenShaSummary(result, innerWidth, theme));
  y += 10;
  const height = y + 42;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMin meet" overflow="visible" style="display:block;width:${width}px;max-width:100%;height:auto;" role="img" aria-label="BaziJS \u5B8C\u6574\u516B\u5B57\u547D\u76E4">
  <defs>
    <style>
      .title { font-size: 28px; font-weight: 800; fill: ${theme.textPrimary}; letter-spacing: 1.5px; }
      .subtitle { font-size: 15px; font-weight: 600; fill: ${theme.textSecondary}; }
      .section-title { font-size: 20px; font-weight: 800; fill: ${theme.accent}; letter-spacing: 1px; }
      .pillar-title { font-size: 19px; font-weight: 800; fill: ${theme.accent}; }
      .subsection-title { font-size: 15px; font-weight: 800; fill: ${theme.accent}; }
      .label { font-size: 14px; font-weight: 700; fill: ${theme.textSecondary}; }
      .value { font-size: 15px; font-weight: 700; fill: ${theme.textPrimary}; }
      .value-accent { font-size: 15px; font-weight: 800; fill: ${theme.accent}; }
      .character { font-size: 38px; font-weight: 800; fill: ${theme.textPrimary}; }
      .body { font-size: 14px; font-weight: 600; fill: ${theme.textPrimary}; }
      .body-strong { font-size: 15px; font-weight: 800; fill: ${theme.textPrimary}; }
      .shensha-auspicious { font-size: 15px; font-weight: 800; fill: ${theme.shenShaColors?.auspicious || theme.textPrimary}; }
      .shensha-inauspicious { font-size: 15px; font-weight: 800; fill: ${theme.shenShaColors?.inauspicious || theme.textPrimary}; }
      .shensha-neutral { font-size: 15px; font-weight: 800; fill: ${theme.shenShaColors?.neutral || theme.textPrimary}; }
      .meta { font-size: 13px; font-weight: 600; fill: ${theme.textSecondary}; }
      .evidence-title { font-size: 13px; font-weight: 800; fill: ${theme.accent}; }
      .evidence { font-size: 12px; font-weight: 600; fill: ${theme.textSecondary}; }
      .muted { font-size: 14px; font-weight: 600; fill: ${theme.textMuted}; }
      .current-badge { font-size: 12px; font-weight: 800; fill: ${theme.accent}; }
      .watermark { font-size: 11px; font-weight: 600; fill: ${theme.textSecondary}; opacity: 0.52; letter-spacing: 0.35px; }
      .card { fill: ${theme.cardBg}; stroke: ${theme.border}; stroke-width: 1.2; }
    </style>
  </defs>
  <rect x="0" y="0" width="${width}" height="${height}" fill="${theme.background}" />
  <rect x="16" y="16" width="${width - 32}" height="${height - 32}" rx="12" fill="none" stroke="${theme.border}" stroke-width="1.5" />
  ${body.join("")}
  ${textNode(width - 40, height - 44, "\u7576\u9EBB\u5BE6\u9A57\u5BA4 \xB7 github.com/donma/bazi-js", "watermark", 'text-anchor="end"')}
  ${textNode(width / 2, height - 24, "BaziJS \u958B\u6E90\u547D\u7406\u5F15\u64CE \xB7 Apache-2.0 \u6388\u6B0A", "muted", 'text-anchor="middle"')}
</svg>`;
}

// src/renderer/png/index.js
async function renderPng(chartResult, options = {}) {
  const svgString = renderSvg(chartResult, options);
  if (typeof window === "undefined" || typeof document === "undefined") {
    return {
      format: "png",
      isNodeMock: true,
      svg: svgString,
      note: "Node.js \u74B0\u5883\u7121\u539F\u751F DOM Image/Canvas\uFF0C\u8ACB\u5728\u700F\u89BD\u5668\u74B0\u5883\u57F7\u884C\u4EE5\u53D6\u5F97 Blob \u6216\u4F7F\u7528 canvas \u6A21\u7D44"
    };
  }
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const URL = window.URL || window.webkitURL || window;
      const blobUrl = URL.createObjectURL(svgBlob);
      img.onload = () => {
        const scale = Number.isFinite(Number(options.pngScale)) && Number(options.pngScale) > 0 ? Number(options.pngScale) : 2;
        const sourceWidth = img.naturalWidth || img.width || 960;
        const sourceHeight = img.naturalHeight || img.height || 980;
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(sourceWidth * scale);
        canvas.height = Math.ceil(sourceHeight * scale);
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(blobUrl);
        canvas.toBlob((blob) => {
          resolve({
            format: "png",
            blob,
            dataUrl: canvas.toDataURL("image/png"),
            width: canvas.width,
            height: canvas.height,
            scale
          });
        }, "image/png");
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(blobUrl);
        reject(new Error("SVG \u8F49\u63DB PNG \u5931\u6557: " + (err.message || "Image \u8F09\u5165\u932F\u8AA4")));
      };
      img.src = blobUrl;
    } catch (e) {
      reject(e);
    }
  });
}

// src/renderer/index.js
function render(chartResult, options = {}) {
  const format = options.format || "svg";
  if (format === "svg") {
    return renderSvg(chartResult, options);
  }
  if (format === "png") {
    return renderPng(chartResult, options);
  }
  throw new Error(`\u4E0D\u652F\u63F4\u7684\u6E32\u67D3\u683C\u5F0F: ${format}\uFF0C\u50C5\u652F\u63F4 "svg" \u6216 "png"`);
}
var Renderer = {
  render,
  renderSvg,
  renderPng,
  themes: THEMES,
  presets: PRESETS
};

// src/index.js
var Validation = Object.freeze({ ...validation_exports, ...validation_exports2 });
var Bazi = {
  version: VERSIONS.engineVersion,
  rules: {
    version: VERSIONS.ruleSetVersion,
    shenSha: { version: VERSIONS.shenShaRuleVersion },
    tenGod: { version: VERSIONS.tenGodRuleVersion },
    hiddenStem: { version: VERSIONS.hiddenStemRuleVersion },
    specialRules: { version: VERSIONS.specialRuleVersion },
    patterns: { version: VERSIONS.patternRuleVersion, regularVersion: VERSIONS.regularPatternRuleVersion },
    strength: { version: VERSIONS.strengthRuleVersion, qiLayerVersion: VERSIONS.strengthQiLayerVersion, fiveCategoryVersion: VERSIONS.fiveCategoryRuleVersion },
    auxiliary: { version: VERSIONS.auxiliaryRuleVersion },
    classicalSummary: { version: VERSIONS.classicalSummaryRuleVersion },
    analysis: { version: VERSIONS.analysisRuleVersion },
    luck: { version: VERSIONS.luckRuleVersion },
    interactions: { version: VERSIONS.interactionRuleVersion },
    transit: { version: VERSIONS.transitGraphVersion },
    useGod: { version: VERSIONS.useGodResolverVersion },
    reference: {
      taxonomyVersion: VERSIONS.referenceTaxonomyVersion,
      indexVersion: VERSIONS.referenceIndexVersion,
      coverageVersion: VERSIONS.referenceCoverageVersion
    }
  },
  calculate,
  calculateSafe,
  Chart,
  Calendar: solar_terms_exports,
  TenGods: tengods_exports,
  Solar: solar_exports,
  Lunar: lunar_exports,
  Constellation: constellation_exports,
  Zodiac: zodiac_exports,
  Julian: julian_exports,
  TrueSolarTime: true_solar_time_exports,
  Rules: rule_registry_exports,
  ShenSha: shensha_exports,
  SpecialRules: special_rules_exports,
  Patterns: patterns_exports,
  Strength: strength_exports,
  Auxiliary: auxiliary_exports,
  Summary: summary_exports,
  Analysis: analysis_exports,
  Luck: luck_exports,
  Transit: transit_exports,
  AI: ai_exports,
  Renderer,
  Validation,
  ValidationData: validation_exports2,
  Errors: errors_exports,
  Reference: reference_exports,
  Constants: stems_exports
};
var index_default = Bazi;
export {
  ai_exports as AI,
  analysis_exports as Analysis,
  auxiliary_exports as Auxiliary,
  solar_terms_exports as Calendar,
  Chart,
  stems_exports as Constants,
  constellation_exports as Constellation,
  errors_exports as Errors,
  julian_exports as Julian,
  luck_exports as Luck,
  lunar_exports as Lunar,
  patterns_exports as Patterns,
  reference_exports as Reference,
  Renderer,
  rule_registry_exports as Rules,
  shensha_exports as ShenSha,
  solar_exports as Solar,
  special_rules_exports as SpecialRules,
  strength_exports as Strength,
  summary_exports as Summary,
  tengods_exports as TenGods,
  transit_exports as Transit,
  true_solar_time_exports as TrueSolarTime,
  VERSIONS,
  Validation,
  validation_exports2 as ValidationData,
  zodiac_exports as Zodiac,
  calculate,
  calculateSafe,
  index_default as default
};
//# sourceMappingURL=bazi-sdk.esm.js.map
