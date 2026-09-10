import { SPECIAL_PATTERN_REGISTRY } from './registry.js';
import { calculateRegularPatterns, REGULAR_PATTERN_REGISTRY, validateRegularPatternRegistry } from './regular.js';

export { SPECIAL_PATTERN_REGISTRY, validateSpecialPatternRegistry } from './registry.js';
export { calculateRegularPatterns, REGULAR_PATTERN_REGISTRY, validateRegularPatternRegistry } from './regular.js';

export function getSpecialPattern(id) {
  return (SPECIAL_PATTERN_REGISTRY || []).find((rule) => rule.id === id) || null;
}

export function listResearchPatterns() {
  return SPECIAL_PATTERN_REGISTRY.map((rule) => ({
    id: rule.id,
    name: rule.name,
    conceptType: rule.conceptType,
    patternType: rule.patternType,
    ruleFamily: rule.ruleFamily,
    implemented: rule.implemented,
    status: rule.status,
    references: rule.references
  }));
}

export function calculatePatterns(options = {}) {
  const regular = calculateRegularPatterns(options);
  const special = SPECIAL_PATTERN_REGISTRY.map((rule) => ({
    id: rule.id,
    name: rule.name,
    displayName: rule.displayName || rule.name,
    conceptType: rule.conceptType,
    patternType: rule.patternType,
    ruleFamily: rule.ruleFamily,
    baseOn: rule.baseOn,
    scope: rule.scope,
    category: rule.category,
    confidence: rule.confidence,
    ruleId: rule.ruleId,
    version: rule.version,
    references: rule.references,
    description: rule.description,
    variants: rule.variants || [],
    researchNotes: rule.researchNotes || {},
    status: 'research-only',
    preliminary: false,
    matched: false,
    finalDecision: false,
    evidence: rule.evidence()
  }));
  return {
    modelId: 'patterns-candidate-registry',
    version: '0.2.0',
    status: 'candidate-and-research',
    regular,
    special,
    candidates: [...regular.candidates, ...special],
    evidence: {
      matched: true,
      regularCandidateCount: regular.evidence.candidateCount,
      specialResearchCount: special.length,
      note: '正格只輸出結構候選；壬騎龍背等特殊格仍維持 research-only，不混入 ShenSha。'
    }
  };
}
