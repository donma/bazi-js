// AI Context 模組
// 規範要求：
// 提供 Bazi.AI.toContext(result, options)
// 去除 UI layout、SVG、不必要重複欄位與 Renderer metadata。
// 保留：四柱、十神、藏干、五行、強弱、合沖刑害、神煞、大運、流運、ruleId、evidence、profile、version。
// 專供大型語言模型 (LLM) 作為 system prompt 或 context 注入，嚴禁直接讓 LLM 自行猜算八字。

import { groupShenShaByPillar } from '../shensha/index.js';

function buildShenShaItem(item, options = {}) {
  const { includeRules = true, includeEvidence = true } = options;
  return {
    id: item.id,
    name: item.name,
    displayName: item.displayName || item.name,
    aliases: item.aliases || [],
    tradition: item.tradition,
    conceptType: item.conceptType,
    ruleFamily: item.ruleFamily,
    scope: item.scope,
    category: item.category,
    tags: item.tags || [],
    tier: item.tier,
    priority: item.priority,
    confidence: item.confidence,
    schools: item.schools || [],
    hitOn: item.hitOn || [],
    baseOn: item.baseOn || item.basedOn || [],
    basedOn: item.basedOn || [],
    target: item.target,
    ...(includeRules ? { ruleId: item.ruleId, version: item.version } : {}),
    reference: item.reference,
    ...(Array.isArray(item.references) ? { references: item.references } : {}),
    ...(item.description ? { description: item.description } : {}),
    ...(item.variants ? { variants: item.variants } : {}),
    ...(item.researchNotes ? { researchNotes: item.researchNotes } : {}),
    ...(includeEvidence ? { evidence: item.evidence } : {})
  };
}

function buildSpecialRuleItem(item, options = {}) {
  const { includeRules = true, includeEvidence = true } = options;
  return {
    id: item.id,
    name: item.name,
    displayName: item.displayName || item.name,
    aliases: item.aliases || [],
    tradition: item.tradition,
    conceptType: item.conceptType,
    ruleFamily: item.ruleFamily,
    baseOn: item.baseOn || [],
    scope: item.scope,
    category: item.category,
    tags: item.tags || [],
    confidence: item.confidence,
    hitOn: item.hitOn || [],
    ...(includeRules ? { ruleId: item.ruleId, version: item.version } : {}),
    reference: item.reference,
    ...(Array.isArray(item.references) ? { references: item.references } : {}),
    ...(item.description ? { description: item.description } : {}),
    ...(item.variants ? { variants: item.variants } : {}),
    ...(item.researchNotes ? { researchNotes: item.researchNotes } : {}),
    ...(includeEvidence ? { evidence: item.evidence } : {})
  };
}

export function toShenShaContext(result, options = {}) {
  const items = (result.shenSha || []).map((item) => buildShenShaItem(item, options));
  const grouped = groupShenShaByPillar(result.shenSha || []);
  const context = {
    preset: result.meta.shenshaPreset || 'classical',
    ruleVersion: result.meta.shenShaRuleVersion || '2.1.0',
    all: items,
    byPillar: Object.fromEntries(Object.entries(grouped).map(([pillar, list]) => [
      pillar,
      list.map((item) => buildShenShaItem(item, options))
    ]))
  };
  return options.compact ? JSON.stringify(context) : context;
}

export function toSpecialRulesContext(result, options = {}) {
  const items = (result.specialRules || []).map((item) => buildSpecialRuleItem(item, options));
  const byConceptType = items.reduce((grouped, item) => {
    const key = item.conceptType || 'unknown';
    (grouped[key] ||= []).push(item);
    return grouped;
  }, {});
  const context = {
    ruleVersion: result.meta.specialRuleVersion || '1.0.0',
    all: items,
    byConceptType
  };
  return options.compact ? JSON.stringify(context) : context;
}

