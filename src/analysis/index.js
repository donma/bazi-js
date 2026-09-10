// 分析模型與 Profile 選擇層
//
// 這一層刻意把「已實作的 canonical 算法」與「研究中的流派模型」分開。
// 研究模型可以被 Profile 選取並出現在結果證據中，但在沒有可審核的全局
// predicate 以前，不會假裝產生一個新的唯一用神或格局結論。

export const ANALYSIS_RULE_VERSION = '1.0.0';
export const ANALYSIS_SELECTION_RULE_ID = 'PROFILE_ANALYSIS_SELECTION_001';

const CLASSICAL_ZIPING = 'classical-ziping';

const REFERENCES = Object.freeze({
  fuyi: [
    {
      type: 'classical',
      sourceId: 'di-tian-sui-yan-wei',
      title: '《滴天髓闡微》',
      locator: '用神、喜神、忌神、仇神、閒神相關注解',
      url: 'https://zh.wikisource.org/zh-hant/滴天髓闡微'
    }
  ],
  seasonal: [
    {
      type: 'classical',
      sourceId: 'san-ming-tong-hui',
      title: '《三命通會》',
      locator: '卷二〈論四時節氣〉、〈論五行旺相休囚死〉',
      url: 'https://zh.wikisource.org/zh-hant/三命通會/卷二'
    }
  ],
  mediator: [
    {
      type: 'classical',
      sourceId: 'di-tian-sui-yan-wei',
      title: '《滴天髓闡微》',
      locator: '五行生剋、通關與中和相關注解',
      url: 'https://zh.wikisource.org/zh-hant/滴天髓闡微'
    }
  ],
  patterns: [
    {
      type: 'classical',
      sourceId: 'san-ming-tong-hui',
      title: '《三命通會》',
      locator: '卷六特殊格各條',
      url: 'https://zh.wikisource.org/zh-hant/三命通會/卷六'
    }
  ]
});

const MODEL_DEFINITIONS = Object.freeze({
  'bazi-js-human-element': {
    id: 'bazi-js-human-element',
    name: 'BaziJS 人元司令分日模型',
    status: 'implemented',
    confidence: 'school-specific',
    conceptType: 'seasonal-derived',
    ruleFamily: 'month-commander',
    baseOn: ['monthPillar.branch', 'solarTerms.prevJie', 'hiddenStems.month'],
    scope: 'seasonal-month',
    ruleId: 'STR_MONTH_COMMANDER_001',
    version: '1.0.0',
    references: REFERENCES.seasonal,
    description: '採 BaziJS canonical 的可重現人元司令分日表。'
  },
  'san-ming-volume-2': {
    id: 'san-ming-volume-2',
    name: '《三命通會》卷二人元司事分日模型',
    status: 'comparison',
    confidence: 'classical-variant',
    conceptType: 'seasonal-derived',
    ruleFamily: 'month-commander',
    baseOn: ['monthPillar.branch', 'solarTerms.prevJie', 'hiddenStems.month'],
    scope: 'seasonal-month',
    ruleId: 'STR_MONTH_COMMANDER_SANMING_002',
    version: '1.0.0',
    references: REFERENCES.seasonal,
    description: '以《三命通會》卷二所見分日表作為比較模型；與 canonical 變體並存。'
  },
  'canonical-palm': {
    id: 'canonical-palm',
    name: 'BaziJS canonical 命宮身宮掌訣',
    status: 'implemented',
    confidence: 'classical-scope',
    conceptType: 'palace-calculation',
    ruleFamily: 'month-hour-palm',
    baseOn: ['monthPillar.branch', 'hourPillar.branch', 'yearPillar.stem'],
    scope: 'month-hour',
    ruleId: 'AUX_CANONICAL_PALM_001',
    version: '1.0.0',
    references: [{ type: 'classical', sourceId: 'san-ming-tong-hui', title: '《三命通會》', locator: '卷二〈論坐命官〉', url: 'https://zh.wikisource.org/zh-hant/三命通會/卷二' }],
    description: '依月支、時支與年干五虎遁計算命宮與身宮。'
  },
  'san-ming-palm-research': {
    id: 'san-ming-palm-research',
    name: '《三命通會》命宮掌訣研究模型',
    status: 'research-only',
    confidence: 'research',
    conceptType: 'palace-calculation',
    ruleFamily: 'month-hour-palm',
    baseOn: ['monthPillar.branch', 'hourPillar.branch', 'yearPillar.stem'],
    scope: 'month-hour',
    ruleId: 'AUX_SANMING_PALM_RESEARCH_001',
    version: '0.1.0',
    references: [{ type: 'classical', sourceId: 'san-ming-tong-hui', title: '《三命通會》', locator: '卷二〈論坐命官〉', url: 'https://zh.wikisource.org/zh-hant/三命通會/卷二' }],
    description: '研究不同掌訣傳本的命宮／身宮差異；尚未完成變體算法。'
  },
  'fuyi-canonical': {
    id: 'fuyi-canonical',
    name: 'canonical 扶抑模型',
    status: 'implemented',
    confidence: 'model-derived',
    conceptType: 'strength-model',
    ruleFamily: 'whole-chart-analysis',
    baseOn: ['dayMaster', 'monthPillar', 'wholeChart'],
    scope: 'whole-chart',
    ruleId: 'STR_CANONICAL_DEFAULT',
    version: '1.0.0',
    references: REFERENCES.fuyi,
    description: '依 BaziJS canonical 權重與得令、得地、得勢計算強弱，再推導扶抑方向。'
  },
  'tiaohou-research': {
    id: 'tiaohou-research',
    name: '調候研究模型',
    status: 'research-only',
    confidence: 'research',
    conceptType: 'seasonal-analysis',
    ruleFamily: 'seasonal-day-analysis',
    baseOn: ['monthPillar', 'dayMaster', 'wholeChart'],
    scope: 'seasonal-whole-chart',
    ruleId: 'ANALYSIS_TIAOHOU_RESEARCH_001',
    version: '0.1.0',
    references: REFERENCES.seasonal,
    description: '調候需依季節寒暖燥濕與全局配置判斷；目前只建立 Profile 邊界，不輸出未完成的唯一取用結論。'
  },
  'tongguan-research': {
    id: 'tongguan-research',
    name: '通關研究模型',
    status: 'research-only',
    confidence: 'research',
    conceptType: 'mediator-analysis',
    ruleFamily: 'whole-chart-mediation',
    baseOn: ['wholeChart', 'interactions', 'elementDistribution'],
    scope: 'whole-chart',
    ruleId: 'ANALYSIS_TONGGUAN_RESEARCH_001',
    version: '0.1.0',
    references: REFERENCES.mediator,
    description: '通關需確認對立五行、介入五行的有效性及合沖刑害；目前只建立 Profile 邊界，不輸出未完成的唯一取用結論。'
  },
  'patterns-research': {
    id: 'patterns-research',
    name: '古典特殊格研究模型',
    status: 'research-only',
    confidence: 'research',
    conceptType: 'special-pattern',
    ruleFamily: 'whole-chart-pattern',
    baseOn: ['dayPillar', 'hourPillar', 'monthPillar', 'wholeChart'],
    scope: 'whole-chart',
    ruleId: 'PATTERN_RESEARCH_ONLY_001',
    version: '0.1.0',
    references: REFERENCES.patterns,
    description: '整局特殊格仍由 Bazi.Patterns 研究登錄；未完成成格與破格 predicate 前不宣告命中。'
  }
});

