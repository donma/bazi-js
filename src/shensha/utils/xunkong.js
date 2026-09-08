// 六甲空亡（旬空）計算。六十甲子每旬固定空兩個地支。

import { sexagenaryIndex } from '../../core/constants/stems.js';

const STEM_CHARS = '甲乙丙丁戊己庚辛壬癸';
const BRANCH_CHARS = '子丑寅卯辰巳午未申酉戌亥';

function parseGanzhi(value) {
  if (typeof value === 'string') return { stem: value[0], branch: value[1] };
  if (value && value.stem && value.branch) return value;
  return null;
}

export function calculateXunKong(ganzhi) {
  const parsed = parseGanzhi(ganzhi);
  if (!parsed) return { xun: null, emptyBranches: [], index: -1 };
  const index = sexagenaryIndex(STEM_CHARS.indexOf(parsed.stem), BRANCH_CHARS.indexOf(parsed.branch));
  if (index < 0) return { xun: null, emptyBranches: [], index: -1 };
  const start = Math.floor(index / 10) * 10;
  return {
    xun: `${STEM_CHARS[start % 10]}${BRANCH_CHARS[start % 12]}旬`,
    emptyBranches: [BRANCH_CHARS[(start + 10) % 12], BRANCH_CHARS[(start + 11) % 12]],
    index
  };
}
