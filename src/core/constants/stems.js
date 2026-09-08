// 天干資料模型
// 每個天干：id, character, pinyin, element(五行), yinYang(陰陽), hiddenBranch? no
// index 0..9 對應 甲..癸

export const STEMS = [
  { id: 'jia',   char: '甲', pinyin: 'jiǎ',  element: '木', yinYang: 'yang' },
  { id: 'yi',    char: '乙', pinyin: 'yǐ',   element: '木', yinYang: 'yin'  },
  { id: 'bing',  char: '丙', pinyin: 'bǐng', element: '火', yinYang: 'yang' },
  { id: 'ding',  char: '丁', pinyin: 'dīng', element: '火', yinYang: 'yin'  },
  { id: 'wu',    char: '戊', pinyin: 'wù',   element: '土', yinYang: 'yang' },
  { id: 'ji',    char: '己', pinyin: 'jǐ',   element: '土', yinYang: 'yin'  },
  { id: 'geng',  char: '庚', pinyin: 'gēng', element: '金', yinYang: 'yang' },
  { id: 'xin',   char: '辛', pinyin: 'xīn',  element: '金', yinYang: 'yin'  },
  { id: 'ren',   char: '壬', pinyin: 'rén',  element: '水', yinYang: 'yang' },
  { id: 'gui',   char: '癸', pinyin: 'guǐ',  element: '水', yinYang: 'yin'  }
];

// 字元 → index
export const STEM_INDEX = Object.fromEntries(STEMS.map((s, i) => [s.char, i]));

export function stemIndex(char) {
  return STEM_INDEX[char];
}

export function stemAt(index) {
  const i = ((index % 10) + 10) % 10;
  return STEMS[i];
}

// 六十甲子序數：天干 index, 地支 index → 甲子序列號 (0..59)
export function sexagenaryIndex(stemIdx, branchIdx) {
  for (let n = 0; n < 60; n++) {
    if (n % 10 === stemIdx && n % 12 === branchIdx) return n;
  }
  return -1;
}

// 由序列號取干、支
export function sexagenaryStemBranch(n) {
  const i = ((n % 60) + 60) % 60;
  return { stemIdx: i % 10, branchIdx: i % 12 };
}

export const STEM_CHARS = STEMS.map((s) => s.char);