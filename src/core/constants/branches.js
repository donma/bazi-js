// 地支資料模型
// 每個地支：id, char, pinyin, element(本氣五行), yinYang, hiddenStems(藏干), zodiac(生肖), hourRange(時辰時段)
// index 0..11 對應 子..亥

export const BRANCHES = [
  { id: 'zi',   char: '子', pinyin: 'zǐ',  element: '水', yinYang: 'yang', zodiac: '鼠', hidden: ['癸'] },
  { id: 'chou', char: '丑', pinyin: 'chǒu', element: '土', yinYang: 'yin',  zodiac: '牛', hidden: ['己', '癸', '辛'] },
  { id: 'yin',  char: '寅', pinyin: 'yín', element: '木', yinYang: 'yang', zodiac: '虎', hidden: ['甲', '丙', '戊'] },
  { id: 'mao',  char: '卯', pinyin: 'mǎo', element: '木', yinYang: 'yin',  zodiac: '兔', hidden: ['乙'] },
  { id: 'chen', char: '辰', pinyin: 'chén', element: '土', yinYang: 'yang', zodiac: '龍', hidden: ['戊', '乙', '癸'] },
  { id: 'si',   char: '巳', pinyin: 'sì',  element: '火', yinYang: 'yin',  zodiac: '蛇', hidden: ['丙', '庚', '戊'] },
  { id: 'wu',   char: '午', pinyin: 'wǔ',  element: '火', yinYang: 'yang', zodiac: '馬', hidden: ['丁', '己'] },
  { id: 'wei',  char: '未', pinyin: 'wèi', element: '土', yinYang: 'yin',  zodiac: '羊', hidden: ['己', '丁', '乙'] },
  { id: 'shen', char: '申', pinyin: 'shēn', element: '金', yinYang: 'yang', zodiac: '猴', hidden: ['庚', '壬', '戊'] },
  { id: 'you',  char: '酉', pinyin: 'yǒu', element: '金', yinYang: 'yin',  zodiac: '雞', hidden: ['辛'] },
  { id: 'xu',   char: '戌', pinyin: 'xū',  element: '土', yinYang: 'yang', zodiac: '狗', hidden: ['戊', '辛', '丁'] },
  { id: 'hai',  char: '亥', pinyin: 'hài', element: '水', yinYang: 'yin',  zodiac: '豬', hidden: ['壬', '甲'] }
];

export const BRANCH_INDEX = Object.fromEntries(BRANCHES.map((b, i) => [b.char, i]));

export function branchIndex(char) {
  return BRANCH_INDEX[char];
}

export function branchAt(index) {
  const i = ((index % 12) + 12) % 12;
  return BRANCHES[i];
}

export const BRANCH_CHARS = BRANCHES.map((b) => b.char);

// 時辰地支：以 23:00 起算子時（0=子 ... 11=亥）
// 子時 23:00-00:59, 丑 01:00-02:59 ... 亥 21:00-22:59
export function hourBranchIndex(hour) {
  const idx = Math.floor(((hour + 1) % 24) / 2);
  return idx % 12;
}

// 根據時辰 index 取其跨越小時起點（23, 1, 3, 5...）
export function branchStartHour(branchIdx) {
  return (branchIdx * 2 + 23) % 24;
}
