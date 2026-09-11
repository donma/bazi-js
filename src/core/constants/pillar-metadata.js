// 四柱干支的公開屬性摘要。
// 保留 yinYang 的英文枚舉供程式判定，另提供中文標籤供 API、Renderer 與 Demo 共用。

import { STEMS, STEM_INDEX } from './stems.js';
import { BRANCHES, BRANCH_INDEX } from './branches.js';

const YIN_YANG_LABELS = Object.freeze({
  yin: '陰',
  yang: '陽'
});

function buildLabel(item) {
  if (!item) return null;
  return `${YIN_YANG_LABELS[item.yinYang] || item.yinYang || ''}${item.element || ''}`;
}

export function getStemInfo(stemChar) {
  const item = STEMS[STEM_INDEX[stemChar]];
  if (!item) return null;
  return {
    id: item.id,
    char: item.char,
    pinyin: item.pinyin,
    element: item.element,
    yinYang: item.yinYang,
    yinYangLabel: YIN_YANG_LABELS[item.yinYang] || item.yinYang,
    label: buildLabel(item)
  };
}

export function getBranchInfo(branchChar) {
  const item = BRANCHES[BRANCH_INDEX[branchChar]];
  if (!item) return null;
  return {
    id: item.id,
    char: item.char,
    pinyin: item.pinyin,
    element: item.element,
    yinYang: item.yinYang,
    yinYangLabel: YIN_YANG_LABELS[item.yinYang] || item.yinYang,
    label: buildLabel(item),
    zodiac: item.zodiac
  };
}

export function getPillarMetadata(stemChar, branchChar) {
  return {
    stemInfo: getStemInfo(stemChar),
    branchInfo: getBranchInfo(branchChar)
  };
}