export const ANALYSIS_MODEL_CATALOG = Object.freeze(Object.values(MODEL_DEFINITIONS));

export const ANALYSIS_DIMENSIONS = Object.freeze([
  'monthCommander',
  'auxiliary',
  'useGod',
  'seasonal',
  'mediator',
  'patterns'
]);

export const ANALYSIS_MODEL_IDS = Object.freeze({
  monthCommander: ['bazi-js-human-element', 'san-ming-volume-2'],
  auxiliary: ['canonical-palm', 'san-ming-palm-research'],
  useGod: ['fuyi-canonical', 'tiaohou-research', 'tongguan-research'],
  seasonal: ['none', 'tiaohou-research'],
  mediator: ['none', 'tongguan-research'],
  patterns: ['research-registry', 'patterns-research']
});

export const ANALYSIS_RULE_IDS = Object.freeze({
  'bazi-js-human-element': 'STR_MONTH_COMMANDER_001',
  'san-ming-volume-2': 'STR_MONTH_COMMANDER_SANMING_002',
  'canonical-palm': 'AUX_CANONICAL_PALM_001',
  'san-ming-palm-research': 'AUX_SANMING_PALM_RESEARCH_001',
  'fuyi-canonical': 'STR_CANONICAL_DEFAULT',
  'tiaohou-research': 'ANALYSIS_TIAOHOU_RESEARCH_001',
  'tongguan-research': 'ANALYSIS_TONGGUAN_RESEARCH_001',
  'none': 'ANALYSIS_NONE_001',
  'research-registry': 'PATTERN_RESEARCH_ONLY_001',
  'patterns-research': 'PATTERN_RESEARCH_ONLY_001'
});

export function getAnalysisRuleId(modelId, dimension) {
  return ANALYSIS_RULE_IDS[modelId] || `ANALYSIS_${String(dimension).toUpperCase().replaceAll('-', '_')}_UNREGISTERED`;
}

function noDecisionModel(modelId, dimension, profileId) {
  const definition = MODEL_DEFINITIONS[modelId];
  return {
    ...(definition || {
      id: modelId,
      name: modelId,
      status: 'research-only',
      confidence: 'research',
      conceptType: 'analysis',
      ruleFamily: dimension,
      baseOn: ['wholeChart'],
      scope: 'whole-chart',
      ruleId: `ANALYSIS_${dimension.toUpperCase()}_UNREGISTERED`,
      version: '0.1.0',
      references: [],
      description: '尚未建立可審核的模型定義。'
    }),
    dimension,
    profileId,
    finalDecision: false,
    result: null,
    evidence: {
      matched: false,
      status: 'research-only',
      reason: '此 Profile 已選取研究模型，但目前不覆寫 canonical 結果；待完成可審核的全局判定函數。'
    }
  };
}

