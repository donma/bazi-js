import { getTenGod } from '../core/constants/ten-gods-data.js';
import { REGULAR_PATTERN_RULE_VERSION } from '../rules/versions.js';

const CLASSICAL_ZIPING = 'classical-ziping';
export const REGULAR_PATTERN_VERSION = REGULAR_PATTERN_RULE_VERSION;

const LU_BRANCH_BY_STEM = Object.freeze({
  甲: '寅', 乙: '卯', 丙: '巳', 丁: '午', 戊: '巳',
  己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子'
});

const YANG_REN_BRANCH_BY_STEM = Object.freeze({
  甲: '卯', 乙: '辰', 丙: '午', 丁: '未', 戊: '午',
  己: '未', 庚: '酉', 辛: '戌', 壬: '子', 癸: '丑'
});

const refs = (...references) => references.map(([title, locator, url, note]) => ({
  type: 'classical', title, locator, url, ...(note ? { note } : {})
}));

const regularPattern = ({ id, name, aliases, ruleId, description, match, baseOn = ['dayMaster', 'monthPillar', 'monthCommander'], variants = [] }) => ({
  id,
  name,
  displayName: name,
  aliases,
  tradition: CLASSICAL_ZIPING,
  conceptType: 'special-pattern',
  ruleFamily: 'month-commander-pattern',
  baseOn,
  scope: 'natal',
  category: 'neutral',
  confidence: 'classical-variant',
  tier: 'candidate',
  priority: 50,
  version: REGULAR_PATTERN_VERSION,
  ruleId,
  references: refs(
    ['《子平真詮》', '月令取格、用神相關篇章', 'https://zh.wikisource.org/zh-hant/子平真詮'],
    ['《三命通會》卷六', '論正官、七殺、財印食傷及月令取格相關條目', 'https://zh.wikisource.org/zh-hant/三命通會/卷六']
  ),
  description,
  variants,
  researchNotes: {
    conflict: true,
    note: '本規則只辨識月令司令／建祿／月刃的結構候選，不宣告完整成格、破格或取用；透干、會局、刑沖與全局喜忌仍需獨立判定。'
  },
  implemented: true,
  status: 'candidate-only',
  match,
  evidence: (context) => {
    const matched = Boolean(match(context));
    return {
      matched,
      status: 'candidate-only',
      basedOn: ['dayMaster', 'monthPillar', 'monthCommander'],
      dayMaster: context.dayMaster,
      monthPillar: context.monthPillar,
      monthCommander: context.monthCommander,
      preliminaryOnly: true,
      reason: matched
        ? '已命中月令結構候選；尚未進行透干、成格、破格與全局取用裁決。'
        : '未命中本條件的月令結構候選。'
    };
  }
});

const monthTenGodMatch = (id, name, aliases, ruleId, description) => regularPattern({
  id, name, aliases, ruleId, description,
  match: (context) => context.monthCommanderTenGod?.id === id
});

export const REGULAR_PATTERN_REGISTRY = Object.freeze([
  monthTenGodMatch('direct_officer', '正官格候選', ['正官格'], 'PT_REGULAR_ZHENGGUAN_001', '月令人元司令對日主為正官時，記錄正官格候選。'),
  monthTenGodMatch('seven_killings', '七殺格候選', ['七殺格', '偏官格'], 'PT_REGULAR_QISHA_002', '月令人元司令對日主為七殺時，記錄七殺格候選。'),
  monthTenGodMatch('direct_wealth', '正財格候選', ['正財格'], 'PT_REGULAR_ZHENGCAI_003', '月令人元司令對日主為正財時，記錄正財格候選。'),
  monthTenGodMatch('indirect_wealth', '偏財格候選', ['偏財格'], 'PT_REGULAR_PIANCAI_004', '月令人元司令對日主為偏財時，記錄偏財格候選。'),
  monthTenGodMatch('direct_resource', '正印格候選', ['正印格'], 'PT_REGULAR_ZHENGYIN_005', '月令人元司令對日主為正印時，記錄正印格候選。'),
  monthTenGodMatch('indirect_resource', '偏印格候選', ['偏印格', '梟神格'], 'PT_REGULAR_PIANYIN_006', '月令人元司令對日主為偏印時，記錄偏印格候選。'),
  monthTenGodMatch('eating_god', '食神格候選', ['食神格'], 'PT_REGULAR_SHISHEN_007', '月令人元司令對日主為食神時，記錄食神格候選。'),
  monthTenGodMatch('hurting_officer', '傷官格候選', ['傷官格'], 'PT_REGULAR_SHANGGUAN_008', '月令人元司令對日主為傷官時，記錄傷官格候選。'),
  regularPattern({
    id: 'built_lu', name: '建祿格候選', aliases: ['建祿格', '月祿格'], ruleId: 'PT_REGULAR_JIANLU_009',
    description: '月支為日主臨官祿位時，記錄建祿格候選。', baseOn: ['dayMaster', 'monthPillar'],
    match: (context) => LU_BRANCH_BY_STEM[context.dayMaster?.stem] === context.monthPillar?.branch,
    variants: [{ id: 'lu-and-month-commander', description: '祿位與月令取格在不同傳本的名稱與取用範圍可能不同。' }]
  }),
  regularPattern({
    id: 'month_blade', name: '月刃格候選', aliases: ['月刃格', '陽刃格'], ruleId: 'PT_REGULAR_YANGREN_010',
    description: '月支為日主陽刃位時，記錄月刃格候選。', baseOn: ['dayMaster', 'monthPillar'],
    match: (context) => YANG_REN_BRANCH_BY_STEM[context.dayMaster?.stem] === context.monthPillar?.branch,
    variants: [{ id: 'yang-ren-naming', description: '陽刃、月刃的命名與是否獨立取格，依流派有差異。' }]
  })
]);

