const CLASSICAL_ZIPING = 'classical-ziping';
const refs = (...references) => references.map(([title, locator, url, note]) => ({
  type: 'classical', title, locator, url, ...(note ? { note } : {})
}));

const researchPattern = (definition) => ({
  aliases: [],
  tradition: CLASSICAL_ZIPING,
  conceptType: 'pattern',
  patternType: 'special',
  legacyConceptType: 'special-pattern',
  ruleFamily: 'whole-chart-pattern',
  scope: 'natal',
  category: 'neutral',
  confidence: 'classical',
  tier: 'research',
  priority: 100,
  version: '0.1.0',
  tags: ['pattern', 'research-only'],
  schools: ['classical-ziping'],
  implemented: false,
  status: 'research-only',
  match: null,
  evidence: () => ({ matched: false, status: 'research-only', reason: '尚未實作；此項只提供古典條件架構。' }),
  ...definition
});

export const SPECIAL_PATTERN_REGISTRY = Object.freeze([
  researchPattern({
    id: 'ren_qi_long_bei', name: '壬騎龍背', displayName: '壬騎龍背', aliases: ['壬騎龍背格'],
    baseOn: ['dayPillar', 'monthBranch', 'wholeChart'], ruleId: 'PT_RENQILONG_001',
    references: refs(['《三命通會》卷六', '壬騎龍背', 'https://zh.wikisource.org/zh-hant/三命通會/卷六']),
    description: '以壬日坐辰為核心，須考察辰多、寅字合住及財官印等全局條件；原文另有壬日坐寅、辰多的變例。',
    variants: [{ id: 'ren-day-chen-core', description: '壬辰日為核心，辰多則貴。' }, { id: 'ren-day-yin-variant', description: '壬寅日、辰多為變例。' }],
    researchNotes: { note: '不能由單一 dayPillar 判定；需建立全局辰寅、透干及財官取用 evidence。' }
  }),
  researchPattern({
    id: 'liu_yin_chao_yang', name: '六陰朝陽', displayName: '六陰朝陽', aliases: ['六陰朝陽格'],
    baseOn: ['dayStem', 'hourPillar', 'wholeChart'], ruleId: 'PT_LIUYIN_002',
    references: refs(['《三命通會》卷六', '六陰朝陽', 'https://zh.wikisource.org/zh-hant/三命通會/卷六']),
    description: '辛日逢戊子時的特殊格架構，還要檢查子數、午丑等破格條件及全局官殺財印。',
    variants: [{ id: 'six-xin-days', description: '辛日遇戊子時；「六陰」指六個辛日。' }],
    researchNotes: { note: '時柱、日干與全局破格條件缺一不可，不列入 SpecialPillar。' }
  }),
  researchPattern({
    id: 'liu_yi_shu_gui', name: '六乙鼠貴', displayName: '六乙鼠貴', aliases: ['六乙鼠貴格'],
    baseOn: ['dayStem', 'hourPillar', 'wholeChart'], ruleId: 'PT_LIUYI_003',
    references: refs(['《三命通會》卷六', '六乙鼠貴', 'https://zh.wikisource.org/zh-hant/三命通會/卷六']),
    description: '乙日逢丙子時的架構，須辨六乙日、子中癸水及官星透藏、刑沖破害等全局條件。',
    variants: [{ id: 'yi-day-bing-zi-hour', description: '六乙日逢丙子時。' }],
    researchNotes: { note: '「鼠貴」是借時支子中癸水取貴的格局語言，不是一般查支神煞。' }
  }),
  researchPattern({
    id: 'ri_lu_gui_shi', name: '日祿歸時', displayName: '日祿歸時', aliases: ['日祿歸時格'],
    baseOn: ['dayStem', 'hourPillar', 'wholeChart'], ruleId: 'PT_RILUGUI_004',
    references: refs(['《三命通會》卷六', '日祿歸時', 'https://zh.wikisource.org/zh-hant/三命通會/卷六']),
    description: '日干之祿落在時支的架構，須檢查官殺、傷官、衝破及月令扶抑，不能只以日干查一個時支就宣告成格。',
    variants: [{ id: 'stem-lu-to-hour', description: '甲寅、乙卯、丙戊巳、丁己午、庚申、辛酉、壬亥、癸子等日祿歸時關係。' }],
    researchNotes: { note: '日祿歸時雖有固定干支對應，成格仍是全局判定。' }
  }),
  researchPattern({
    id: 'gong_lu', name: '拱祿', displayName: '拱祿', aliases: ['拱祿格'],
    baseOn: ['dayPillar', 'hourPillar', 'wholeChart'], ruleId: 'PT_GONGLU_005',
    references: refs(['《三命通會》卷六', '拱祿', 'https://zh.wikisource.org/zh-hant/三命通會/卷六']),
    description: '日時兩柱夾拱祿位的虛神架構，須兩柱干同、地支相隔、無填實及沖破，並考察月令全局。',
    variants: [{ id: 'virtual-lu', description: '以日時夾出未現之祿支；虛神不可被填實或破壞。' }],
    researchNotes: { note: '拱字本身表示虛神推取，不能用一般神煞的單支命中模型實作。' }
  }),
  researchPattern({
    id: 'gong_gui', name: '拱貴', displayName: '拱貴', aliases: ['拱貴格'],
    baseOn: ['dayPillar', 'hourPillar', 'wholeChart'], ruleId: 'PT_GONGGUI_006',
    references: refs(['《三命通會》卷六', '拱貴', 'https://zh.wikisource.org/zh-hant/三命通會/卷六']),
    description: '日時夾拱天乙貴人等貴神的虛神架構，需辨日干貴人、相鄰地支、填實與沖破。',
    variants: [{ id: 'virtual-noble', description: '以日時夾出未現之貴神支。' }],
    researchNotes: { note: '拱貴與一般天乙貴人查法不同；須另建虛神與破格 evidence。' }
  }),
  researchPattern({
    id: 'fu_de_xiu_qi', name: '福德秀氣', displayName: '福德秀氣', aliases: ['福德秀氣格'],
    baseOn: ['yearPillar', 'monthPillar', 'dayPillar', 'hourPillar', 'wholeChart'], ruleId: 'PT_FUDE_007',
    references: refs(['《三命通會》卷六', '福德秀氣', 'https://zh.wikisource.org/zh-hant/三命通會/卷六']),
    description: '以巳酉丑金局及日干等組合取福德秀氣，須整合三合局、季節、透干與刑沖，不宜拆成一顆神煞。',
    variants: [{ id: 'si-you-chou-metal', description: '巳酉丑三合金局是重要骨架，仍需按原文條件細分。' }],
    researchNotes: { note: '此項需先完成 whole-chart pattern DSL 或明確的全局 predicate，現階段只建研究登錄。' }
  })
]);

