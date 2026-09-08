// 藏干權重（子平法標準司權分配）
// 本氣、中氣、餘氣及其通常權重（百分比）

export const HIDDEN_STEMS_DATA = {
  '子': [
    { stem: '癸', role: 'primary', weight: 1.0, days: 30 }
  ],
  '丑': [
    { stem: '己', role: 'primary', weight: 0.6, days: 18 },
    { stem: '癸', role: 'secondary', weight: 0.25, days: 9 },
    { stem: '辛', role: 'residual', weight: 0.15, days: 3 }
  ],
  '寅': [
    { stem: '甲', role: 'primary', weight: 0.6, days: 16 },
    { stem: '丙', role: 'secondary', weight: 0.25, days: 7 },
    { stem: '戊', role: 'residual', weight: 0.15, days: 7 }
  ],
  '卯': [
    { stem: '乙', role: 'primary', weight: 1.0, days: 30 }
  ],
  '辰': [
    { stem: '戊', role: 'primary', weight: 0.6, days: 18 },
    { stem: '乙', role: 'secondary', weight: 0.25, days: 9 },
    { stem: '癸', role: 'residual', weight: 0.15, days: 3 }
  ],
  '巳': [
    { stem: '丙', role: 'primary', weight: 0.6, days: 16 },
    { stem: '庚', role: 'secondary', weight: 0.25, days: 9 },
    { stem: '戊', role: 'residual', weight: 0.15, days: 5 }
  ],
  '午': [
    { stem: '丁', role: 'primary', weight: 0.7, days: 20 },
    { stem: '己', role: 'secondary', weight: 0.3, days: 10 }
  ],
  '未': [
    { stem: '己', role: 'primary', weight: 0.6, days: 18 },
    { stem: '丁', role: 'secondary', weight: 0.25, days: 9 },
    { stem: '乙', role: 'residual', weight: 0.15, days: 3 }
  ],
  '申': [
    { stem: '庚', role: 'primary', weight: 0.6, days: 17 },
    { stem: '壬', role: 'secondary', weight: 0.25, days: 7 },
    { stem: '戊', role: 'residual', weight: 0.15, days: 6 }
  ],
  '酉': [
    { stem: '辛', role: 'primary', weight: 1.0, days: 30 }
  ],
  '戌': [
    { stem: '戊', role: 'primary', weight: 0.6, days: 18 },
    { stem: '辛', role: 'secondary', weight: 0.25, days: 9 },
    { stem: '丁', role: 'residual', weight: 0.15, days: 3 }
  ],
  '亥': [
    { stem: '壬', role: 'primary', weight: 0.7, days: 20 },
    { stem: '甲', role: 'secondary', weight: 0.3, days: 10 }
  ]
};

export function getHiddenStems(branchChar) {
  return HIDDEN_STEMS_DATA[branchChar] || [];
}
