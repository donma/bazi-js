// BaziJS Reference API: a machine-readable index for concepts, rules,
// classical sources, variants and coverage. It does not calculate a chart.

import sourceCatalog from '../../sources/classical-texts.json' with { type: 'json' };
import evidenceLedger from '../../sources/evidence-ledger.json' with { type: 'json' };
import variantsCatalog from '../../sources/variants.json' with { type: 'json' };
import { SHENSHA_REGISTRY } from '../shensha/registry.js';
import { SPECIAL_RULE_REGISTRY } from '../special-rules/registry.js';
import { SPECIAL_PATTERN_REGISTRY } from '../patterns/registry.js';
import { REGULAR_PATTERN_REGISTRY } from '../patterns/regular.js';
import { SYSTEM_CONCEPTS } from './system-concepts.js';
import {
  CONCEPT_TYPES,
  TAXONOMY_VERSION,
  canonicalizeRuleTaxonomy,
  getConceptStatus,
  getTaxonomy,
  validateTaxonomy
} from './taxonomy.js';

const RULES = Object.freeze([
  ...SHENSHA_REGISTRY,
  ...SPECIAL_RULE_REGISTRY,
  ...REGULAR_PATTERN_REGISTRY,
  ...SPECIAL_PATTERN_REGISTRY
]);

const SOURCE_HINTS = Object.freeze([
  ['san-ming-tong-hui', ['三命通會', '三命通会']],
  ['yuan-hai-zi-ping', ['淵海子平', '渊海子平']],
  ['xie-ji-bian-fang-shu', ['協紀辨方書', '协纪辨方书']],
  ['di-tian-sui-yan-wei', ['滴天髓闡微', '滴天髓阐微']],
  ['zi-ping-zhen-quan', ['子平真詮', '子平真诠']],
  ['gu-jin-tu-shu-ji-cheng', ['古今圖書集成', '古今图书集成']]
]);

const clone = (value) => {
  if (typeof value === 'function' || value === undefined) return undefined;
  if (Array.isArray(value)) return value.map(clone).filter((item) => item !== undefined);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .map(([key, item]) => [key, clone(item)])
      .filter(([, item]) => item !== undefined));
  }
  return value;
};

const sourceRecords = Array.isArray(sourceCatalog.sources) ? sourceCatalog.sources : [];
const sourceMap = new Map(sourceRecords.map((source) => [source.sourceId, source]));
const catalogEvidence = Array.isArray(sourceCatalog.evidenceRecords) ? sourceCatalog.evidenceRecords : [];
const ledgerCitations = Array.isArray(evidenceLedger.citations) ? evidenceLedger.citations : [];
const editionRecords = Array.isArray(evidenceLedger.editionRecords) ? evidenceLedger.editionRecords : [];
const catalogVariants = Array.isArray(variantsCatalog.variants) ? variantsCatalog.variants : [];

function ruleText(rule) {
  return [
    rule.name,
    rule.displayName,
    ...(rule.aliases || []),
    rule.reference,
    ...(rule.references || []).flatMap((ref) => [ref.title, ref.locator, ref.note])
  ].filter(Boolean).join(' ');
}

function inferSourceIds(rule) {
  const text = ruleText(rule);
  const explicit = new Set(rule.sourceIds || []);
  for (const [sourceId, hints] of SOURCE_HINTS) {
    if (hints.some((hint) => text.includes(hint))) explicit.add(sourceId);
  }
  return [...explicit].filter((sourceId) => sourceMap.has(sourceId));
}

function ruleEvidence(rule) {
  const ruleIds = [rule.ruleId, rule.id].filter(Boolean);
  return [
    ...catalogEvidence.filter((record) => ruleIds.some((id) => (record.ruleIds || []).includes(id))),
    ...ledgerCitations.filter((record) => ruleIds.some((id) => (record.ruleIds || []).includes(id)))
  ];
}

