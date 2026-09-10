import { CANONICAL_PROFILE } from './canonical.js';
import { getAnalysisRuleId } from '../../analysis/index.js';

// 這裡只登錄「可重現的規則配置差異」，不把不同傳承混成一個預設答案。
// 根目錄 profiles/ 是可審核的 JSON 目錄；本檔則讓瀏覽器 SDK 可以直接取用同一組內建 Profile。
const CLASSICAL_ZIPING = 'classical-ziping';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function rule(value, ruleId, overridden = false) {
  return { value, ruleId, version: '1.0.0', ...(overridden ? { overridden: true } : {}) };
}

function analysisRule(value, dimension) {
  return {
    value,
    ruleId: getAnalysisRuleId(value, dimension),
    version: value.endsWith('-research') || value === 'research-registry' ? '0.1.0' : '1.0.0',
    overridden: true
  };
}

function buildComparisonProfile({ id, name, description, overrides, differences, status = 'comparison' }) {
  const profile = clone(CANONICAL_PROFILE);
  profile.id = id;
  profile.name = name;
  profile.description = description;
  profile.tradition = CLASSICAL_ZIPING;
  profile.profileType = 'comparison';
  profile.status = status;
  profile.baseId = 'canonical';
  profile.version = status === 'research-only' ? '0.1.0' : '1.0.0';
  profile.diff = differences;

  if (overrides.dayBoundary) {
    profile.rules.dayBoundary = rule(
      overrides.dayBoundary,
      overrides.dayBoundary === '00:00' ? 'DAY_BOUNDARY_MIDNIGHT_0000' : 'DAY_BOUNDARY_ZISHI_2300',
      true
    );
  }
  if (overrides.yearBoundary) {
    profile.rules.yearBoundary = rule(overrides.yearBoundary, `YEAR_BOUNDARY_${overrides.yearBoundary.toUpperCase()}`, true);
  }
  if (overrides.monthBoundary) {
    profile.rules.monthBoundary = rule(overrides.monthBoundary, `MONTH_BOUNDARY_${overrides.monthBoundary.toUpperCase()}`, true);
  }
  if (overrides.startAgeMethod) {
    profile.rules.luckCycle.startAgeMethod = rule(
      overrides.startAgeMethod,
      overrides.startAgeMethod === 'jieqi-whole-days-divide-3'
        ? 'LUCK_START_DIFF_WHOLE_DAY_DIV_3'
        : 'LUCK_START_DIFF_DIV_3',
      true
    );
  }
  if (typeof overrides.trueSolarTime === 'boolean') {
    profile.rules.trueSolarTime = rule(
      overrides.trueSolarTime,
      overrides.trueSolarTime ? 'TRUE_SOLAR_TIME_ENABLED' : 'TRUE_SOLAR_TIME_DISABLED',
      true
    );
  }
  if (overrides.analysis) {
    for (const [dimension, modelId] of Object.entries(overrides.analysis)) {
      profile.rules.analysis[dimension] = analysisRule(modelId, dimension);
    }
  }
  return profile;
}

const CANONICAL_DESCRIPTOR = {
  ...clone(CANONICAL_PROFILE),
  tradition: CLASSICAL_ZIPING,
  profileType: 'reference',
  status: 'default',
  references: ['docs/references/rule-differences.md', 'docs/architecture/quality-gates.md']
};

export const PROFILE_CATALOG = Object.freeze([
  CANONICAL_DESCRIPTOR,
  buildComparisonProfile({
    id: 'civil-midnight',
    name: '民用午夜換日比較',
    description: '只將換日界線改為 00:00，供與民用曆法或其他排盤系統逐案比對。',
    overrides: { dayBoundary: '00:00' },
    differences: { dayBoundary: { from: '23:00', to: '00:00' } }
  }),
  buildComparisonProfile({
    id: 'lunar-calendar',
    name: '農曆初一切界比較',
    description: '以農曆正月初一切年、農曆初一切月並以 00:00 換日，僅作差異研究。',
    overrides: { yearBoundary: 'lunar_new_year', monthBoundary: 'lunar_month', dayBoundary: '00:00' },
    differences: {
      yearBoundary: { from: 'lichun', to: 'lunar_new_year' },
      monthBoundary: { from: 'jie', to: 'lunar_month' },
      dayBoundary: { from: '23:00', to: '00:00' }
    }
  }),
  buildComparisonProfile({
    id: 'true-solar',
    name: '真太陽時比較',
    description: '保留 canonical 的子平切界，改以出生地經度修正真太陽時；未提供地點時使用時區中央經線。',
    overrides: { trueSolarTime: true },
    differences: { trueSolarTime: { from: false, to: true } }
  }),
  buildComparisonProfile({
    id: 'jieqi-whole-day',
    name: '節氣差整日換算比較',
    description: '保留 canonical 的節氣取節與順逆規則，但先取整日再以三日一歲換算；只作方法差異研究。',
    overrides: { startAgeMethod: 'jieqi-whole-days-divide-3' },
    differences: { startAgeMethod: { from: 'jieqi-diff-divide-3', to: 'jieqi-whole-days-divide-3' } }
  }),
  buildComparisonProfile({
    id: 'classical-sanming',
    name: '《三命通會》人元分日比較',
    description: '只將月令人元司事分日切換為《三命通會》卷二表格，保留 canonical 其他計算，供逐案研究。',
    overrides: { analysis: { monthCommander: 'san-ming-volume-2' } },
    differences: { analysis: { monthCommander: { from: 'bazi-js-human-element', to: 'san-ming-volume-2' } } }
  }),
  buildComparisonProfile({
    id: 'research-tiaohou',
    name: '調候研究 Profile',
    description: '標記調候與季節分析的研究邊界；未完成判定前不覆寫 canonical 扶抑結果。',
    overrides: { analysis: { useGod: 'tiaohou-research', seasonal: 'tiaohou-research' } },
    differences: {
      analysis: {
        useGod: { from: 'fuyi-canonical', to: 'tiaohou-research' },
        seasonal: { from: 'none', to: 'tiaohou-research' }
      }
    },
    status: 'research-only'
  }),
  buildComparisonProfile({
    id: 'research-tongguan',
    name: '通關研究 Profile',
    description: '標記通關與介入五行的研究邊界；未完成全局判定前不覆寫 canonical 結果。',
    overrides: { analysis: { useGod: 'tongguan-research', mediator: 'tongguan-research' } },
    differences: {
      analysis: {
        useGod: { from: 'fuyi-canonical', to: 'tongguan-research' },
        mediator: { from: 'none', to: 'tongguan-research' }
      }
    },
    status: 'research-only'
  }),
  buildComparisonProfile({
    id: 'research-patterns',
    name: '古典特殊格研究 Profile',
    description: '只選取 Pattern 研究登錄；沒有完整成格與破格 predicate 時不宣告命中。',
    overrides: { analysis: { patterns: 'patterns-research' } },
    differences: { analysis: { patterns: { from: 'research-registry', to: 'patterns-research' } } },
    status: 'research-only'
  })
]);

// RuleRegistry 只需要註冊 canonical 以外的內建項目，避免重複註冊。
export const BUILTIN_PROFILES = Object.freeze(PROFILE_CATALOG.filter((profile) => profile.id !== CANONICAL_PROFILE.id));
