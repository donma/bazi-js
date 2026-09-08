// 大運（Luck Cycles）計算模組
// 規範要求：
// 1. 方向規則：canonical 採 gender-year-yinyang（年干陰陽 + 性別）：
//    陽男陰女順行（forward: true）
//    陰男陽女逆行（forward: false）
// 2. 起運歲數計算：canonical 採 jieqi-diff-divide-3（節氣差除以3）：
//    順行算至下一個「節」（Jie），逆行算至上一個「節」（Jie）。
//    三天算一歲，一天算四個月，一個時辰算十天，一小時算五天，十二分鐘算一天。
//    計算不得只精確到整歲，需輸出：歲、月、日、公曆起運確切日期。
// 3. 大運由月柱干支起發（順行向後排，逆行向前排），共排 8 ~ 10 步大運。
// 4. 每步大運帶起訖歲數、起訖年份、干支、十神、納音、地支長生。

import { stemAt, stemIndex, sexagenaryIndex } from '../core/constants/stems.js';
import { branchAt, branchIndex, branchStartHour } from '../core/constants/branches.js';
import { getNayin } from '../core/constants/nayin-data.js';
import { getTenGod } from '../core/constants/ten-gods-data.js';
import { getTwelveStage } from '../core/constants/twelve-stages-data.js';
import { getSurroundingJie } from '../calendar/solar-terms.js';
import { gregorianToJulianDay, jdToLocalParts } from '../calendar/julian.js';
import { calculateTransit } from '../transit/index.js';
import { calculateTransitShenSha } from '../shensha/engine.js';
import { calculateXunKong } from '../shensha/utils/xunkong.js';