function sourceIdsForRule(rule) {
  const ids = new Set(inferSourceIds(rule));
  for (const record of ruleEvidence(rule)) {
    for (const sourceId of record.sourceIds || [record.sourceId]) {
      if (sourceMap.has(sourceId)) ids.add(sourceId);
    }
  }
  return [...ids];
}

function canonicalRule(rule) {
  const taxonomy = canonicalizeRuleTaxonomy(rule);
  const sourceIds = sourceIdsForRule(rule);
  const evidence = ruleEvidence(rule);
  return clone({
    id: rule.id,
    ruleId: rule.ruleId,
    conceptId: taxonomy.conceptId,
    name: rule.name,
    displayName: rule.displayName || rule.name,
    aliases: rule.aliases || [],
    tradition: rule.tradition,
    conceptType: taxonomy.conceptType,
    ...(taxonomy.patternType ? { patternType: taxonomy.patternType } : {}),
    ...(taxonomy.legacyConceptType ? { legacyConceptType: taxonomy.legacyConceptType } : {}),
    ruleFamily: rule.ruleFamily,
    baseOn: rule.baseOn || rule.basedOn || [],
    scope: rule.scope,
    category: rule.category,
    confidence: rule.confidence,
    status: getConceptStatus(rule),
    version: rule.version,
    sourceIds,
    references: rule.references || [],
    description: rule.description || '',
    interpretation: rule.interpretation || '',
    variants: rule.variants || [],
    researchNotes: rule.researchNotes || {},
    evidence: evidence.length ? evidence : [],
    implementation: {
      status: rule.implemented === false ? 'not-implemented' : 'implemented',
      runtimeRegistry: RULES.includes(rule),
      module: rule.conceptType === 'shensha' ? 'src/shensha'
        : taxonomy.conceptType === 'special-rule' ? 'src/special-rules'
          : 'src/patterns'
    }
  });
}

function canonicalSystemRule(concept) {
  return clone({
    id: concept.conceptId,
    ruleId: concept.ruleId,
    conceptId: concept.conceptId,
    name: concept.name,
    displayName: concept.displayName || concept.name,
    aliases: concept.aliases || [],
    tradition: concept.tradition,
    conceptType: concept.conceptType,
    ruleFamily: concept.ruleFamily,
    baseOn: concept.baseOn || [],
    scope: concept.scope,
    category: concept.category || 'neutral',
    confidence: concept.confidence,
    status: concept.status,
    version: concept.version,
    sourceIds: concept.sourceIds || [],
    references: concept.references || [],
    description: concept.description || '',
    variants: concept.variants || [],
    researchNotes: concept.researchNotes || {},
    evidence: concept.evidence || [],
    referenceKind: 'system-concept',
    api: concept.implementation?.api || [],
    outputFields: concept.implementation?.outputFields || [],
    implementation: {
      ...(concept.implementation || {}),
      runtimeRegistry: true
    }
  });
}

const SYSTEM_RULES = Object.freeze(SYSTEM_CONCEPTS.map(canonicalSystemRule));
const CANONICAL_RULES = Object.freeze([...RULES.map(canonicalRule), ...SYSTEM_RULES]);
const RULE_BY_ID = new Map(CANONICAL_RULES.flatMap((rule) => [[rule.ruleId, rule], [rule.id, rule]]));

function conceptDescription(rules) {
  return rules.find((rule) => rule.description)?.description || '';
}

