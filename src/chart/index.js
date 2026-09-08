// BaziJS 主入口與統一 SDK 介面
// 支援：
// - Bazi.calculate(input, options)
// - Bazi.calculateSafe(input, options)
// - new Bazi.Chart(input, options)
// - 模組導出：Calendar, Chart, Rules, ShenSha, Strength, Luck, Transit, Renderer, AI, Validation

import { validateInput, parseTimezoneOffset } from '../core/utils/validation.js';
import { calculateFourPillars } from './chart.js';
import { calculateChartTenGods } from '../tengods/index.js';
import { calculateChartHiddenStems } from '../hidden-stems/index.js';
import { calculateChartNayin } from '../nayin/index.js';
import { calculateChartTwelveStages } from '../twelve-stages/index.js';
import { calculateChartKongWang } from '../core/constants/kongwang-calc.js';
import { calculateChartAuxiliary } from '../auxiliary/index.js';
import { calculateInteractions } from '../interactions/index.js';
import { calculateStrength } from '../strength/index.js';
import { calculateShenSha, calculateShenShaOnPillar, calculateTransitShenSha } from '../shensha/index.js';
import { calculateSpecialRules } from '../special-rules/index.js';
import { calculateLuckCycles } from '../luck/index.js';
import { calculateTransit } from '../transit/index.js';
import { calculateTrueSolarTime } from '../calendar/true-solar-time.js';
import { solarToLunar } from '../calendar/lunar.js';
import { getWesternConstellation } from '../calendar/constellation.js';
import { getZodiacAnimal } from '../calendar/zodiac.js';
import { getYearSolarTerms, getSurroundingJie } from '../calendar/solar-terms.js';
import { gregorianToJulianDay } from '../calendar/julian.js';
import { RuleRegistry } from '../rules/rule-registry.js';
import { toContext } from '../ai/index.js';
import { VERSIONS } from '../rules/versions.js';
import { BaziRuleError } from '../core/errors/index.js';