export function validateSpecialPatternRegistry(registry = SPECIAL_PATTERN_REGISTRY) {
  const errors = [];
  const ids = new Set();
  const ruleIds = new Set();
  for (const rule of registry) {
    if (!rule.id || ids.has(rule.id)) errors.push(`duplicate id: ${rule.id || '(empty)'}`);
    ids.add(rule.id);
    if (!rule.ruleId || ruleIds.has(rule.ruleId)) errors.push(`duplicate ruleId: ${rule.ruleId || '(empty)'}`);
    ruleIds.add(rule.ruleId);
    for (const field of ['name', 'tradition', 'conceptType', 'patternType', 'ruleFamily', 'scope', 'category', 'confidence', 'version', 'description']) {
      if (!rule[field]) errors.push(`${rule.id}: ${field} is required`);
    }
    if (!Array.isArray(rule.baseOn) || rule.baseOn.length === 0) errors.push(`${rule.id}: baseOn is required`);
    if (rule.implemented && typeof rule.match !== 'function') errors.push(`${rule.id}: implemented patterns require match`);
    if (typeof rule.evidence !== 'function') errors.push(`${rule.id}: evidence must be a function`);
    if (!Array.isArray(rule.references) || rule.references.length === 0) errors.push(`${rule.id}: references is required`);
  }
  return { valid: errors.length === 0, errors, count: registry.length };
}

const validation = validateSpecialPatternRegistry();
if (!validation.valid) throw new Error(`Special pattern registry invalid: ${validation.errors.join('; ')}`);
