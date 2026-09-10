const RESOLVER_VERSION = '0.1.0';
const CLASSICAL_ZIPING = 'classical-ziping';

const RESEARCH_MODELS = Object.freeze([
  {
    modelId: 'geju-research',
    name: '格局取用研究模型',
    ruleId: 'ANALYSIS_GEJU_RESEARCH_001',
    description: '依月令、透干、成格與破格條件提出候選；目前尚未完成全局 predicate。'
  },
  {
    modelId: 'tiaohou-research',
    name: '調候取用研究模型',
    ruleId: 'ANALYSIS_TIAOHOU_RESEARCH_001',
    description: '依寒暖燥濕與季節配置提出候選；目前不下唯一取用決定。'
  },
  {
    modelId: 'tongguan-research',
    name: '通關取用研究模型',
    ruleId: 'ANALYSIS_TONGGUAN_RESEARCH_001',
    description: '依對立五行、介入五行與合沖刑害提出候選；目前不下唯一取用決定。'
  },
  {
    modelId: 'conformity-research',
    name: '從格／專旺研究模型',
    ruleId: 'ANALYSIS_CONFORMITY_RESEARCH_001',
    description: '特殊強弱與從化條件尚須獨立驗證，不由強弱閾值直接宣告。'
  }
]);

function researchCandidate(model, result = null) {
  return {
    modelId: model.modelId,
    name: model.name,
    ruleId: model.ruleId,
    version: RESOLVER_VERSION,
    tradition: CLASSICAL_ZIPING,
    status: 'research-only',
    confidence: 'research',
    finalDecision: false,
    result,
    evidence: {
      matched: false,
      status: 'research-only',
      reason: model.description
    }
  };
}

/**
 * 統一多模型用神輸出。resolver 不會把研究模型的候選假裝成 canonical 結論。
 */
export function buildUseGodResolver({ profile = null, strength = null, patterns = null } = {}) {
  const selectedModelId = profile?.rules?.analysis?.useGod?.value || 'fuyi-canonical';
  const canonical = {
    modelId: 'fuyi-canonical',
    name: 'canonical 扶抑模型',
    ruleId: 'STR_CANONICAL_DEFAULT',
    version: '1.0.0',
    tradition: CLASSICAL_ZIPING,
    status: 'implemented',
    confidence: 'model-derived',
    finalDecision: Boolean(strength),
    result: strength ? {
      score: strength.score,
      level: strength.level,
      favorableElements: strength.favorableElements,
      unfavorableElements: strength.unfavorableElements
    } : null,
    evidence: {
      matched: Boolean(strength),
      status: 'implemented',
      source: 'strength.decision',
      reason: '由 BaziJS canonical 扶抑模型提供目前唯一已實作的用神方向。'
    }
  };
  const candidates = [canonical, ...RESEARCH_MODELS.map((model) => researchCandidate(model, model.modelId === 'geju-research' && patterns ? {
    candidateCount: patterns.regular?.evidence?.candidateCount || 0,
    candidates: (patterns.regular?.candidates || []).filter((candidate) => candidate.matched).map((candidate) => candidate.id)
  } : null))];
  const selected = candidates.find((candidate) => candidate.modelId === selectedModelId) || null;
  const hasResearchSelection = selected?.status === 'research-only';
  const conflicts = hasResearchSelection
    ? [{
        type: 'unresolved-model-selection',
        models: [selectedModelId],
        status: 'undetermined',
        reason: '所選 Profile 的模型尚未完成可審核的全局判定，因此不覆寫 canonical 結果。'
      }]
    : [];

  return {
    modelId: 'multi-model-use-god-resolver',
    version: RESOLVER_VERSION,
    tradition: CLASSICAL_ZIPING,
    profileId: profile?.id || 'canonical',
    selectedModelId,
    status: hasResearchSelection ? 'research-only' : 'implemented',
    candidates,
    conflicts,
    finalDecision: selected?.status === 'implemented' && selected.finalDecision
      ? { modelId: selected.modelId, result: selected.result }
      : null,
    evidence: {
      matched: Boolean(selected),
      candidateCount: candidates.length,
      unresolvedModels: candidates.filter((candidate) => candidate.status === 'research-only').map((candidate) => candidate.modelId),
      rule: '只採用明確選取且已實作的模型；研究模型保留 candidate／conflict，不自動合併。'
    }
  };
}