function formatLocalDateTime(parts) {
  if (!parts) return null;
  const pad = (value) => String(value).padStart(2, '0');
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)} ${pad(parts.hour)}:${pad(parts.minute)}`;
}

function formatTimezoneOffset(offsetHours) {
  const sign = offsetHours < 0 ? '-' : '+';
  const absolute = Math.abs(offsetHours);
  const hours = Math.floor(absolute);
  const minutes = Math.round((absolute - hours) * 60);
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function annualRange(startLocal, step) {
  // 年度資料採「起運日所在年份」開始；既有 fromAge/toAge 保持原始完成歲數語意，
  // fromYear/toYear 則改為與實際起運日期對齊，避免 sample1 式的年份錯一格。
  const fromYear = startLocal.year + (step - 1) * 10;
  return { fromYear, toYear: fromYear + 9 };
}

function buildAnnualDetails({ pillars, cycle, birthYear, startLocal, timezoneOffsetHours, shenshaPreset, gender, includeAnnualShenSha, yearBoundary, monthBoundary, dayBoundary }) {
  const { fromYear, toYear } = annualRange(startLocal, cycle.step);
  const annuals = [];

  for (let year = fromYear; year <= toYear; year++) {
    // 年柱只與年份/節氣有關，固定取年中時刻可避開立春邊界；
    // 月、日、時仍保留在 calculateTransit 的完整結果中供使用端擴充。
    const transit = calculateTransit(pillars, {
      datetime: `${year}-06-01T12:00:00${formatTimezoneOffset(timezoneOffsetHours)}`,
      yearBoundary,
      monthBoundary,
      dayBoundary
    });
    const yearPillar = transit.year;
    const transitShenSha = includeAnnualShenSha
      ? calculateTransitShenSha(pillars, transit, { preset: shenshaPreset, gender }).shenSha
      : [];
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
        method: 'annual-transit-at-mid-year',
        note: 'SDK 提供可追溯的流年結構與互動；未將未考據的吉凶分數或小運文案硬編入結果。'
      }
    });
  }
  return annuals;
}

export function calculateLuckCycles({
  pillars,
  gender, // 'male' | 'female'
  birthDate, // 'YYYY-MM-DD'
  birthTime = '12:00',
  birthTimeMode = birthTime ? 'exact' : 'unknown',
  birthHourBranch = null,
  timingDate = birthDate,
  timingTime = null,
  timezoneOffsetHours = 8,
  cycleCount = 10,
  directionRule = 'gender-year-yinyang',
  startAgeMethod = 'jieqi-diff-divide-3',
  includeAnnualDetails = false,
  shenshaPreset = 'classical',
  includeAnnualShenSha = true,
  yearBoundary = 'lichun',
  monthBoundary = 'jie',
  dayBoundary = '23:00'
}) {
  const [bYear, bMonth, bDay] = birthDate.split('-').map(Number);
  const [tYear, tMonth, tDay] = timingDate.split('-').map(Number);
  let bHour = 12;
  let bMinute = 0;
  let timingAssumption = 'unknown-time-civil-noon';
  if (birthTimeMode === 'exact' && (timingTime || birthTime)) {
    [bHour, bMinute] = (timingTime || birthTime).split(':').map(Number);
    timingAssumption = timingTime && timingDate !== birthDate ? 'effective-solar-time' : 'civil-exact-time';
  } else if (birthTimeMode === 'branch' && birthHourBranch) {
    // 只知時辰時，起運仍可計算，但只能採該時辰中點並明確揭露假設。
    bHour = (branchStartHour(branchIndex(birthHourBranch)) + 1) % 24;
    bMinute = 0;
    timingAssumption = 'branch-midpoint';
  }
  // 當地民用時刻 → UT 的 JD（與節氣 JD(UT) 比較起運差，須扣除時區）
  const currentJD = gregorianToJulianDay(tYear, tMonth, tDay + (bHour + bMinute / 60) / 24) - timezoneOffsetHours / 24;

  // 1. 判斷順逆
  const yearStemYinYang = pillars.year.stemData.yinYang; // 'yang' | 'yin'
  let forward = true;

  if (directionRule === 'gender-year-yinyang') {
    if (gender === 'male') {
      forward = (yearStemYinYang === 'yang');
    } else {
      // female
      forward = (yearStemYinYang === 'yin');
    }
  }

  // 2. 求前後節時刻，以求起運時間差
  const surrounding = getSurroundingJie(currentJD, timezoneOffsetHours);
  const prevJie = surrounding.prevJie;
  const nextJie = surrounding.nextJie;

  let targetJie = forward ? nextJie : prevJie;
  // 差距天數
  let diffDays = forward ? (nextJie.jdUT - currentJD) : (currentJD - prevJie.jdUT);
  if (diffDays < 0) diffDays = 0;

  // 3. 節氣差除以 3 法則換算歲、月、日
  // 1 日 = 1/3 歲 = 4 個月 = 120 天
  // 1 小時 (1/24 日) = 5 天
  // 總月數 = diffDays * 4;
  const totalMonths = diffDays * 4;
  const startYears = Math.floor(totalMonths / 12);
  const remMonths = totalMonths - startYears * 12;
  const startMonths = Math.floor(remMonths);
  const remDays = (remMonths - startMonths) * 30;
  const startDays = Math.round(remDays);

  // 計算公曆起運日期（由出生日期推進 totalMonths 月，約合 diffDays * 121.75 天）
  const startJdOffset = diffDays * (365.2422 / 3);
  const startLocal = jdToLocalParts(currentJD + startJdOffset, timezoneOffsetHours);
  const pad = n => String(n).padStart(2, '0');
  const startDateStr = `${startLocal.year}-${pad(startLocal.month)}-${pad(startLocal.day)}`;
  const startDateTimeStr = formatLocalDateTime(startLocal);

  // 4. 由月柱向後或向前展開大運步數
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
    direction: forward ? 'forward' : 'backward',
    directionText: forward ? '順行' : '逆行',
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
      display: `${startYears} 歲 ${startMonths} 個月 ${startDays} 天`,
      startDate: startDateStr,
      startDateTime: startDateTimeStr,
      targetJie: targetJie.name,
      method: startAgeMethod,
      timingAssumption,
      timingDate,
      timingTime: `${String(bHour).padStart(2, '0')}:${String(bMinute).padStart(2, '0')}`
    },
    cycles
  };
}
