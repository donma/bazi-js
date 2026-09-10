// 命卦／東四西四（八宅輔助資料）
//
// 命卦不是古典子平四柱的必要欄位，而是八宅系統常見的出生年輔助分類。
// 因此獨立放在 Auxiliary，不混入 ShenSha、SpecialPillar 或子平格局。
// 本 profile 採「立春切年 + 年末兩位數」算法；其他網站對跨世紀與 5 數處理
// 有差異，差異保留在 variants/researchNotes，不在 SDK 內假裝只有一個答案。

export const MING_GUA_METHOD = 'bazhai-ming-gua-last-two-digits';
export const MING_GUA_VERSION = '1.0.0';
export const MING_GUA_RULE_ID = 'AUX_MING_GUA_LAST_TWO_DIGITS';

const TRIGRAMS = Object.freeze({
  1: { name: '坎', symbol: '☵', element: '水', direction: '北', group: 'east', groupName: '東四命' },
  2: { name: '坤', symbol: '☷', element: '土', direction: '西南', group: 'west', groupName: '西四命' },
  3: { name: '震', symbol: '☳', element: '木', direction: '東', group: 'east', groupName: '東四命' },
  4: { name: '巽', symbol: '☴', element: '木', direction: '東南', group: 'east', groupName: '東四命' },
  6: { name: '乾', symbol: '☰', element: '金', direction: '西北', group: 'west', groupName: '西四命' },
  7: { name: '兌', symbol: '☱', element: '金', direction: '西', group: 'west', groupName: '西四命' },
  8: { name: '艮', symbol: '☶', element: '土', direction: '東北', group: 'west', groupName: '西四命' },
  9: { name: '離', symbol: '☲', element: '火', direction: '南', group: 'east', groupName: '東四命' }
});

const REFERENCES = Object.freeze([
  'https://www.d02.cn/tool/bazhai/',
  'https://m.k366.com/minggua/1984.htm',
  'https://guanyitang.com/tools/kua-number',
  'docs/references/special-systems.md'
]);

function reduceToNine(value) {
  const remainder = ((value % 9) + 9) % 9;
  return remainder === 0 ? 9 : remainder;
}

function normalizeGender(gender) {
  if (gender === 'male' || gender === 'female') return gender;
  throw new Error(`命卦需要 gender 為 male 或 female，收到：${gender}`);
}

/**
 * 計算八宅命卦。yearPillar.baziYear 優先，確保命卦與本次四柱採用的切年規則一致。
 * @param {{solarYear?: number, effectiveYear?: number, yearPillar?: {baziYear?: number}, gender: 'male'|'female', yearBoundary?: string}} options
 */
export function calculateMingGua({
  solarYear,
  effectiveYear,
  yearPillar = null,
  gender,
  yearBoundary = 'lichun'
} = {}) {
  const normalizedGender = normalizeGender(gender);
  const selectedYear = Number.isInteger(yearPillar?.baziYear)
    ? yearPillar.baziYear
    : Number.isInteger(effectiveYear)
      ? effectiveYear
      : solarYear;
  if (!Number.isInteger(selectedYear) || selectedYear < 1) {
    throw new Error('命卦需要有效的 solarYear/effectiveYear');
  }

  const yearLastTwo = ((selectedYear % 100) + 100) % 100;
  const rawNumber = normalizedGender === 'male'
    ? 100 - yearLastTwo
    : yearLastTwo - 4;
  const remainder = reduceToNine(rawNumber);
  const guaNumber = remainder === 5 ? (normalizedGender === 'male' ? 2 : 8) : remainder;
  const trigram = TRIGRAMS[guaNumber];

  return {
    modelId: MING_GUA_METHOD,
    version: MING_GUA_VERSION,
    confidence: 'modern-common',
    tradition: 'bazhai',
    conceptType: 'auxiliary',
    ruleFamily: 'ming-gua',
    baseOn: ['effectiveSolarYear', 'gender'],
    scope: 'birth-year',
    category: 'auxiliary',
    ruleId: MING_GUA_RULE_ID,
    method: MING_GUA_METHOD,
    yearBoundary,
    yearBasis: yearBoundary,
    effectiveYear: selectedYear,
    gender: normalizedGender,
    yearLastTwo,
    rawNumber,
    remainder,
    guaNumber,
    number: guaNumber,
    trigram: { ...trigram },
    group: trigram.group,
    groupName: trigram.groupName,
    references: REFERENCES,
    description: '以本命盤切年後的年份末兩位數與性別推算八宅命卦，並分類為東四命或西四命。',
    variants: [
      {
        id: 'full-year-sum',
        description: '部分現代工具改用西元完整年份數字和或 2000 年後另一套公式，可能造成命卦不同。'
      },
      {
        id: 'five-number',
        description: '餘數 5 常需依性別寄卦：男寄坤、女寄艮；這裡明確記錄轉換。'
      }
    ],
    researchNotes: {
      conflict: true,
      note: '命卦屬八宅輔助法，不是子平四柱的統一核心規則；跨世紀、立春切年及餘 5 處理需逐 profile 指定。',
      selectedVariant: 'last-two-digits-with-5-gender-mapping',
      comparisonNote: '網路抽樣資料對 2020 女性命卦有互相矛盾的表格；本 SDK 依公式與多個對照案例採 兌（西四命），不把矛盾來源刪除。'
    },
    evidence: {
      matched: true,
      yearBoundary,
      effectiveYear: selectedYear,
      formula: normalizedGender === 'male'
        ? `男命：100 - ${yearLastTwo} = ${rawNumber}；取 1–9 餘數 ${remainder}`
        : `女命：${yearLastTwo} - 4 = ${rawNumber}；取 1–9 餘數 ${remainder}`,
      fiveHandling: remainder === 5 ? `餘數 5 按性別寄${normalizedGender === 'male' ? '坤（2）' : '艮（8）'}` : '無餘數 5 寄卦轉換',
      targetValue: `${trigram.name}（${trigram.groupName}）`
    }
  };
}
