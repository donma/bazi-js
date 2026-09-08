// 官方神煞目錄（ShenSha Catalog - Data-driven）
// 每個神煞皆定義：
// - id: 唯一識別碼
// - name: 中文全名
// - category: 'auspicious' (吉) | 'inauspicious' (凶) | 'neutral' (中性)
// - baseOn: 基準來源 ('dayStem'|'yearStem'|'monthBranch'|'yearBranch'|'dayBranch'|'dayPillar')
// - ruleId: 規則編號（可追溯）
// - version: 規則版本
// - reference: 經典文獻出處（《三命通會》、《子平真詮》、《淵海子平》等）
// - check: 判定函數 (params: { pillars, targetPillar, targetType: 'stem'|'branch' }) => boolean

export const SHENSHA_CATALOG = [
  // 1. 天乙貴人
  // 口訣：甲戊庚牛羊，乙己鼠猴鄉，丙丁豬雞位，壬癸兔蛇藏，六辛逢馬虎，此是貴人方。
  {
    id: 'tian_yi_gui_ren',
    name: '天乙貴人',
    category: 'auspicious',
    baseOn: ['dayStem', 'yearStem'],
    ruleId: 'SS_TYGR_001',
    version: '1.0.0',
    reference: '《淵海子平》卷二、《三命通會》卷三',
    match: ({ baseStem, targetBranch }) => {
      const map = {
        '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
        '乙': ['子', '申'], '己': ['子', '申'],
        '丙': ['亥', '酉'], '丁': ['亥', '酉'],
        '壬': ['卯', '巳'], '癸': ['卯', '巳'],
        '辛': ['午', '寅']
      };
      return map[baseStem] ? map[baseStem].includes(targetBranch) : false;
    }
  },

  // 2. 太極貴人
  // 口訣：甲乙生人子午中，丙丁雞兔定亨通，戊己兩干臨四季，庚辛寅亥祿豐隆，壬癸巳申偏喜美
  {
    id: 'tai_ji_gui_ren',
    name: '太極貴人',
    category: 'auspicious',
    baseOn: ['dayStem', 'yearStem'],
    ruleId: 'SS_TJGR_002',
    version: '1.0.0',
    reference: '《三命通會》卷三',
    match: ({ baseStem, targetBranch }) => {
      const map = {
        '甲': ['子', '午'], '乙': ['子', '午'],
        '丙': ['酉', '卯'], '丁': ['酉', '卯'],
        '戊': ['辰', '戌', '丑', '未'], '己': ['辰', '戌', '丑', '未'],
        '庚': ['寅', '亥'], '辛': ['寅', '亥'],
        '壬': ['巳', '申'], '癸': ['巳', '申']
      };
      return map[baseStem] ? map[baseStem].includes(targetBranch) : false;
    }
  },

  // 3. 天德貴人
  // 正月生者見丁，二月見申，三月見壬，四月見辛，五月見亥，六月見甲，
  // 七月見癸，八月見寅，九月見丙，十月見乙，十一月見巳，十二月見庚。
  {
    id: 'tian_de_gui_ren',
    name: '天德貴人',
    category: 'auspicious',
    baseOn: ['monthBranch'],
    ruleId: 'SS_TDGR_003',
    version: '1.0.0',
    reference: '《淵海子平》、《子平真詮》',
    match: ({ monthBranch, targetStem, targetBranch }) => {
      const map = {
        '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛',
        '午': '亥', '未': '甲', '申': '癸', '酉': '寅',
        '戌': '丙', '亥': '乙', '子': '巳', '丑': '庚'
      };
      const val = map[monthBranch];
      if (!val) return false;
      return targetStem === val || targetBranch === val;
    }
  },

  // 4. 月德貴人
  // 寅午戌月在丙，申子辰月在壬，亥卯未月在甲，巳酉丑月在庚。
  {
    id: 'yue_de_gui_ren',
    name: '月德貴人',
    category: 'auspicious',
    baseOn: ['monthBranch'],
    ruleId: 'SS_YDGR_004',
    version: '1.0.0',
    reference: '《三命通會》卷三',
    match: ({ monthBranch, targetStem }) => {
      const map = {
        '寅': '丙', '午': '丙', '戌': '丙',
        '申': '壬', '子': '壬', '辰': '壬',
        '亥': '甲', '卯': '甲', '未': '甲',
        '巳': '庚', '酉': '庚', '丑': '庚'
      };
      return map[monthBranch] === targetStem;
    }
  },

  // 5. 文昌貴人
  // 口訣：甲乙巳午報君知，丙戊申宮丁己雞，庚豬辛鼠壬逢虎，癸人見兔入雲梯。
  {
    id: 'wen_chang_gui_ren',
    name: '文昌貴人',
    category: 'auspicious',
    baseOn: ['dayStem', 'yearStem'],
    ruleId: 'SS_WCGR_005',
    version: '1.0.0',
    reference: '《三命通會》卷三',
    match: ({ baseStem, targetBranch }) => {
      const map = {
        '甲': '巳', '乙': '午',
        '丙': '申', '戊': '申',
        '丁': '酉', '己': '酉',
        '庚': '亥', '辛': '子',
        '壬': '寅', '癸': '卯'
      };
      return map[baseStem] === targetBranch;
    }
  },

  // 6. 祿神（建祿）
  // 甲祿在寅，乙祿在卯，丙戊祿在巳，丁己祿在午，庚祿在申，辛祿在酉，壬祿在亥，癸祿在子。
  {
    id: 'lu_shen',
    name: '祿神',
    category: 'auspicious',
    baseOn: ['dayStem'],
    ruleId: 'SS_LUSHEN_006',
    version: '1.0.0',
    reference: '《三命通會》卷三',
    match: ({ baseStem, targetBranch }) => {
      const map = {
        '甲': '寅', '乙': '卯',
        '丙': '巳', '戊': '巳',
        '丁': '午', '己': '午',
        '庚': '申', '辛': '酉',
        '壬': '亥', '癸': '子'
      };
      return map[baseStem] === targetBranch;
    }
  },

  // 7. 羊刃
  // 甲羊刃在卯，乙羊刃在寅，丙戊羊刃在午，丁己羊刃在巳，庚羊刃在酉，辛羊刃在申，壬羊刃在子，癸羊刃在亥。
  {
    id: 'yang_ren',
    name: '羊刃',
    category: 'inauspicious',
    baseOn: ['dayStem'],
    ruleId: 'SS_YANGREN_007',
    version: '1.0.0',
    reference: '《淵海子平》、《三命通會》',
    match: ({ baseStem, targetBranch }) => {
      const map = {
        '甲': '卯', '乙': '寅',
        '丙': '午', '戊': '午',
        '丁': '巳', '己': '巳',
        '庚': '酉', '辛': '申',
        '壬': '子', '癸': '亥'
      };
      return map[baseStem] === targetBranch;
    }
  },

  // 8. 驛馬
  // 申子辰馬在寅，寅午戌馬在申，巳酉丑馬在亥，亥卯未馬在巳。
  {
    id: 'yi_ma',
    name: '驛馬',
    category: 'neutral',
    baseOn: ['yearBranch', 'dayBranch'],
    ruleId: 'SS_YIMA_008',
    version: '1.0.0',
    reference: '《三命通會》卷三',
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        '申': '寅', '子': '寅', '辰': '寅',
        '寅': '申', '午': '申', '戌': '申',
        '巳': '亥', '酉': '亥', '丑': '亥',
        '亥': '巳', '卯': '巳', '未': '巳'
      };
      return map[baseBranch] === targetBranch;
    }
  },

  // 9. 桃花（咸池）
  // 申子辰在酉，寅午戌在卯，巳酉丑在午，亥卯未在子。
  {
    id: 'tao_hua',
    name: '桃花（咸池）',
    category: 'neutral',
    baseOn: ['yearBranch', 'dayBranch'],
    ruleId: 'SS_TAOHUA_009',
    version: '1.0.0',
    reference: '《三命通會》卷三',
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        '申': '酉', '子': '酉', '辰': '酉',
        '寅': '卯', '午': '卯', '戌': '卯',
        '巳': '午', '酉': '午', '丑': '午',
        '亥': '子', '卯': '子', '未': '子'
      };
      return map[baseBranch] === targetBranch;
    }
  },

  // 10. 華蓋
  // 寅午戌見戌，巳酉丑見丑，申子辰見辰，亥卯未見未。
  {
    id: 'hua_gai',
    name: '華蓋',
    category: 'neutral',
    baseOn: ['yearBranch', 'dayBranch'],
    ruleId: 'SS_HUAGAI_010',
    version: '1.0.0',
    reference: '《三命通會》卷三',
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        '寅': '戌', '午': '戌', '戌': '戌',
        '巳': '丑', '酉': '丑', '丑': '丑',
        '申': '辰', '子': '辰', '辰': '辰',
        '亥': '未', '卯': '未', '未': '未'
      };
      return map[baseBranch] === targetBranch;
    }
  },

  // 11. 將星
  // 寅午戌見午，巳酉丑見酉，申子辰見子，亥卯未見卯。
  {
    id: 'jiang_xing',
    name: '將星',
    category: 'auspicious',
    baseOn: ['yearBranch', 'dayBranch'],
    ruleId: 'SS_JIANGXING_011',
    version: '1.0.0',
    reference: '《三命通會》卷三',
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        '寅': '午', '午': '午', '戌': '午',
        '巳': '酉', '酉': '酉', '丑': '酉',
        '申': '子', '子': '子', '辰': '子',
        '亥': '卯', '卯': '卯', '未': '卯'
      };
      return map[baseBranch] === targetBranch;
    }
  },

  // 12. 劫煞
  // 申子辰見巳，亥卯未見申，寅午戌見亥，巳酉丑見寅。
  {
    id: 'jie_sha',
    name: '劫煞',
    category: 'inauspicious',
    baseOn: ['yearBranch', 'dayBranch'],
    ruleId: 'SS_JIESHA_012',
    version: '1.0.0',
    reference: '《三命通會》卷三',
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        '申': '巳', '子': '巳', '辰': '巳',
        '亥': '申', '卯': '申', '未': '申',
        '寅': '亥', '午': '亥', '戌': '亥',
        '巳': '寅', '酉': '寅', '丑': '寅'
      };
      return map[baseBranch] === targetBranch;
    }
  },

  // 13. 亡神
  // 申子辰見亥，亥卯未見寅，寅午戌見巳，巳酉丑見申。
  {
    id: 'wang_shen',
    name: '亡神',
    category: 'inauspicious',
    baseOn: ['yearBranch', 'dayBranch'],
    ruleId: 'SS_WANGSHEN_013',
    version: '1.0.0',
    reference: '《三命通會》卷三',
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        '申': '亥', '子': '亥', '辰': '亥',
        '亥': '寅', '卯': '寅', '未': '寅',
        '寅': '巳', '午': '巳', '戌': '巳',
        '巳': '申', '酉': '申', '丑': '申'
      };
      return map[baseBranch] === targetBranch;
    }
  },

  // 14. 孤辰
  // 亥子丑人見寅，寅卯辰人見巳，巳午未人見申，申酉戌人見亥。
  {
    id: 'gu_chen',
    name: '孤辰',
    category: 'inauspicious',
    baseOn: ['yearBranch'],
    ruleId: 'SS_GUCHEN_014',
    version: '1.0.0',
    reference: '《三命通會》卷三',
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        '亥': '寅', '子': '寅', '丑': '寅',
        '寅': '巳', '卯': '巳', '辰': '巳',
        '巳': '申', '午': '申', '未': '申',
        '申': '亥', '酉': '亥', '戌': '亥'
      };
      return map[baseBranch] === targetBranch;
    }
  },

  // 15. 寡宿
  // 亥子丑人見戌，寅卯辰人見丑，巳午未人見辰，申酉戌人見未。
  {
    id: 'gua_su',
    name: '寡宿',
    category: 'inauspicious',
    baseOn: ['yearBranch'],
    ruleId: 'SS_GUASU_015',
    version: '1.0.0',
    reference: '《三命通會》卷三',
    match: ({ baseBranch, targetBranch }) => {
      const map = {
        '亥': '戌', '子': '戌', '丑': '戌',
        '寅': '丑', '卯': '丑', '辰': '丑',
        '巳': '辰', '午': '辰', '未': '辰',
        '申': '未', '酉': '未', '戌': '未'
      };
      return map[baseBranch] === targetBranch;
    }
  },

  // 16. 金輿
  // 甲龍乙蛇丙戊羊，丁己猴猴庚犬傍，辛豬壬牛癸逢虎，仕人遇此祿名昌。
  {
    id: 'jin_yu',
    name: '金輿',
    category: 'auspicious',
    baseOn: ['dayStem'],
    ruleId: 'SS_JINYU_016',
    version: '1.0.0',
    reference: '《三命通會》卷三',
    match: ({ baseStem, targetBranch }) => {
      const map = {
        '甲': '辰', '乙': '巳',
        '丙': '未', '戊': '未',
        '丁': '申', '己': '申',
        '庚': '戌', '辛': '亥',
        '壬': '丑', '癸': '寅'
      };
      return map[baseStem] === targetBranch;
    }
  },

  // 17. 魁罡貴人
  // 戊戌、庚戌、庚辰、壬辰四日出生者為魁罡。
  {
    id: 'kui_gang',
    name: '魁罡貴人',
    category: 'neutral',
    baseOn: ['dayPillar'],
    ruleId: 'SS_KUIGANG_017',
    version: '1.0.0',
    reference: '《三命通會》卷五、《淵海子平》',
    matchChart: (pillars) => {
      const ganzhi = `${pillars.day.stem}${pillars.day.branch}`;
      return ['戊戌', '庚戌', '庚辰', '壬辰'].includes(ganzhi);
    }
  }
];