export function toContext(result, options = {}) {
  const {
    compact = true,
    includeRules = true,
    includeEvidence = true,
    includeShenShaEvidence = true,
    includeStrengthEvidence = true,
    includeInteractions = true,
    maxLuckCycles = 6
  } = options;

  const ctx = {
    metadata: {
      engine: 'BaziJS',
      engineVersion: result.meta.engineVersion,
      ruleSetVersion: result.meta.ruleSetVersion,
      profileId: result.meta.profileId,
      shenshaPreset: result.meta.shenshaPreset || 'classical',
      shenShaRuleVersion: result.meta.shenShaRuleVersion || '2.1.0',
      specialRuleVersion: result.meta.specialRuleVersion || '1.0.0'
    },

    inputSummary: {
      birthDate: result.input.birthDate,
      birthTime: result.input.birthTime || '未知',
      gender: result.input.gender === 'male' ? '乾造（男）' : '坤造（女）',
      timezone: result.input.timezone,
      trueSolarTimeUsed: result.accuracy.trueSolarTimeUsed
    },

    pillars: {
      year: {
        ganzhi: result.pillars.year.ganzhi,
        stem: result.pillars.year.stem,
        branch: result.pillars.year.branch,
        tenGod: result.tenGods.stems.year ? result.tenGods.stems.year.full : null,
        nayin: result.nayin.year,
        hidden: result.tenGods.hidden.year.map(h => `${h.stem}(${h.tenGod.full})`)
      },
      month: {
        ganzhi: result.pillars.month.ganzhi,
        stem: result.pillars.month.stem,
        branch: result.pillars.month.branch,
        tenGod: result.tenGods.stems.month ? result.tenGods.stems.month.full : null,
        nayin: result.nayin.month,
        hidden: result.tenGods.hidden.month.map(h => `${h.stem}(${h.tenGod.full})`)
      },
      day: {
        ganzhi: result.pillars.day.ganzhi,
        stem: result.pillars.day.stem,
        branch: result.pillars.day.branch,
        tenGod: '日主（元神）',
        nayin: result.nayin.day,
        hidden: result.tenGods.hidden.day.map(h => `${h.stem}(${h.tenGod.full})`)
      },
      hour: result.pillars.hour.available ? {
        ganzhi: result.pillars.hour.ganzhi,
        stem: result.pillars.hour.stem,
        branch: result.pillars.hour.branch,
        tenGod: result.tenGods.stems.hour ? result.tenGods.stems.hour.full : null,
        nayin: result.nayin.hour,
        hidden: result.tenGods.hidden.hour.map(h => `${h.stem}(${h.tenGod.full})`)
      } : { available: false, reason: '時間未知' }
    },

    dayMaster: {
      stem: result.strength.dayMaster,
      elementScore: result.strength.score,
      strengthLevel: result.strength.level,
      favorableElements: result.strength.favorableElements,
      unfavorableElements: result.strength.unfavorableElements,
      ...(includeStrengthEvidence ? { strengthEvidence: result.strength.evidence } : {})
    },

    fiveElementsDistribution: result.strength.distribution,

    kongWang: {
      byDay: result.kongWang.byDay.branches,
      byYear: result.kongWang.byYear.branches
    },

    auxiliary: {
      taiYuan: result.auxiliary.taiYuan ? result.auxiliary.taiYuan.ganzhi : null,
      taiXi: result.auxiliary.taiXi ? result.auxiliary.taiXi.ganzhi : null,
      mingGong: result.auxiliary.mingGong ? result.auxiliary.mingGong.ganzhi : null,
      shenGong: result.auxiliary.shenGong ? result.auxiliary.shenGong.ganzhi : null
    },

    shenSha: toShenShaContext(result, {
      includeRules,
      includeEvidence: includeShenShaEvidence,
      compact: false
    }),

    specialRules: toSpecialRulesContext(result, {
      includeRules,
      includeEvidence: includeShenShaEvidence,
      compact: false
    }),

    // 舊欄位保留，讓既有整合不必同步升級；新程式請使用 shenSha。
    shenShaList: result.shenSha.map(s => buildShenShaItem(s, {
      includeRules,
      includeEvidence: includeShenShaEvidence
    })),

    ...(includeInteractions ? {
      interactions: {
        stems: result.interactions.stems.map(s => s.name),
        branches: result.interactions.branches.map(b => b.name)
      }
    } : {}),

    luckCyclesSummary: {
      direction: result.luckCycles.directionText,
      startAge: result.luckCycles.startAge.display,
      startDate: result.luckCycles.startAge.startDate,
      cycles: result.luckCycles.cycles.slice(0, maxLuckCycles).map(c => ({
        step: c.step,
        ganzhi: c.ganzhi,
        ageRange: `${c.fromAge}~${c.toAge}歲`,
        tenGodStem: c.tenGodStem ? c.tenGodStem.full : '',
        nayin: c.nayin
      }))
    }
  };

  if (compact) {
    return JSON.stringify(ctx);
  }
  return ctx;
}
