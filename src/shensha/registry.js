// ShenSha vNext 規則註冊表。
// 舊 catalog 以 adapter 方式掛入，保留舊檔案及舊 match(params) API。

import { SHENSHA_CATALOG } from './catalog.js';
import { EXTENDED_SHENSHA } from './catalogs/extended/vnext.js';
import { SHENSHA_CATEGORIES, SHENSHA_CONFIDENCES, SHENSHA_TIERS } from './constants.js';

const LEGACY_DISPLAY = {
  tao_hua: { displayName: '桃花（咸池）', aliases: ['咸池'] },
  tian_xi: { name: '天喜', displayName: '天喜', aliases: ['天喜星'] },
  tian_yi_star: { name: '天醫', displayName: '天醫', aliases: ['天醫星'] },
  hong_luan: { name: '紅鸞', displayName: '紅鸞', aliases: ['紅鸞星'] },
  shi_e_da_bai: { name: '十惡大敗', displayName: '十惡大敗', aliases: ['十惡大敗日'] }
};

function legacyMatcher(rule, context) {
  if (rule.matchChart) return context.target.pillar === 'day' && rule.matchChart(context.pillars);
  const baseKey = context.activeBase;
  if (baseKey === 'dayStem') return rule.match({ baseStem: context.bases.dayStem, targetBranch: context.target.branch, targetStem: context.target.stem });
  if (baseKey === 'yearStem') return rule.match({ baseStem: context.bases.yearStem, targetBranch: context.target.branch, targetStem: context.target.stem });
  if (baseKey === 'monthBranch') return rule.match({ monthBranch: context.bases.monthBranch, targetBranch: context.target.branch, targetStem: context.target.stem });
  if (baseKey === 'dayBranch') return rule.match({ baseBranch: context.bases.dayBranch, targetBranch: context.target.branch, targetStem: context.target.stem });
  if (baseKey === 'yearBranch') return rule.match({ baseBranch: context.bases.yearBranch, targetBranch: context.target.branch, targetStem: context.target.stem });
  return false;
}

function normalizeLegacyRule(rule) {
  const override = LEGACY_DISPLAY[rule.id] || {};
  const isPillarRule = Boolean(rule.matchChart || rule.baseOn.includes('dayPillar'));
  return {
    ...rule,
    name: override.name || rule.name,
    displayName: override.displayName || rule.name,
    aliases: override.aliases || [],
    tags: ['legacy', rule.category === 'auspicious' ? 'noble' : rule.category],
    tier: 'core',
    priority: 100,
    confidence: 'classical',
    schools: ['canonical', 'legacy-catalog'],
    target: isPillarRule ? 'pillar' : 'branch',
    description: `由 BaziJS v1 catalog adapter 保留的${rule.name}規則。`,
    references: [{ type: 'classical', title: rule.reference, note: 'Legacy catalog adapter；保留原始判定函數。' }],
    match: (context) => legacyMatcher(rule, context)
  };
}

export const SHENSHA_REGISTRY = Object.freeze([
  ...SHENSHA_CATALOG.map(normalizeLegacyRule),
  ...EXTENDED_SHENSHA
]);

export function validateShenShaRegistry(registry = SHENSHA_REGISTRY) {
  const errors = [];
  const ids = new Set();
  const ruleIds = new Set();
  for (const rule of registry) {
    if (!rule.id || ids.has(rule.id)) errors.push(`duplicate id: ${rule.id || '(empty)'}`);
    ids.add(rule.id);
    if (!rule.ruleId || ruleIds.has(rule.ruleId)) errors.push(`duplicate ruleId: ${rule.ruleId || '(empty)'}`);
    ruleIds.add(rule.ruleId);
    if (!rule.name || !rule.displayName) errors.push(`${rule.id}: name/displayName is required`);
    if (!SHENSHA_CATEGORIES.includes(rule.category)) errors.push(`${rule.id}: invalid category`);
    if (!SHENSHA_TIERS.includes(rule.tier)) errors.push(`${rule.id}: invalid tier`);
    if (!SHENSHA_CONFIDENCES.includes(rule.confidence)) errors.push(`${rule.id}: invalid confidence`);
    if (!Array.isArray(rule.baseOn) || rule.baseOn.length === 0) errors.push(`${rule.id}: baseOn is required`);
    if (typeof rule.match !== 'function') errors.push(`${rule.id}: match must be a function`);
    if (!rule.version) errors.push(`${rule.id}: version is required`);
    if (!Array.isArray(rule.references) || rule.references.length === 0) errors.push(`${rule.id}: references is required`);
  }
  return { valid: errors.length === 0, errors, count: registry.length };
}

const validation = validateShenShaRegistry();
if (!validation.valid) throw new Error(`ShenSha registry invalid: ${validation.errors.join('; ')}`);

export function getShenShaRule(id) {
  return SHENSHA_REGISTRY.find((rule) => rule.id === id) || null;
}

export function getShenShaCatalog() {
  return SHENSHA_REGISTRY.slice();
}
