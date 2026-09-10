// ShenSha 公開 API。

export { calculateShenSha, calculateShenShaOnPillar, calculateTransitShenSha, groupShenShaByPillar } from './engine.js';
export { SHENSHA_REGISTRY, getShenShaCatalog, getShenShaRule, validateShenShaRegistry } from './registry.js';
export { SHENSHA_CATALOG } from './catalog.js';
export { SHENSHA_INTERPRETATIONS } from './interpretations.js';
export { SHENSHA_PRESETS, getShenShaPreset, SHENSHA_CATEGORIES, SHENSHA_TIERS, SHENSHA_CONFIDENCES } from './constants.js';
export { calculateXunKong } from './utils/xunkong.js';