function buildConcept(rules) {
  const first = rules[0];
  const sourceIds = [...new Set(rules.flatMap((rule) => rule.sourceIds || []))];
  const aliases = [...new Set(rules.flatMap((rule) => rule.aliases || []))];
  return clone({
    conceptId: first.conceptId,
    name: first.name,
    aliases,
    conceptType: first.conceptType,
    ...(first.patternType ? { patternType: first.patternType } : {}),
    traditions: [...new Set(rules.map((rule) => rule.tradition).filter(Boolean))],
    status: rules.some((rule) => rule.status === 'canonical') ? 'canonical' : first.status,
    ruleIds: rules.map((rule) => rule.ruleId),
    sourceIds,
    description: conceptDescription(rules),
    version: [...new Set(rules.map((rule) => rule.version).filter(Boolean))].join(', '),
    ruleFamily: [...new Set(rules.map((rule) => rule.ruleFamily).filter(Boolean))],
    confidence: [...new Set(rules.map((rule) => rule.confidence).filter(Boolean))],
    api: [...new Set(rules.flatMap((rule) => rule.api || []))],
    outputFields: [...new Set(rules.flatMap((rule) => rule.outputFields || []))],
    evidenceStatus: [...new Set(rules.map((rule) => rule.evidence?.status).filter(Boolean))],
    implementation: {
      status: rules.every((rule) => rule.implementation?.status === 'not-implemented') ? 'not-implemented' : 'registered',
      modules: [...new Set(rules.map((rule) => rule.implementation?.module).filter(Boolean))]
    }
  });
}

const conceptMap = new Map();
for (const rule of CANONICAL_RULES) {
  const list = conceptMap.get(rule.conceptId) || [];
  list.push(rule);
  conceptMap.set(rule.conceptId, list);
}
const CONCEPTS = Object.freeze([...conceptMap.values()].map(buildConcept));
const CONCEPT_BY_ID = new Map(CONCEPTS.map((concept) => [concept.conceptId, concept]));

function getConcept(query) {
  if (!query) return null;
  const value = String(query).trim().toLowerCase();
  const concept = CONCEPTS.find((item) => [item.conceptId, item.name, ...(item.aliases || [])]
    .some((field) => String(field).toLowerCase() === value));
  if (!concept) return null;
  return clone({
    ...concept,
    rules: concept.ruleIds.map((ruleId) => getRule(ruleId)),
    sources: concept.sourceIds.map((sourceId) => getSource(sourceId)),
    variants: getVariants(concept.conceptId)
  });
}

function findConcept(query = '') {
  const value = String(query).trim().toLowerCase();
  if (!value) return CONCEPTS.map(clone);
  return CONCEPTS.filter((concept) => [concept.conceptId, concept.name, ...(concept.aliases || []), concept.description]
    .some((field) => String(field).toLowerCase().includes(value))).map(clone);
}

function getRule(query) {
  const raw = RULE_BY_ID.get(query) || RULE_BY_ID.get(String(query || '').trim());
  if (!raw) return null;
  return clone({
    ...raw,
    sources: raw.sourceIds.map((sourceId) => getSource(sourceId))
  });
}

function getSource(sourceId) {
  const source = sourceMap.get(sourceId);
  if (!source) return null;
  const citations = [
    ...catalogEvidence.filter((record) => (record.sourceIds || []).includes(sourceId)),
    ...ledgerCitations.filter((record) => record.sourceId === sourceId)
  ];
  return clone({
    ...source,
    editionRecords: editionRecords.filter((record) => record.sourceId === sourceId),
    citations
  });
}

function getSourcesForRule(ruleQuery) {
  const rule = getRule(ruleQuery);
  return rule ? rule.sourceIds.map(getSource).filter(Boolean) : [];
}

function getRulesFromSource(sourceId) {
  return CANONICAL_RULES.filter((rule) => rule.sourceIds.includes(sourceId)).map((rule) => getRule(rule.ruleId));
}

