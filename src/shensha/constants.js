// ShenSha vNext 的共用常數與 preset 定義。

export const SHENSHA_CATEGORIES = Object.freeze(['auspicious', 'inauspicious', 'neutral']);
export const SHENSHA_TIERS = Object.freeze(['core', 'extended', 'optional']);
export const SHENSHA_CONFIDENCES = Object.freeze([
  'classical',
  'traditional',
  'modern-common',
  'school-specific',
  'folk',
  'experimental'
]);
export const PILLAR_KEYS = Object.freeze(['year', 'month', 'day', 'hour']);

export const SHENSHA_PRESETS = Object.freeze({
  minimal: Object.freeze({ id: 'minimal', tiers: ['core'], excludeExperimental: true }),
  classical: Object.freeze({ id: 'classical', tiers: ['core', 'extended'], excludeExperimental: true }),
  full: Object.freeze({ id: 'full', tiers: ['core', 'extended', 'optional'], excludeExperimental: true })
});

export function getShenShaPreset(name = 'classical') {
  return SHENSHA_PRESETS[name] || SHENSHA_PRESETS.classical;
}
