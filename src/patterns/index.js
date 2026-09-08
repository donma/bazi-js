import { SPECIAL_PATTERN_REGISTRY } from './registry.js';

export { SPECIAL_PATTERN_REGISTRY, validateSpecialPatternRegistry } from './registry.js';

export function getSpecialPattern(id) {
  return (SPECIAL_PATTERN_REGISTRY || []).find((rule) => rule.id === id) || null;
}

export function listResearchPatterns() {
  return SPECIAL_PATTERN_REGISTRY.map((rule) => ({
    id: rule.id,
    name: rule.name,
    conceptType: rule.conceptType,
    ruleFamily: rule.ruleFamily,
    implemented: rule.implemented,
    status: rule.status,
    references: rule.references
  }));
}
