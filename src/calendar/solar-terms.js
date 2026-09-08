// 二十四節氣精確表與查詢模組
// 為求極速且絕對確定性（兼顧 1900-2100 精確度到分秒），提供解析計算與即時查算

import { gregorianToJulianDay, julianDayToGregorian, ttToUt, utToTt, jdToLocalParts } from './julian.js';
import { solarLongitude, findSolarLongitudeTime } from './solar.js';

// 二十四節氣定義（依太陽黃經度數，0°=春分，315°=立春）
export const SOLAR_TERMS = [
  { id: 'chun_fen',     name: '春分', type: 'qi',  longitude: 0,   monthBranch: null },
  { id: 'qing_ming',    name: '清明', type: 'jie', longitude: 15,  monthBranch: '辰' },
  { id: 'gu_yu',        name: '穀雨', type: 'qi',  longitude: 30,  monthBranch: null },
  { id: 'li_xia',       name: '立夏', type: 'jie', longitude: 45,  monthBranch: '巳' },
  { id: 'xiao_man',     name: '小滿', type: 'qi',  longitude: 60,  monthBranch: null },
  { id: 'mang_zhong',   name: '芒種', type: 'jie', longitude: 75,  monthBranch: '午' },
  { id: 'xia_zhi',      name: '夏至', type: 'qi',  longitude: 90,  monthBranch: null },
  { id: 'xiao_shu',     name: '小暑', type: 'jie', longitude: 105, monthBranch: '未' },
  { id: 'da_shu',       name: '大暑', type: 'qi',  longitude: 120, monthBranch: null },
  { id: 'li_qiu',       name: '立秋', type: 'jie', longitude: 135, monthBranch: '申' },
  { id: 'chu_shu',      name: '處暑', type: 'qi',  longitude: 150, monthBranch: null },
  { id: 'bai_lu',       name: '白露', type: 'jie', longitude: 165, monthBranch: '酉' },
  { id: 'qiu_fen',      name: '秋分', type: 'qi',  longitude: 180, monthBranch: null },
  { id: 'han_lu',       name: '寒露', type: 'jie', longitude: 195, monthBranch: '戌' },
  { id: 'shuang_jiang', name: '霜降', type: 'qi',  longitude: 210, monthBranch: null },
  { id: 'li_dong',      name: '立冬', type: 'jie', longitude: 225, monthBranch: '亥' },
  { id: 'xiao_xue',     name: '小雪', type: 'qi',  longitude: 240, monthBranch: null },
  { id: 'da_xue',       name: '大雪', type: 'jie', longitude: 255, monthBranch: '子' },
  { id: 'dong_zhi',     name: '冬至', type: 'qi',  longitude: 270, monthBranch: null },
  { id: 'xiao_han',     name: '小寒', type: 'jie', longitude: 285, monthBranch: '丑' },
  { id: 'da_han',       name: '大寒', type: 'qi',  longitude: 300, monthBranch: null },
  { id: 'li_chun',      name: '立春', type: 'jie', longitude: 315, monthBranch: '寅' },
  { id: 'yu_shui',      name: '雨水', type: 'qi',  longitude: 330, monthBranch: null },
  { id: 'jing_zhe',     name: '驚蟄', type: 'jie', longitude: 345, monthBranch: '卯' }
];

