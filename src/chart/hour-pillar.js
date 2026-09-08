// 時柱計算模組
// 支援三種模式：
// 1. exact: 給定 HH:mm
// 2. branch: 只知時辰地支 (如 '午')
// 3. unknown: 完全未知時間（不猜測時柱，回傳空/佔位）
//
// 五鼠遁日起時訣（由日干求子時天干）：
// 甲己還加甲（甲、己日子時為甲子）
// 乙庚丙作初（乙、庚日子時為丙子）
// 丙辛從戊起（丙、辛日子時為戊子）
// 丁壬庚子居（丁、壬日子時為庚子）
// 戊癸何方發，壬子是真途（戊、癸日子時為壬子）

import { stemAt, stemIndex, sexagenaryIndex } from '../core/constants/stems.js';
import { branchAt, branchIndex, hourBranchIndex } from '../core/constants/branches.js';

// 五鼠遁表：日干序號 (0..9) 對應子時起點天干序號 (0..9)
// 甲(0)->甲(0), 乙(1)->丙(2), 丙(2)->戊(4), 丁(3)->庚(6), 戊(4)->壬(8)
// 己(5)->甲(0), 庚(6)->丙(2), 辛(7)->戊(4), 壬(8)->庚(6), 癸(9)->壬(8)
const WU_SHU_DUN = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];

export function calculateHourPillar({
  mode = 'exact', // 'exact' | 'branch' | 'unknown'
  hour = null,
  minute = 0,
  branchChar = null,
  dayStemChar, // 由日柱所得之日干
  ziShiMode = 'zi_chu' // 'zi_chu' 23:00起算子時 | 'ye_zi' 夜子/早子分別
}) {
  const trace = [];

  // 若時間未知
  if (mode === 'unknown') {
    trace.push(`出生時間未知 (unknown)，依規範不猜測時柱`);
    return {
      available: false,
      mode: 'unknown',
      stem: null,
      branch: null,
      ganzhi: null,
      sexagenaryIndex: null,
      trace
    };
  }

  let hBranchIdx = 0;
  let hBranchChar = '子';

  if (mode === 'branch') {
    if (!branchChar) throw new Error('時辰模式下必須提供 branchChar (如 "午")');
    hBranchIdx = branchIndex(branchChar);
    hBranchChar = branchChar;
    trace.push(`依指定時辰地支【${branchChar}】排時柱`);
  } else {
    // exact 模式
    if (hour === null || hour === undefined) {
      throw new Error('精確時間模式下必須提供 hour');
    }
    hBranchIdx = hourBranchIndex(hour);
    hBranchChar = branchAt(hBranchIdx).char;
    trace.push(`公曆小時 ${hour}:${String(minute).padStart(2, '0')}，對應時辰地支【${hBranchChar}】`);
  }

  // 五鼠遁求時干
  const dStemIdx = stemIndex(dayStemChar);
  const ratStartStemIdx = WU_SHU_DUN[dStemIdx];

  // 時柱地支序號就是從子(0)開始的偏移量 (0..11)
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
