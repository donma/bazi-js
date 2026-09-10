// 空亡計算模組
// 計算日柱旬空（最主要）與年柱旬空

import { getKongWangInfo } from './kongwang-data.js';

export function calculateChartKongWang(pillars) {
  const dayKong = getKongWangInfo(pillars.day.sexagenaryIndex);
  const yearKong = getKongWangInfo(pillars.year.sexagenaryIndex);

  // 檢查四柱中哪些地支落入空亡
  const checkHits = (kongBranches) => ({
    year: kongBranches.includes(pillars.year.branch),
    month: kongBranches.includes(pillars.month.branch),
    day: kongBranches.includes(pillars.day.branch),
    hour: pillars.hour.available ? kongBranches.includes(pillars.hour.branch) : false
  });

  const toRecord = (source, pillar) => ({
    method: 'six-jia-xun-kong',
    ruleId: 'AUX_KONGWANG_SIX_XUN_001',
    version: '1.0.0',
    tradition: 'classical-ziping',
    conceptType: 'auxiliary',
    ruleFamily: 'xun-kong',
    baseOn: [pillar, `${pillar}.sexagenaryIndex`],
    scope: 'pillar-xun',
    category: 'void-branch',
    confidence: 'classical-derived',
    pillar,
    sexagenaryIndex: pillars[pillar].sexagenaryIndex,
    xunName: source.xunName,
    xunStart: source.xunStart,
    xunEnd: source.xunEnd,
    branches: source.branches,
    hits: checkHits(source.branches),
    references: [
      {
        sourceId: 'san-ming-tong-hui',
        title: '《三命通會》',
        locator: '卷三〈論空亡〉',
        url: 'https://zh.wikisource.org/zh-hant/三命通會/卷三'
      }
    ],
    variants: [
      { id: 'day-based', description: '日柱旬空是子平排盤最常見的主判定。' },
      { id: 'year-based', description: '年柱旬空可另列為年空，不能與日空混為同一結果。' },
      { id: 'void-branch-interpretation', description: '空亡是否成立及其吉凶，仍需依流派與全局，不由命中兩支單獨斷定。' }
    ],
    researchNotes: {
      conflict: false,
      note: '本欄只計算六甲旬中未配出的兩個地支；不直接推導吉凶。'
    },
    evidence: {
      matched: true,
      sourcePillar: pillars[pillar].ganzhi,
      xun: source.xunName,
      algorithm: 'sexagenary-index-to-six-xun',
      voidBranches: source.branches,
      hits: checkHits(source.branches)
    }
  });

  return {
    byDay: {
      ...toRecord(dayKong, 'day')
    },
    byYear: {
      ...toRecord(yearKong, 'year')
    }
  };
}
