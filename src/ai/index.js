// AI Context 模組
// 規範要求：
// 提供 Bazi.AI.toContext(result, options)
// 去除 UI layout、SVG、不必要重複欄位與 Renderer metadata。
// 保留：四柱、十神、藏干、五行、強弱、合沖刑害、神煞、大運、流運、ruleId、evidence、profile、version。
// 專供大型語言模型 (LLM) 作為 system prompt 或 context 注入，嚴禁直接讓 LLM 自行猜算八字。

import { calculateXunKong, groupShenShaByPillar } from '../shensha/index.js';

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
    ...(item.interpretation ? { interpretation: item.interpretation } : {}),
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
    ...(item.interpretation ? { interpretation: item.interpretation } : {}),
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

function buildPillarContext(result, pillarKey, options = {}) {
  const pillar = result.pillars[pillarKey];
  const hidden = result.tenGods.hidden[pillarKey] || [];
  const stage = result.twelveStages.byDayMaster[pillarKey] || null;
  const selfSeated = result.twelveStages.selfSeated[pillarKey] || null;
  return {
    available: pillar.available !== false,
    ganzhi: pillar.ganzhi,
    stem: pillar.stem,
    branch: pillar.branch,
    sexagenaryIndex: pillar.sexagenaryIndex,
    tenGod: pillarKey === 'day' ? '日主（元神）' : result.tenGods.stems[pillarKey] ? result.tenGods.stems[pillarKey].full : null,
    nayin: result.nayin[pillarKey],
    hidden: hidden.map((item) => `${item.stem}(${item.tenGod.full})`),
    hiddenDetails: hidden,
    stage,
    selfSeated,
    xunKong: pillar.ganzhi ? calculateXunKong(pillar.ganzhi) : null,
    ...(options.includeRules ? { source: 'BaziJS canonical chart result' } : {})
  };
}

function buildTransitPillarContext(result, pillarKey, options = {}) {
  const pillar = result.transits && result.transits[pillarKey];
  if (!pillar) return null;
  return {
    ganzhi: pillar.ganzhi,
    stem: pillar.stem,
    branch: pillar.branch,
    sexagenaryIndex: pillar.sexagenaryIndex,
    tenGod: pillar.tenGod || null,
    stage: pillar.stage || null,
    nayin: pillar.nayin || null,
    shenSha: (pillar.shenSha || []).map((item) => buildShenShaItem(item, options))
  };
}

