// 可追溯古典資料摘要：供 UI、JSON 匯出與 AI Context 共用。
// 這裡只整理已計算的資料，不額外創造一套未驗證的斷語或計分法。

import { BRANCHES } from '../core/constants/branches.js';
import { STEMS, STEM_INDEX } from '../core/constants/stems.js';
import { elementRelation } from '../core/constants/elements.js';

export const CLASSICAL_SUMMARY_METHOD = 'classical-summary-derived';
export const CLASSICAL_SUMMARY_RULE_ID = 'SUMMARY_CLASSICAL_TRACEABLE_001';
export const CLASSICAL_SUMMARY_VERSION = '1.0.0';

const REFERENCES = Object.freeze([
  {
    sourceId: 'san-ming-tong-hui',
    title: '《三命通會》',
    locator: '卷二〈論人元司事〉、〈論胎元〉、〈論坐命官〉；卷三〈論空亡〉',
    url: 'https://zh.wikisource.org/zh-hant/三命通會/卷二'
  },
  {
    sourceId: 'san-ming-tong-hui',
    title: '《三命通會》',
    locator: '卷三〈論空亡〉',
    url: 'https://zh.wikisource.org/zh-hant/三命通會/卷三'
  },
  {
    sourceId: 'di-tian-sui-yan-wei',
    title: '《滴天髓闡微》',
    locator: '月令、人元與用神喜忌相關注解',
    url: 'https://zh.wikisource.org/zh-hant/滴天髓闡微'
  }
]);

function stemElement(stem) {
  return STEMS[STEM_INDEX[stem]]?.element || null;
}

function branchElement(branch) {
  return BRANCHES.find((item) => item.char === branch)?.element || null;
}

function palaceRecord(key, label, ruleId, value, baseOn, note) {
  return {
    id: key,
    label,
    value: value || null,
    ruleId,
    version: '1.1.0',
    tradition: 'classical-ziping-compatible',
    conceptType: 'auxiliary',
    ruleFamily: 'palace-and-embryo',
    baseOn,
    scope: key === 'mingGua' ? 'birth-year' : 'chart-auxiliary',
    category: 'auxiliary',
    confidence: key === 'mingGua' ? 'modern-common' : 'school-specific',
    references: REFERENCES.filter((item) => item.sourceId === 'san-ming-tong-hui'),
    description: note,
    variants: key === 'mingGong' || key === 'shenGong'
      ? [{ id: 'solar-term-over-month', description: '命宮、身宮另有中氣過宮與月建取法差異。' }, { id: 'zi-hour-boundary', description: '子時換日與時支邊界可能使宮位不同。' }]
      : [{ id: 'school-formula', description: '胎元、胎息在不同傳本與註家有算法差異。' }],
    researchNotes: {
      conflict: key !== 'mingGua',
      note
    },
    evidence: {
      matched: Boolean(value),
      sourceValue: value?.ganzhi || value?.groupName || null,
      basedOn: baseOn,
      calculation: note
    }
  };
}

function buildFiveCategory(result) {
  const source = result.strength.fiveCategory;
  if (!source) return null;
  const rows = ['use', 'joy', 'idle', 'adversary', 'taboo'].map((category) => {
    const item = source.byElement ? Object.values(source.byElement).find((entry) => entry.category === category) : null;
    const element = item?.element || source.groups?.[category]?.[0] || null;
    return {
      category,
      label: item?.label || category,
      element,
      relationToUse: item?.relationToUse || (element ? elementRelation(element, source.useElement) : null),
      strength: element ? result.strength.distribution[element] || null : null,
      seasonalState: element ? result.strength.seasonalStates[element] || null : null,
      description: item?.description || null
    };
  });
  return {
    ...source,
    method: source.method || source.modelId,
    rows,
    references: [
      ...source.references,
      {
        sourceId: 'di-tian-sui-yan-wei',
        title: '《滴天髓闡微》',
        locator: '喜神、忌神、仇神、閒神相關注解',
        url: 'https://zh.wikisource.org/zh-hant/滴天髓闡微'
      }
    ],
    evidence: {
      ...source.evidence,
      sourceScope: 'whole-chart strength model',
      categoryOrder: ['use', 'joy', 'idle', 'adversary', 'taboo'],
      rows
    }
  };
}

function buildMonthCommand(result) {
  const commander = result.strength.monthCommander;
  const hidden = result.hiddenStems?.month || [];
  const hiddenGods = result.tenGods?.hidden?.month || [];
  return {
    ...(commander || {}),
    hiddenStems: hidden.map((item, index) => ({
      ...item,
      element: stemElement(item.stem),
      tenGod: hiddenGods[index]?.tenGod || null
    })),
    monthPillar: result.pillars.month,
    previousJie: result.calendar.solarTerms.prevJie || null,
    evidence: {
      ...(commander?.evidence || {}),
      monthPillar: result.pillars.month.ganzhi,
      previousJie: result.calendar.solarTerms.prevJie || null,
      hiddenStems: hidden
    }
  };
}

