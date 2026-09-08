// 月柱計算模組
// canonical 預設：以「十二節」切月（monthBoundary: "jie"），絕非以農曆初一換月。
// 節氣月建對應：
// 立春後 寅月(正月)
// 驚蟄後 卯月(二月)
// 清明後 辰月(三月)
// 立夏後 巳月(四月)
// 芒種後 午月(五月)
// 小暑後 未月(六月)
// 立秋後 申月(七月)
// 白露後 酉月(八月)
// 寒露後 戌月(九月)
// 立冬後 亥月(十月)
// 大雪後 子月(十一月)
// 小寒後 丑月(十二月)
//
// 五虎遁年起月訣（由年干求寅月天干）：
// 甲己之年丙作首（甲、己年正月為丙寅）
// 乙庚之歲戊為頭（乙、庚年正月為戊寅）
// 丙辛之歲尋庚上（丙、辛年正月為庚寅）
// 丁壬壬位順行流（丁、壬年正月為壬寅）
// 若言戊癸何方發，甲寅之上好追求（戊、癸年正月為甲寅）

import { stemAt, stemIndex, sexagenaryIndex } from '../core/constants/stems.js';
import { branchAt, branchIndex } from '../core/constants/branches.js';
import { getSurroundingJie } from '../calendar/solar-terms.js';
import { gregorianToJulianDay } from '../calendar/julian.js';

// 五虎遁表：年干序號 (0..9) 對應正月（寅月）天干序號 (0..9)
// 甲(0)->丙(2), 乙(1)->戊(4), 丙(2)->庚(6), 丁(3)->壬(8), 戊(4)->甲(0)
// 己(5)->丙(2), 庚(6)->戊(4), 辛(7)->庚(6), 壬(8)->壬(8), 癸(9)->甲(0)
const WU_HU_DUN = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];

// 地支月建序號（以寅為 0，卯為 1 ... 丑為 11）
const YIN_BASED_BRANCH_ORDER = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
const YIN_ORDER_MAP = Object.fromEntries(YIN_BASED_BRANCH_ORDER.map((b, i) => [b, i]));

export function calculateMonthPillar({
  year,
  month,
  day,
  hour = 12,
  minute = 0,
  timezoneOffsetHours = 8,
  yearStemChar, // 由年柱計算所得之年干
  monthBoundary = 'jie'
}) {
  // 當地民用時刻 → UT 的 JD（同 year-pillar 註解，否則節氣邊界誤判時區偏移量）
  const currentJD = gregorianToJulianDay(year, month, day + (hour + minute / 60) / 24) - timezoneOffsetHours / 24;
  const trace = [];

  let monthBranchChar = '寅';
  let prevJieInfo = null;
  let nextJieInfo = null;

  if (monthBoundary === 'jie') {
    const surrounding = getSurroundingJie(currentJD, timezoneOffsetHours);
    prevJieInfo = surrounding.prevJie;
    nextJieInfo = surrounding.nextJie;

    if (prevJieInfo) {
      monthBranchChar = prevJieInfo.monthBranch;
      trace.push(`交節點為 ${prevJieInfo.name} (${prevJieInfo.local.year}-${prevJieInfo.local.month}-${prevJieInfo.local.day} ${prevJieInfo.local.hour}:${prevJieInfo.local.minute})，月建地支為【${monthBranchChar}】`);
    } else {
      monthBranchChar = '寅';
      trace.push(`未找到前置交節點，預設寅月`);
    }
  }

  // 計算月干：五虎遁
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
