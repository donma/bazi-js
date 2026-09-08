var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/core/utils/validation.js
var validation_exports = {};
__export(validation_exports, {
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

// src/core/utils/validation.js
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
  if (month < 1 || month > 12 || day < 1 || day > 31) {
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
    if (!input.birthTime) {
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
    if (!input.birthHourBranch || !BRANCH_INDEX[input.birthHourBranch] === void 0) {
      throw new BaziValidationError('birthTimeMode \u70BA "branch" \u6642\u5FC5\u9808\u63D0\u4F9B\u6709\u6548\u7684\u5730\u652F birthHourBranch (\u5982 "\u5348")', "birthHourBranch");
    }
  }
  const timezone = input.timezone || "+08:00";
  const tzMatch = timezone.match(/^([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!tzMatch) {
    throw new BaziValidationError('timezone \u683C\u5F0F\u4E0D\u6B63\u78BA\uFF0C\u4F8B\u5982 "+08:00" \u6216 "-05:00"', "timezone");
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
  yearBoundary = "lichun"
  // 'lichun' | 'lunar_new_year'
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
  } else {
    trace.push(`\u4F7F\u7528\u81EA\u8A02\u5E74\u908A\u754C: ${yearBoundary}`);
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
  monthBoundary = "jie"
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
    yearBoundary
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
    monthBoundary
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

// src/tengods/index.js
function calculateChartTenGods(pillars) {
  const dayMaster = pillars.day.stem;
  const stems = {
    year: getTenGod(dayMaster, pillars.year.stem),
    month: getTenGod(dayMaster, pillars.month.stem),
    day: { id: "day_master", short: "\u65E5\u4E3B", full: "\u65E5\u4E3B" },
    hour: pillars.hour.available ? getTenGod(dayMaster, pillars.hour.stem) : null
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
      tenGod: getTenGod(dayMaster, h.stem)
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
  const rule = STEM_CHANGSHENG_MAP[stemChar];
  if (!rule) return null;
  const startIdx = BRANCH_INDEX[rule.startBranch];
  const targetIdx = BRANCH_INDEX[branchChar];
  if (targetIdx === void 0) return null;
  let step;
  if (rule.forward) {
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
function getKongWang(sexagenaryIdx) {
  const i = (sexagenaryIdx % 60 + 60) % 60;
  const xun = XUN_KONGWANG.find((x) => i >= x.start && i <= x.end);
  return xun ? xun.kong : [];
}

// src/core/constants/kongwang-calc.js
function calculateChartKongWang(pillars) {
  const dayKong = getKongWang(pillars.day.sexagenaryIndex);
  const yearKong = getKongWang(pillars.year.sexagenaryIndex);
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
function calculateChartAuxiliary(pillars) {
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
      taiYuan,
      taiXi,
      mingGong: null,
      shenGong: null
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
    taiYuan,
    taiXi,
    mingGong,
    shenGong
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
    stems: stemsInteractions,
    branches: branchesInteractions
  };
}

// src/strength/index.js
var strength_exports = {};
__export(strength_exports, {
  calculateStrength: () => calculateStrength
});
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
function calculateStrength(pillars, interactions = null) {
  const dayMasterStem = pillars.day.stem;
  const dayMasterData = STEMS[STEM_INDEX[dayMasterStem]];
  const dmElement = dayMasterData.element;
  const evidence = [];
  const elementScores = { "\u6728": 0, "\u706B": 0, "\u571F": 0, "\u91D1": 0, "\u6C34": 0 };
  const stemWeights = [
    { pillar: "year", stem: pillars.year.stem, weight: 8 },
    { pillar: "month", stem: pillars.month.stem, weight: 12 },
    ...pillars.hour.available ? [{ pillar: "hour", stem: pillars.hour.stem, weight: 10 }] : []
  ];
  for (const item of stemWeights) {
    const el = STEMS[STEM_INDEX[item.stem]].element;
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
    distribution: fiveElementsDistribution,
    favorableElements: [...new Set(favorableElements)],
    unfavorableElements: [...new Set(unfavorableElements)],
    evidence
  };
}

// src/shensha/index.js
var shensha_exports = {};
__export(shensha_exports, {
  calculateShenSha: () => calculateShenSha,
  calculateShenShaOnPillar: () => calculateShenShaOnPillar
});

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
  // 17. 魁罡貴人
  // 戊戌、庚戌、庚辰、壬辰四日出生者為魁罡。
  {
    id: "kui_gang",
    name: "\u9B41\u7F61\u8CB4\u4EBA",
    category: "neutral",
    baseOn: ["dayPillar"],
    ruleId: "SS_KUIGANG_017",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E94\u3001\u300A\u6DF5\u6D77\u5B50\u5E73\u300B",
    matchChart: (pillars) => {
      const ganzhi = `${pillars.day.stem}${pillars.day.branch}`;
      return ["\u620A\u620C", "\u5E9A\u620C", "\u5E9A\u8FB0", "\u58EC\u8FB0"].includes(ganzhi);
    }
  },
  // 18. 紅鸞星
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
  // 19. 天喜星（紅鸞對沖位）
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
  // 20. 天醫星
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
  // 21. 紅艷煞
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
  },
  // 22. 十惡大敗日
  // 甲辰、乙巳、丙申、丁亥、戊戌、己丑、庚辰、辛巳、壬申、癸亥十日為十惡大敗日。
  {
    id: "shi_e_da_bai",
    name: "\u5341\u60E1\u5927\u6557\u65E5",
    category: "inauspicious",
    baseOn: ["dayPillar"],
    ruleId: "SS_SHIEDABAI_022",
    version: "1.0.0",
    reference: "\u300A\u4E09\u547D\u901A\u6703\u300B\u5377\u4E94",
    matchChart: (pillars) => {
      const ganzhi = `${pillars.day.stem}${pillars.day.branch}`;
      return ["\u7532\u8FB0", "\u4E59\u5DF3", "\u4E19\u7533", "\u4E01\u4EA5", "\u620A\u620C", "\u5DF1\u4E11", "\u5E9A\u8FB0", "\u8F9B\u5DF3", "\u58EC\u7533", "\u7678\u4EA5"].includes(ganzhi);
    }
  }
];

// src/shensha/index.js
function calculateShenSha(pillars) {
  const results = [];
  const pillarEntries = [
    { pillar: "year", stem: pillars.year.stem, branch: pillars.year.branch },
    { pillar: "month", stem: pillars.month.stem, branch: pillars.month.branch },
    { pillar: "day", stem: pillars.day.stem, branch: pillars.day.branch },
    ...pillars.hour.available ? [{ pillar: "hour", stem: pillars.hour.stem, branch: pillars.hour.branch }] : []
  ];
  for (const rule of SHENSHA_CATALOG) {
    if (rule.matchChart) {
      if (rule.matchChart(pillars)) {
        results.push({
          id: rule.id,
          name: rule.name,
          category: rule.category,
          hitOn: ["day"],
          basedOn: rule.baseOn,
          ruleId: rule.ruleId,
          version: rule.version,
          reference: rule.reference,
          evidence: {
            reason: `\u65E5\u67F1\u70BA\u3010${pillars.day.stem}${pillars.day.branch}\u3011\uFF0C\u7B26\u5408${rule.name}\u689D\u4EF6`
          }
        });
      }
      continue;
    }
    const hitPillars = [];
    const baseUsed = [];
    let evidenceText = "";
    for (const target of pillarEntries) {
      if (rule.baseOn.includes("dayStem")) {
        if (rule.match({ baseStem: pillars.day.stem, targetBranch: target.branch })) {
          hitPillars.push(target.pillar);
          baseUsed.push(`\u4EE5\u65E5\u5E72\u3010${pillars.day.stem}\u3011\u67E5\u5F97\u3010${target.branch}\u3011\u65BC ${target.pillar} \u652F`);
        }
      }
      if (rule.baseOn.includes("yearStem")) {
        if (rule.match({ baseStem: pillars.year.stem, targetBranch: target.branch })) {
          if (!hitPillars.includes(target.pillar)) hitPillars.push(target.pillar);
          baseUsed.push(`\u4EE5\u5E74\u5E72\u3010${pillars.year.stem}\u3011\u67E5\u5F97\u3010${target.branch}\u3011\u65BC ${target.pillar} \u652F`);
        }
      }
      if (rule.baseOn.includes("monthBranch")) {
        if (rule.match({ monthBranch: pillars.month.branch, targetStem: target.stem, targetBranch: target.branch })) {
          if (!hitPillars.includes(target.pillar)) hitPillars.push(target.pillar);
          baseUsed.push(`\u4EE5\u6708\u4EE4\u3010${pillars.month.branch}\u3011\u67E5\u5F97 ${target.pillar} \u67F1`);
        }
      }
      if (rule.baseOn.includes("dayBranch")) {
        if (rule.match({ baseBranch: pillars.day.branch, targetBranch: target.branch })) {
          if (!hitPillars.includes(target.pillar)) hitPillars.push(target.pillar);
          baseUsed.push(`\u4EE5\u65E5\u652F\u3010${pillars.day.branch}\u3011\u67E5\u5F97\u3010${target.branch}\u3011\u65BC ${target.pillar} \u652F`);
        }
      }
      if (rule.baseOn.includes("yearBranch")) {
        if (rule.match({ baseBranch: pillars.year.branch, targetBranch: target.branch })) {
          if (!hitPillars.includes(target.pillar)) hitPillars.push(target.pillar);
          baseUsed.push(`\u4EE5\u5E74\u652F\u3010${pillars.year.branch}\u3011\u67E5\u5F97\u3010${target.branch}\u3011\u65BC ${target.pillar} \u652F`);
        }
      }
    }
    if (hitPillars.length > 0) {
      results.push({
        id: rule.id,
        name: rule.name,
        category: rule.category,
        hitOn: hitPillars,
        basedOn: rule.baseOn,
        ruleId: rule.ruleId,
        version: rule.version,
        reference: rule.reference,
        evidence: {
          details: baseUsed
        }
      });
    }
  }
  return results;
}
function calculateShenShaOnPillar(natalPillars, stemChar, branchChar, pillarLabel) {
  const results = [];
  if (!stemChar || !branchChar) return results;
  for (const rule of SHENSHA_CATALOG) {
    if (rule.matchChart) continue;
    const baseUsed = [];
    if (rule.baseOn.includes("dayStem")) {
      if (rule.match({ baseStem: natalPillars.day.stem, targetBranch: branchChar })) {
        baseUsed.push(`\u4EE5\u65E5\u5E72\u3010${natalPillars.day.stem}\u3011\u67E5\u5F97\u3010${branchChar}\u3011`);
      }
    }
    if (rule.baseOn.includes("yearStem")) {
      if (rule.match({ baseStem: natalPillars.year.stem, targetBranch: branchChar })) {
        baseUsed.push(`\u4EE5\u5E74\u5E72\u3010${natalPillars.year.stem}\u3011\u67E5\u5F97\u3010${branchChar}\u3011`);
      }
    }
    if (rule.baseOn.includes("monthBranch")) {
      if (rule.match({ monthBranch: natalPillars.month.branch, targetStem: stemChar, targetBranch: branchChar })) {
        baseUsed.push(`\u4EE5\u6708\u4EE4\u3010${natalPillars.month.branch}\u3011\u67E5\u5F97`);
      }
    }
    if (rule.baseOn.includes("dayBranch")) {
      if (rule.match({ baseBranch: natalPillars.day.branch, targetBranch: branchChar })) {
        baseUsed.push(`\u4EE5\u65E5\u652F\u3010${natalPillars.day.branch}\u3011\u67E5\u5F97\u3010${branchChar}\u3011`);
      }
    }
    if (rule.baseOn.includes("yearBranch")) {
      if (rule.match({ baseBranch: natalPillars.year.branch, targetBranch: branchChar })) {
        baseUsed.push(`\u4EE5\u5E74\u652F\u3010${natalPillars.year.branch}\u3011\u67E5\u5F97\u3010${branchChar}\u3011`);
      }
    }
    if (baseUsed.length > 0) {
      results.push({
        id: rule.id,
        name: rule.name,
        category: rule.category,
        hitOn: [pillarLabel],
        basedOn: rule.baseOn,
        ruleId: rule.ruleId,
        version: rule.version,
        reference: rule.reference,
        evidence: {
          details: baseUsed
        }
      });
    }
  }
  return results;
}

// src/luck/index.js
var luck_exports = {};
__export(luck_exports, {
  calculateLuckCycles: () => calculateLuckCycles
});
function calculateLuckCycles({
  pillars,
  gender,
  // 'male' | 'female'
  birthDate,
  // 'YYYY-MM-DD'
  birthTime = "12:00",
  timezoneOffsetHours = 8,
  cycleCount = 10,
  directionRule = "gender-year-yinyang",
  startAgeMethod = "jieqi-diff-divide-3"
}) {
  const [bYear, bMonth, bDay] = birthDate.split("-").map(Number);
  const [bHour, bMinute] = (birthTime || "12:00").split(":").map(Number);
  const currentJD = gregorianToJulianDay(bYear, bMonth, bDay + (bHour + bMinute / 60) / 24) - timezoneOffsetHours / 24;
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
  let diffDays = forward ? nextJie.jdUT - currentJD : currentJD - prevJie.jdUT;
  if (diffDays < 0) diffDays = 0;
  const totalMonths = diffDays * 4;
  const startYears = Math.floor(totalMonths / 12);
  const remMonths = totalMonths - startYears * 12;
  const startMonths = Math.floor(remMonths);
  const remDays = (remMonths - startMonths) * 30;
  const startDays = Math.round(remDays);
  const startJdOffset = diffDays * (365.2422 / 3);
  const startGregorian = julianDayToGregorian(currentJD + startJdOffset);
  const pad = (n) => String(n).padStart(2, "0");
  const startDateStr = `${startGregorian.year}-${pad(startGregorian.month)}-${pad(startGregorian.day)}`;
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
    const fromAge = startYears + (step - 1) * 10;
    const toAge = fromAge + 9;
    const fromYear = bYear + fromAge;
    const toYear = bYear + toAge;
    cycles.push({
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
    });
  }
  return {
    direction: forward ? "forward" : "backward",
    directionText: forward ? "\u9806\u884C" : "\u9006\u884C",
    forward,
    directionRule,
    startAgeMethod,
    diffDays: Number(diffDays.toFixed(3)),
    targetJie: {
      name: targetJie.name,
      jdUT: targetJie.jdUT,
      local: targetJie.local
    },
    startAge: {
      years: startYears,
      months: startMonths,
      days: startDays,
      display: `${startYears} \u6B72 ${startMonths} \u500B\u6708 ${startDays} \u5929`,
      startDate: startDateStr
    },
    cycles
  };
}

// src/transit/index.js
var transit_exports = {};
__export(transit_exports, {
  calculateTransit: () => calculateTransit
});
function calculateTransit(chartPillars, options = {}) {
  let dtStr = options.datetime || (/* @__PURE__ */ new Date()).toISOString();
  let datePart = "2026-09-08";
  let timePart = "12:00";
  let timezoneOffsetHours = 8;
  if (dtStr.includes("T")) {
    const parts = dtStr.split("T");
    datePart = parts[0];
    const timeMatch = parts[1].match(/^(\d{2}:\d{2})/);
    if (timeMatch) timePart = timeMatch[1];
    if (parts[1].includes("+")) {
      const tzPart = parts[1].split("+")[1];
      timezoneOffsetHours = Number(tzPart.split(":")[0]);
    }
  } else {
    const parts = dtStr.split(" ");
    datePart = parts[0];
    if (parts[1]) timePart = parts[1].slice(0, 5);
  }
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  const transitPillars = calculateFourPillars({
    year: y,
    month: m,
    day: d,
    hour: hh,
    minute: mm,
    birthTimeMode: "exact",
    timezoneOffsetHours,
    yearBoundary: "lichun",
    monthBoundary: "jie",
    dayBoundary: "23:00"
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
        transitBranch: yearTransit.branch,
        natalBranch: natal.branch,
        description: `\u6D41\u5E74\u652F\u3010${yearTransit.branch}\u3011\u6C96\u539F\u5C40${natal.pillar}\u652F\u3010${natal.branch}\u3011`
      });
    }
    if (HE_MAP[yearTransit.branch] === natal.branch) {
      interactions.push({
        type: "transit_combine",
        target: "year",
        natalPillar: natal.pillar,
        transitBranch: yearTransit.branch,
        natalBranch: natal.branch,
        description: `\u6D41\u5E74\u652F\u3010${yearTransit.branch}\u3011\u5408\u539F\u5C40${natal.pillar}\u652F\u3010${natal.branch}\u3011`
      });
    }
  }
  return {
    targetDatetime: `${datePart} ${timePart}`,
    year: yearTransit,
    month: monthTransit,
    day: dayTransit,
    hour: hourTransit,
    interactions
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

// src/rules/rule-registry.js
var rule_registry_exports = {};
__export(rule_registry_exports, {
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
      ruleId: "STR_CANONICAL_DEFAULT",
      version: "1.0.0"
    }
  }
};

// src/rules/rule-registry.js
var ProfileRegistry = class {
  constructor() {
    this.profiles = /* @__PURE__ */ new Map();
    this.register(CANONICAL_PROFILE);
  }
  register(profile) {
    this.profiles.set(profile.id, profile);
  }
  get(id = "canonical") {
    return this.profiles.get(id) || this.profiles.get("canonical");
  }
  // 建立自訂 Profile（繼承 base，覆寫 overrides）
  createProfile({ id, name, description, base = "canonical", overrides = {} }) {
    const baseProfile = this.get(base);
    if (!baseProfile) {
      throw new Error(`\u627E\u4E0D\u5230\u57FA\u790E Profile: ${base}`);
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
        newProfile.rules.dayBoundary = {
          value: val,
          ruleId: val === "00:00" ? "DAY_BOUNDARY_MIDNIGHT_0000" : "DAY_BOUNDARY_ZISHI_2300",
          version: "1.0.0",
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.dayBoundary.value, to: val };
      } else if (key === "trueSolarTime") {
        newProfile.rules.trueSolarTime = {
          value: Boolean(val),
          ruleId: val ? "TRUE_SOLAR_TIME_ENABLED" : "TRUE_SOLAR_TIME_DISABLED",
          version: "1.0.0",
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.trueSolarTime.value, to: val };
      } else if (key === "yearBoundary") {
        newProfile.rules.yearBoundary = {
          value: val,
          ruleId: `YEAR_BOUNDARY_${val.toUpperCase()}`,
          version: "1.0.0",
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.yearBoundary.value, to: val };
      } else if (key === "monthBoundary") {
        newProfile.rules.monthBoundary = {
          value: val,
          ruleId: `MONTH_BOUNDARY_${val.toUpperCase()}`,
          version: "1.0.0",
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.monthBoundary.value, to: val };
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
      version: p.version
    }));
  }
};
var RuleRegistry = new ProfileRegistry();

// src/ai/index.js
var ai_exports = {};
__export(ai_exports, {
  toContext: () => toContext
});
function toContext(result, options = {}) {
  const {
    compact = true,
    includeRules = true,
    includeEvidence = true,
    includeShenShaEvidence = true,
    includeStrengthEvidence = true,
    includeInteractions = true,
    maxLuckCycles = 6
  } = options;
  const ctx = {
    metadata: {
      engine: "BaziJS",
      engineVersion: result.meta.engineVersion,
      ruleSetVersion: result.meta.ruleSetVersion,
      profileId: result.meta.profileId
    },
    inputSummary: {
      birthDate: result.input.birthDate,
      birthTime: result.input.birthTime || "\u672A\u77E5",
      gender: result.input.gender === "male" ? "\u4E7E\u9020\uFF08\u7537\uFF09" : "\u5764\u9020\uFF08\u5973\uFF09",
      timezone: result.input.timezone,
      trueSolarTimeUsed: result.accuracy.trueSolarTimeUsed
    },
    pillars: {
      year: {
        ganzhi: result.pillars.year.ganzhi,
        stem: result.pillars.year.stem,
        branch: result.pillars.year.branch,
        tenGod: result.tenGods.stems.year ? result.tenGods.stems.year.full : null,
        nayin: result.nayin.year,
        hidden: result.tenGods.hidden.year.map((h) => `${h.stem}(${h.tenGod.full})`)
      },
      month: {
        ganzhi: result.pillars.month.ganzhi,
        stem: result.pillars.month.stem,
        branch: result.pillars.month.branch,
        tenGod: result.tenGods.stems.month ? result.tenGods.stems.month.full : null,
        nayin: result.nayin.month,
        hidden: result.tenGods.hidden.month.map((h) => `${h.stem}(${h.tenGod.full})`)
      },
      day: {
        ganzhi: result.pillars.day.ganzhi,
        stem: result.pillars.day.stem,
        branch: result.pillars.day.branch,
        tenGod: "\u65E5\u4E3B\uFF08\u5143\u795E\uFF09",
        nayin: result.nayin.day,
        hidden: result.tenGods.hidden.day.map((h) => `${h.stem}(${h.tenGod.full})`)
      },
      hour: result.pillars.hour.available ? {
        ganzhi: result.pillars.hour.ganzhi,
        stem: result.pillars.hour.stem,
        branch: result.pillars.hour.branch,
        tenGod: result.tenGods.stems.hour ? result.tenGods.stems.hour.full : null,
        nayin: result.nayin.hour,
        hidden: result.tenGods.hidden.hour.map((h) => `${h.stem}(${h.tenGod.full})`)
      } : { available: false, reason: "\u6642\u9593\u672A\u77E5" }
    },
    dayMaster: {
      stem: result.strength.dayMaster,
      elementScore: result.strength.score,
      strengthLevel: result.strength.level,
      favorableElements: result.strength.favorableElements,
      unfavorableElements: result.strength.unfavorableElements,
      ...includeStrengthEvidence ? { strengthEvidence: result.strength.evidence } : {}
    },
    fiveElementsDistribution: result.strength.distribution,
    kongWang: {
      byDay: result.kongWang.byDay.branches,
      byYear: result.kongWang.byYear.branches
    },
    auxiliary: {
      taiYuan: result.auxiliary.taiYuan ? result.auxiliary.taiYuan.ganzhi : null,
      taiXi: result.auxiliary.taiXi ? result.auxiliary.taiXi.ganzhi : null,
      mingGong: result.auxiliary.mingGong ? result.auxiliary.mingGong.ganzhi : null,
      shenGong: result.auxiliary.shenGong ? result.auxiliary.shenGong.ganzhi : null
    },
    shenShaList: result.shenSha.map((s) => ({
      name: s.name,
      category: s.category,
      hitOn: s.hitOn,
      ruleId: includeRules ? s.ruleId : void 0,
      reference: s.reference,
      ...includeShenShaEvidence ? { evidence: s.evidence } : {}
    })),
    ...includeInteractions ? {
      interactions: {
        stems: result.interactions.stems.map((s) => s.name),
        branches: result.interactions.branches.map((b) => b.name)
      }
    } : {},
    luckCyclesSummary: {
      direction: result.luckCycles.directionText,
      startAge: result.luckCycles.startAge.display,
      startDate: result.luckCycles.startAge.startDate,
      cycles: result.luckCycles.cycles.slice(0, maxLuckCycles).map((c) => ({
        step: c.step,
        ganzhi: c.ganzhi,
        ageRange: `${c.fromAge}~${c.toAge}\u6B72`,
        tenGodStem: c.tenGodStem ? c.tenGodStem.full : "",
        nayin: c.nayin
      }))
    }
  };
  if (compact) {
    return JSON.stringify(ctx);
  }
  return ctx;
}

// src/rules/versions.js
var ENGINE_VERSION = "1.0.1";
var RULE_SET_VERSION = "2026.09";
var CALENDAR_RULE_VERSION = "1.0.0";
var SHENSHA_RULE_VERSION = "1.1.0";
var STRENGTH_RULE_VERSION = "1.0.0";
var INTERACTION_RULE_VERSION = "1.0.0";
var LUCK_RULE_VERSION = "1.0.0";
var VERSIONS = {
  engineVersion: ENGINE_VERSION,
  ruleSetVersion: RULE_SET_VERSION,
  calendarRuleVersion: CALENDAR_RULE_VERSION,
  shenShaRuleVersion: SHENSHA_RULE_VERSION,
  strengthRuleVersion: STRENGTH_RULE_VERSION,
  interactionRuleVersion: INTERACTION_RULE_VERSION,
  luckRuleVersion: LUCK_RULE_VERSION
};

// src/chart/index.js
function calculate(input, options = {}) {
  validateInput(input);
  const profileId = input.profile || options.profile || "canonical";
  const profile = RuleRegistry.get(profileId);
  const yearBoundary = input.yearBoundary || profile.rules.yearBoundary.value;
  const monthBoundary = input.monthBoundary || profile.rules.monthBoundary.value;
  const dayBoundary = input.dayBoundary || profile.rules.dayBoundary.value;
  const enableTrueSolarTime = input.trueSolarTime !== void 0 ? input.trueSolarTime : profile.rules.trueSolarTime.value;
  const timezone = input.timezone || "+08:00";
  const tzMatch = timezone.match(/^([+-])(\d{1,2})(?::?(\d{2}))?$/);
  const tzSign = tzMatch[1] === "-" ? -1 : 1;
  const tzHours = parseInt(tzMatch[2], 10);
  const tzMins = tzMatch[3] ? parseInt(tzMatch[3], 10) : 0;
  const timezoneOffsetHours = tzSign * (tzHours + tzMins / 60);
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
    dayBoundary
  });
  const tenGods = calculateChartTenGods(pillars);
  const hiddenStems = calculateChartHiddenStems(pillars);
  const nayin = calculateChartNayin(pillars);
  const twelveStages = calculateChartTwelveStages(pillars);
  const kongWang = calculateChartKongWang(pillars);
  const auxiliary = calculateChartAuxiliary(pillars);
  const interactions = calculateInteractions(pillars);
  const strength = calculateStrength(pillars, interactions);
  const shenSha = calculateShenSha(pillars);
  const luckCycles = calculateLuckCycles({
    pillars,
    gender: input.gender,
    birthDate: input.birthDate,
    birthTime: input.birthTime,
    timezoneOffsetHours,
    directionRule: profile.rules.luckCycle.directionRule.value,
    startAgeMethod: profile.rules.luckCycle.startAgeMethod.value
  });
  const transitDate = options.transitDatetime || `${inYear}-06-01T12:00:00+08:00`;
  const transits = calculateTransit(pillars, { datetime: transitDate });
  if (luckCycles && Array.isArray(luckCycles.cycles)) {
    luckCycles.cycles.forEach((cyc, idx) => {
      cyc.shenSha = calculateShenShaOnPillar(pillars, cyc.stem, cyc.branch, `luck-${idx + 1}`);
    });
  }
  if (transits && transits.year) {
    transits.shenShaYear = calculateShenShaOnPillar(
      pillars,
      transits.year.stem,
      transits.year.branch,
      "transit-year"
    );
  }
  const result = {
    meta: {
      ...VERSIONS,
      profileId: profile.id,
      profileName: profile.name
    },
    input: {
      ...input,
      timezone
    },
    accuracy: {
      timeKnown: birthTimeMode !== "unknown",
      hourPillarAvailable: pillars.hour.available,
      trueSolarTimeUsed: Boolean(enableTrueSolarTime && birthTimeMode === "exact")
    },
    calendar: {
      solar: {
        year: inYear,
        month: inMonth,
        day: inDay,
        time: input.birthTime || null
      },
      lunar: lunarInfo,
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
        usedTrueSolarTime: Boolean(enableTrueSolarTime && birthTimeMode === "exact")
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
    shenSha,
    luckCycles,
    transits,
    rules: {
      applied: [
        profile.rules.yearBoundary,
        profile.rules.monthBoundary,
        profile.rules.dayBoundary,
        profile.rules.luckCycle.directionRule,
        profile.rules.luckCycle.startAgeMethod
      ]
    },
    debug: options.debug ? pillars.debug : void 0
  };
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
    textSecondary: "#c3c9d1",
    textMuted: "#8f96a0",
    accent: "#e06c53",
    gold: "#dfb15b",
    border: "#2c313a",
    borderDark: "#4a5160",
    gridBg: "#181b20",
    tagBg: "#252930",
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
    height: 1080,
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
    height: 1100,
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
    height: 1130,
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
function renderSvg(chartResult, options = {}) {
  const theme = getTheme(options.theme || "modern-oriental");
  const preset = getPreset(options.preset || "full");
  const { width, height } = preset;
  const p = chartResult.pillars;
  const res = chartResult;
  const pillarCols = [
    { title: "\u6642\u67F1", data: p.hour, tenGod: res.tenGods.stems.hour, hidden: res.tenGods.hidden.hour, nayin: res.nayin.hour, stage: res.twelveStages.byDayMaster.hour },
    { title: "\u65E5\u67F1", data: p.day, tenGod: { full: "\u65E5\u4E3B" }, hidden: res.tenGods.hidden.day, nayin: res.nayin.day, stage: res.twelveStages.byDayMaster.day },
    { title: "\u6708\u67F1", data: p.month, tenGod: res.tenGods.stems.month, hidden: res.tenGods.hidden.month, nayin: res.nayin.month, stage: res.twelveStages.byDayMaster.month },
    { title: "\u5E74\u67F1", data: p.year, tenGod: res.tenGods.stems.year, hidden: res.tenGods.hidden.year, nayin: res.nayin.year, stage: res.twelveStages.byDayMaster.year }
  ];
  const dayMasterEl = (STEMS[STEM_INDEX[res.pillars.day.stem]] || {}).element || "";
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: ${theme.background}; font-family: -apple-system, BlinkMacSystemFont, 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', 'Segoe UI', Roboto, sans-serif; text-rendering: geometricPrecision; shape-rendering: geometricPrecision;">
  <defs>
    <style>
      text { text-rendering: geometricPrecision; -webkit-font-smoothing: antialiased; }
      .title { font-size: 26px; font-weight: 700; fill: ${theme.textPrimary}; letter-spacing: 1.5px; }
      .subtitle { font-size: 13px; fill: ${theme.textSecondary}; font-weight: 500; }
      .meta-label { font-size: 13px; fill: ${theme.textMuted}; font-weight: 500; }
      .meta-value { font-size: 14px; fill: ${theme.textPrimary}; font-weight: 700; }
      .col-header { font-size: 15px; fill: ${theme.textSecondary}; text-anchor: middle; font-weight: 700; }
      .tengod { font-size: 15px; fill: ${theme.gold}; text-anchor: middle; font-weight: 700; }
      .ganzhi { font-size: 38px; font-weight: 700; text-anchor: middle; }
      .hidden-stem { font-size: 13px; fill: ${theme.textSecondary}; text-anchor: middle; font-weight: 500; }
      .badge-text { font-size: 12px; fill: ${theme.cardBg}; font-weight: 700; text-anchor: middle; }
      .section-title { font-size: 17px; font-weight: 700; fill: ${theme.accent}; letter-spacing: 1px; }
      .card { fill: ${theme.cardBg}; stroke: ${theme.border}; stroke-width: 1; rx: 6px; }
      .grid-box { fill: ${theme.gridBg}; stroke: ${theme.border}; stroke-width: 1; }
    </style>
  </defs>

  <!-- \u80CC\u666F\u5E95\u8272\u8207\u5916\u908A\u6846 -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="${theme.background}" />
  <rect x="16" y="16" width="${width - 32}" height="${height - 32}" fill="none" stroke="${theme.border}" stroke-width="1.5" rx="8" />

  <!-- \u9802\u90E8 Header -->
  <g transform="translate(40, 50)">
    <text x="0" y="0" class="title">\u516B\u5B57\u547D\u76E4 \xB7 \u5B50\u5E73\u56DB\u67F1</text>
    <text x="0" y="24" class="subtitle">BaziJS Metaphysical Engine v${res.meta.engineVersion} \xB7 \u898F\u7BC4\u6D41\u6D3E: ${res.meta.profileName}</text>
  </g>

  <!-- \u57FA\u672C\u8CC7\u6599\u8CC7\u8A0A\u5217\uFF08\u96D9\u884C\u6392\u7248\uFF0C\u907F\u514D\u55AE\u884C\u5B57\u4E32\u91CD\u758A\u767C\u7CCA\uFF09 -->
  <g transform="translate(40, 95)">
    <rect x="0" y="0" width="${width - 80}" height="88" class="card" />
    <g transform="translate(20, 30)">
      <text x="0" y="0" class="meta-label">\u516C\u66C6\uFF1A</text>
      <text x="52" y="0" class="meta-value">${res.calendar.solar.year}\u5E74${res.calendar.solar.month}\u6708${res.calendar.solar.day}\u65E5 ${res.input.birthTime || "\u672A\u77E5"}</text>

      <text x="340" y="0" class="meta-label">\u8FB2\u66C6\uFF1A</text>
      <text x="392" y="0" class="meta-value">${res.calendar.lunar.monthName}${res.calendar.lunar.dayName}</text>

      <text x="0" y="34" class="meta-label">\u6027\u5225\uFF1A</text>
      <text x="52" y="34" class="meta-value">${res.input.gender === "male" ? "\u4E7E\u9020\uFF08\u7537\uFF09" : "\u5764\u9020\uFF08\u5973\uFF09"}</text>

      <text x="340" y="34" class="meta-label">\u65E5\u4E3B\uFF1A</text>
      <text x="392" y="34" class="meta-value" fill="${theme.accent}">${res.pillars.day.stem}${dayMasterEl}\uFF08${res.strength.level}\uFF09</text>
    </g>
  </g>

  <!-- \u56DB\u67F1\u4E3B\u76E4\u8868\u683C -->
  <g transform="translate(40, 195)">
    <rect x="0" y="0" width="${width - 80}" height="280" class="card" />
`;
  const colWidth = (width - 80) / 4;
  pillarCols.forEach((col, idx) => {
    const x = idx * colWidth;
    const centerX = x + colWidth / 2;
    const stemChar = col.data.available !== false ? col.data.stem : "\uFF1F";
    const branchChar = col.data.available !== false ? col.data.branch : "\uFF1F";
    const tengodName = col.tenGod ? col.tenGod.full || col.tenGod.short : "\u2014";
    const nayinName = col.nayin || "\u2014";
    const stageName = col.stage ? col.stage.name : "\u2014";
    svg += `
    <!-- \u67F1\u4F4D Header: ${col.title} -->
    <rect x="${x}" y="0" width="${colWidth}" height="36" class="grid-box" />
    <text x="${centerX}" y="23" class="col-header">${col.title}</text>

    <!-- \u5929\u5E72\u5341\u795E -->
    <text x="${centerX}" y="62" class="tengod">${tengodName}</text>

    <!-- \u5929\u5E72\u5B57\u5143 -->
    <text x="${centerX}" y="105" class="ganzhi" fill="${theme.textPrimary}">${stemChar}</text>

    <!-- \u5730\u652F\u5B57\u5143 -->
    <text x="${centerX}" y="152" class="ganzhi" fill="${theme.textPrimary}">${branchChar}</text>

    <!-- \u85CF\u5E72\u5217\u8868 -->
    <g transform="translate(${centerX}, 180)">
    `;
    if (col.hidden && col.hidden.length > 0) {
      col.hidden.forEach((h, hIdx) => {
        const tgShort = h.tenGod ? h.tenGod.short : "";
        svg += `<text x="0" y="${hIdx * 18}" class="hidden-stem">${h.stem} <tspan fill="${theme.textMuted}">(${tgShort})</tspan></text>`;
      });
    } else {
      svg += `<text x="0" y="0" class="hidden-stem">\u2014</text>`;
    }
    svg += `
    </g>

    <!-- \u7D0D\u97F3\u8207\u9577\u751F -->
    <text x="${centerX}" y="248" class="meta-label" text-anchor="middle">\u7D0D\u97F3: ${nayinName}</text>
    <text x="${centerX}" y="266" class="meta-label" text-anchor="middle">\u9577\u751F: ${stageName}</text>
    `;
    if (idx > 0) {
      svg += `<line x1="${x}" y1="0" x2="${x}" y2="280" stroke="${theme.border}" stroke-width="1" />`;
    }
  });
  svg += `  </g>`;
  if (preset.includeStrength) {
    const yOffset = 490;
    svg += `
    <!-- \u4E94\u884C\u5F37\u5F31\u5206\u6790\u5340\u584A -->
    <g transform="translate(40, ${yOffset})">
      <rect x="0" y="0" width="${width - 80}" height="130" class="card" />
      <text x="24" y="32" class="section-title">\u4E94\u884C\u6C23\u6578\u8207\u5F37\u5F31\u5E73\u8861</text>

      <g transform="translate(24, 52)">
        <text x="0" y="20" class="meta-label">\u65E5\u4E3B\u65FA\u8870\u5F97\u5206\uFF1A</text>
        <text x="90" y="20" class="meta-value" font-size="16px" fill="${theme.accent}">${res.strength.score} \u5206 \xB7 \u3010${res.strength.level}\u3011</text>

        <text x="0" y="50" class="meta-label">\u559C\u7528\u4E94\u884C\uFF1A</text>
        <text x="70" y="50" class="meta-value" fill="${theme.elementColors["\u6728"] || theme.textPrimary}">${res.strength.favorableElements.join("\u3001") || "\u7121\u7279\u5225\u6A19\u8A18"}</text>

        <text x="220" y="50" class="meta-label">\u5FCC\u4EC7\u4E94\u884C\uFF1A</text>
        <text x="290" y="50" class="meta-value" fill="${theme.elementColors["\u706B"] || theme.textPrimary}">${res.strength.unfavorableElements.join("\u3001") || "\u7121\u7279\u5225\u6A19\u8A18"}</text>
      </g>

      <!-- \u4E94\u884C\u4F54\u6BD4\u689D\u5F62\u5716 -->
      <g transform="translate(420, 48)">
    `;
    const elementsList = ["\u6728", "\u706B", "\u571F", "\u91D1", "\u6C34"];
    elementsList.forEach((el, eIdx) => {
      const elData = res.strength.distribution[el] || { percentage: 20 };
      const barY = eIdx * 14;
      const barW = Math.max(4, elData.percentage / 100 * 200);
      const color = theme.elementColors[el] || theme.textPrimary;
      svg += `
        <text x="0" y="${barY + 10}" font-size="11px" fill="${color}">${el}</text>
        <rect x="24" y="${barY + 2}" width="200" height="9" fill="${theme.gridBg}" rx="2" />
        <rect x="24" y="${barY + 2}" width="${barW}" height="9" fill="${color}" rx="2" />
        <text x="232" y="${barY + 10}" font-size="10px" fill="${theme.textMuted}">${elData.percentage}%</text>
      `;
    });
    svg += `
      </g>
    </g>
    `;
  }
  if (preset.includeLuckCycles && res.luckCycles) {
    const yOffset = 635;
    const cardW = width - 80;
    const stepW = Math.min(80, (cardW - 40) / Math.min(8, res.luckCycles.cycles.length));
    svg += `
    <!-- \u5927\u904B\u8D70\u52E2\u5340\u584A -->
    <g transform="translate(40, ${yOffset})">
      <rect x="0" y="0" width="${cardW}" height="160" class="card" />
      <text x="24" y="32" class="section-title">\u8D77\u904B\u8D70\u52E2\uFF08${res.luckCycles.directionText} \xB7 ${res.luckCycles.startAge.display}\u8D77\u904B\uFF09</text>
      <g transform="translate(24, 50)">
    `;
    res.luckCycles.cycles.slice(0, 8).forEach((cyc, idx) => {
      const bx = idx * stepW;
      const bCenterX = bx + stepW / 2;
      svg += `
        <rect x="${bx}" y="0" width="${stepW - 6}" height="92" class="grid-box" rx="4" />
        <text x="${bCenterX - 3}" y="20" font-size="12px" font-weight="600" fill="${theme.textSecondary}" text-anchor="middle">${cyc.fromAge}\u6B72</text>
        <text x="${bCenterX - 3}" y="48" font-size="19px" font-weight="bold" fill="${theme.textPrimary}" text-anchor="middle">${cyc.ganzhi}</text>
        <text x="${bCenterX - 3}" y="68" font-size="12px" font-weight="600" fill="${theme.gold}" text-anchor="middle">${cyc.tenGodStem ? cyc.tenGodStem.short : ""}</text>
        <text x="${bCenterX - 3}" y="84" font-size="11px" fill="${theme.textSecondary}" text-anchor="middle">${cyc.fromYear}\u5E74</text>
      `;
    });
    svg += `
      </g>
    </g>
    `;
  }
  if (preset.includeShenSha && height >= 900) {
    const yOffset = 800;
    const cardW = width - 80;
    const maxCharsPerLine = Math.max(18, Math.floor((cardW - 130) / 13.5));
    const cap = (lines, total, maxL) => {
      if (lines.length <= maxL) return lines;
      const cut = lines.slice(0, maxL);
      cut[maxL - 1] += `\uFF08\u7B49\u5171${total}\u9846\uFF09`;
      return cut;
    };
    const wrapNames = (list, limit) => {
      const names = (list || []).slice(0, limit).map((s) => `${s.name}(${s.hitOn.join("/")})`);
      if (names.length === 0) return ["\u2014"];
      const lines = [];
      let cur = "";
      for (const n of names) {
        const piece = cur ? "\u3001 " + n : n;
        if ((cur + piece).length > maxCharsPerLine && cur) {
          lines.push(cur);
          cur = n;
        } else {
          cur += piece;
        }
      }
      if (cur) lines.push(cur);
      return lines;
    };
    const natalLines = cap(wrapNames(res.shenSha, 14), (res.shenSha || []).length, 3);
    const yearList = res.transits && res.transits.shenShaYear ? res.transits.shenShaYear : [];
    const yearSSLines = cap(wrapNames(yearList, 10), yearList.length, 1);
    const firstLuck = res.luckCycles.cycles[0];
    const luckList = firstLuck && firstLuck.shenSha ? firstLuck.shenSha : [];
    const luckSSLines = cap(wrapNames(luckList, 10), luckList.length, 1);
    const luckLabel = firstLuck ? `${firstLuck.ganzhi}\u904B\uFF1A` : "";
    const rowGap = 24;
    const blockRows = 1 + natalLines.length + yearSSLines.length + luckSSLines.length;
    const cardH = 50 + blockRows * rowGap + 26;
    let shenShaInner = "";
    let ry = 0;
    const addRow = (label, lines) => {
      lines.forEach((ln, li) => {
        shenShaInner += `
        <text x="0" y="${ry}" class="meta-label">${li === 0 ? label : ""}</text>
        <text x="82" y="${ry}" class="meta-value" font-size="13px">${ln}</text>`;
        ry += rowGap;
      });
    };
    addRow("\u539F\u5C40\u795E\u715E\uFF1A", natalLines);
    addRow("\u6D41\u5E74\u795E\u715E\uFF1A", yearSSLines);
    addRow("\u521D\u904B\u795E\u715E\uFF1A", luckSSLines.map((ln, li) => li === 0 ? luckLabel + ln : ln));
    svg += `
    <!-- \u795E\u715E\u8207\u9644\u5BAE -->
    <g transform="translate(40, ${yOffset})">
      <rect x="0" y="0" width="${cardW}" height="${cardH}" class="card" />
      <text x="24" y="30" class="section-title">\u795E\u715E\u5409\u51F6\u8207\u547D\u5BAE\u8EAB\u5BAE</text>
      <g transform="translate(24, 52)">
        ${shenShaInner}
        <text x="0" y="${ry}" class="meta-label">\u80CE\u5143\u547D\u5BAE\uFF1A</text>
        <text x="82" y="${ry}" class="meta-value" font-size="13px">\u80CE\u5143: ${res.auxiliary.taiYuan ? res.auxiliary.taiYuan.ganzhi : "\u2014"} \uFF5C \u80CE\u606F: ${res.auxiliary.taiXi ? res.auxiliary.taiXi.ganzhi : "\u2014"} \uFF5C \u547D\u5BAE: ${res.auxiliary.mingGong ? res.auxiliary.mingGong.ganzhi : "\u2014"} \uFF5C \u8EAB\u5BAE: ${res.auxiliary.shenGong ? res.auxiliary.shenGong.ganzhi : "\u2014"}</text>
      </g>
    </g>
    `;
  }
  svg += `
  <text x="${width / 2}" y="${height - 24}" font-size="11px" fill="${theme.textMuted}" text-anchor="middle">
    Produced by BaziJS Open Source Metaphysical Engine \xB7 Apache-2.0 License
  </text>
</svg>`;
  return svg;
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
        const canvas = document.createElement("canvas");
        canvas.width = img.width || 960;
        canvas.height = img.height || 980;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(blobUrl);
        canvas.toBlob((blob) => {
          resolve({
            format: "png",
            blob,
            dataUrl: canvas.toDataURL("image/png"),
            width: canvas.width,
            height: canvas.height
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
var Bazi = {
  version: VERSIONS.engineVersion,
  rules: {
    version: VERSIONS.ruleSetVersion,
    shenSha: { version: VERSIONS.shenShaRuleVersion },
    strength: { version: VERSIONS.strengthRuleVersion }
  },
  calculate,
  calculateSafe,
  Chart,
  Calendar: solar_terms_exports,
  Solar: solar_exports,
  Lunar: lunar_exports,
  Julian: julian_exports,
  TrueSolarTime: true_solar_time_exports,
  Rules: rule_registry_exports,
  ShenSha: shensha_exports,
  Strength: strength_exports,
  Luck: luck_exports,
  Transit: transit_exports,
  AI: ai_exports,
  Renderer,
  Validation: validation_exports,
  Errors: errors_exports,
  Constants: stems_exports
};
var index_default = Bazi;
export {
  ai_exports as AI,
  solar_terms_exports as Calendar,
  Chart,
  stems_exports as Constants,
  errors_exports as Errors,
  julian_exports as Julian,
  luck_exports as Luck,
  lunar_exports as Lunar,
  Renderer,
  rule_registry_exports as Rules,
  shensha_exports as ShenSha,
  solar_exports as Solar,
  strength_exports as Strength,
  transit_exports as Transit,
  true_solar_time_exports as TrueSolarTime,
  VERSIONS,
  validation_exports as Validation,
  calculate,
  calculateSafe,
  index_default as default
};
//# sourceMappingURL=bazi-sdk.esm.js.map
