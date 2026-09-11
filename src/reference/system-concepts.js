// System-level Reference Concepts.
// These describe existing SDK capabilities, not additional metaphysical rules.

import { VERSIONS } from '../rules/versions.js';

const sdkReference = (module, note) => ({
  type: 'sdk',
  module,
  locator: module,
  note
});

const feature = ({
  conceptId,
  name,
  aliases,
  conceptType,
  ruleId,
  version,
  ruleFamily,
  baseOn,
  scope,
  description,
  module,
  api,
  outputFields,
  sourceIds = [],
  references = [],
  evidence,
  variants = []
}) => ({
  conceptId,
  ruleId,
  name,
  displayName: name,
  aliases,
  tradition: 'bazi-js-sdk',
  conceptType,
  ruleFamily,
  baseOn,
  scope,
  category: 'neutral',
  confidence: 'implemented-contract',
  status: 'implemented',
  version,
  sourceIds,
  references: references.length ? references : [sdkReference(module, '功能契約與實作位置；不等同古籍原文證據。')],
  description,
  variants,
  researchNotes: {
    sourceCoverage: sourceIds.length ? 'classical-source-linked' : 'sdk-contract-only',
    note: sourceIds.length
      ? '功能已有相關古籍來源索引，但實際 SDK 算法仍以輸出 evidence 與版本契約為準。'
      : '目前已升格為可查詢的實作概念；專屬古籍版本、頁碼與原文仍待補齊。'
  },
  evidence: {
    kind: 'implementation-contract',
    matched: true,
    basedOn: ['module', 'version', 'public-api', 'output-schema'],
    status: evidence?.status || 'implemented',
    note: evidence?.note || '此概念描述已存在的 SDK 功能，不宣稱額外命理結論。'
  },
  implementation: {
    status: 'implemented',
    module,
    api,
    outputFields
  }
});

