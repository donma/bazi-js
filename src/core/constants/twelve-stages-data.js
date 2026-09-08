// 十二長生歷程表
// 長生、沐浴、冠帶、臨官、帝旺、衰、病、死、墓、絕、胎、養
// 陽干順行，陰干逆行

export const STAGES = [
  '長生', '沐浴', '冠帶', '臨官', '帝旺', '衰',
  '病', '死', '墓', '絕', '胎', '養'
];

export const STAGE_IDS = [
  'chang_sheng', 'mu_yu', 'guan_dai', 'lin_guan', 'di_wang', 'shuai',
  'bing', 'si', 'mu', 'jue', 'tai', 'yang'
];

// 各天干的長生地支
// 陽干：甲長生在亥（順行）、丙戊長生在寅（順行）、庚長生在巳（順行）、壬長生在申（順行）
// 陰干：乙長生在午（逆行）、丁己長生在酉（逆行）、辛長生在子（逆行）、癸長生在卯（逆行）
export const STEM_CHANGSHENG_MAP = {
  '甲': { startBranch: '亥', forward: true  },
  '乙': { startBranch: '午', forward: false },
  '丙': { startBranch: '寅', forward: true  },
  '丁': { startBranch: '酉', forward: false },
  '戊': { startBranch: '寅', forward: true  },
  '己': { startBranch: '酉', forward: false },
  '庚': { startBranch: '巳', forward: true  },
  '辛': { startBranch: '子', forward: false },
  '壬': { startBranch: '申', forward: true  },
  '癸': { startBranch: '卯', forward: false }
};

import { BRANCH_INDEX } from './branches.js';

export function getTwelveStage(stemChar, branchChar) {
  const rule = STEM_CHANGSHENG_MAP[stemChar];
  if (!rule) return null;
  const startIdx = BRANCH_INDEX[rule.startBranch];
  const targetIdx = BRANCH_INDEX[branchChar];
  if (targetIdx === undefined) return null;

  let step;
  if (rule.forward) {
    step = (targetIdx - startIdx + 12) % 12;
  } else {
    step = (startIdx - targetIdx + 12) % 12;
  }
  return {
    id: STAGE_IDS[step],
    name: STAGES[step],
    step
  };
}
