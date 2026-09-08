// 十神速查與對應規則
// 比肩、劫財、食神、傷官、偏財、正財、七殺、正官、偏印、正印

export const TEN_GODS = [
  { id: 'friend',       short: '比', full: '比肩', type: 'same_polarity',   relation: 'same'     },
  { id: 'rob_wealth',   short: '劫', full: '劫財', type: 'diff_polarity',   relation: 'same'     },
  { id: 'eating_god',   short: '食', full: '食神', type: 'same_polarity',   relation: 'generate' },
  { id: 'hurting_officer', short: '傷', full: '傷官', type: 'diff_polarity', relation: 'generate' },
  { id: 'indirect_wealth', short: '偏財', full: '偏財', type: 'same_polarity', relation: 'restrict' },
  { id: 'direct_wealth',   short: '正財', full: '正財', type: 'diff_polarity', relation: 'restrict' },
  { id: 'seven_killings',  short: '殺', full: '七殺', type: 'same_polarity',   relation: 'counter'  },
  { id: 'direct_officer',  short: '官', full: '正官', type: 'diff_polarity',   relation: 'counter'  },
  { id: 'indirect_resource', short: '梟', full: '偏印', type: 'same_polarity', relation: 'drain'    },
  { id: 'direct_resource',   short: '印', full: '正印', type: 'diff_polarity', relation: 'drain'    }
];

import { STEM_INDEX, STEMS } from './stems.js';
import { elementRelation } from './elements.js';

// 計算 targetStem 對應 baseStem（日主）的十神
export function getTenGod(baseStemChar, targetStemChar) {
  const base = STEMS[STEM_INDEX[baseStemChar]];
  const target = STEMS[STEM_INDEX[targetStemChar]];
  if (!base || !target) return null;

  const samePolarity = (base.yinYang === target.yinYang);
  // base 對 target 的五行關係：
  // 若 base 和 target 同五行：
  if (base.element === target.element) {
    return samePolarity
      ? { id: 'friend', short: '比', full: '比肩' }
      : { id: 'rob_wealth', short: '劫', full: '劫財' };
  }

  // base 生 target (日主生食傷)
  const rel = elementRelation(base.element, target.element);
  if (rel === 'generate') {
    return samePolarity
      ? { id: 'eating_god', short: '食', full: '食神' }
      : { id: 'hurting_officer', short: '傷', full: '傷官' };
  }

  // base 剋 target (日主剋財)
  if (rel === 'restrict') {
    return samePolarity
      ? { id: 'indirect_wealth', short: '偏財', full: '偏財' }
      : { id: 'direct_wealth', short: '正財', full: '正財' };
  }

  // target 剋 base (官殺剋日主，即 base 被剋 counter)
  if (rel === 'counter') {
    return samePolarity
      ? { id: 'seven_killings', short: '殺', full: '七殺' }
      : { id: 'direct_officer', short: '官', full: '正官' };
  }

  // target 生 base (印星生日主，即 base 被生 drain)
  if (rel === 'drain') {
    return samePolarity
      ? { id: 'indirect_resource', short: '梟', full: '偏印' }
      : { id: 'direct_resource', short: '印', full: '正印' };
  }

  return null;
}
