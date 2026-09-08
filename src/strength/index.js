// 五行強弱引擎（Strength Engine）
// 子平八字核心量化與性徵分析：
// 拒絕單純點算五行個數！
// 全面納入：
// 1. 得令（月令司權、月令本氣生助）：得令者權重高達 40~50%
// 2. 得地（地支通根：本氣根、中氣根、餘氣根與長生祿旺庫）：通根力量量化
// 3. 得勢（天干透出比劫與印星生助）：生、助日主天干透出
// 4. 失勢（剋洩耗：官殺剋、食傷洩、財星耗）
// 5. 刑沖破害對根氣之損耗（沖則根損 50%~70%，刑穿亦削弱）
// 6. 三合/三會/六合化氣對五行力量之轉化
// 7. 同黨（比劫+印星） vs 異黨（食傷+財星+官殺）得失分計算
// 8. 判定層級：極強(從強/專旺)、偏強、中和平衡、偏弱、極弱(從格/從殺從財從兒)
// 9. 喜用神與忌神推導（扶抑、通關、調候）
// 10. 輸出完整 evidence 證據鏈

import { STEMS, STEM_INDEX } from '../core/constants/stems.js';
import { BRANCHES, BRANCH_INDEX } from '../core/constants/branches.js';
import { getHiddenStems } from '../core/constants/hidden-stems-data.js';
import { elementRelation, ELEMENTS } from '../core/constants/elements.js';

// 月令五行旺衰係數（旺=1.0, 相=0.8, 休=0.4, 囚=0.2, 死=0.1）
// 寅卯月：木旺、火相、水休、金囚、土死
// 巳午月：火旺、土相、木休、水囚、金死
// 申酉月：金旺、水相、土休、火囚、木死
// 亥子月：水旺、木相、金休、土囚、火死
// 辰戌丑未月：土旺、金相、火休、木囚、水死
const SEASON_STATES = {
  '寅': { '木': '旺', '火': '相', '水': '休', '金': '囚', '土': '死' },
  '卯': { '木': '旺', '火': '相', '水': '休', '金': '囚', '土': '死' },
  '辰': { '土': '旺', '金': '相', '火': '休', '木': '囚', '水': '死' },
  '巳': { '火': '旺', '土': '相', '木': '休', '水': '囚', '金': '死' },
  '午': { '火': '旺', '土': '相', '木': '休', '水': '囚', '金': '死' },
  '未': { '土': '旺', '金': '相', '火': '休', '木': '囚', '水': '死' },
  '申': { '水': '相', '金': '旺', '土': '休', '火': '囚', '木': '死' },
  '酉': { '金': '旺', '水': '相', '土': '休', '火': '囚', '木': '死' },
  '戌': { '土': '旺', '金': '相', '火': '休', '木': '囚', '水': '死' },
  '亥': { '水': '旺', '木': '相', '金': '休', '土': '囚', '火': '死' },
  '子': { '水': '旺', '木': '相', '金': '休', '土': '囚', '火': '死' },
  '丑': { '土': '旺', '金': '相', '火': '休', '木': '囚', '水': '死' }
};

const STATE_FACTOR = {
  '旺': 1.2,
  '相': 1.0,
  '休': 0.6,
  '囚': 0.3,
  '死': 0.1
};

// 人元司令分野：以「節」為月界，按節後經過的整日選出當月值令藏干。
// 這是細化 evidence，不取代整體強弱模型；各家在巳、申、亥等月的分日
// 有差異，因此把採用的分段與 elapsedDays 一併輸出，讓使用端可追溯。
export const MONTH_COMMAND_PHASES = Object.freeze({
  '寅': [{ stem: '戊', days: 7 }, { stem: '丙', days: 7 }, { stem: '甲', days: 16 }],
  '卯': [{ stem: '甲', days: 10 }, { stem: '乙', days: 20 }],
  '辰': [{ stem: '乙', days: 9 }, { stem: '癸', days: 3 }, { stem: '戊', days: 18 }],
  '巳': [{ stem: '戊', days: 7 }, { stem: '庚', days: 7 }, { stem: '丙', days: 16 }],
  '午': [{ stem: '丙', days: 10 }, { stem: '己', days: 9 }, { stem: '丁', days: 11 }],
  '未': [{ stem: '丁', days: 9 }, { stem: '乙', days: 3 }, { stem: '己', days: 18 }],
  '申': [{ stem: '戊', days: 7 }, { stem: '壬', days: 7 }, { stem: '庚', days: 16 }],
  '酉': [{ stem: '庚', days: 10 }, { stem: '辛', days: 20 }],
  '戌': [{ stem: '辛', days: 9 }, { stem: '丁', days: 3 }, { stem: '戊', days: 18 }],
  '亥': [{ stem: '戊', days: 7 }, { stem: '甲', days: 5 }, { stem: '壬', days: 18 }],
  '子': [{ stem: '壬', days: 10 }, { stem: '癸', days: 20 }],
  '丑': [{ stem: '癸', days: 9 }, { stem: '辛', days: 3 }, { stem: '己', days: 18 }]
});

