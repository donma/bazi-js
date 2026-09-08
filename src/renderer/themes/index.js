// Renderer 主題色彩 Tokens（Data-driven）
// 規範要求：不得把 theme 色碼散落在 Renderer 邏輯中。
// 內建三種主題：
// 1. modern-oriental（現代東方：象牙白、水墨深灰、朱砂紅、雅金色）
// 2. classic（典雅古典：仿古宣紙底色、老墨、丹青）
// 3. dark（夜闌深邃：玄青黑底、金字、琉璃藍點綴）

export const THEMES = {
  'modern-oriental': {
    id: 'modern-oriental',
    name: '現代東方',
    background: '#faf8f5',
    cardBg: '#ffffff',
    textPrimary: '#1f1f1f',
    textSecondary: '#3d3d3d',
    textMuted: '#5c5c5c',
    accent: '#a9321f', // 朱砂紅（加深，確保小字對比）
    gold: '#7d5f16',   // 雅金（加深，淺金在白底上對比不足）
    border: '#d9cfbf',
    borderDark: '#b8a88f',
    gridBg: '#f5f1eb',
    tagBg: '#f2eee9',
    elementColors: {
      '木': '#2d6a4f',
      '火': '#b23a22',
      '土': '#9c6644',
      '金': '#b38d38',
      '水': '#1d3557'
    }
  },

  'classic': {
    id: 'classic',
    name: '古典仿宣',
    background: '#f4ede1',
    cardBg: '#fdfbf7',
    textPrimary: '#1a1816',
    textSecondary: '#3f3830',
    textMuted: '#5f574a',
    accent: '#8a2b19',
    gold: '#7a5c14',
    border: '#d3c4ab',
    borderDark: '#b09a78',
    gridBg: '#ece3d2',
    tagBg: '#e6dcce',
    elementColors: {
      '木': '#26543d',
      '火': '#992d19',
      '土': '#845334',
      '金': '#997327',
      '水': '#162942'
    }
  },

  'dark': {
    id: 'dark',
    name: '玄黑幽邃',
    background: '#121417',
    cardBg: '#1c1f24',
    textPrimary: '#f2f4f7',
    textSecondary: '#c3c9d1',
    textMuted: '#8f96a0',
    accent: '#e06c53',
    gold: '#dfb15b',
    border: '#2c313a',
    borderDark: '#4a5160',
    gridBg: '#181b20',
    tagBg: '#252930',
    elementColors: {
      '木': '#40916c',
      '火': '#e06c53',
      '土': '#b08968',
      '金': '#dfb15b',
      '水': '#457b9d'
    }
  }
};

export function getTheme(themeName = 'modern-oriental') {
  return THEMES[themeName] || THEMES['modern-oriental'];
}