function buildVoids(result) {
  const byDay = result.kongWang.byDay;
  const byYear = result.kongWang.byYear;
  return {
    method: 'six-jia-xun-kong',
    ruleId: 'AUX_KONGWANG_SIX_XUN_001',
    version: '1.0.0',
    tradition: 'classical-ziping',
    conceptType: 'auxiliary',
    ruleFamily: 'xun-kong',
    baseOn: ['dayPillar.sexagenaryIndex', 'yearPillar.sexagenaryIndex'],
    scope: 'day-and-year-pillar',
    category: 'void-branch',
    confidence: 'classical-derived',
    byDay,
    byYear,
    rows: [
      { id: 'day', label: '日空', sourcePillar: result.pillars.day.ganzhi, ...byDay },
      { id: 'year', label: '年空', sourcePillar: result.pillars.year.ganzhi, ...byYear }
    ],
    references: REFERENCES.filter((item) => item.locator.includes('空亡')),
    variants: [
      { id: 'day-xun', description: '以日柱旬空作主要空亡欄位。' },
      { id: 'year-xun', description: '年柱旬空另列為年空，僅作資料對照。' }
    ],
    researchNotes: {
      conflict: false,
      note: '旬空算法可由六十甲子索引重現；吉凶解釋不在此資料層決定。'
    },
    evidence: {
      matched: true,
      dayPillar: result.pillars.day.ganzhi,
      yearPillar: result.pillars.year.ganzhi,
      dayVoid: byDay.branches,
      yearVoid: byYear.branches,
      hitMatrix: { day: byDay.hits, year: byYear.hits }
    }
  };
}

function buildAuxiliary(result) {
  const values = result.auxiliary || {};
  const palaceRows = [
    palaceRecord('taiYuan', '胎元', 'AUX_TAIYUAN_001', values.taiYuan, ['monthPillar.stem', 'monthPillar.branch'], '月干進一位、月支進三位。'),
    palaceRecord('taiXi', '胎息', 'AUX_TAIXI_002', values.taiXi, ['dayPillar.stem', 'dayPillar.branch'], '日干取五合、日支取六合。'),
    palaceRecord('mingGong', '命宮', 'AUX_MINGGONG_003', values.mingGong, ['monthPillar.branch', 'hourPillar.branch', 'yearPillar.stem'], '命宮值以月數與時數的掌訣公式計算，天干用五虎遁。'),
    palaceRecord('shenGong', '身宮', 'AUX_SHENGONG_004', values.shenGong, ['monthPillar.branch', 'hourPillar.branch', 'yearPillar.stem'], '身宮值以月數與時數的掌訣公式計算，天干用五虎遁。')
  ];
  const matrix = palaceRows.map((row) => ({
    id: row.id,
    label: row.label,
    ganzhi: row.value?.ganzhi || null,
    stem: row.value?.stem || null,
    stemElement: stemElement(row.value?.stem),
    branch: row.value?.branch || null,
    branchElement: branchElement(row.value?.branch),
    nayin: row.value?.nayin || null,
    ruleId: row.ruleId
  }));
  return {
    method: 'auxiliary-palace-and-embryo',
    ruleId: 'AUX_CLASSICAL_AUXILIARY_001',
    version: '1.1.0',
    tradition: 'classical-ziping-compatible',
    conceptType: 'auxiliary',
    ruleFamily: 'palace-and-embryo',
    baseOn: ['monthPillar', 'dayPillar', 'hourPillar', 'yearPillar.stem'],
    scope: 'whole-chart-auxiliary',
    category: 'auxiliary',
    confidence: 'school-specific',
    palaceRows,
    matrix,
    mingGua: values.mingGua || null,
    elementDistribution: result.strength.distribution,
    seasonalStates: result.strength.seasonalStates,
    references: REFERENCES.filter((item) => item.sourceId === 'san-ming-tong-hui'),
    variants: [
      { id: 'ming-shen-palace', description: '命宮、身宮存在中氣過宮、月建與子時邊界差異。' },
      { id: 'tai-xi', description: '胎息常見以日干支天地合推算，但傳本對胎息有不同取法。' },
      { id: 'ming-gua-separate', description: '命卦屬八宅輔助法，不能當作子平核心宮位。' }
    ],
    researchNotes: {
      conflict: true,
      note: '矩陣集中呈現已實作欄位；不把輔助宮位直接轉成性格、醫療或財務斷語。'
    },
    evidence: {
      matched: true,
      palaceRows: matrix,
      hourAvailable: Boolean(result.pillars.hour.available),
      unknownHourHandling: result.pillars.hour.available ? null : '命宮、身宮保留 null，不猜算。'
    }
  };
}

export function buildClassicalSummary(result) {
  return {
    modelId: CLASSICAL_SUMMARY_METHOD,
    version: CLASSICAL_SUMMARY_VERSION,
    confidence: 'traceable-derived',
    tradition: 'classical-ziping-compatible',
    conceptType: 'summary',
    ruleFamily: 'classical-summary',
    baseOn: ['strength.fiveCategory', 'strength.monthCommander', 'kongWang', 'auxiliary'],
    scope: 'whole-chart',
    category: 'data-summary',
    ruleId: CLASSICAL_SUMMARY_RULE_ID,
    method: CLASSICAL_SUMMARY_METHOD,
    sections: ['fiveCategory', 'monthCommand', 'voids', 'auxiliary'],
    references: REFERENCES,
    description: '把扶抑五分類、月令人元司令、日空年空與輔助宮位整理成可驗證的資料摘要；不新增未經證實的斷語。',
    fiveCategory: buildFiveCategory(result),
    monthCommand: buildMonthCommand(result),
    voids: buildVoids(result),
    auxiliary: buildAuxiliary(result),
    variants: [
      { id: 'school-profile', description: '不同 Profile 可替換月令分日、用神與宮位算法；本摘要記錄本次實際採用結果。' }
    ],
    researchNotes: {
      conflict: true,
      note: '經典來源支持名目與判定範圍，但不代表五分類、分日表與宮位公式跨流派唯一。'
    },
    evidence: {
      matched: true,
      chartPillars: Object.fromEntries(Object.entries(result.pillars).map(([key, value]) => [key, value.ganzhi])),
      sectionEvidence: {
        fiveCategory: Boolean(result.strength.fiveCategory),
        monthCommand: Boolean(result.strength.monthCommander),
        voids: Boolean(result.kongWang),
        auxiliary: Boolean(result.auxiliary)
      }
    }
  };
}
