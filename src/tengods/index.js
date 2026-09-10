// 十神計算模組
// 以日主（日干）為基準，計算四柱天干與各支藏干的十神

import { getTenGod } from '../core/constants/ten-gods-data.js';
import { getHiddenStems } from '../core/constants/hidden-stems-data.js';
import { TEN_GOD_INTERPRETATIONS, HIDDEN_ROLE_INTERPRETATIONS } from './interpretations.js';

const withTenGodInterpretation = (tenGod) => tenGod
  ? { ...tenGod, interpretation: tenGod.interpretation || TEN_GOD_INTERPRETATIONS[tenGod.id] || '' }
  : tenGod;

export function calculateChartTenGods(pillars) {
  const dayMaster = pillars.day.stem;

  // 四柱天干十神
  const stems = {
    year: withTenGodInterpretation(getTenGod(dayMaster, pillars.year.stem)),
    month: withTenGodInterpretation(getTenGod(dayMaster, pillars.month.stem)),
    day: withTenGodInterpretation({ id: 'day_master', short: '日主', full: '日主' }),
    hour: pillars.hour.available ? withTenGodInterpretation(getTenGod(dayMaster, pillars.hour.stem)) : null
  };

  // 各地支藏干及其對應十神
  const calculateBranchTenGods = (branchChar) => {
    if (!branchChar) return [];
    const hidden = getHiddenStems(branchChar);
    return hidden.map(h => ({
      stem: h.stem,
      role: h.role, // 'primary' | 'secondary' | 'residual'
      weight: h.weight,
      days: h.days,
      tenGod: withTenGodInterpretation(getTenGod(dayMaster, h.stem)),
      roleInterpretation: HIDDEN_ROLE_INTERPRETATIONS[h.role] || ''
    }));
  };

  const hidden = {
    year: calculateBranchTenGods(pillars.year.branch),
    month: calculateBranchTenGods(pillars.month.branch),
    day: calculateBranchTenGods(pillars.day.branch),
    hour: pillars.hour.available ? calculateBranchTenGods(pillars.hour.branch) : []
  };

  return {
    dayMaster,
    stems,
    hidden
  };
}

export { TEN_GOD_INTERPRETATIONS, HIDDEN_ROLE_INTERPRETATIONS } from './interpretations.js';