export function calculateRegularPatterns({ pillars, monthCommander = null } = {}) {
  const dayMaster = pillars?.day?.stem ? { stem: pillars.day.stem } : null;
  const monthPillar = pillars?.month ? { stem: pillars.month.stem, branch: pillars.month.branch, ganzhi: pillars.month.ganzhi } : null;
  const commanderStem = monthCommander?.stem || null;
  const monthCommanderTenGod = dayMaster?.stem && commanderStem ? getTenGod(dayMaster.stem, commanderStem) : null;
  const context = { dayMaster, monthPillar, monthCommander, monthCommanderTenGod };
  const candidates = REGULAR_PATTERN_REGISTRY.map((rule) => {
    const matched = Boolean(rule.match(context));
    return {
      id: rule.id,
      name: rule.name,
      displayName: rule.displayName,
      aliases: rule.aliases,
      tradition: rule.tradition,
      conceptType: rule.conceptType,
      ruleFamily: rule.ruleFamily,
      baseOn: rule.baseOn,
      scope: rule.scope,
      category: rule.category,
      confidence: rule.confidence,
      ruleId: rule.ruleId,
      version: rule.version,
      references: rule.references,
      description: rule.description,
      variants: rule.variants,
      researchNotes: rule.researchNotes,
      status: rule.status,
      preliminary: true,
      matched,
      finalDecision: false,
      evidence: rule.evidence(context)
    };
  });
  return {
    modelId: 'regular-pattern-candidate-engine',
    version: REGULAR_PATTERN_VERSION,
    status: 'candidate-only',
    candidates,
    evidence: {
      matched: true,
      candidateCount: candidates.filter((item) => item.matched).length,
      ruleCount: candidates.length,
      dayMaster: dayMaster?.stem || null,
      monthPillar: monthPillar?.ganzhi || null,
      monthCommanderStem: commanderStem,
      monthCommanderTenGod: monthCommanderTenGod?.full || null,
      reason: '只產生正格結構候選；成格／破格與特殊格不由此結果直接宣告。'
    }
  };
}

export function validateRegularPatternRegistry(registry = REGULAR_PATTERN_REGISTRY) {
  const errors = [];
  const ids = new Set();
  const ruleIds = new Set();
  for (const rule of registry) {
    if (!rule.id || ids.has(rule.id)) errors.push(`duplicate id: ${rule.id || '(empty)'}`);
    ids.add(rule.id);
    if (!rule.ruleId || ruleIds.has(rule.ruleId)) errors.push(`duplicate ruleId: ${rule.ruleId || '(empty)'}`);
    ruleIds.add(rule.ruleId);
    for (const field of ['name', 'tradition', 'conceptType', 'ruleFamily', 'scope', 'category', 'confidence', 'ruleId', 'version', 'description']) {
      if (!rule[field]) errors.push(`${rule.id}: ${field} is required`);
    }
    if (!Array.isArray(rule.baseOn) || rule.baseOn.length === 0) errors.push(`${rule.id}: baseOn is required`);
    if (typeof rule.match !== 'function' || typeof rule.evidence !== 'function') errors.push(`${rule.id}: match/evidence are required`);
    if (!Array.isArray(rule.references) || rule.references.length === 0) errors.push(`${rule.id}: references is required`);
  }
  return { valid: errors.length === 0, errors, count: registry.length };
}

const validation = validateRegularPatternRegistry();
if (!validation.valid) throw new Error(`Regular pattern registry invalid: ${validation.errors.join('; ')}`);
