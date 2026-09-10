import { elementRelation } from '../core/constants/elements.js';
import { STRENGTH_QI_LAYER_VERSION } from '../rules/versions.js';

export { STRENGTH_QI_LAYER_VERSION };

const ELEMENTS = Object.freeze(['木', '火', '土', '金', '水']);
const TRANSFORMATION_TYPES = new Set([
  'stem_combine',
  'six_combination',
  'triple_combination',
  'triple_meeting',
  'half_combination',
  'arch_combination'
]);

const round = (value) => Number(Number(value || 0).toFixed(1));

function partitionScores(elementScores, dayMasterElement) {
  let allyScore = 0;
  let enemyScore = 0;
  for (const [element, score] of Object.entries(elementScores)) {
    const relation = elementRelation(element, dayMasterElement);
    if (relation === 'same' || relation === 'generate') allyScore += score;
    else enemyScore += score;
  }
  return { allyScore: round(allyScore), enemyScore: round(enemyScore) };
}

/**
 * 建立五行氣數快照。快照只描述計算層，不把固定分數閾值解讀成特殊格局。
 */
export function buildQiSnapshot(elementScores, dayMasterElement) {
  const normalized = Object.fromEntries(ELEMENTS.map((element) => [element, Number(elementScores[element] || 0)]));
  const totalScore = Object.values(normalized).reduce((sum, score) => sum + score, 0);
  const partition = partitionScores(normalized, dayMasterElement);
  return {
    modelId: 'bazi-js-weighted-qi',
    version: STRENGTH_QI_LAYER_VERSION,
    distribution: Object.fromEntries(Object.entries(normalized).map(([element, score]) => [element, {
      score: round(score),
      percentage: totalScore > 0 ? round((score / totalScore) * 100) : 20
    }])),
    totalScore: round(totalScore),
    allyScore: partition.allyScore,
    enemyScore: partition.enemyScore,
    evidence: {
      matched: true,
      elements: ELEMENTS,
      calculation: '天干透出與地支藏干加權；此快照未套用特殊格局判定。'
    }
  };
}

function transformationReason(type, formation) {
  if (formation === 'complete') return `${type} 已在互動層形成完整結構；是否化氣仍需 Profile 的季節、透干與阻隔條件。`;
  if (formation === 'partial') return `${type} 只形成部分結構，先記為候選，不直接改寫五行氣數。`;
  return `${type} 屬虛拱或局部結構，缺少完整成化條件，不直接改寫五行氣數。`;
}

/**
 * 互動層只提供「轉化候選」證據。
 * canonical 目前不把合局直接當成已化，避免把結構命中誤當成全局成化。
 */
export function buildTransformationLayer(interactions = null, context = {}) {
  const candidates = [];
  let sequence = 0;
  for (const [layer, rows] of Object.entries(interactions || {})) {
    if (!Array.isArray(rows)) continue;
    for (const interaction of rows) {
      if (!TRANSFORMATION_TYPES.has(interaction.type)) continue;
      const targetElement = interaction.element || interaction.generates || null;
      if (!targetElement) continue;
      const formation = interaction.type === 'triple_combination' || interaction.type === 'triple_meeting'
        ? 'complete'
        : interaction.type === 'half_combination'
          ? 'partial'
          : 'partial';
      sequence += 1;
      candidates.push({
        id: `STR_TRANSFORMATION_${String(interaction.type).toUpperCase()}_${String(sequence).padStart(3, '0')}`,
        sourceLayer: layer,
        sourceType: interaction.type,
        name: interaction.name,
        chars: Array.isArray(interaction.chars) ? [...interaction.chars] : [],
        pillars: Array.isArray(interaction.pillars) ? [...interaction.pillars] : [],
        targetElement,
        formation,
        status: 'candidate',
        applied: false,
        confidence: 'structural-only',
        reason: transformationReason(interaction.name || interaction.type, formation),
        evidence: {
          matched: true,
          monthBranch: context.monthBranch || null,
          seasonalState: context.seasonalStates?.[targetElement] || null,
          completeStructure: formation === 'complete',
          requires: ['seasonal-support', '透干／得用', '無阻隔或破壞', 'profile-transformation-policy']
        }
      });
    }
  }

  return {
    modelId: 'conservative-structural-evidence',
    version: STRENGTH_QI_LAYER_VERSION,
    status: 'evidence-only',
    applied: [],
    candidates,
    evidence: {
      matched: candidates.length > 0,
      appliedCount: 0,
      candidateCount: candidates.length,
      reason: 'canonical 目前只記錄互動與成化候選；沒有足夠的 Profile 條件時不自動化氣。'
    }
  };
}

export function buildEffectiveQiSnapshot(elementScores, dayMasterElement, transformationLayer) {
  const snapshot = buildQiSnapshot(elementScores, dayMasterElement);
  return {
    ...snapshot,
    modelId: 'bazi-js-interaction-adjusted-qi',
    status: 'interaction-adjusted',
    transformationStatus: transformationLayer?.status || 'evidence-only',
    appliedTransformations: transformationLayer?.applied || [],
    evidence: {
      ...snapshot.evidence,
      interactionAdjustment: '目前僅套用既有六沖根氣折損；合局／會局仍保留為候選，不自動改變分布。'
    }
  };
}
