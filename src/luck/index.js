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
import { branchAt, branchIndex } from '../core/constants/branches.js';
import { getNayin } from '../core/constants/nayin-data.js';
import { getTenGod } from '../core/constants/ten-gods-data.js';
import { getTwelveStage } from '../core/constants/twelve-stages-data.js';
import { getSurroundingJie } from '../calendar/solar-terms.js';
import { gregorianToJulianDay, julianDayToGregorian } from '../calendar/julian.js';

export function calculateLuckCycles({
  pillars,
  gender, // 'male' | 'female'
  birthDate, // 'YYYY-MM-DD'
  birthTime = '12:00',
  timezoneOffsetHours = 8,
  cycleCount = 10,
  directionRule = 'gender-year-yinyang',
  startAgeMethod = 'jieqi-diff-divide-3'
}) {
  const [bYear, bMonth, bDay] = birthDate.split('-').map(Number);
  const [bHour, bMinute] = (birthTime || '12:00').split(':').map(Number);
  // 當地民用時刻 → UT 的 JD（與節氣 JD(UT) 比較起運差，須扣除時區）
  const currentJD = gregorianToJulianDay(bYear, bMonth, bDay + (bHour + bMinute / 60) / 24) - timezoneOffsetHours / 24;

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
  const startGregorian = julianDayToGregorian(currentJD + startJdOffset);
  const pad = n => String(n).padStart(2, '0');
  const startDateStr = `${startGregorian.year}-${pad(startGregorian.month)}-${pad(startGregorian.day)}`;

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
      startDate: startDateStr
    },
    cycles
  };
}
