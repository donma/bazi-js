// 獨立演算法（Independent Reference Algorithm）
// 目的：產生 Golden Test 的 expected 值，避免「用 production code 產生 expected 再自測」。
// 本模組刻意與 src/ 實作分離：
// - 日柱：以「2000-01-01 = 戊午(54)」錨點 + 自訂 civil-day 差數法（非 JDN 公式）
// - 年柱：以「立春日期查表 + (year-4) mod 60」兩段式（非太陽黃經天文計算）
// - 月柱：以節氣約略日查表判斷節月 + 五虎遁「對照表」形式
// - 時柱：以「日干 x 時支 → 時干」二維對照表（查表式，非公式）
// 上方立春/節氣近似日（月/日，CST）僅供 golden 樣本避開邊界使用。

// ---------- civil day 差數（Howard Hinnant days-from-civil 演算法，非 JDN 公式） ----------
function daySerial(y, m, d) {
  const y2 = m <= 2 ? y - 1 : y;
  const era = Math.floor(y2 / 400);
  const yoe = y2 - era * 400;
  const mp = (m + 9) % 12; // Mar=0 .. Feb=11
  const doy = Math.floor((153 * mp + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe;
}
const ANCHOR_SERIAL = daySerial(2000, 1, 1); // 錨點：2000-01-01 = 戊午(54)
function daysFromAnchor(y, m, d) {
  return daySerial(y, m, d) - ANCHOR_SERIAL;
}

const STEMS = '甲乙丙丁戊己庚辛壬癸';
const BRANCHES = '子丑寅卯辰巳午未申酉戌亥';
export function refDayGanzhi(y, m, d) {
  const n = daysFromAnchor(y, m, d);
  const idx = (((54 + n) % 60) + 60) % 60; // 錨點序 54，向前/後推移
  return { ganzhi: STEMS[idx % 10] + BRANCHES[idx % 12], stemIdx: idx % 10, branchIdx: idx % 12, idx };
}

// ---------- 節氣近似日（CST，僅用於避開邊界與月柱粗判，精度 ±1 日可接受） ----------
// 格式：{ jie: {month: day}, qi: ... }
export function approxLichunDay(y) {
  // 立春大多落在 2/3 或 2/4（少數 2/5）。本表只供「避開邊界」與粗驗用。
  return (y % 4 === 0 && y % 100 !== 0) ? { m: 2, d: 5 } : { m: 2, d: 4 };
}

const JIE_BRANCHES = ['丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子'];
// 節氣約略月日（中氣日 ±15 日），只求 golden 生成避開臨界
const APPROX_JIE = [
  [1, 6], [2, 4], [3, 6], [4, 5], [5, 6], [6, 6], [7, 7], [8, 8], [9, 8], [10, 8], [11, 7], [12, 7]
];
export function refMonthBranch(y, m, d) {
  // 初始為上一年大雪後之子月；掃過已過之節後取該節之月建
  let idx = 11; // 子
  for (let i = 0; i < 12; i++) {
    const [jm, jd] = APPROX_JIE[i];
    if (m > jm || (m === jm && d >= jd)) idx = i;
  }
  return JIE_BRANCHES[idx];
}

// 五虎遁查表（年干 x 寅月干）
const WUHU = { 甲: 2, 乙: 4, 丙: 6, 丁: 8, 戊: 0, 己: 2, 庚: 4, 辛: 6, 壬: 8, 癸: 0 };
const YIN_ORDER = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
export function refMonthGanzhi(yearStem, mBranch) {
  const step = YIN_ORDER.indexOf(mBranch);
  const sIdx = (WUHU[yearStem] + step) % 10;
  return STEMS[sIdx] + mBranch;
}

export function refYearGanzhi(y) {
  const s = ((y - 4) % 10 + 10) % 10;
  const b = ((y - 4) % 12 + 12) % 12;
  return { ganzhi: STEMS[s] + BRANCHES[b], stemIdx: s, branchIdx: b };
}

// 五鼠遁查表（日干 x 時支 -> 時干）
const WUSHU = { 甲: 0, 乙: 2, 丙: 4, 丁: 6, 戊: 8, 己: 0, 庚: 2, 辛: 4, 壬: 6, 癸: 8 };
const HOUR_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export function refHourBranch(hour) {
  return HOUR_ORDER[Math.floor(((hour + 1) % 24) / 2)];
}
export function refHourGanzhi(dayStem, hourBranch) {
  const step = HOUR_ORDER.indexOf(hourBranch);
  const sIdx = (WUSHU[dayStem] + step) % 10;
  return STEMS[sIdx] + hourBranch;
}

// 由 birthDate/birthTime(僅整點, 避開邊界) 得完整四柱參考
export function refFourPillars(birthDate, hour, safe) {
  const [y, m, d] = birthDate.split('-').map(Number);
  const day = refDayGanzhi(y, m, d);

  // 年：簡化處理 — 若日期在立春後（粗表），用該年；立春前用前一年。safe=true 表示樣本遠離立春
  const lc = approxLichunDay(y);
  let yearGanZhi = refYearGanzhi(y);
  if (m < lc.m || (m === lc.m && d < lc.d)) {
    yearGanZhi = refYearGanzhi(y - 1);
  }
  const mBranch = refMonthBranch(y, m, d);
  const monthGZ = refMonthGanzhi(yearGanZhi.ganzhi[0], mBranch);
  const hBranch = refHourBranch(hour);
  const hourGZ = refHourGanzhi(day.ganzhi[0], hBranch);

  return {
    year: yearGanZhi.ganzhi,
    month: monthGZ,
    day: day.ganzhi,
    hour: hourGZ,
    dayStemIdx: day.stemIdx,
    dayBranchIdx: day.branchIdx
  };
}