export const SYSTEM_CONCEPTS = Object.freeze([
  feature({
    conceptId: 'calendar.engine', name: '曆法與節氣', aliases: ['Calendar', 'Calendar Engine', '節氣計算'],
    conceptType: 'calendar', ruleId: 'CALENDAR_ENGINE_001', version: VERSIONS.calendarRuleVersion,
    ruleFamily: 'calendar-and-solar-terms', baseOn: ['birthDate', 'birthTime', 'timezone', 'solarTerms'], scope: 'calendar',
    module: 'src/calendar', api: ['Bazi.Calendar', 'Bazi.Solar', 'Bazi.Lunar', 'Bazi.TrueSolarTime'],
    outputFields: ['calendar.solar', 'calendar.lunar', 'calendar.solarTerms', 'calendar.time', 'accuracy.precision'],
    description: '處理公曆、農曆、儒略日、節氣、生肖、星座與真太陽時修正，並把時間精度與假設留在結果中。'
  }),
  feature({
    conceptId: 'ten-god.relation', name: '十神關係', aliases: ['TenGod', 'Ten Gods', '十神計算'],
    conceptType: 'ten-god', ruleId: 'TENGOD_RELATION_001', version: VERSIONS.tenGodRuleVersion,
    ruleFamily: 'day-master-relation', baseOn: ['dayMaster', 'stems', 'hiddenStems'], scope: 'natal',
    module: 'src/tengods', api: ['Bazi.TenGods'],
    outputFields: ['tenGods.dayMaster', 'tenGods.stems', 'tenGods.hidden'],
    description: '以日主天干為基準，計算四柱天干與地支藏干的十神關係，並保留角色與解釋欄位。'
  }),
  feature({
    conceptId: 'hidden-stem.registry', name: '地支藏干', aliases: ['HiddenStem', 'Hidden Stems', '藏干'],
    conceptType: 'hidden-stem', ruleId: 'HIDDEN_STEM_REGISTRY_001', version: VERSIONS.hiddenStemRuleVersion,
    ruleFamily: 'branch-hidden-stems', baseOn: ['branch'], scope: 'pillar',
    module: 'src/core/constants/hidden-stems-data.js', api: ['Bazi.TenGods', 'Bazi.calculate'],
    outputFields: ['hiddenStems.year', 'hiddenStems.month', 'hiddenStems.day', 'hiddenStems.hour', 'tenGods.hidden'],
    description: '提供每個地支所藏天干、本氣／中氣／餘氣角色、日數與比例；不把藏干本身誤當成透干。'
  }),
  feature({
    conceptId: 'interaction.chart-relationships', name: '天干地支互動', aliases: ['Interactions', 'Interactions Engine', '合沖刑害破'],
    conceptType: 'interaction', ruleId: 'INTERACTIONS_ENGINE_001', version: VERSIONS.interactionRuleVersion,
    ruleFamily: 'chart-relationship', baseOn: ['pillars', 'stemPairs', 'branchGroups'], scope: 'whole-chart',
    module: 'src/interactions', api: ['Bazi.Interactions'],
    outputFields: ['interactions.stems', 'interactions.branches', 'interactions.formation', 'interactions.transformability', 'interactions.evidence'],
    description: '辨識天干五合／相沖與地支合、沖、刑、害、破、三合、三會、半合、拱合，並將觀測到的結構與成化候選分開。'
  }),
  feature({
    conceptId: 'strength.engine', name: '五行強弱與氣數', aliases: ['Strength', 'Strength Engine', '扶抑強弱'],
    conceptType: 'strength', ruleId: 'STRENGTH_ENGINE_001', version: VERSIONS.strengthRuleVersion,
    ruleFamily: 'whole-chart-strength', baseOn: ['dayMaster', 'monthCommander', 'hiddenStems', 'interactions'], scope: 'whole-chart',
    module: 'src/strength', api: ['Bazi.Strength', 'Bazi.calculate'],
    outputFields: ['strength.score', 'strength.level', 'strength.distribution', 'strength.rawQi', 'strength.effectiveQi', 'strength.transformations', 'strength.assessment', 'strength.evidence'],
    sourceIds: ['di-tian-sui-yan-wei'],
    references: [{ type: 'classical', sourceId: 'di-tian-sui-yan-wei', title: '《滴天髓闡微》', locator: '人元司令、月令與全局取用相關注解', url: 'https://zh.wikisource.org/zh-hant/滴天髓闡微' }],
    description: '以得令、得地、得勢、同黨異黨、互動折損與轉化候選建立可追溯強弱模型；分數是 SDK 模型輸出，不是科學測量。'
  }),
  feature({
    conceptId: 'luck.cycles', name: '大運與起運', aliases: ['Luck', 'Luck Cycles', '大運'],
    conceptType: 'luck', ruleId: 'LUCK_CYCLES_ENGINE_001', version: VERSIONS.luckRuleVersion,
    ruleFamily: 'luck-cycle-calculation', baseOn: ['gender', 'yearStem', 'monthPillar', 'solarTerms'], scope: 'natal-to-luck',
    module: 'src/luck', api: ['Bazi.Luck', 'Bazi.calculate'],
    outputFields: ['luckCycles.direction', 'luckCycles.startAge', 'luckCycles.variants', 'luckCycles.cycles', 'luckCycles.cycles[].annuals'],
    sourceIds: ['san-ming-tong-hui'],
    references: [{ type: 'classical', sourceId: 'san-ming-tong-hui', title: '《三命通會》', locator: '卷二〈論大運〉', url: 'https://zh.wikisource.org/zh-hant/三命通會/卷二' }],
    description: '依 Profile 與起運方法計算順逆、起運歲數、大運干支與可選逐年資料，並保留精確節氣法與整日比較法。'
  }),
  feature({
    conceptId: 'transit.graph', name: '流年與時間運', aliases: ['Transit', 'Transit Engine', '流年流月流日流時'],
    conceptType: 'transit', ruleId: 'TRANSIT_ENGINE_001', version: VERSIONS.transitGraphVersion,
    ruleFamily: 'time-layer-transit', baseOn: ['datetime', 'timezone', 'yearBoundary', 'monthBoundary', 'dayBoundary'], scope: 'time-layer',
    module: 'src/transit', api: ['Bazi.Transit', 'Bazi.calculate'],
    outputFields: ['transits.year', 'transits.month', 'transits.day', 'transits.hour', 'transits.interactions', 'transits.shenShaYear', 'transits.transitGraph'],
    description: '計算指定時間的流年、流月、流日、流時，並以 transit graph 保存時間層節點、互動與結構事件；事件不直接等同吉凶。'
  }),
  feature({
    conceptId: 'use-god.resolver', name: '用神模型與候選解析', aliases: ['UseGod', 'Use God', '用神'],
    conceptType: 'use-god', ruleId: 'USE_GOD_RESOLVER_001', version: VERSIONS.useGodResolverVersion,
    ruleFamily: 'multi-model-analysis', baseOn: ['strength', 'patterns', 'profile'], scope: 'whole-chart-analysis',
    module: 'src/analysis', api: ['Bazi.Analysis', 'Bazi.AI', 'Bazi.calculate'],
    outputFields: ['analysis.useGodResolver.candidates', 'analysis.useGodResolver.conflicts', 'analysis.useGodResolver.finalDecision', 'analysis.selected.useGod'],
    sourceIds: ['di-tian-sui-yan-wei'],
    references: [{ type: 'classical', sourceId: 'di-tian-sui-yan-wei', title: '《滴天髓闡微》', locator: '用神、喜神、忌神、仇神、閒神相關注解', url: 'https://zh.wikisource.org/zh-hant/滴天髓闡微' }],
    description: '集中保存扶抑、格局、調候、通關與從化候選；目前只有已實作模型可作決定，其餘保留 research-only 與 conflict evidence。'
  })
]);