// 大致在一年中的約略天數（從該年 1月1日 00:00 起算的天數估計值，供初始迭代牛頓法使用）
// 小寒 ~ 1月6日 (5.5)
// 大寒 ~ 1月20日 (19.5)
// 立春 ~ 2月4日 (34.5)
// 雨水 ~ 2月19日 (49.5)
// 驚蟄 ~ 3月6日 (64.5)
// 春分 ~ 3月21日 (79.5)
// 清明 ~ 4月5日 (94.5)
// 穀雨 ~ 4月20日 (109.5)
// 立夏 ~ 5月6日 (125.5)
// 小滿 ~ 5月21日 (140.5)
// 芒種 ~ 6月6日 (156.5)
// 夏至 ~ 6月21日 (171.5)
// 小暑 ~ 7月7日 (187.5)
// 大暑 ~ 7月23日 (203.5)
// 立秋 ~ 8月8日 (219.5)
// 處暑 ~ 8月23日 (234.5)
// 白露 ~ 9月8日 (250.5)
// 秋分 ~ 9月23日 (265.5)
// 寒露 ~ 10月8日 (280.5)
// 霜降 ~ 10月23日 (295.5)
// 立冬 ~ 11月7日 (310.5)
// 小雪 ~ 11月22日 (325.5)
// 大雪 ~ 12月7日 (340.5)
// 冬至 ~ 12月22日 (355.5)

const TERM_APPROX_DAYS = {
  'xiao_han': 5.5,
  'da_han': 19.8,
  'li_chun': 34.5,
  'yu_shui': 49.6,
  'jing_zhe': 64.3,
  'chun_fen': 79.5,
  'qing_ming': 94.6,
  'gu_yu': 109.8,
  'li_xia': 125.4,
  'xiao_man': 140.8,
  'mang_zhong': 156.6,
  'xia_zhi': 171.9,
  'xiao_shu': 187.8,
  'da_shu': 203.8,
  'li_qiu': 219.8,
  'chu_shu': 235.3,
  'bai_lu': 250.8,
  'qiu_fen': 266.0,
  'han_lu': 281.0,
  'shuang_jiang': 296.0,
  'li_dong': 311.0,
  'xiao_xue': 325.8,
  'da_xue': 340.8,
  'dong_zhi': 355.8
};

// 快取某年所有 24 節氣之 JD(UT)
const TERM_CACHE = new Map();

// 計算某年某節氣之精確 JD(UT)
export function calculateSolarTermJD(year, termId) {
  const cacheKey = `${year}_${termId}`;
  if (TERM_CACHE.has(cacheKey)) return TERM_CACHE.get(cacheKey);

  const term = SOLAR_TERMS.find(t => t.id === termId);
  if (!term) throw new Error(`無效節氣 ID: ${termId}`);

  // 以 1 月 1 日 0h UT 為基準估算
  const baseJD = gregorianToJulianDay(year, 1, 1);
  const approxDays = TERM_APPROX_DAYS[termId];
  const guessJD = baseJD + approxDays;
  const guessTT = utToTt(guessJD, year);

  // 精確求解黃經
  const preciseTT = findSolarLongitudeTime(term.longitude, guessTT);
  const preciseUT = ttToUt(preciseTT, year);

  TERM_CACHE.set(cacheKey, preciseUT);
  return preciseUT;
}

// 取得某年全部 24 節氣（照時間順序排列，包含從上一年的冬至到下一年的大寒前後）
export function getYearSolarTerms(year, timezoneOffsetHours = 8) {
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

// 取得當前 JD(UT) 所落在的「節」（月柱交節）以及前後節氣
// 依據命理十二節切月：立春(寅月)、驚蟄(卯月)、清明(辰月)、立夏(巳月)、芒種(午月)、小暑(未月)、
// 立秋(申月)、白露(酉月)、寒露(戌月)、立冬(亥月)、大雪(子月)、小寒(丑月)
export function getSurroundingJie(jdUT, timezoneOffsetHours = 8) {
  const g = julianDayToGregorian(jdUT);
  const year = g.year;

  // 取 year-1、year、year+1 的所有「節」
  const allJie = [];
  const jieTerms = SOLAR_TERMS.filter(t => t.type === 'jie');

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

  // 找 prev (jdUT <= 當前) 與 next (jdUT > 當前)
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

// 取得立春時刻（特定年）
export function getLichunMoment(year, timezoneOffsetHours = 8) {
  const jdUT = calculateSolarTermJD(year, 'li_chun');
  return {
    jdUT,
    local: jdToLocalParts(jdUT, timezoneOffsetHours)
  };
}