function getVariants(query) {
  const ruleIds = CONCEPT_BY_ID.has(query)
    ? CONCEPT_BY_ID.get(query).ruleIds
    : [getRule(query)?.ruleId].filter(Boolean);
  const variants = [];
  for (const variant of catalogVariants.filter((item) => !query || item.variantId === query || item.conceptId === query)) {
    variants.push({
      ...clone(variant),
      sourceIds: variant.sourceIds || [],
      status: variant.status || 'comparison',
      variantId: variant.variantId,
      condition: variant.condition || ''
    });
  }
  for (const ruleId of ruleIds) {
    const rule = RULE_BY_ID.get(ruleId);
    if (!rule) continue;
    for (const variant of rule.variants || []) {
      variants.push({
        variantId: `${rule.ruleId}:${variant.id || variants.length + 1}`,
        conceptId: rule.conceptId,
        ruleId: rule.ruleId,
        tradition: rule.tradition,
        sourceIds: rule.sourceIds,
        status: 'research-only',
        condition: variant.condition || variant.description || variant.note || '',
        ...clone(variant)
      });
    }
    for (const record of ruleEvidence(rule)) {
      for (const variant of record.variants || []) {
        variants.push({
          variantId: `${rule.ruleId}:${variant.id || record.evidenceId}`,
          conceptId: rule.conceptId,
          ruleId: rule.ruleId,
          tradition: rule.tradition,
          sourceIds: record.sourceIds || [record.sourceId],
          status: 'research-only',
          condition: variant.condition || variant.description || variant.note || '',
          ...clone(variant)
        });
      }
    }
  }
  const unique = new Map(variants.map((variant) => [variant.variantId, variant]));
  return [...unique.values()];
}

function coverageEntry(concept) {
  const rules = concept.ruleIds.map((ruleId) => RULE_BY_ID.get(ruleId)).filter(Boolean);
  const hasSource = concept.sourceIds.length > 0;
  const hasLocator = concept.sourceIds.some((sourceId) => {
    const source = getSource(sourceId);
    return source?.citations?.some((citation) => citation.locator || citation.scope || citation.originalBasis);
  });
  return {
    conceptId: concept.conceptId,
    conceptType: concept.conceptType,
    status: concept.status,
    ruleCount: rules.length,
    sourceLinked: hasSource,
    locatorBacked: hasLocator,
    variantsDocumented: rules.some((rule) => {
      const evidenceVariants = Array.isArray(rule.evidence)
        ? rule.evidence.some((item) => (item.variants || []).length > 0)
        : false;
      return (rule.variants || []).length > 0 || evidenceVariants;
    }),
    machineReadable: true,
    implemented: rules.some((rule) => rule.implementation?.status === 'implemented'),
    testStatus: 'not-collected',
    externalStatus: 'not-collected'
  };
}

function dimension(entries, key) {
  const total = entries.length;
  const covered = entries.filter((entry) => entry[key]).length;
  return { covered, total, percent: total ? Number((covered / total * 100).toFixed(1)) : 0 };
}

function getCoverage(type = null) {
  const entries = CONCEPTS.filter((concept) => !type || concept.conceptType === type).map(coverageEntry);
  return {
    coverageVersion: '0.1.0',
    catalogVersion: sourceCatalog.catalogVersion,
    scope: type || 'all',
    totals: { concepts: entries.length, rules: entries.reduce((sum, entry) => sum + entry.ruleCount, 0) },
    dimensions: {
      sourceLinked: dimension(entries, 'sourceLinked'),
      locatorBacked: dimension(entries, 'locatorBacked'),
      variantsDocumented: dimension(entries, 'variantsDocumented'),
      machineReadable: dimension(entries, 'machineReadable'),
      implemented: dimension(entries, 'implemented'),
      tests: { covered: 0, total: entries.length, status: 'not-collected' },
      external: { covered: 0, total: entries.length, status: 'not-collected' },
      documentation: { covered: entries.filter((entry) => entry.sourceLinked && entry.machineReadable).length, total: entries.length, percent: entries.length ? Number((entries.filter((entry) => entry.sourceLinked && entry.machineReadable).length / entries.length * 100).toFixed(1)) : 0 }
    },
    entries
  };
}

function getCoverageReport() {
  return {
    coverageVersion: '0.1.0',
    taxonomyVersion: TAXONOMY_VERSION,
    catalogVersion: sourceCatalog.catalogVersion,
    scopes: ['all', ...CONCEPT_TYPES].map((scope) => getCoverage(scope === 'all' ? null : scope))
  };
}

