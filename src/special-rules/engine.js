import { SPECIAL_RULE_REGISTRY, SPECIAL_PILLAR_RULES, SEASONAL_SPECIAL_RULES } from './registry.js';
import { createSpecialRuleContext } from './context.js';

function resultFor(rule, context, evidence) {
  return {
    id: rule.id,
    name: rule.name,
    displayName: rule.displayName || rule.name,
    aliases: rule.aliases || [],
    tradition: rule.tradition,
    conceptType: rule.conceptType,
    ruleFamily: rule.ruleFamily,
    baseOn: rule.baseOn,
    scope: rule.scope,
    category: rule.category,
    tags: rule.tags || [],
    tier: rule.tier,
    priority: rule.priority,
    confidence: rule.confidence,
    schools: rule.schools || [],
    hitOn: rule.ruleFamily === 'hour-pillar-special' ? ['hour'] : ['day'],
    target: rule.ruleFamily === 'hour-pillar-special' ? 'hour' : 'day',
    ruleId: rule.ruleId,
    version: rule.version,
    reference: rule.references[0] ? rule.references[0].title : undefined,
    references: rule.references,
    description: rule.description || '',
    ...(rule.interpretation ? { interpretation: rule.interpretation } : {}),
    ...(rule.variants ? { variants: rule.variants } : {}),
    ...(rule.researchNotes ? { researchNotes: rule.researchNotes } : {}),
    evidence
  };
}

function calculateFromRegistry(pillars, registry, options = {}) {
  const context = createSpecialRuleContext(pillars, options);
  return registry.flatMap((rule) => {
    let matched = false;
    try {
      matched = rule.match(context) === true;
    } catch (error) {
      return [];
    }
    if (!matched) return [];
    return [resultFor(rule, context, rule.evidence(context))];
  });
}

export function calculateSpecialPillarRules(pillars, options = {}) {
  return calculateFromRegistry(pillars, SPECIAL_PILLAR_RULES, options);
}

export function calculateSeasonalSpecialRules(pillars, options = {}) {
  return calculateFromRegistry(pillars, SEASONAL_SPECIAL_RULES, options);
}

export function calculateSpecialRules(pillars, options = {}) {
  return calculateFromRegistry(pillars, SPECIAL_RULE_REGISTRY, options);
}

export function validateSpecialRuleRegistry(registry = SPECIAL_RULE_REGISTRY) {
  const errors = [];
  const ids = new Set();
  const ruleIds = new Set();
  for (const rule of registry) {
    if (!rule.id || ids.has(rule.id)) errors.push(`duplicate id: ${rule.id || '(empty)'}`);
    ids.add(rule.id);
    if (!rule.ruleId || ruleIds.has(rule.ruleId)) errors.push(`duplicate ruleId: ${rule.ruleId || '(empty)'}`);
    ruleIds.add(rule.ruleId);
    for (const field of ['name', 'tradition', 'conceptType', 'ruleFamily', 'scope', 'category', 'confidence', 'version', 'description', 'interpretation']) {
      if (!rule[field]) errors.push(`${rule.id}: ${field} is required`);
    }
    if (!Array.isArray(rule.baseOn) || rule.baseOn.length === 0) errors.push(`${rule.id}: baseOn is required`);
    if (typeof rule.match !== 'function') errors.push(`${rule.id}: match must be a function`);
    if (typeof rule.evidence !== 'function') errors.push(`${rule.id}: evidence must be a function`);
    if (!Array.isArray(rule.references) || rule.references.length === 0) errors.push(`${rule.id}: references is required`);
  }
  return { valid: errors.length === 0, errors, count: registry.length };
}

const validation = validateSpecialRuleRegistry();
if (!validation.valid) throw new Error(`Special rule registry invalid: ${validation.errors.join('; ')}`);

export function getSpecialRule(id) {
  return SPECIAL_RULE_REGISTRY.find((rule) => rule.id === id) || null;
}

export function getSpecialRuleCatalog() {
  return SPECIAL_RULE_REGISTRY.slice();
}