export function toContext(result, options = {}) {
  const {
    compact = true,
    includeRules = true,
    includeEvidence = true,
    includeShenShaEvidence = includeEvidence,
    includeStrengthEvidence = true,
    includeInteractions = true,
    maxLuckCycles = 10
  } = options;

  const ctx = {
    metadata: {
      engine: 'BaziJS',
      engineVersion: result.meta.engineVersion,
      resultSchemaVersion: result.meta.resultSchemaVersion || '2.1.0',
      ruleSetVersion: result.meta.ruleSetVersion,
      profileId: result.meta.profileId,
      shenshaPreset: result.meta.shenshaPreset || 'classical',
      shenShaRuleVersion: result.meta.shenShaRuleVersion || '2.1.0',
      specialRuleVersion: result.meta.specialRuleVersion || '1.0.0',
      fiveCategoryRuleVersion: result.meta.fiveCategoryRuleVersion || '1.0.0',
      auxiliaryRuleVersion: result.meta.auxiliaryRuleVersion || '1.0.0',
      classicalSummaryRuleVersion: result.meta.classicalSummaryRuleVersion || '1.0.0',
      analysisRuleVersion: result.meta.analysisRuleVersion || '1.0.0',
      luckRuleVersion: result.meta.luckRuleVersion || '1.0.0'
    },

    inputSummary: {
      birthDate: result.input.birthDate,
      birthTime: result.input.birthTime || '未知',
      gender: result.input.gender === 'male' ? '乾造（男）' : '坤造（女）',
      timezone: result.input.timezone,
      trueSolarTimeUsed: result.accuracy.trueSolarTimeUsed,
      zodiac: result.calendar.zodiac ? result.calendar.zodiac.name : null,
      constellation: result.calendar.constellation ? result.calendar.constellation.name : null
    },

    // AI Context 也必須能重現本次排盤，不只保留人類可讀摘要。
    input: result.input,
    accuracy: result.accuracy,

    calendar: {
      solar: result.calendar.solar,
      lunar: result.calendar.lunar,
      zodiac: result.calendar.zodiac || null,
      constellation: result.calendar.constellation || null,
      solarTerms: result.calendar.solarTerms,
      time: result.calendar.time
    },

    pillars: {
      year: buildPillarContext(result, 'year', { includeRules }),
      month: buildPillarContext(result, 'month', { includeRules }),
      day: buildPillarContext(result, 'day', { includeRules }),
      hour: result.pillars.hour.available
        ? buildPillarContext(result, 'hour', { includeRules })
        : { available: false, reason: '時間未知' }
    },

    dayMaster: {
      stem: result.strength.dayMasterStem || result.pillars.day.stem,
      element: result.strength.dayMaster,
      elementScore: result.strength.score,
      strengthLevel: result.strength.level,
      monthState: result.strength.monthState || null,
      monthCommander: result.strength.monthCommander || null,
      seasonalStates: result.strength.seasonalStates || {},
      favorableElements: result.strength.favorableElements,
      unfavorableElements: result.strength.unfavorableElements,
      fiveCategory: result.strength.fiveCategory || null,
      ...(includeStrengthEvidence ? { strengthEvidence: result.strength.evidence } : {})
    },

    fiveElementsDistribution: result.strength.distribution,

    kongWang: {
      byDay: result.kongWang.byDay.branches,
      byYear: result.kongWang.byYear.branches
    },

    auxiliary: {
      taiYuan: result.auxiliary.taiYuan || null,
      taiXi: result.auxiliary.taiXi || null,
      mingGong: result.auxiliary.mingGong || null,
      shenGong: result.auxiliary.shenGong || null,
      mingGua: result.auxiliary.mingGua || null
    },

    classicalSummary: result.classicalSummary || null,

    analysis: result.analysis || null,

    rules: result.rules,

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
        branches: result.interactions.branches.map(b => b.name),
        details: result.interactions
      }
    } : {}),

    // 畫面會顯示目前流年；AI Context 不能只保留原局與大運摘要。
    transits: result.transits ? {
      targetDatetime: result.transits.targetDatetime,
      year: buildTransitPillarContext(result, 'year', { includeRules, includeEvidence: includeShenShaEvidence }),
      month: buildTransitPillarContext(result, 'month', { includeRules, includeEvidence: includeShenShaEvidence }),
      day: buildTransitPillarContext(result, 'day', { includeRules, includeEvidence: includeShenShaEvidence }),
      hour: buildTransitPillarContext(result, 'hour', { includeRules, includeEvidence: includeShenShaEvidence }),
      interactions: result.transits.interactions || [],
      shenShaYear: (result.transits.shenShaYear || []).map((item) => buildShenShaItem(item, {
        includeRules,
        includeEvidence: includeShenShaEvidence
      })),
      shenSha: ((Array.isArray(result.transits.shenSha) ? result.transits.shenSha : result.transits.shenSha && result.transits.shenSha.shenSha) || []).map((item) => buildShenShaItem(item, {
        includeRules,
        includeEvidence: includeShenShaEvidence
      }))
    } : null,

    luckCyclesSummary: {
      direction: result.luckCycles.directionText,
      startAge: result.luckCycles.startAge.display,
      startDate: result.luckCycles.startAge.startDate,
      startAgeMethod: result.luckCycles.startAgeMethod,
      startAgeDetails: result.luckCycles.startAge,
      variants: result.luckCycles.variants || [],
      cycles: result.luckCycles.cycles.slice(0, maxLuckCycles).map(c => ({
        step: c.step,
        ganzhi: c.ganzhi,
        stem: c.stem,
        branch: c.branch,
        sexagenaryIndex: c.sexagenaryIndex,
        ageRange: `${c.fromAge}~${c.toAge}歲`,
        fromYear: c.fromYear,
        toYear: c.toYear,
        tenGodStem: c.tenGodStem ? c.tenGodStem.full : '',
        stage: c.stage || null,
        nayin: c.nayin,
        startDate: c.startDate || null,
        endDate: c.endDate || null,
        nominalAgeRange: c.nominalFromAge !== undefined ? `${c.nominalFromAge}~${c.nominalToAge}歲` : null,
        shenSha: (c.shenSha || []).map((item) => buildShenShaItem(item, {
          includeRules,
          includeEvidence: includeShenShaEvidence
        })),
        ...(options.includeLuckAnnualDetails && Array.isArray(c.annuals) ? {
          annuals: c.annuals.map((annual) => ({
            age: annual.age,
            year: annual.year,
            ganzhi: annual.ganzhi,
            tenGod: annual.tenGod,
            stage: annual.stage,
            nayin: annual.nayin,
            xunKong: annual.xunKong,
            shenSha: (annual.shenSha || []).map((item) => buildShenShaItem(item, {
              includeRules,
              includeEvidence: includeShenShaEvidence
            })),
            interactions: includeInteractions ? annual.interactions : undefined
          }))
        } : {})
      }))
    }
  };

  if (compact) {
    return JSON.stringify(ctx);
  }
  return ctx;
}