function selectedRule(profile, dimension) {
  const rule = profile?.rules?.analysis?.[dimension];
  return rule || { value: dimension === 'seasonal' || dimension === 'mediator' ? 'none' : 'research-registry', ruleId: 'PROFILE_ANALYSIS_DEFAULT_001', version: ANALYSIS_RULE_VERSION };
}

/**
 * 建立本次命盤實際採用的分析模型選擇與研究狀態。
 * @param {{profile: object, strength?: object}} options
 */
export function buildAnalysisResult({ profile, strength = null, auxiliary = null } = {}) {
  const profileId = profile?.id || 'canonical';
  const selected = Object.fromEntries(ANALYSIS_DIMENSIONS.map((dimension) => {
    const rule = selectedRule(profile, dimension);
    return [dimension, { ...rule, modelId: rule.value }];
  }));

  const useGodRule = selected.useGod;
  const useGodModel = useGodRule.modelId;
  const useGod = useGodModel === 'fuyi-canonical'
    ? {
        ...MODEL_DEFINITIONS['fuyi-canonical'],
        dimension: 'useGod',
        profileId,
        finalDecision: true,
        result: strength ? {
          score: strength.score,
          level: strength.level,
          favorableElements: strength.favorableElements,
          unfavorableElements: strength.unfavorableElements
        } : null,
        evidence: { matched: true, status: 'implemented', source: 'strength' }
      }
    : noDecisionModel(useGodModel, 'useGod', profileId);

  const monthCommander = MODEL_DEFINITIONS[selected.monthCommander.modelId]?.status === 'research-only'
    ? noDecisionModel(selected.monthCommander.modelId, 'monthCommander', profileId)
    : {
        ...MODEL_DEFINITIONS[selected.monthCommander.modelId],
        dimension: 'monthCommander',
        profileId,
        finalDecision: Boolean(strength?.monthCommander),
        result: strength?.monthCommander || null,
        evidence: strength?.monthCommander?.evidence || { matched: false, status: 'not-calculated' }
      };
  const auxiliaryModel = MODEL_DEFINITIONS[selected.auxiliary.modelId]?.status === 'research-only'
    ? noDecisionModel(selected.auxiliary.modelId, 'auxiliary', profileId)
    : {
        ...MODEL_DEFINITIONS[selected.auxiliary.modelId],
        dimension: 'auxiliary',
        profileId,
        finalDecision: Boolean(auxiliary),
        result: auxiliary || null,
        evidence: auxiliary?.model?.evidence || { matched: false, status: 'not-calculated' }
      };

  const models = {
    monthCommander,
    auxiliary: auxiliaryModel,
    useGod,
    seasonal: selected.seasonal.modelId === 'none'
      ? { id: 'none', dimension: 'seasonal', status: 'not-selected', finalDecision: false, result: null, evidence: { matched: false, status: 'not-selected' } }
      : noDecisionModel(selected.seasonal.modelId, 'seasonal', profileId),
    mediator: selected.mediator.modelId === 'none'
      ? { id: 'none', dimension: 'mediator', status: 'not-selected', finalDecision: false, result: null, evidence: { matched: false, status: 'not-selected' } }
      : noDecisionModel(selected.mediator.modelId, 'mediator', profileId),
    patterns: selected.patterns.modelId === 'research-registry'
      ? { id: 'research-registry', dimension: 'patterns', status: 'research-only', finalDecision: false, result: null, evidence: { matched: false, status: 'research-only', source: 'Bazi.Patterns' } }
      : noDecisionModel(selected.patterns.modelId, 'patterns', profileId)
  };

  return {
    schemaVersion: ANALYSIS_RULE_VERSION,
    profileId,
    profileName: profile?.name || 'canonical',
    selected,
    models,
    ruleId: ANALYSIS_SELECTION_RULE_ID,
    version: ANALYSIS_RULE_VERSION,
    evidence: {
      matched: true,
      profileId,
      selectedModelIds: Object.fromEntries(Object.entries(selected).map(([key, value]) => [key, value.modelId])),
      nonCanonicalModels: Object.values(models).filter((model) => model.status === 'research-only').map((model) => model.id)
    },
    description: 'Profile 只決定本次分析模型；研究模型若尚未完成全局判定，不會覆寫 canonical 結果。'
  };
}

export function getAnalysisModel(id) {
  return MODEL_DEFINITIONS[id] || null;
}

export function validateAnalysisProfileRules(profile) {
  const errors = [];
  for (const dimension of ANALYSIS_DIMENSIONS) {
    const rule = profile?.rules?.analysis?.[dimension];
    if (!rule) {
      errors.push(`rules.analysis.${dimension} is required`);
      continue;
    }
    if (!ANALYSIS_MODEL_IDS[dimension].includes(rule.value)) errors.push(`rules.analysis.${dimension}.value is invalid: ${rule.value}`);
    if (!rule.ruleId || !rule.version) errors.push(`rules.analysis.${dimension} requires ruleId/version`);
  }
  return errors;
}