function toContext(options = {}) {
  const requested = options.conceptIds || options.concepts || null;
  const concepts = requested
    ? requested.map((id) => getConcept(id)).filter(Boolean)
    : CONCEPTS.map((concept) => getConcept(concept.conceptId));
  const rules = concepts.flatMap((concept) => concept.rules || []);
  const sources = options.includeSources === false ? [] : [...new Map(concepts.flatMap((concept) => concept.sources || []).map((source) => [source.sourceId, source])).values()];
  const variants = options.includeVariants === false ? [] : concepts.flatMap((concept) => concept.variants || []);
  return clone({
    contextType: 'bazi-js-reference-context',
    taxonomy: getTaxonomy(),
    concepts: concepts.map((concept) => ({ ...concept, rules: undefined, sources: undefined, variants: undefined })),
    rules,
    ...(options.includeSources === false ? {} : { sources }),
    ...(options.includeVariants === false ? {} : { variants }),
    ...(options.includeExamples === false ? {} : { examples: [] }),
    ...(options.includeResearchNotes === false ? {} : { researchNotes: rules.flatMap((rule) => rule.researchNotes ? [{ ruleId: rule.ruleId, ...rule.researchNotes }] : []) }),
    claimPolicy: {
      mayStateAsImplemented: rules.filter((rule) => rule.implementation?.status === 'implemented').map((rule) => rule.ruleId),
      mayStateAsCanonical: rules.filter((rule) => rule.status === 'canonical').map((rule) => rule.ruleId),
      mustMentionVariant: variants.map((variant) => variant.variantId),
      mustCiteSource: rules.map((rule) => rule.ruleId)
    }
  });
}

function validateReferenceIndex() {
  const errors = [];
  const ruleIds = new Set();
  for (const rule of CANONICAL_RULES) {
    if (ruleIds.has(rule.ruleId)) errors.push(`duplicate ruleId: ${rule.ruleId}`);
    ruleIds.add(rule.ruleId);
    if (!rule.sourceIds.length && rule.referenceKind !== 'system-concept') errors.push(`${rule.ruleId}: no linked source`);
    for (const sourceId of rule.sourceIds) if (!sourceMap.has(sourceId)) errors.push(`${rule.ruleId}: unknown source ${sourceId}`);
    if (!CONCEPT_TYPES.includes(rule.conceptType)) errors.push(`${rule.ruleId}: invalid canonical conceptType`);
    if (rule.conceptType === 'pattern' && !rule.patternType) errors.push(`${rule.ruleId}: patternType is required`);
  }
  const taxonomy = validateTaxonomy(RULES, CONCEPTS);
  errors.push(...taxonomy.errors);
  for (const concept of CONCEPTS) {
    if (concept.ruleIds.length === 0) errors.push(`${concept.conceptId}: orphan concept`);
    if (concept.sourceIds.some((sourceId) => !sourceMap.has(sourceId))) errors.push(`${concept.conceptId}: unknown source link`);
  }
  const variantIds = new Set();
  for (const variant of catalogVariants) {
    if (variantIds.has(variant.variantId)) errors.push(`duplicate variantId: ${variant.variantId}`);
    variantIds.add(variant.variantId);
    for (const sourceId of variant.sourceIds || []) if (!sourceMap.has(sourceId)) errors.push(`${variant.variantId}: unknown source ${sourceId}`);
  }
  return {
    valid: errors.length === 0,
    errors,
    counts: { rules: CANONICAL_RULES.length, concepts: CONCEPTS.length, sources: sourceRecords.length, variants: catalogVariants.length, catalogEvidence: catalogEvidence.length, ledgerCitations: ledgerCitations.length }
  };
}

export {
  CANONICAL_RULES,
  SYSTEM_CONCEPTS,
  CONCEPTS,
  RULES,
  getConcept,
  findConcept,
  getRule,
  getSourcesForRule,
  getRulesFromSource,
  getVariants,
  getCoverage,
  getCoverageReport,
  toContext,
  validateReferenceIndex,
  getTaxonomy,
  getSource
};
