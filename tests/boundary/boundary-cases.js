// 邊界案例（Boundary Cases）— 全部經人工核對與外部萬年曆交叉驗證
// 分類：立春邊界 / 23:00換日 / 00:00換日 / 未知時間 / 只知時辰 / 真太陽時 / 1900邊界 / 2100邊界 / 越界錯誤

export const BOUNDARY_CASES = [
  {
    caseId: 'BD-LICHUN-01',
    category: '立春邊界',
    description: '2024-02-04 15:00（立春 16:26:53 之前）年柱仍癸卯、月柱仍乙丑',
    input: { birthDate: '2024-02-04', birthTime: '15:00', gender: 'male', timezone: '+08:00' },
    expected: { year: '癸卯', month: '乙丑', day: '戊戌', hour: '庚申', hourPillarAvailable: true },
    source: '人工推算 + 紫金山天文台立春時刻 16:26:53 交叉'
  },
  {
    caseId: 'BD-LICHUN-02',
    category: '立春邊界',
    description: '2024-02-04 17:00（立春之後）年柱交甲辰、月柱交丙寅',
    input: { birthDate: '2024-02-04', birthTime: '17:00', gender: 'male', timezone: '+08:00' },
    expected: { year: '甲辰', month: '丙寅', day: '戊戌', hour: '辛酉', hourPillarAvailable: true },
    source: '人工推算 + 紫金山天文台立春時刻交叉'
  },
  {
    caseId: 'BD-ZISHI-01',
    category: '23:00換日',
    description: '2024-05-15 22:59 未達子初，日柱當日己卯',
    input: { birthDate: '2024-05-15', birthTime: '22:59', gender: 'female', timezone: '+08:00' },
    expected: { year: '甲辰', month: '己巳', day: '己卯', hour: '乙亥', hourPillarAvailable: true },
    source: '人工推算（五鼠遁：己日亥時乙亥）'
  },
  {
    caseId: 'BD-ZISHI-02',
    category: '23:00換日',
    description: '2024-05-15 23:00 子初換日，日柱進次日庚辰、時柱丙子',
    input: { birthDate: '2024-05-15', birthTime: '23:00', gender: 'female', timezone: '+08:00' },
    expected: { year: '甲辰', month: '己巳', day: '庚辰', hour: '丙子', hourPillarAvailable: true },
    source: '人工推算（canonical 23:00 規則）'
  },
  {
    caseId: 'BD-ZISHI-03',
    category: '23:00換日',
    description: '2024-05-16 00:00 仍屬次日庚辰日子時',
    input: { birthDate: '2024-05-16', birthTime: '00:00', gender: 'male', timezone: '+08:00' },
    expected: { year: '甲辰', month: '己巳', day: '庚辰', hour: '丙子', hourPillarAvailable: true },
    source: '人工推算'
  },
  {
    caseId: 'BD-MIDNIGHT-01',
    category: '00:00換日',
    description: '00:00 profile 下 23:30 仍屬當日（夜子時歸當日）',
    input: { birthDate: '2024-05-15', birthTime: '23:30', gender: 'male', timezone: '+08:00', dayBoundary: '00:00' },
    expected: { year: '甲辰', month: '己巳', day: '己卯', hour: '甲子', hourPillarAvailable: true },
    source: '人工推算（midnight profile 語義）'
  },
  {
    caseId: 'BD-UNKNOWN-01',
    category: '未知時間',
    description: '時間未知不得猜測時柱，命宮身宮為 null',
    input: { birthDate: '1995-10-24', birthTimeMode: 'unknown', gender: 'female', timezone: '+08:00' },
    expected: { year: '乙亥', month: '丙戌', day: null, hour: null, hourPillarAvailable: false },
    source: '人工推算（年/月柱可知，日柱不考核、時柱必須缺席）',
    checkDay: false
  },
  {
    caseId: 'BD-BRANCH-01',
    category: '只知時辰',
    description: '只知午時，時支必須為午（日期選立秋後旬日避開節氣臨界）',
    input: { birthDate: '1990-08-18', birthTimeMode: 'branch', birthHourBranch: '午', gender: 'male', timezone: '+08:00' },
    expected: { year: '庚午', month: '甲申', day: null, hour: null, hourPillarAvailable: true, hourBranch: '午' },
    source: '人工推算',
    checkDay: false,
    checkHourStem: false
  },
  {
    caseId: 'BD-TST-01',
    category: '真太陽時',
    description: '啟用真太陽時需保留 civilTime 並輸出修正分鐘數',
    input: { birthDate: '1983-06-21', birthTime: '12:00', gender: 'male', timezone: '+08:00', trueSolarTime: true, location: { country: 'TW', city: 'Taipei', longitude: 121.5654 } },
    expected: { usedTrueSolarTime: true },
    source: '結構斷言',
    structuralOnly: true
  },
  {
    caseId: 'BD-EDGE-1900',
    category: '1900邊界',
    description: 'SDK 保證最左邊界 1900-01-01 可排盤',
    input: { birthDate: '1900-01-01', birthTime: '06:00', gender: 'male', timezone: '+08:00' },
    expected: { year: '己亥', month: '丙子', day: '甲戌', hour: '丁卯', hourPillarAvailable: true },
    source: '人工推算 + 萬年曆交叉（甲戌日）'
  },
  {
    caseId: 'BD-EDGE-2100',
    category: '2100邊界',
    description: 'SDK 保證最右邊界 2100-12-31 可排盤',
    input: { birthDate: '2100-12-31', birthTime: '18:00', gender: 'female', timezone: '+08:00' },
    expected: { year: '庚申', month: '戊子', day: '丁未', hour: '己酉', hourPillarAvailable: true },
    source: '獨立演算法 + 干支公式人工核對'
  },
  {
    caseId: 'BD-ANCHOR-2000',
    category: '外部驗證錨點',
    description: '2000-01-01（三獨立萬年曆來源）：己卯年丙子月戊午日戊午時',
    input: { birthDate: '2000-01-01', birthTime: '12:00', gender: 'male', timezone: '+08:00' },
    expected: { year: '己卯', month: '丙子', day: '戊午', hour: '戊午', hourPillarAvailable: true },
    source: 'ximizi/rili.com/8s8s 三站一致'
  },
  {
    caseId: 'BD-ANCHOR-2024',
    category: '外部驗證錨點',
    description: '2024-01-01（多站萬年曆）：癸卯年甲子月甲子日庚午時',
    input: { birthDate: '2024-01-01', birthTime: '12:00', gender: 'male', timezone: '+08:00' },
    expected: { year: '癸卯', month: '甲子', day: '甲子', hour: '庚午', hourPillarAvailable: true },
    source: 'rili.com/月沙工具箱/易卦網一致'
  },
  {
    caseId: 'BD-ERROR-01',
    category: '錯誤案例',
    description: '1899-12-31 超出範圍必須回傳明確錯誤（BIRTH_DATE_OUT_OF_RANGE）',
    input: { birthDate: '1899-12-31', birthTime: '12:00', gender: 'male', timezone: '+08:00' },
    expectedError: 'BIRTH_DATE_OUT_OF_RANGE',
    source: '規範 3.1'
  },
  {
    caseId: 'BD-ERROR-02',
    category: '錯誤案例',
    description: '缺 gender 必須報錯',
    input: { birthDate: '2000-01-01', birthTime: '12:00', timezone: '+08:00' },
    expectedError: 'BAZI_VALIDATION_ERROR',
    source: '規範 4.1'
  }
];
