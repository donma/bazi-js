// Reference ontology for the Bazi Bible layer.
// This is deliberately additive: runtime rule registries may keep legacy
// conceptType values while Reference exposes one canonical vocabulary.

export const TAXONOMY_VERSION = '0.1.0';
export const TAXONOMY_ID = 'bazi-js-reference-ontology';

export const CONCEPT_TYPES = Object.freeze([
  'calendar',
  'pillar',
  'stem-branch',
  'five-element',
  'ten-god',
  'hidden-stem',
  'nayin',
  'twelve-stage',
  'kongwang',
  'interaction',
  'strength',
  'month-commander',
  'pattern',
  'use-god',
  'shensha',
  'special-rule',
  'auxiliary',
  'luck',
  'transit',
  'profile'
]);

export const PATTERN_TYPES = Object.freeze([
  'regular',
  'special',
  'conformity',
  'transformation',
  'other'
]);

export const CONCEPT_STATUSES = Object.freeze([
  'canonical',
  'implemented',
  'candidate-only',
  'research-only',
  'conflicted',
  'deprecated'
]);

const REGULAR_CONCEPT_IDS = Object.freeze({
  direct_officer: 'pattern.zheng-guan',
  seven_killings: 'pattern.qi-sha',
  direct_wealth: 'pattern.zheng-cai',
  indirect_wealth: 'pattern.pian-cai',
  direct_resource: 'pattern.zheng-yin',
  indirect_resource: 'pattern.pian-yin',
  eating_god: 'pattern.shi-shen',
  hurting_officer: 'pattern.shang-guan',
  built_lu: 'pattern.jian-lu',
  month_blade: 'pattern.yang-ren'
});

const LEGACY_TYPE_MAP = Object.freeze({
  'special-pattern': { conceptType: 'pattern', patternType: 'special' },
  'special-pillar': { conceptType: 'special-rule' },
  'seasonal-special': { conceptType: 'special-rule' },
  pattern: { conceptType: 'pattern', patternType: 'special' }
});

const slug = (value) => String(value || '')
  .trim()
  .replace(/([a-z])([A-Z])/g, '$1-$2')
  .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
  .replace(/^-+|-+$/g, '')
  .toLowerCase();

export function getCanonicalTaxonomy(rule = {}) {
  const legacyConceptType = rule.conceptType || null;
  const mapped = LEGACY_TYPE_MAP[legacyConceptType] || { conceptType: legacyConceptType || 'auxiliary' };
  const conceptType = mapped.conceptType;
  const patternType = conceptType === 'pattern'
    ? rule.patternType || mapped.patternType || (rule.ruleFamily === 'month-commander-pattern' ? 'regular' : 'special')
    : undefined;
  return {
    conceptType,
    ...(patternType ? { patternType } : {}),
    ...(legacyConceptType && legacyConceptType !== conceptType ? { legacyConceptType } : {})
  };
}

export function getConceptId(rule = {}) {
  if (rule.conceptId) return rule.conceptId;
  if (REGULAR_CONCEPT_IDS[rule.id]) return REGULAR_CONCEPT_IDS[rule.id];
  const taxonomy = getCanonicalTaxonomy(rule);
  return `${taxonomy.conceptType}.${slug(rule.id || rule.name || rule.ruleId)}`;
}

export function getConceptStatus(rule = {}) {
  if (CONCEPT_STATUSES.includes(rule.status)) return rule.status;
  if (rule.implemented === false || rule.tier === 'research') return 'research-only';
  if (rule.tier === 'candidate') return 'candidate-only';
  return 'canonical';
}

export function canonicalizeRuleTaxonomy(rule = {}) {
  const taxonomy = getCanonicalTaxonomy(rule);
  return {
    ...taxonomy,
    conceptId: getConceptId(rule),
    status: getConceptStatus(rule)
  };
}

export function validateTaxonomy(rules = [], concepts = []) {
  const errors = [];
  const conceptIds = new Set();
  for (const rule of rules) {
    const taxonomy = canonicalizeRuleTaxonomy(rule);
    if (!CONCEPT_TYPES.includes(taxonomy.conceptType)) {
      errors.push(`${rule.ruleId || rule.id}: invalid conceptType ${taxonomy.conceptType}`);
    }
    if (taxonomy.conceptType === 'pattern' && !PATTERN_TYPES.includes(taxonomy.patternType)) {
      errors.push(`${rule.ruleId || rule.id}: invalid patternType ${taxonomy.patternType}`);
    }
    if (!taxonomy.conceptId) errors.push(`${rule.ruleId || rule.id}: conceptId is required`);
  }
  for (const concept of concepts) {
    if (!concept.conceptId) errors.push('concept: conceptId is required');
    if (conceptIds.has(concept.conceptId)) errors.push(`duplicate conceptId: ${concept.conceptId}`);
    conceptIds.add(concept.conceptId);
    if (!CONCEPT_TYPES.includes(concept.conceptType)) errors.push(`${concept.conceptId}: invalid conceptType`);
    if (concept.conceptType === 'pattern' && !PATTERN_TYPES.includes(concept.patternType)) {
      errors.push(`${concept.conceptId}: patternType is required`);
    }
  }
  return { valid: errors.length === 0, errors, ruleCount: rules.length, conceptCount: concepts.length };
}

export function getTaxonomy() {
  return {
    schemaVersion: '1.0.0',
    taxonomyId: TAXONOMY_ID,
    version: TAXONOMY_VERSION,
    conceptTypes: CONCEPT_TYPES.slice(),
    patternTypes: PATTERN_TYPES.slice(),
    statuses: CONCEPT_STATUSES.slice(),
    legacyMappings: Object.fromEntries(Object.entries(LEGACY_TYPE_MAP).map(([key, value]) => [key, { ...value }]))
  };
}