function formatTimezoneOffset(offsetHours) {
  const sign = offsetHours < 0 ? '-' : '+';
  const absolute = Math.abs(offsetHours);
  const hours = Math.floor(absolute);
  const minutes = Math.round((absolute - hours) * 60);
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// 主計算函數
export function calculate(input, options = {}) {
  // 1. 驗證輸入格式與範圍 (1900-01-01 ~ 2100-12-31)
  validateInput(input);

  // 2. 解析 Rule Profile
  const profileId = input.profile || options.profile || 'canonical';
  const profile = RuleRegistry.require(profileId);

  // 3. 提取規則參數
  const yearBoundary = input.yearBoundary || profile.rules.yearBoundary.value;
  const monthBoundary = input.monthBoundary || profile.rules.monthBoundary.value;
  const dayBoundary = input.dayBoundary || profile.rules.dayBoundary.value;
  const enableTrueSolarTime = input.trueSolarTime !== undefined
    ? input.trueSolarTime
    : profile.rules.trueSolarTime.value;

  // 4. 時區與時間解析
  const timezone = input.timezone || '+08:00';
  const timezoneOffsetHours = parseTimezoneOffset(timezone);

  const [inYear, inMonth, inDay] = input.birthDate.split('-').map(Number);
  const birthTimeMode = input.birthTimeMode || (input.birthTime ? 'exact' : 'unknown');

  let inHour = 12;
  let inMinute = 0;
  if (birthTimeMode === 'exact' && input.birthTime) {
    const [h, m] = input.birthTime.split(':').map(Number);
    inHour = h;
    inMinute = m;
  }

  // 5. 真太陽時處理
  let calcYear = inYear;
  let calcMonth = inMonth;
  let calcDay = inDay;
  let calcHour = inHour;
  let calcMinute = inMinute;
  let trueSolarInfo = null;

  if (enableTrueSolarTime && birthTimeMode === 'exact') {
    const longitude = input.location && typeof input.location.longitude === 'number'
      ? input.location.longitude
      : timezoneOffsetHours * 15;

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

  // 6. 農曆與節氣轉換
  const lunarInfo = solarToLunar(calcYear, calcMonth, calcDay);
  // 當地民用時刻 → UT 的 JD（展示用前後節氣比較，須扣除時區）
  const currentJD = gregorianToJulianDay(calcYear, calcMonth, calcDay + (calcHour + calcMinute / 60) / 24) - timezoneOffsetHours / 24;
  const surroundingJieInfo = getSurroundingJie(currentJD, timezoneOffsetHours);

  // 7. 排四柱
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

  // 8. 結構化命理層計算
  const tenGods = calculateChartTenGods(pillars);
  const hiddenStems = calculateChartHiddenStems(pillars);
  const nayin = calculateChartNayin(pillars);
  const twelveStages = calculateChartTwelveStages(pillars);
  const kongWang = calculateChartKongWang(pillars);
  const auxiliary = calculateChartAuxiliary(pillars);
  const interactions = calculateInteractions(pillars);
  const strength = calculateStrength(pillars, interactions, {
    currentJD,
    prevJie: surroundingJieInfo.prevJie
  });
  const shenshaPreset = input.shenshaPreset || input.shenShaPreset || options.shenshaPreset || options.shenShaPreset || 'classical';
  if (!['minimal', 'classical', 'full'].includes(shenshaPreset)) {
    throw new BaziRuleError(`找不到 ShenSha preset：${shenshaPreset}`, 'SHENSHA_PRESET_NOT_FOUND', { preset: shenshaPreset });
  }
  const shenSha = calculateShenSha(pillars, { preset: shenshaPreset, gender: input.gender });
  const specialRules = calculateSpecialRules(pillars, { gender: input.gender, input });

  const appliedRule = (profileRule, value, overridden = false, ruleId = profileRule.ruleId) => ({
    ...profileRule,
    value,
    ruleId,
    overridden: overridden || value !== profileRule.value
  });

  // 9. 大運計算
  const luckCycles = calculateLuckCycles({
    pillars,
    gender: input.gender,
    birthDate: input.birthDate,
    birthTime: input.birthTime,
    birthTimeMode,
    birthHourBranch: input.birthHourBranch,
    timingDate: `${calcYear}-${String(calcMonth).padStart(2, '0')}-${String(calcDay).padStart(2, '0')}`,
    timingTime: birthTimeMode === 'exact'
      ? `${String(calcHour).padStart(2, '0')}:${String(calcMinute).padStart(2, '0')}`
      : undefined,
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

  // 10. 當期流年/流月運勢計算（以當前或指定時刻）
  const transitDate = options.transitDatetime || `${inYear}-06-01T12:00:00${formatTimezoneOffset(timezoneOffsetHours)}`;
  const transits = calculateTransit(pillars, {
    datetime: transitDate,
    yearBoundary,
    monthBoundary,
    dayBoundary
  });

  // 11. 大運神煞：每步大運干支以原局為基準觸發的神煞（catalog scope: luck）
  if (luckCycles && Array.isArray(luckCycles.cycles)) {
    luckCycles.cycles.forEach((cyc, idx) => {
      cyc.shenSha = calculateShenShaOnPillar(pillars, cyc.stem, cyc.branch, `luck-${idx + 1}`, { preset: shenshaPreset, gender: input.gender });
    });
  }

  // 12. 流年神煞：當期流年干支以原局為基準觸發的神煞（catalog scope: transit）
  if (transits && transits.year) {
    const transitShenSha = calculateTransitShenSha(pillars, transits, { preset: shenshaPreset, gender: input.gender });
    transits.shenShaYear = transitShenSha.shenSha;
    transits.shenSha = transitShenSha;
    transits.year.shenSha = transitShenSha.shenSha;
  }

  const result = {
    meta: {
      ...VERSIONS,
      profileId: profile.id,
      profileName: profile.name,
      shenshaPreset
    },

    input: {
      ...input,
      timezone
    },

    accuracy: {
      timeKnown: birthTimeMode !== 'unknown',
      hourPillarAvailable: pillars.hour.available,
      trueSolarTimeUsed: Boolean(enableTrueSolarTime && birthTimeMode === 'exact'),
      boundaryRules: {
        year: yearBoundary,
        month: monthBoundary,
        day: dayBoundary
      },
      assumptions: {
        unknownTime: birthTimeMode === 'unknown' ? '時柱、命宮、身宮與起運時刻採不可確定處理；起運日期以民用中午作為計時假設。' : null,
        branchTime: birthTimeMode === 'branch' ? '時辰模式只確定時支；起運日期以該時辰中點估算。' : null,
        trueSolarTime: enableTrueSolarTime && birthTimeMode === 'exact' ? '四柱與起運計時使用真太陽時修正後時刻。' : null
      },
      precision: {
        solarTerms: 'Meeus low-precision solar longitude; typical boundary uncertainty is approximately ±10 minutes.',
        lunarCalendar: '1900-2100 encoded lunisolar table.'
      }
    },

    calendar: {
      solar: {
        year: inYear,
        month: inMonth,
        day: inDay,
        time: input.birthTime || null,
        effectiveDate: `${calcYear}-${String(calcMonth).padStart(2, '0')}-${String(calcDay).padStart(2, '0')}`,
        effectiveTime: birthTimeMode === 'unknown'
          ? null
          : `${String(calcHour).padStart(2, '0')}:${String(calcMinute).padStart(2, '0')}`
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
        usedTrueSolarTime: Boolean(enableTrueSolarTime && birthTimeMode === 'exact'),
        effectiveDate: `${calcYear}-${String(calcMonth).padStart(2, '0')}-${String(calcDay).padStart(2, '0')}`,
        effectiveTime: birthTimeMode === 'unknown'
          ? null
          : `${String(calcHour).padStart(2, '0')}:${String(calcMinute).padStart(2, '0')}`
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
    specialRules,
    luckCycles,
    transits,

    rules: {
      applied: [
        appliedRule(profile.rules.yearBoundary, yearBoundary, input.yearBoundary !== undefined, `YEAR_BOUNDARY_${yearBoundary.toUpperCase()}`),
        appliedRule(profile.rules.monthBoundary, monthBoundary, input.monthBoundary !== undefined, `MONTH_BOUNDARY_${monthBoundary.toUpperCase()}`),
        appliedRule(profile.rules.dayBoundary, dayBoundary, input.dayBoundary !== undefined, dayBoundary === '00:00' ? 'DAY_BOUNDARY_MIDNIGHT_0000' : 'DAY_BOUNDARY_ZISHI_2300'),
        profile.rules.luckCycle.directionRule,
        profile.rules.luckCycle.startAgeMethod
      ]
    },

    debug: options.debug ? pillars.debug : undefined
  };

  return result;
}

// Safe API：包裝異常，不拋錯
export function calculateSafe(input, options = {}) {
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
        code: err.code || 'BAZI_ERROR',
        message: err.message,
        field: err.field || null,
        details: err.details || {}
      }
    };
  }
}

// 物件型 API: new Bazi.Chart(input)
export class Chart {
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
}
