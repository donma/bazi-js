// 輔助四宮計算模組（胎元、胎息、命宮、身宮）
//
// 1. 胎元：
//    月干進一位（+1），月支進三位（+3）
//    例：戊申月 -> 天干戊+1=己，地支申+3=亥 -> 胎元己亥
//
// 2. 胎息：
//    日柱天干地支相合者為胎息。
//    天干五合（甲己、乙庚、丙辛、丁壬、戊癸）
//    地支六合（子丑、寅亥、卯戌、辰酉、巳申、午未）
//    例：庚子日 -> 乙丑（乙庚合金，子丑合土）
//
// 3. 命宮：
//    口訣：「若問命宮何處起，立命推尋卯上生。日辰逆行時順轉，數到生時是命宮。」
//    或公式法：
//    取太陽過宮（以中氣過宮或以月建）：
//    命宮地支 = (26 - (月支數 + 時支數)) % 12
//    其中地支數以寅=1, 卯=2 ... 丑=12 計算；或子=1..亥=12。
//    標準子平掌訣法（以寅起正月）：
//    設正月(寅)=1, 二月(卯)=2, ..., 丑=12。
//    時支子=1, 丑=2, 寅=3, ..., 亥=12。
//    命宮地支數 M = (14 - 月支數 - 時支數 + 24) % 12 (若為0則為12)。
//    天干以年上起月訣（五虎遁）配命宮天干。
//
// 4. 身宮：
//    身宮與命宮相對：
//    身宮地支數 S = (月支數 + 時支數 + 24) % 12 (若為0則為12)。
//    天干同樣以年上起月訣（五虎遁）配合身宮地支。

import { stemAt, stemIndex, sexagenaryIndex } from '../core/constants/stems.js';
import { branchAt, branchIndex } from '../core/constants/branches.js';
import { getNayin } from '../core/constants/nayin-data.js';

// 天干五合對應
const STEM_HE = {
  '甲': '己', '己': '甲',
  '乙': '庚', '庚': '乙',
  '丙': '辛', '辛': '丙',
  '丁': '壬', '壬': '丁',
  '戊': '癸', '癸': '戊'
};

// 地支六合對應
const BRANCH_HE = {
  '子': '丑', '丑': '子',
  '寅': '亥', '亥': '寅',
  '卯': '戌', '戌': '卯',
  '辰': '酉', '酉': '辰',
  '巳': '申', '申': '巳',
  '午': '未', '未': '午'
};

// 五虎遁年起月訣（由年干求寅月天干）
const WU_HU_DUN = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
const YIN_BASED_BRANCH_ORDER = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
const YIN_ORDER_MAP = Object.fromEntries(YIN_BASED_BRANCH_ORDER.map((b, i) => [b, i]));

export function calculateChartAuxiliary(pillars) {
  // 1. 胎元
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

  // 2. 胎息
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

  // 3. 命宮與身宮（若時柱未知，則無法精確推算命宮身宮）
  if (!pillars.hour.available) {
    return {
      taiYuan,
      taiXi,
      mingGong: null,
      shenGong: null
    };
  }

  // 掌訣數：以正月(寅)=1, 二月(卯)=2 ... 丑=12
  // 子=11, 丑=12, 寅=1, 卯=2, 辰=3, 巳=4, 午=5, 未=6, 申=7, 酉=8, 戌=9, 亥=10
  const branchToMonthNum = (bChar) => {
    const idx = YIN_ORDER_MAP[bChar];
    return idx + 1; // 1..12
  };

  // 時辰數：以子=1, 丑=2 ... 亥=12
  const branchToHourNum = (bChar) => {
    return branchIndex(bChar) + 1; // 1..12
  };

  const mNum = branchToMonthNum(pillars.month.branch);
  const hNum = branchToHourNum(pillars.hour.branch);

  // 命宮地支： (14 - 月數 - 時數) % 12 (以 1..12 對應 寅..丑)
  let mgVal = (14 - mNum - hNum);
  while (mgVal <= 0) mgVal += 12;
  while (mgVal > 12) mgVal -= 12;
  const mgBranchChar = YIN_BASED_BRANCH_ORDER[mgVal - 1];

  // 身宮地支： (月數 + 時數 + 12 - 2) % 12
  let sgVal = (mNum + hNum - 2);
  while (sgVal <= 0) sgVal += 12;
  while (sgVal > 12) sgVal -= 12;
  const sgBranchChar = YIN_BASED_BRANCH_ORDER[sgVal - 1];

  // 由年干五虎遁求命宮、身宮天干
  const yStemIdx = stemIndex(pillars.year.stem);
  const tigerStart = WU_HU_DUN[yStemIdx];

  const mgStep = YIN_ORDER_MAP[mgBranchChar];
  const mgStemIdx = (tigerStart + mgStep) % 10;
  const mgStem = stemAt(mgStemIdx).char;
  const mgGanzhi = `${mgStem}${mgBranchChar}`;
  const mgIndex = sexagenaryIndex(mgStemIdx, branchIndex(mgBranchChar));

  const sgStep = YIN_ORDER_MAP[sgBranchChar];
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
