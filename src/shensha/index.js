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
    // 專屬命盤日柱或整體判定（如魁罡）
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
            reason: `日柱為【${pillars.day.stem}${pillars.day.branch}】，符合魁罡條件`
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
