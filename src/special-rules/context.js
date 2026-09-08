const SEASON_BY_MONTH_BRANCH = Object.freeze({
  寅: 'spring', 卯: 'spring', 辰: 'spring',
  巳: 'summer', 午: 'summer', 未: 'summer',
  申: 'autumn', 酉: 'autumn', 戌: 'autumn',
  亥: 'winter', 子: 'winter', 丑: 'winter'
});

const SEASON_BRANCHES = Object.freeze({
  spring: Object.freeze(['寅', '卯', '辰']),
  summer: Object.freeze(['巳', '午', '未']),
  autumn: Object.freeze(['申', '酉', '戌']),
  winter: Object.freeze(['亥', '子', '丑'])
});

function normalizePillar(pillar) {
  if (!pillar) return { available: false, stem: null, branch: null, ganzhi: null };
  const stem = pillar.stem || null;
  const branch = pillar.branch || null;
  return {
    ...pillar,
    available: pillar.available !== false && Boolean(stem || branch || pillar.ganzhi),
    stem,
    branch,
    ganzhi: pillar.ganzhi || (stem && branch ? `${stem}${branch}` : null)
  };
}

export function createSpecialRuleContext(pillars, options = {}) {
  const normalized = {
    year: normalizePillar(pillars && pillars.year),
    month: normalizePillar(pillars && pillars.month),
    day: normalizePillar(pillars && pillars.day),
    hour: normalizePillar(pillars && pillars.hour)
  };
  const monthBranch = normalized.month.branch;
  const season = SEASON_BY_MONTH_BRANCH[monthBranch] || null;
  return {
    pillars: normalized,
    input: options.input || null,
    gender: options.gender || null,
    calendar: options.calendar || null,
    monthBranch,
    season,
    seasonBranches: season ? SEASON_BRANCHES[season] : [],
    seasonSource: 'month-branch (節令月令)'
  };
}

export { SEASON_BY_MONTH_BRANCH, SEASON_BRANCHES };
