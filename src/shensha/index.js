// 神煞判定引擎（ShenSha Engine）
// 掃描命盤（年、月、日、時支，天干）並輸出命中神煞列表
// 每筆輸出皆包含：
// - id: 神煞代號
// - name: 名稱
// - category: 吉/凶/中性
// - hitOn: 命中的柱位 (['year', 'month', 'day', 'hour'])
// - basedOn: 查出神煞的基準 (['dayStem', ...])
// - ruleId: 規則唯一識別碼
// - reference: 經典文獻依據
// - evidence: 判定證據明細

import { SHENSHA_CATALOG } from './catalog.js';

export function calculateShenSha(pillars) {
  const results = [];

  const pillarEntries = [
    { pillar: 'year', stem: pillars.year.stem, branch: pillars.year.branch },
    { pillar: 'month', stem: pillars.month.stem, branch: pillars.month.branch },
    { pillar: 'day', stem: pillars.day.stem, branch: pillars.day.branch },
    ...(pillars.hour.available ? [{ pillar: 'hour', stem: pillars.hour.stem, branch: pillars.hour.branch }] : [])
  ];

  for (const rule of SHENSHA_CATALOG) {
    // 整柱型判定（如魁罡、十惡大敗）：以原局日柱為準
    if (rule.matchChart) {
      if (rule.matchChart(pillars)) {
        results.push({
          id: rule.id,
          name: rule.name,
          category: rule.category,
          hitOn: ['day'],
          basedOn: rule.baseOn,
          ruleId: rule.ruleId,
          version: rule.version,
          reference: rule.reference,
          evidence: {
            reason: `日柱為【${pillars.day.stem}${pillars.day.branch}】，符合${rule.name}條件`
          }
        });
      }
      continue;
    }

    // 依基準比對（dayStem, yearStem, monthBranch, yearBranch, dayBranch）
    const hitPillars = [];
    const baseUsed = [];
    let evidenceText = '';

    for (const target of pillarEntries) {
      // 1. 基於天干（日干 / 年干）查地支
      if (rule.baseOn.includes('dayStem')) {
        if (rule.match({ baseStem: pillars.day.stem, targetBranch: target.branch })) {
          hitPillars.push(target.pillar);
          baseUsed.push(`以日干【${pillars.day.stem}】查得【${target.branch}】於 ${target.pillar} 支`);
        }
      }
      if (rule.baseOn.includes('yearStem')) {
        if (rule.match({ baseStem: pillars.year.stem, targetBranch: target.branch })) {
          if (!hitPillars.includes(target.pillar)) hitPillars.push(target.pillar);
          baseUsed.push(`以年干【${pillars.year.stem}】查得【${target.branch}】於 ${target.pillar} 支`);
        }
      }

      // 2. 基於月令（月支）查天干或地支（如天德、月德）
      if (rule.baseOn.includes('monthBranch')) {
        if (rule.match({ monthBranch: pillars.month.branch, targetStem: target.stem, targetBranch: target.branch })) {
          if (!hitPillars.includes(target.pillar)) hitPillars.push(target.pillar);
          baseUsed.push(`以月令【${pillars.month.branch}】查得 ${target.pillar} 柱`);
        }
      }

      // 3. 基於年支或日支查其他地支（如驛馬、桃花、華蓋、將星、亡神、劫煞、孤辰、寡宿）
      if (rule.baseOn.includes('dayBranch')) {
        if (rule.match({ baseBranch: pillars.day.branch, targetBranch: target.branch })) {
          if (!hitPillars.includes(target.pillar)) hitPillars.push(target.pillar);
          baseUsed.push(`以日支【${pillars.day.branch}】查得【${target.branch}】於 ${target.pillar} 支`);
        }
      }
      if (rule.baseOn.includes('yearBranch')) {
        if (rule.match({ baseBranch: pillars.year.branch, targetBranch: target.branch })) {
          if (!hitPillars.includes(target.pillar)) hitPillars.push(target.pillar);
          baseUsed.push(`以年支【${pillars.year.branch}】查得【${target.branch}】於 ${target.pillar} 支`);
        }
      }
    }

    if (hitPillars.length > 0) {
      results.push({
        id: rule.id,
        name: rule.name,
        category: rule.category,
        hitOn: hitPillars,
        basedOn: rule.baseOn,
        ruleId: rule.ruleId,
        version: rule.version,
        reference: rule.reference,
        evidence: {
          details: baseUsed
        }
      });
    }
  }

  return results;
}

// 以原局為基準，檢查「單一外來柱」（大運干支 / 流年干支）觸發的神煞。
// 用途：大運神煞、流年神煞（對應 catalog scope: natal / luck / transit）。
// 參數：natalPillars 原局四柱；stemChar/branchChar 外來柱干支；pillarLabel 標籤（如 'luck-1'、'transit-year'）。
// 整柱型規則（matchChart）僅屬原局，此處略過。
export function calculateShenShaOnPillar(natalPillars, stemChar, branchChar, pillarLabel) {
  const results = [];
  if (!stemChar || !branchChar) return results;

  for (const rule of SHENSHA_CATALOG) {
    if (rule.matchChart) continue;

    const baseUsed = [];

    if (rule.baseOn.includes('dayStem')) {
      if (rule.match({ baseStem: natalPillars.day.stem, targetBranch: branchChar })) {
        baseUsed.push(`以日干【${natalPillars.day.stem}】查得【${branchChar}】`);
      }
    }
    if (rule.baseOn.includes('yearStem')) {
      if (rule.match({ baseStem: natalPillars.year.stem, targetBranch: branchChar })) {
        baseUsed.push(`以年干【${natalPillars.year.stem}】查得【${branchChar}】`);
      }
    }
    if (rule.baseOn.includes('monthBranch')) {
      if (rule.match({ monthBranch: natalPillars.month.branch, targetStem: stemChar, targetBranch: branchChar })) {
        baseUsed.push(`以月令【${natalPillars.month.branch}】查得`);
      }
    }
    if (rule.baseOn.includes('dayBranch')) {
      if (rule.match({ baseBranch: natalPillars.day.branch, targetBranch: branchChar })) {
        baseUsed.push(`以日支【${natalPillars.day.branch}】查得【${branchChar}】`);
      }
    }
    if (rule.baseOn.includes('yearBranch')) {
      if (rule.match({ baseBranch: natalPillars.year.branch, targetBranch: branchChar })) {
        baseUsed.push(`以年支【${natalPillars.year.branch}】查得【${branchChar}】`);
      }
    }

    if (baseUsed.length > 0) {
      results.push({
        id: rule.id,
        name: rule.name,
        category: rule.category,
        hitOn: [pillarLabel],
        basedOn: rule.baseOn,
        ruleId: rule.ruleId,
        version: rule.version,
        reference: rule.reference,
        evidence: {
          details: baseUsed
        }
      });
    }
  }

  return results;
}
