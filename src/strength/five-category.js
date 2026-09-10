// 用／喜／閒／仇／忌五分類
//
// 這不是另一套「神煞」，也不是所有子平流派都共同接受的固定答案。
// BaziJS 先把 canonical 扶抑模型選出的第一個 favorable element 視為用神，
// 再依五行生剋關係推導其餘四類。模型選擇與證據一併輸出，避免把推導結果
// 冒充成古籍中唯一的用神判法。

import { ELEMENTS, elementRelation } from '../core/constants/elements.js';

export const FIVE_CATEGORY_METHOD = 'canonical-use-derived';
export const FIVE_CATEGORY_RULE_ID = 'STR_FIVE_CATEGORY_CANONICAL_DERIVED';
export const FIVE_CATEGORY_VERSION = '1.0.0';

const CATEGORY_META = Object.freeze({
  use: { label: '用神', description: '本模型選定、用以平衡命局的五行。' },
  joy: { label: '喜神', description: '生助用神的五行。' },
  idle: { label: '閒神', description: '與用神沒有直接主要生剋方向的剩餘五行。' },
  adversary: { label: '仇神', description: '生助忌神、使忌神力量增強的五行。' },
  taboo: { label: '忌神', description: '直接制約或破壞用神的五行。' }
});

const REFERENCES = Object.freeze([
  'https://www.minglitang.com.au/learn/favourable-unfavourable',
  'docs/references/special-systems.md'
]);

function requireElement(element) {
  const data = ELEMENTS.find((item) => item.char === element);
  if (!data) throw new Error(`不支援的五行：${element}`);
  return data;
}

function categoryItem(element, category, useElement) {
  const meta = CATEGORY_META[category];
  return {
    element,
    category,
    label: meta.label,
    description: meta.description,
    relationToUse: elementRelation(element, useElement)
  };
}

/**
 * 由已選定的用神推導五分類。
 * @param {{useElement?: string, favorableElements?: string[], method?: string}} options
 */
export function calculateFiveElementCategories({
  useElement = null,
  favorableElements = [],
  method = FIVE_CATEGORY_METHOD
} = {}) {
  if (method !== FIVE_CATEGORY_METHOD) {
    throw new Error(`不支援的五分類方法：${method}`);
  }

  const selectedUseElement = useElement || favorableElements[0] || null;
  if (!selectedUseElement) return null;
  const useData = requireElement(selectedUseElement);
  const joyElement = useData.generatedBy;
  const tabooElement = useData.restrictedBy;
  const tabooData = requireElement(tabooElement);
  const adversaryElement = tabooData.generatedBy;
  const idleElement = ELEMENTS
    .map((item) => item.char)
    .find((element) => ![selectedUseElement, joyElement, tabooElement, adversaryElement].includes(element));

  const assignments = {
    [selectedUseElement]: categoryItem(selectedUseElement, 'use', selectedUseElement),
    [joyElement]: categoryItem(joyElement, 'joy', selectedUseElement),
    [idleElement]: categoryItem(idleElement, 'idle', selectedUseElement),
    [adversaryElement]: categoryItem(adversaryElement, 'adversary', selectedUseElement),
    [tabooElement]: categoryItem(tabooElement, 'taboo', selectedUseElement)
  };

  const groups = Object.fromEntries(Object.keys(CATEGORY_META).map((category) => [
    category,
    Object.values(assignments).filter((item) => item.category === category).map((item) => item.element)
  ]));

  return {
    modelId: FIVE_CATEGORY_METHOD,
    version: FIVE_CATEGORY_VERSION,
    confidence: 'model-derived',
    tradition: 'classical-ziping-compatible',
    conceptType: 'strength-derived',
    ruleFamily: 'use-god-five-category',
    baseOn: ['wholeChart', 'dayMaster', 'strength.favorableElements'],
    scope: 'whole-chart',
    category: 'analysis',
    ruleId: FIVE_CATEGORY_RULE_ID,
    method,
    useElement: selectedUseElement,
    selection: {
      basis: 'canonical-strength.favorableElements[0]',
      candidates: [...new Set(favorableElements)],
      note: '用神的選取仍依 profile 的強弱模型；本欄位只記錄本次模型如何展開五分類。'
    },
    byElement: assignments,
    groups,
    references: REFERENCES,
    description: '以 canonical 扶抑模型的第一個喜用五行作為用神，再按生剋關係展開用、喜、閒、仇、忌。',
    variants: [
      {
        id: 'school-selected-use',
        description: '其他流派可能先以調候、格局、通關或透干取用，導致五分類不同。'
      }
    ],
    researchNotes: {
      conflict: true,
      note: '五分類依賴用神選取；古典子平並沒有一份跨流派、固定五行排序可直接取代判局。'
    },
    evidence: {
      matched: true,
      selectedUseElement,
      derivation: [
        `${selectedUseElement}為用神`,
        `${joyElement}生${selectedUseElement}，列為喜神`,
        `${tabooElement}剋${selectedUseElement}，列為忌神`,
        `${adversaryElement}生${tabooElement}，列為仇神`,
        `${idleElement}為剩餘五行，列為閒神`
      ],
      relations: Object.fromEntries(Object.values(assignments).map((item) => [item.element, item.relationToUse]))
    }
  };
}