export function calculateMonthCommander(monthBranch, elapsedDays) {
  const phases = MONTH_COMMAND_PHASES[monthBranch];
  if (!phases || !Number.isFinite(elapsedDays)) return null;

  const wholeDays = Math.max(0, Math.floor(elapsedDays));
  let cursor = 0;
  let phaseIndex = phases.length - 1;
  for (let index = 0; index < phases.length; index++) {
    cursor += phases[index].days;
    if (wholeDays < cursor) {
      phaseIndex = index;
      break;
    }
  }

  const phase = phases[phaseIndex];
  const stem = STEMS[STEM_INDEX[phase.stem]];
  return {
    stem: phase.stem,
    element: stem ? stem.element : null,
    monthBranch,
    elapsedDays: wholeDays,
    phase: phaseIndex + 1,
    phaseCount: phases.length,
    phaseDays: phase.days,
    phases: phases.map((item) => ({ ...item })),
    algorithm: 'jie-after-whole-days'
  };
}

export function calculateStrength(pillars, interactions = null, calendarContext = {}) {
  const dayMasterStem = pillars.day.stem;
  const dayMasterData = STEMS[STEM_INDEX[dayMasterStem]];
  const dmElement = dayMasterData.element;

  const evidence = [];

  // ================= 1. 五行基礎得分（天干透出 + 地支藏干司權） =================
  // 總權重基準設定為 100 分：
  // 天干：年干 8分、月干 12分、時干 10分（日主不計自身透出，日主為受測主體）
  // 地支：月令地支 40分（八字最重提綱）、日支 15分、時支 15分、年支 10分
  const elementScores = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

  // 天干透出計分
  const stemWeights = [
    { pillar: 'year', stem: pillars.year.stem, weight: 8 },
    { pillar: 'month', stem: pillars.month.stem, weight: 12 },
    ...(pillars.hour.available ? [{ pillar: 'hour', stem: pillars.hour.stem, weight: 10 }] : [])
  ];

  for (const item of stemWeights) {
    const el = STEMS[STEM_INDEX[item.stem]].element;
    elementScores[el] += item.weight;
    evidence.push({
      ruleId: 'STR_STEM_TRANSPARENCY',
      pillar: item.pillar,
      effect: item.weight,
      element: el,
      reason: `${item.pillar}干【${item.stem}】透出，增強五行【${el}】力量 ${item.weight} 分`
    });
  }

  // 地支藏干加權計分
  const branchWeights = [
    { pillar: 'month', branch: pillars.month.branch, baseWeight: 40 },
    { pillar: 'day', branch: pillars.day.branch, baseWeight: 15 },
    { pillar: 'year', branch: pillars.year.branch, baseWeight: 10 },
    ...(pillars.hour.available ? [{ pillar: 'hour', branch: pillars.hour.branch, baseWeight: 15 }] : [])
  ];

  // 檢查地支是否有沖（沖則損其藏干力量 40%）
  const clashedBranches = new Set();
  if (interactions && interactions.branches) {
    for (const bInter of interactions.branches) {
      if (bInter.type === 'six_clash') {
        bInter.chars.forEach(c => clashedBranches.add(c));
      }
    }
  }

  for (const item of branchWeights) {
    const hiddenList = getHiddenStems(item.branch);
    let clashDamp = clashedBranches.has(item.branch) ? 0.65 : 1.0;

    for (const h of hiddenList) {
      const el = STEMS[STEM_INDEX[h.stem]].element;
      const score = item.baseWeight * h.weight * clashDamp;
      elementScores[el] += score;
      evidence.push({
        ruleId: 'STR_BRANCH_ROOT',
        pillar: item.pillar,
        branch: item.branch,
        hiddenStem: h.stem,
        effect: Number(score.toFixed(1)),
        element: el,
        reason: `${item.pillar}支【${item.branch}】藏干【${h.stem}】(${h.role}) 提供五行【${el}】氣數 ${score.toFixed(1)} 分${clashDamp < 1.0 ? '（受沖折損）' : ''}`
      });
    }
  }

  // ================= 2. 得令判定（得月令本氣或相生） =================
  const monthBranch = pillars.month.branch;
  const monthState = (SEASON_STATES[monthBranch] && SEASON_STATES[monthBranch][dmElement]) || '休';
  const monthStateFactor = STATE_FACTOR[monthState] || 0.6;
  const deLing = (monthState === '旺' || monthState === '相');

  const elapsedDays = Number.isFinite(calendarContext.currentJD) && calendarContext.prevJie && Number.isFinite(calendarContext.prevJie.jdUT)
    ? Math.max(0, calendarContext.currentJD - calendarContext.prevJie.jdUT)
    : null;
  const monthCommander = calculateMonthCommander(monthBranch, elapsedDays);

  evidence.push({
    ruleId: 'STR_DE_LING',
    effect: deLing ? 15 : -15,
    reason: `日主五行【${dmElement}】生於【${monthBranch}】月，處於【${monthState}】地（係數 ${monthStateFactor}），判定為【${deLing ? '得令' : '不得令'}】`
  });

  // ================= 3. 得地判定（地支通根情況） =================
  // 檢查日主同五行在四支之藏干（本氣通根、中餘氣根）
  let rootCount = 0;
  let primaryRootCount = 0;
  for (const item of branchWeights) {
    const hiddenList = getHiddenStems(item.branch);
    for (const h of hiddenList) {
      const el = STEMS[STEM_INDEX[h.stem]].element;
      if (el === dmElement) {
        rootCount++;
        if (h.role === 'primary') primaryRootCount++;
      }
    }
  }
  const deDi = (primaryRootCount >= 1 || rootCount >= 2);
  evidence.push({
    ruleId: 'STR_DE_DI',
    effect: deDi ? 12 : -10,
    reason: `日主在地支尋得本氣根 ${primaryRootCount} 處、其餘根氣 ${rootCount - primaryRootCount} 處，判定為【${deDi ? '得地（通根有力）' : '不得地（無根或虛浮）'}】`
  });

  // ================= 4. 得勢判定（天干印比生助） =================
  let allyStemCount = 0;
  for (const item of stemWeights) {
    const el = STEMS[STEM_INDEX[item.stem]].element;
    const rel = elementRelation(el, dmElement);
    if (rel === 'same' || rel === 'generate') { // 比劫同五行 或 印星生日主
      allyStemCount++;
    }
  }
  const deShi = (allyStemCount >= 1);
  evidence.push({
    ruleId: 'STR_DE_SHI',
    effect: deShi ? 10 : -8,
    reason: `天干透出同黨（比劫、印星）生助共 ${allyStemCount} 干，判定為【${deShi ? '得勢' : '失勢'}】`
  });

  // ================= 5. 同黨 vs 異黨量化綜合得分 =================
  // 同黨：日主同五行（比劫） + 生日主五行（印綬）
  // 異黨：剋日主（官殺） + 日主生（食傷） + 日主剋（財星）
  let allyScore = 0;
  let enemyScore = 0;

  for (const [el, score] of Object.entries(elementScores)) {
    const rel = elementRelation(el, dmElement);
    if (rel === 'same' || rel === 'generate') {
      allyScore += score;
    } else {
      enemyScore += score;
    }
  }

  const totalScore = allyScore + enemyScore;
  const dayMasterStrengthPct = totalScore > 0 ? (allyScore / totalScore) * 100 : 50;
  const finalScore = Number(dayMasterStrengthPct.toFixed(1));

  // ================= 6. 強弱級別劃分 =================
  // 極強（專旺/從強）：> 82% 且幾乎無剋洩耗
  // 偏強：55% ~ 82%
  // 中和平衡：45% ~ 55%
  // 偏弱：22% ~ 45%
  // 極弱（從格）：< 22% 且無根無助
  let level = '中和';
  let levelCode = 'balanced';

  if (finalScore >= 82) {
    level = '極強（從強/專旺）';
    levelCode = 'extremelyStrong';
  } else if (finalScore >= 55) {
    level = '偏強';
    levelCode = 'strong';
  } else if (finalScore >= 45) {
    level = '中和';
    levelCode = 'balanced';
  } else if (finalScore >= 22) {
    level = '偏弱';
    levelCode = 'weak';
  } else {
    level = '極弱（從弱）';
    levelCode = 'extremelyWeak';
  }

  // ================= 7. 喜用神與忌神推導（子平扶抑法與格局平衡） =================
  // 身強者：喜剋、洩、耗（官殺、食傷、財星），忌生、助（印綬、比劫）
  // 身弱者：喜生、扶（印綬、比劫），忌剋、洩、耗（官殺、財星、食傷）
  // 極旺從強者：順其旺勢（喜比劫、印綬、食傷，忌官殺逆其氣勢）
  // 極弱從弱者：順其弱勢（喜官殺、財星、食傷，忌印綬比劫破格）
  const favorableElements = [];
  const unfavorableElements = [];

  const dmObj = ELEMENTS.find(e => e.char === dmElement);
  const resourceEl = dmObj.restrictedBy; // 生日主之母（水生木）-> generatedBy
  const selfEl = dmElement;
  const outputEl = dmObj.generates; // 食傷（木生火）
  const wealthEl = dmObj.restricts; // 財星（木剋土）
  const officerEl = dmObj.generatedBy; // generatedBy 修正：dmObj.generatedBy 是印星！
  const realResourceEl = dmObj.generatedBy;
  const realOfficerEl = dmObj.restrictedBy; // 官殺剋日主

  if (levelCode === 'strong') {
    // 身強喜 剋、洩、耗
    favorableElements.push(outputEl, wealthEl, realOfficerEl);
    unfavorableElements.push(realResourceEl, selfEl);
  } else if (levelCode === 'weak') {
    // 身弱喜 生、助
    favorableElements.push(realResourceEl, selfEl);
    unfavorableElements.push(realOfficerEl, wealthEl, outputEl);
  } else if (levelCode === 'extremelyStrong') {
    // 從強喜 助、生、洩
    favorableElements.push(selfEl, realResourceEl, outputEl);
    unfavorableElements.push(realOfficerEl, wealthEl);
  } else if (levelCode === 'extremelyWeak') {
    // 從弱喜 耗、洩、剋
    favorableElements.push(wealthEl, realOfficerEl, outputEl);
    unfavorableElements.push(realResourceEl, selfEl);
  } else {
    // 中和：依氣候與微弱差額微調
    favorableElements.push(wealthEl, outputEl);
    unfavorableElements.push(realOfficerEl);
  }

  // 格式化五行統計量
  const fiveElementsDistribution = {};
  for (const [el, sc] of Object.entries(elementScores)) {
    fiveElementsDistribution[el] = {
      score: Number(sc.toFixed(1)),
      percentage: totalScore > 0 ? Number(((sc / totalScore) * 100).toFixed(1)) : 20
    };
  }

  return {
    dayMaster: dmElement,
    score: finalScore,
    level,
    levelCode,
    deLing,
    deDi,
    deShi,
    allyScore: Number(allyScore.toFixed(1)),
    enemyScore: Number(enemyScore.toFixed(1)),
    dayMasterStem: dayMasterStem,
    monthState: {
      branch: monthBranch,
      name: monthState,
      factor: monthStateFactor,
      deLing
    },
    monthCommander,
    seasonalStates: Object.fromEntries(Object.entries(SEASON_STATES[monthBranch] || {}).map(([element, name]) => [element, {
      name,
      factor: STATE_FACTOR[name] || null
    }])),
    distribution: fiveElementsDistribution,
    favorableElements: [...new Set(favorableElements)],
    unfavorableElements: [...new Set(unfavorableElements)],
    evidence
  };
}
