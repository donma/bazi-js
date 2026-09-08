// Renderer 尺寸與排版規格 Presets
// 1. full: 完整大盤（含四柱、十神、藏干、五行、長生、胎元命宮、大運、神煞）
// 2. mobile-share: 行動社群分享圖（垂直長條型，易於手機螢幕閱覽與轉發）
// 3. a4: 標準列印規格比例（寬 800, 高 1130）
// 4. compact: 緊湊型卡片（四柱主盤與強弱得分）

export const PRESETS = {
  'full': {
    id: 'full',
    name: '全覽主盤',
    width: 960,
    height: 980,
    includePillars: true,
    includeStrength: true,
    includeInteractions: true,
    includeShenSha: true,
    includeLuckCycles: true,
    includeAuxiliary: true
  },

  'mobile-share': {
    id: 'mobile-share',
    name: '社群直式分享',
    width: 640,
    height: 1100,
    includePillars: true,
    includeStrength: true,
    includeInteractions: false,
    includeShenSha: true,
    includeLuckCycles: true,
    includeAuxiliary: true
  },

  'a4': {
    id: 'a4',
    name: 'A4 列印版式',
    width: 800,
    height: 1130,
    includePillars: true,
    includeStrength: true,
    includeInteractions: true,
    includeShenSha: true,
    includeLuckCycles: true,
    includeAuxiliary: true
  },

  'compact': {
    id: 'compact',
    name: '精簡微卡',
    width: 600,
    height: 480,
    includePillars: true,
    includeStrength: true,
    includeInteractions: false,
    includeShenSha: false,
    includeLuckCycles: false,
    includeAuxiliary: false
  }
};

export function getPreset(presetName = 'full') {
  return PRESETS[presetName] || PRESETS['full'];
}
