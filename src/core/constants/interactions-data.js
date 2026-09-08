// 地支關係常數：六合、六沖、三合、三會、六害、相破、相刑

// 1. 六合（化氣）
export const SIX_COMBINATIONS = [
  { branches: ['子', '丑'], generates: '土', name: '子丑合土' },
  { branches: ['寅', '亥'], generates: '木', name: '寅亥合木' },
  { branches: ['卯', '戌'], generates: '火', name: '卯戌合火' },
  { branches: ['辰', '酉'], generates: '金', name: '辰酉合金' },
  { branches: ['巳', '申'], generates: '水', name: '巳申合水' },
  { branches: ['午', '未'], generates: '土', name: '午未合土' } // 亦有日月合化火土，canonical採火/土
];

// 2. 六沖
export const SIX_CLASHES = [
  { pair: ['子', '午'], name: '子午沖' },
  { pair: ['丑', '未'], name: '丑未沖' },
  { pair: ['寅', '申'], name: '寅申沖' },
  { pair: ['卯', '酉'], name: '卯酉沖' },
  { pair: ['辰', '戌'], name: '辰戌沖' },
  { pair: ['巳', '亥'], name: '巳亥沖' }
];

// 3. 三合局（長生、帝旺、墓）
export const TRIPLE_COMBINATIONS = [
  { branches: ['申', '子', '辰'], element: '水', name: '申子辰三合水局', sheng: '申', wang: '子', mu: '辰' },
  { branches: ['亥', '卯', '未'], element: '木', name: '亥卯未三合木局', sheng: '亥', wang: '卯', mu: '未' },
  { branches: ['寅', '午', '戌'], element: '火', name: '寅午戌三合火局', sheng: '寅', wang: '午', mu: '戌' },
  { branches: ['巳', '酉', '丑'], element: '金', name: '巳酉丑三合金局', sheng: '巳', wang: '酉', mu: '丑' }
];

// 4. 三會局（方局，力最大）
export const TRIPLE_MEETINGS = [
  { branches: ['寅', '卯', '辰'], element: '木', direction: '東方', name: '寅卯辰三會東方木' },
  { branches: ['巳', '午', '未'], element: '火', direction: '南方', name: '巳午未三會南方火' },
  { branches: ['申', '酉', '戌'], element: '金', direction: '西方', name: '申酉戌三會西方金' },
  { branches: ['亥', '子', '丑'], element: '水', direction: '北方', name: '亥子丑三會北方水' }
];

// 5. 六害（相害 / 相穿）
export const SIX_HARMS = [
  { pair: ['子', '未'], name: '子未害' },
  { pair: ['丑', '午'], name: '丑午害' },
  { pair: ['寅', '巳'], name: '寅巳害' },
  { pair: ['卯', '辰'], name: '卯辰害' },
  { pair: ['申', '亥'], name: '申亥害' },
  { pair: ['酉', '戌'], name: '酉戌害' }
];

// 6. 相破
export const SIX_DESTRUCTIONS = [
  { pair: ['子', '酉'], name: '子酉破' },
  { pair: ['丑', '辰'], name: '丑辰破' },
  { pair: ['寅', '亥'], name: '寅亥破' },
  { pair: ['卯', '午'], name: '卯午破' },
  { pair: ['巳', '申'], name: '巳申破' },
  { pair: ['未', '戌'], name: '未戌破' }
];

// 7. 相刑（三刑、自刑、無禮之刑）
export const PUNISHMENTS = [
  // 無恩之刑（寅巳申三刑）
  { branches: ['寅', '巳', '申'], type: 'ungrateful', name: '寅巳申三刑' },
  // 恃勢之刑（丑戌未三刑）
  { branches: ['丑', '戌', '未'], type: 'bullying', name: '丑戌未三刑' },
  // 無禮之刑（子卯刑）
  { branches: ['子', '卯'], type: 'uncivil', name: '子卯相刑' },
  // 自刑（辰辰、午午、酉酉、亥亥）
  { branches: ['辰', '辰'], type: 'self', name: '辰辰自刑' },
  { branches: ['午', '午'], type: 'self', name: '午午自刑' },
  { branches: ['酉', '酉'], type: 'self', name: '酉酉自刑' },
  { branches: ['亥', '亥'], type: 'self', name: '亥亥自刑' }
];

// 8. 天干五合
export const STEM_COMBINATIONS = [
  { pair: ['甲', '己'], generates: '土', name: '甲己合土' },
  { pair: ['乙', '庚'], generates: '金', name: '乙庚合金' },
  { pair: ['丙', '辛'], generates: '水', name: '丙辛合水' },
  { pair: ['丁', '壬'], generates: '木', name: '丁壬合木' },
  { pair: ['戊', '癸'], generates: '火', name: '戊癸合火' }
];

// 9. 天干相沖
export const STEM_CLASHES = [
  { pair: ['甲', '庚'], name: '甲庚沖' },
  { pair: ['乙', '辛'], name: '乙辛沖' },
  { pair: ['丙', '壬'], name: '丙壬沖' },
  { pair: ['丁', '癸'], name: '丁癸沖' }
];
