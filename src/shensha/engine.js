// ShenSha vNext engine：規則選擇、證據收集、柱位分組與外來流柱。

import { getShenShaPreset } from './constants.js';
import { SHENSHA_REGISTRY } from './registry.js';
import { createShenShaContext, getBaseValue, getPillarEntries } from './utils/context.js';

function isRuleEnabled(rule, preset) {
  return preset.tiers.includes(rule.tier) && !(preset.excludeExperimental && rule.confidence === 'experimental');
}

function matchedValue(value) {
  if (typeof value === 'object' && value !== null) return value.matched !== false;
  return Boolean(value);
}

function matchNote(value, rule) {
  if (value && typeof value === 'object') return value.evidence || value.reason || rule.description;
  return rule.description;
}

function normalizeTarget(target) {
  return {
    pillar: target.pillar,
    available: target.available !== false,
    stem: target.stem || null,
    branch: target.branch || null,
    ganzhi: target.ganzhi || (target.stem && target.branch ? `${target.stem}${target.branch}` : null),
    sexagenaryIndex: target.sexagenaryIndex ?? null
  };
}

function resultFor(rule, hits, evidence) {
  const references = rule.references || [];
  return {
    id: rule.id,
    name: rule.name,
    displayName: rule.displayName || rule.name,
    aliases: rule.aliases || [],
    tradition: rule.tradition,
    conceptType: rule.conceptType,
    ruleFamily: rule.ruleFamily,
    scope: rule.scope,
    category: rule.category,
    tags: rule.tags || [],
    tier: rule.tier,
    priority: rule.priority,
    confidence: rule.confidence,
    schools: rule.schools || [],
    hitOn: [...new Set(hits)],
    baseOn: rule.baseOn,
    basedOn: rule.baseOn,
    target: rule.target,
    ruleId: rule.ruleId,
    version: rule.version,
    reference: references[0] ? references[0].title : undefined,
    references,
    description: rule.description || '',
    ...(rule.variants ? { variants: rule.variants } : {}),
    ...(rule.researchNotes ? { researchNotes: rule.researchNotes } : {}),
    evidence: { details: evidence }
  };
}

function evaluateRules(pillars, targets, options = {}) {
  const preset = getShenShaPreset(options.preset || options.shenshaPreset || options.shenShaPreset || 'classical');
  const baseContext = createShenShaContext(pillars, { gender: options.gender });
  const external = options.external === true;
  const results = [];

  for (const rule of SHENSHA_REGISTRY) {
    if (!isRuleEnabled(rule, preset)) continue;
    if (external && rule.baseOn.includes('dayPillar')) continue;
    const hits = [];
    const evidence = [];
    for (const rawTarget of targets) {
      const target = normalizeTarget(rawTarget);
      if (!target.available) continue;
      for (const baseKey of rule.baseOn) {
        const context = { ...baseContext, target, activeBase: baseKey };
        let value = false;
        try {
          value = rule.match(context);
        } catch (error) {
          evidence.push({ basedOn: baseKey, matched: false, error: error.message });
          continue;
        }
        if (!matchedValue(value)) continue;
        if (!hits.includes(target.pillar)) hits.push(target.pillar);
        evidence.push({
          basedOn: baseKey,
          baseValue: getBaseValue(context, baseKey),
          targetPillar: target.pillar,
          targetValue: target.ganzhi || target.branch,
          matched: true,
          reason: matchNote(value, rule)
        });
      }
    }
    if (hits.length > 0) results.push(resultFor(rule, hits, evidence));
  }
  return results;
}

export function calculateShenSha(pillars, options = {}) {
  return evaluateRules(pillars, getPillarEntries(pillars), options);
}

export function calculateShenShaOnPillar(natalPillars, stemChar, branchChar, pillarLabel, options = {}) {
  if (!stemChar || !branchChar) return [];
  return evaluateRules(natalPillars, [{ pillar: pillarLabel, stem: stemChar, branch: branchChar, available: true }], { ...options, external: true });
}

export function calculateTransitShenSha(natalChart, transit, options = {}) {
  const pillar = transit && (transit.year || transit);
  if (!pillar || !pillar.stem || !pillar.branch) return { year: null, shenSha: [] };
  const results = calculateShenShaOnPillar(natalChart.pillars || natalChart, pillar.stem, pillar.branch, 'transit-year', options);
  return { year: transit && typeof transit.year === 'number' ? transit.year : null, target: pillar.ganzhi || `${pillar.stem}${pillar.branch}`, shenSha: results };
}

export function groupShenShaByPillar(results = []) {
  const grouped = { year: [], month: [], day: [], hour: [] };
  for (const item of results) {
    for (const pillar of item.hitOn || []) {
      if (!grouped[pillar]) continue;
      grouped[pillar].push({
        ...item,
        hitOn: [pillar],
        evidence: {
          ...(item.evidence || {}),
          details: (item.evidence && item.evidence.details ? item.evidence.details : []).filter((detail) => detail.targetPillar === pillar)
        }
      });
    }
  }
  return grouped;
}
