// 將既有命盤轉成神煞 matcher 共用的 context。

import { getNayin } from '../../core/constants/nayin-data.js';
import { STEM_INDEX, STEMS } from '../../core/constants/stems.js';
import { calculateXunKong } from './xunkong.js';

function toPillar(pillar, key) {
  const available = pillar && pillar.available !== false && pillar.stem && pillar.branch;
  if (!available) return { pillar: key, available: false, stem: null, branch: null, ganzhi: null };
  const ganzhi = pillar.ganzhi || `${pillar.stem}${pillar.branch}`;
  return {
    pillar: key,
    available: true,
    stem: pillar.stem,
    branch: pillar.branch,
    ganzhi,
    sexagenaryIndex: pillar.sexagenaryIndex ?? null,
    nayin: pillar.sexagenaryIndex === undefined ? null : getNayin(pillar.sexagenaryIndex)
  };
}

export function createShenShaContext(pillars, options = {}) {
  const normalized = {
    year: toPillar(pillars.year, 'year'),
    month: toPillar(pillars.month, 'month'),
    day: toPillar(pillars.day, 'day'),
    hour: toPillar(pillars.hour, 'hour')
  };
  const yearStemInfo = STEMS[STEM_INDEX[normalized.year.stem]] || {};
  const bases = {
    yearStem: normalized.year.stem,
    monthStem: normalized.month.stem,
    dayStem: normalized.day.stem,
    yearBranch: normalized.year.branch,
    monthBranch: normalized.month.branch,
    dayBranch: normalized.day.branch,
    dayPillar: normalized.day.ganzhi,
    yearPillar: normalized.year,
    dayPillarData: normalized.day
  };
  return {
    pillars: normalized,
    bases,
    gender: options.gender || null,
    yearStemYinYang: yearStemInfo.yinYang || null,
    dayXunKong: calculateXunKong(normalized.day.ganzhi),
    target: null
  };
}

export function getBaseValue(context, baseKey) {
  const value = context.bases[baseKey];
  if (value && typeof value === 'object') return value.ganzhi || value.branch || null;
  return value ?? null;
}

export function getPillarEntries(pillars) {
  return ['year', 'month', 'day', 'hour']
    .map((key) => toPillar(pillars[key], key))
    .filter((item) => item.available);
}

export function isBaseActive(context, baseKey) {
  return !context.activeBase || context.activeBase === baseKey;
}
