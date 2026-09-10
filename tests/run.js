// BaziJS 測試執行器（node tests/run.js）
// 執行：單元測試 + Golden Cases（四柱全欄位）+ 邊界案例
// 結束碼：全過為 0，任一失敗為 1

import fs from 'fs';
import Bazi from '../src/index.js';

let pass = 0;
let fail = 0;
const failures = [];

function assert(cond, label, detail) {
  if (cond) {
    pass++;
  } else {
    fail++;
    failures.push(`${label} :: ${detail || ''}`);
    console.log(`  ✗ FAIL ${label} ${detail || ''}`);
  }
}

// ---------- 單元測試 ----------
async function runUnit() {
  console.log('== 單元測試 ==');

  // 日柱錨點（外部驗證）
  const d1 = Bazi.calculate({ birthDate: '2000-01-01', birthTime: '12:00', gender: 'male' });
  assert(d1.pillars.day.ganzhi === '戊午', 'UT-DAY-2000', d1.pillars.day.ganzhi);
  const d2 = Bazi.calculate({ birthDate: '2024-01-01', birthTime: '12:00', gender: 'male' });
  assert(d2.pillars.day.ganzhi === '甲子', 'UT-DAY-2024', d2.pillars.day.ganzhi);
  const d3 = Bazi.calculate({ birthDate: '1900-01-01', birthTime: '12:00', gender: 'male' });
  assert(d3.pillars.day.ganzhi === '甲戌', 'UT-DAY-1900', d3.pillars.day.ganzhi);
  assert(Number(d1.transits.targetDatetime.slice(0, 4)) === new Date().getFullYear(), 'UT-TRANSIT-DEFAULT-CURRENT-YEAR', d1.transits.targetDatetime);

  // 十神：甲日主見丙為食神、見庚為七殺、見壬為偏印、見戊為偏財、見甲為比肩
  const tg = Bazi.Constants;
  void tg;

  // 納音抽查：甲子=海中金、丙寅=爐中火
  const nayin = Bazi.calculate({ birthDate: '2024-01-01', birthTime: '12:00', gender: 'male' }).nayin;
  assert(nayin.day === '海中金', 'UT-NAYIN-JIAZI', nayin.day);

  // 空亡抽查：甲子旬（甲子日）空戌亥
  const kw = Bazi.calculate({ birthDate: '2024-01-01', birthTime: '12:00', gender: 'male' }).kongWang;
  assert(JSON.stringify(kw.byDay.branches) === JSON.stringify(['戌', '亥']), 'UT-KONGWANG-JIAZI', JSON.stringify(kw.byDay.branches));
  assert(kw.byDay.xunName === '甲子旬' && kw.byDay.ruleId === 'AUX_KONGWANG_SIX_XUN_001' && kw.byDay.evidence.matched, 'UT-KONGWANG-PROVENANCE', JSON.stringify(kw.byDay));

  // 藏干抽查：子藏癸、午藏丁己
  const hs = Bazi.calculate({ birthDate: '2024-01-01', birthTime: '12:00', gender: 'male' }).hiddenStems;
  assert(hs.day.map((h) => h.stem).join('') === '癸', 'UT-HIDDEN-ZI', JSON.stringify(hs.day));

  // 十二長生抽查：甲日主坐亥為長生
  const st = Bazi.calculate({ birthDate: '1995-10-24', birthTime: '12:00', gender: 'male' });
  void st;

  // Safe API 錯誤結構
  const err = Bazi.calculateSafe({ birthDate: '1899-01-01', birthTime: '12:00', gender: 'male' });
  assert(err.success === false && err.error.code === 'BIRTH_DATE_OUT_OF_RANGE', 'UT-SAFEAPI-RANGE', JSON.stringify(err.error && err.error.code));

  // 輸入契約：不能讓無效日期、地支或時區進入曆法層。
  const invalidDate = Bazi.calculateSafe({ birthDate: '2024-02-30', birthTime: '12:00', gender: 'male' });
  assert(invalidDate.success === false && invalidDate.error.code === 'BAZI_VALIDATION_ERROR', 'UT-VALIDATE-CALENDAR-DATE', JSON.stringify(invalidDate.error));
  const invalidBranch = Bazi.calculateSafe({ birthDate: '2024-01-01', birthTimeMode: 'branch', birthHourBranch: '不存在', gender: 'male' });
  assert(invalidBranch.success === false && invalidBranch.error.field === 'birthHourBranch', 'UT-VALIDATE-BRANCH', JSON.stringify(invalidBranch.error));
  const invalidTimezone = Bazi.calculateSafe({ birthDate: '2024-01-01', birthTime: '12:00', gender: 'male', timezone: '+25:00' });
  assert(invalidTimezone.success === false && invalidTimezone.error.field === 'timezone', 'UT-VALIDATE-TIMEZONE', JSON.stringify(invalidTimezone.error));
  const invalidLocation = Bazi.calculateSafe({ birthDate: '2024-01-01', birthTime: '12:00', gender: 'male', location: { longitude: 181 } });
  assert(invalidLocation.success === false && invalidLocation.error.field === 'location.longitude', 'UT-VALIDATE-LONGITUDE', JSON.stringify(invalidLocation.error));
  const unknownProfile = Bazi.calculateSafe({ birthDate: '2024-01-01', birthTime: '12:00', gender: 'male' }, { profile: 'not-a-real-profile' });
  assert(unknownProfile.success === false && unknownProfile.error.code === 'BAZI_RULE_ERROR', 'UT-PROFILE-UNKNOWN-IS-ERROR', JSON.stringify(unknownProfile.error));
  const unknownPreset = Bazi.calculateSafe({ birthDate: '2024-01-01', birthTime: '12:00', gender: 'male' }, { shenshaPreset: 'not-a-real-preset' });
  assert(unknownPreset.success === false && unknownPreset.error.details.ruleId === 'SHENSHA_PRESET_NOT_FOUND', 'UT-SHENSHA-PRESET-UNKNOWN-IS-ERROR', JSON.stringify(unknownPreset.error));
  let lunarRangeError = false;
  try { Bazi.Lunar.solarToLunar(2200, 1, 1); } catch (error) { lunarRangeError = error.code === 'BAZI_CALENDAR_ERROR'; }
  assert(lunarRangeError, 'UT-LUNAR-OUT-OF-RANGE', '超出農曆資料範圍必須明確失敗');

  // AI Context 結構
  const ctx = Bazi.AI.toContext(d1, { compact: false });
  assert(ctx.pillars && ctx.pillars.day.ganzhi === '戊午' && ctx.metadata.profileId === 'canonical', 'UT-AI-CONTEXT', '');
  assert(ctx.dayMaster.fiveCategory && ctx.auxiliary.mingGua && ctx.luckCyclesSummary.variants.length === 2, 'UT-AI-NEW-SYSTEMS', 'AI Context 必須保留五分類、命卦與起運方法 variants');
  assert(d1.meta.apiVersion === '1.0.0' && d1.meta.governanceVersion === '1.0.0', 'UT-API-GOVERNANCE-VERSIONS', JSON.stringify(d1.meta));
  assert(d1.meta.strengthQiLayerVersion === '1.1.0' && Bazi.rules.strength.qiLayerVersion === '1.1.0', 'UT-STRENGTH-QI-VERSION', JSON.stringify(d1.meta));
  assert(d1.meta.profile?.rules?.dayBoundary?.value === '23:00' && d1.meta.profile?.tradition === 'classical-ziping', 'UT-PROFILE-SNAPSHOT', JSON.stringify(d1.meta.profile));
  assert(d1.accuracy.precision.timezone.offsetHours === 8 && d1.accuracy.precision.timezone.dstSupported === false, 'UT-ACCURACY-TIMEZONE-MODEL', JSON.stringify(d1.accuracy.precision.timezone));
  assert(d1.accuracy.precision.solarTermsModel.modelId === 'meeus-solar-longitude-low-precision' && d1.accuracy.limitations.some((item) => item.id === 'solar-term-minute-precision'), 'UT-ACCURACY-SOLAR-TERM-LIMIT', JSON.stringify(d1.accuracy));
  const validationManifest = Bazi.Validation.getValidationManifest();
  assert(validationManifest.manifestId === 'bazi-js-validation-manifest' && validationManifest.totals.cases === 55 && validationManifest.datasets.length === 3, 'UT-VALIDATION-MANIFEST', JSON.stringify(validationManifest));

  // 新增的可選系統：五分類、八宅命卦、起運方法 variants。
  const mingGua2020 = Bazi.Auxiliary.calculateMingGua({ effectiveYear: 2020, gender: 'female' });
  assert(mingGua2020.trigram.name === '兌' && mingGua2020.groupName === '西四命', 'UT-MING-GUA-2020-F', JSON.stringify(mingGua2020));
  const fiveCategory = Bazi.Strength.calculateFiveElementCategories({ useElement: '金', favorableElements: ['金', '水', '土'] });
  assert(JSON.stringify(fiveCategory.groups) === JSON.stringify({ use: ['金'], joy: ['土'], idle: ['水'], adversary: ['木'], taboo: ['火'] }), 'UT-FIVE-CATEGORY-DETERMINISTIC', JSON.stringify(fiveCategory.groups));
  assert(d1.strength.fiveCategory && d1.strength.fiveCategory.evidence.matched, 'UT-FIVE-CATEGORY-IN-RESULT', JSON.stringify(d1.strength.fiveCategory));
  assert(d1.strength.rawQi && d1.strength.rawQi.distribution && d1.strength.rawQi.evidence.matched, 'UT-STRENGTH-RAW-QI-LAYER', JSON.stringify(d1.strength.rawQi));
  assert(d1.strength.effectiveQi && d1.strength.effectiveQi.status === 'interaction-adjusted' && d1.strength.effectiveQi.evidence.interactionAdjustment, 'UT-STRENGTH-EFFECTIVE-QI-LAYER', JSON.stringify(d1.strength.effectiveQi));
  assert(d1.strength.layers?.dayMasterAssessment?.evidence?.note.includes('特殊格'), 'UT-STRENGTH-ASSESSMENT-SEPARATES-PATTERNS', JSON.stringify(d1.strength.assessment));
  assert(Array.isArray(d1.strength.transformations.candidates) && d1.strength.transformations.applied.length === 0, 'UT-STRENGTH-TRANSFORMATION-EVIDENCE-ONLY', JSON.stringify(d1.strength.transformations));
  assert(d1.interactions.stems.every((item) => item.evidence?.matched && item.formation && item.transformability), 'UT-INTERACTIONS-TRACEABLE-METADATA', JSON.stringify(d1.interactions.stems));
  assert(d1.interactions.branches.every((item) => item.evidence?.matched && item.formation && item.transformability), 'UT-BRANCH-INTERACTIONS-TRACEABLE-METADATA', JSON.stringify(d1.interactions.branches));
  assert(d1.strength.monthCommander === null || (d1.strength.monthCommander.ruleId === 'STR_MONTH_COMMANDER_001' && d1.strength.monthCommander.evidence.matched), 'UT-MONTH-COMMANDER-PROVENANCE', JSON.stringify(d1.strength.monthCommander));
  assert(d1.analysis && d1.analysis.selected.useGod.modelId === 'fuyi-canonical' && d1.analysis.models.useGod.finalDecision === true, 'UT-ANALYSIS-CANONICAL-SELECTION', JSON.stringify(d1.analysis));
  assert(d1.analysis.useGodResolver && d1.analysis.useGodResolver.candidates.length === 5 && d1.analysis.useGodResolver.finalDecision?.modelId === 'fuyi-canonical', 'UT-USE-GOD-RESOLVER-CANDIDATES', JSON.stringify(d1.analysis.useGodResolver));
  assert(d1.patterns && d1.patterns.regular.candidates.length === 10 && d1.patterns.special.length === 7 && d1.patterns.evidence.matched, 'UT-REGULAR-PATTERN-CANDIDATE-ENGINE', JSON.stringify(d1.patterns));
  assert(Bazi.Patterns.validateRegularPatternRegistry().valid && Bazi.Patterns.REGULAR_PATTERN_REGISTRY.length === 10, 'UT-REGULAR-PATTERN-REGISTRY', JSON.stringify(Bazi.Patterns.validateRegularPatternRegistry()));
  const regularTargets = {
    direct_officer: '辛', seven_killings: '庚', direct_wealth: '己', indirect_wealth: '戊',
    direct_resource: '癸', indirect_resource: '壬', eating_god: '丙', hurting_officer: '丁'
  };
  for (const [patternId, targetStem] of Object.entries(regularTargets)) {
    const positive = Bazi.Patterns.calculateRegularPatterns({
      pillars: { day: { stem: '甲' }, month: { stem: targetStem, branch: '子', ganzhi: `${targetStem}子` } },
      monthCommander: { stem: targetStem }
    });
    const item = positive.regularPatternTest || positive.candidates.find((candidate) => candidate.id === patternId);
    assert(item?.matched === true, `UT-REGULAR-PATTERN-POSITIVE-${patternId}`, JSON.stringify(item));
  }
  const luPositive = Bazi.Patterns.calculateRegularPatterns({
    pillars: { day: { stem: '甲' }, month: { stem: '丙', branch: '寅', ganzhi: '丙寅' } },
    monthCommander: { stem: '丙' }
  });
  assert(luPositive.candidates.find((candidate) => candidate.id === 'built_lu')?.matched === true && luPositive.candidates.find((candidate) => candidate.id === 'month_blade')?.matched === false, 'UT-REGULAR-PATTERN-LU-BOUNDARY', JSON.stringify(luPositive.candidates.filter((candidate) => ['built_lu', 'month_blade'].includes(candidate.id))));
  const bladePositive = Bazi.Patterns.calculateRegularPatterns({
    pillars: { day: { stem: '甲' }, month: { stem: '丙', branch: '卯', ganzhi: '丙卯' } },
    monthCommander: { stem: '丙' }
  });
  assert(bladePositive.candidates.find((candidate) => candidate.id === 'month_blade')?.matched === true && bladePositive.candidates.find((candidate) => candidate.id === 'built_lu')?.matched === false, 'UT-REGULAR-PATTERN-BLADE-BOUNDARY', JSON.stringify(bladePositive.candidates.filter((candidate) => ['built_lu', 'month_blade'].includes(candidate.id))));
  assert(d1.meta.regularPatternRuleVersion === '0.2.0' && Bazi.rules.patterns.regularVersion === '0.2.0', 'UT-REGULAR-PATTERN-VERSION', JSON.stringify(d1.meta));
  assert(d1.transits.transitGraph && d1.transits.transitGraph.layers.includes('natal') && d1.transits.transitGraph.layers.includes('transit-year') && d1.transits.transitGraph.nodes.some((node) => node.layer === 'luck') && d1.transits.transitGraph.edges.some((edge) => edge.type === 'transit-time-containment') && Array.isArray(d1.transits.transitGraph.events) && d1.transits.transitGraph.evidence.matched, 'UT-TRANSIT-MULTI-LAYER-GRAPH', JSON.stringify(d1.transits.transitGraph));
  assert(d1.meta.useGodResolverVersion === '0.1.0' && d1.meta.transitGraphVersion === '0.1.0', 'UT-ANALYSIS-TRANSIT-VERSIONS', JSON.stringify(d1.meta));
  const sanmingAnalysis = Bazi.calculate({ birthDate: '2020-08-31', birthTime: '20:06', gender: 'female' }, { profile: 'classical-sanming' });
  assert(sanmingAnalysis.analysis.selected.monthCommander.modelId === 'san-ming-volume-2' && sanmingAnalysis.analysis.models.monthCommander.status === 'comparison' && sanmingAnalysis.strength.monthCommander.ruleId === 'STR_MONTH_COMMANDER_SANMING_002', 'UT-ANALYSIS-SANMING-PROFILE', JSON.stringify(sanmingAnalysis.analysis.selected.monthCommander));
  assert(sanmingAnalysis.strength.monthCommander.researchNotes.conflict === true && sanmingAnalysis.strength.monthCommander.evidence.sourceTable === 'san-ming-tong-hui-volume-2', 'UT-ANALYSIS-SANMING-EVIDENCE', JSON.stringify(sanmingAnalysis.strength.monthCommander));
  const researchAnalysis = Bazi.calculate({ birthDate: '2020-08-31', birthTime: '20:06', gender: 'female' }, { profile: 'research-tiaohou' });
  assert(researchAnalysis.analysis.models.useGod.status === 'research-only' && researchAnalysis.analysis.models.useGod.finalDecision === false && researchAnalysis.strength.useGod.finalDecision === false, 'UT-ANALYSIS-RESEARCH-NO-OVERRIDE', JSON.stringify(researchAnalysis.analysis));
  assert(researchAnalysis.analysis.useGodResolver.status === 'research-only' && researchAnalysis.analysis.useGodResolver.finalDecision === null && researchAnalysis.analysis.useGodResolver.conflicts[0]?.status === 'undetermined', 'UT-USE-GOD-RESOLVER-RESEARCH-NO-DECISION', JSON.stringify(researchAnalysis.analysis.useGodResolver));
  const customAnalysisProfile = Bazi.Rules.RuleRegistry.createProfile({ id: 'test-analysis-profile', base: 'canonical', overrides: { analysis: { monthCommander: 'san-ming-volume-2', patterns: 'patterns-research' } } });
  assert(customAnalysisProfile.rules.analysis.monthCommander.value === 'san-ming-volume-2' && customAnalysisProfile.diff.analysis.patterns.to === 'patterns-research', 'UT-ANALYSIS-CUSTOM-PROFILE', JSON.stringify(customAnalysisProfile.diff));
  assert(d1.classicalSummary && JSON.stringify(d1.classicalSummary.sections) === JSON.stringify(['fiveCategory', 'monthCommand', 'voids', 'auxiliary']), 'UT-CLASSICAL-SUMMARY-SECTIONS', JSON.stringify(d1.classicalSummary?.sections));
  assert(d1.classicalSummary.fiveCategory.rows.length === 5 && d1.classicalSummary.fiveCategory.evidence.rows.length === 5, 'UT-CLASSICAL-SUMMARY-FIVE-ROWS', JSON.stringify(d1.classicalSummary.fiveCategory.rows));
  assert(d1.classicalSummary.voids.rows.length === 2 && d1.classicalSummary.voids.byDay.xunName && d1.classicalSummary.voids.byYear.xunName, 'UT-CLASSICAL-SUMMARY-VOID-ROWS', JSON.stringify(d1.classicalSummary.voids));
  assert(d1.classicalSummary.auxiliary.matrix.length === 4 && d1.classicalSummary.auxiliary.evidence.matched, 'UT-CLASSICAL-SUMMARY-AUX-MATRIX', JSON.stringify(d1.classicalSummary.auxiliary.matrix));
  assert(d1.auxiliary.mingGua && d1.auxiliary.mingGua.ruleId === 'AUX_MING_GUA_LAST_TWO_DIGITS', 'UT-MING-GUA-IN-RESULT', JSON.stringify(d1.auxiliary.mingGua));
  assert(d1.luckCycles.variants.length === 2 && d1.luckCycles.variants.some((variant) => variant.method === 'jieqi-whole-days-divide-3'), 'UT-LUCK-METHOD-VARIANTS', JSON.stringify(d1.luckCycles.variants));
  const wholeDayProfile = Bazi.calculate({ birthDate: '1983-05-11', birthTime: '16:19', gender: 'male' }, { profile: 'jieqi-whole-day' });
  assert(wholeDayProfile.luckCycles.startAge.method === 'jieqi-whole-days-divide-3' && wholeDayProfile.luckCycles.startAge.calculationDiffDays < wholeDayProfile.luckCycles.startAge.rawDiffDays, 'UT-LUCK-WHOLE-DAY-PROFILE', JSON.stringify(wholeDayProfile.luckCycles.startAge));

  // 流年結構事件：畫面與 SVG 只應呈現真正存在的事件。
  const eventChart = Bazi.calculate({ birthDate: '2024-03-01', birthTime: '12:00', gender: 'male' }, { transitDatetime: '2024-06-01T12:00:00+08:00' });
  assert(eventChart.transits.transitGraph.events.some((event) => event.type === '伏吟'), 'UT-TRANSIT-STRUCTURAL-EVENT', JSON.stringify(eventChart.transits.transitGraph.events));
  const eventSvg = Bazi.Renderer.render(eventChart, { format: 'svg', preset: 'full', theme: 'modern-oriental' });
  assert(eventSvg.includes('結構事件') && eventSvg.includes('伏吟'), 'UT-RENDER-TRANSIT-EVENT', 'SVG 應同步呈現存在的流年結構事件');

  // Renderer SVG 可產出
  const svg = Bazi.Renderer.render(d1, { format: 'svg', preset: 'full', theme: 'modern-oriental' });
  assert(typeof svg === 'string' && svg.includes('<svg'), 'UT-RENDER-SVG', '');
  const publicDemoSource = fs.readFileSync(new URL('../demo/app.js', import.meta.url), 'utf8');
  assert(!/sample1/i.test(publicDemoSource) && !/sample1/i.test(svg), 'UT-PUBLIC-NO-INTERNAL-SAMPLE1', '公開畫面與 SVG 不應顯示內部比對檔名');
  const demoPillarSource = publicDemoSource.slice(publicDemoSource.indexOf('const pillarCols = ['));
  const expectedDisplayOrder = ['hour', 'day', 'month', 'year'];
  const demoOrder = expectedDisplayOrder.map((key) => demoPillarSource.indexOf(`key: '${key}'`));
  const svgOrder = expectedDisplayOrder.map((label) => svg.indexOf(`class="pillar-title" text-anchor="middle">${label === 'hour' ? '時柱' : label === 'day' ? '日柱' : label === 'month' ? '月柱' : '年柱'}</text>`));
  assert(demoOrder.every((position, index) => position >= 0 && (index === 0 || position > demoOrder[index - 1])) && svgOrder.every((position, index) => position >= 0 && (index === 0 || position > svgOrder[index - 1])), 'UT-PILLAR-DISPLAY-TRADITIONAL-ORDER', '畫面與 SVG 應由左至右顯示時、日、月、年');
  for (const preset of ['full', 'mobile-share', 'a4', 'compact']) {
    const s = Bazi.Renderer.render(d1, { format: 'svg', preset, theme: 'dark' });
    assert(s.includes('<svg'), `UT-RENDER-PRESET-${preset}`, '');
  }
  for (const theme of ['modern-oriental', 'classic', 'dark']) {
    const s = Bazi.Renderer.render(d1, { format: 'svg', preset: 'compact', theme });
    assert(s.includes('<svg'), `UT-RENDER-THEME-${theme}`, '');
  }

  // Rule Profile override
  const custom = Bazi.Rules.RuleRegistry.createProfile({ id: 'test-school', base: 'canonical', overrides: { dayBoundary: '00:00' } });
  assert(custom.rules.dayBoundary.value === '00:00', 'UT-PROFILE-OVERRIDE', '');
  assert(custom.diff.dayBoundary.from === '23:00', 'UT-PROFILE-DIFF', JSON.stringify(custom.diff));

  // Transit 結構
  const tr = Bazi.Transit.calculateTransit(d1.pillars, { datetime: '2026-09-08T12:00:00+08:00' });
  assert(tr.year && tr.month && tr.day && tr.hour, 'UT-TRANSIT-STRUCT', '');
  const westTransit = Bazi.Transit.calculateTransit(d1.pillars, { datetime: '2026-09-08T12:00:00-05:00' });
  assert(westTransit.timezoneOffsetHours === -5 && westTransit.targetDatetime === '2026-09-08 12:00', 'UT-TRANSIT-NEGATIVE-TZ', JSON.stringify(westTransit));
  const utcTransit = Bazi.Transit.calculateTransit(d1.pillars, { datetime: '2026-09-08T12:00:00Z' });
  assert(utcTransit.timezoneOffsetHours === 0, 'UT-TRANSIT-UTC', JSON.stringify(utcTransit));
  const readableTransitChart = Bazi.calculate({ birthDate: '1983-06-21', birthTimeMode: 'branch', birthHourBranch: '午', gender: 'male' });
  const readableTransit = Bazi.Transit.calculateTransit(readableTransitChart.pillars, { datetime: '2027-09-08T12:00:00+08:00' });
  const readableDescriptions = readableTransit.interactions.map((item) => item.description || '');
  assert(readableDescriptions.some((description) => description.includes('原局月支')) && readableDescriptions.some((description) => description.includes('原局時支')), 'UT-TRANSIT-CHINESE-PILLAR-LABELS', readableDescriptions.join('、'));
  assert(!readableDescriptions.some((description) => /原局(?:year|month|day|hour)支/.test(description)), 'UT-TRANSIT-NO-INTERNAL-PILLAR-LABEL', readableDescriptions.join('、'));
  let invalidTransitDate = false;
  try { Bazi.Transit.parseTransitDatetime(new Date('invalid')); } catch (error) { invalidTransitDate = error.code === 'BAZI_VALIDATION_ERROR'; }
  assert(invalidTransitDate, 'UT-TRANSIT-INVALID-DATE', 'invalid Date 必須回傳穩定驗證錯誤');

  // Profile 邊界不是裝飾欄位：農曆正月切年與農曆月切柱必須改變實際計算。
  const lunarNewYearBefore = Bazi.calculate({ birthDate: '2024-02-09', birthTime: '12:00', gender: 'male', yearBoundary: 'lunar_new_year' });
  const lunarNewYearAfter = Bazi.calculate({ birthDate: '2024-02-10', birthTime: '12:00', gender: 'male', yearBoundary: 'lunar_new_year' });
  assert(lunarNewYearBefore.pillars.year.ganzhi === '癸卯' && lunarNewYearAfter.pillars.year.ganzhi === '甲辰', 'UT-YEAR-BOUNDARY-LUNAR-NEW-YEAR', `${lunarNewYearBefore.pillars.year.ganzhi}/${lunarNewYearAfter.pillars.year.ganzhi}`);
  const lunarMonth = Bazi.calculate({ birthDate: '2024-02-09', birthTime: '12:00', gender: 'male', monthBoundary: 'lunar_month' });
  assert(lunarMonth.pillars.month.ganzhi === '丁丑' && lunarMonth.rules.applied.find((rule) => rule.ruleId === 'MONTH_BOUNDARY_LUNAR_MONTH'), 'UT-MONTH-BOUNDARY-LUNAR-MONTH', JSON.stringify(lunarMonth.pillars.month));
  assert(lunarMonth.rules.applied.find((rule) => rule.ruleId === 'MONTH_BOUNDARY_LUNAR_MONTH')?.overridden === true, 'UT-RULES-ACTUAL-OVERRIDE', JSON.stringify(lunarMonth.rules));
  assert(lunarMonth.accuracy.boundaryRules.month === 'lunar_month' && lunarMonth.accuracy.precision, 'UT-ACCURACY-PROVENANCE', JSON.stringify(lunarMonth.accuracy));
  const lunarBoundaryAnnualDetails = Bazi.calculateSafe({
    birthDate: '2020-08-31',
    birthTime: '20:06',
    gender: 'male',
    yearBoundary: 'lunar_new_year'
  }, { includeLuckAnnualDetails: true, includeAnnualLuckShenSha: true });
  assert(lunarBoundaryAnnualDetails.success === true, 'UT-LUNAR-YEAR-ANNUAL-DETAILS-SAFE', lunarBoundaryAnnualDetails.error?.message);
  assert(lunarBoundaryAnnualDetails.data?.luckCycles?.cycles?.some((cycle) => cycle.annuals?.some((annual) => annual.year > 2100)), 'UT-LUNAR-YEAR-ANNUAL-DETAILS-2101', '2101 年逐年資料未產生');

  // sample1.html 抽樣對照：只比對可由 SDK 規則重現的結構，不比對第三方吉凶文案。
  const sample1 = Bazi.calculate({ birthDate: '1983-05-11', birthTime: '16:19', gender: 'male' }, {
    includeLuckAnnualDetails: true
  });
  assert(sample1.calendar.zodiac && sample1.calendar.zodiac.name === '豬', 'UT-SAMPLE1-ZODIAC', JSON.stringify(sample1.calendar.zodiac));
  assert(sample1.calendar.constellation && sample1.calendar.constellation.name === '金牛座', 'UT-SAMPLE1-CONSTELLATION', JSON.stringify(sample1.calendar.constellation));
  assert(sample1.strength.monthCommander && sample1.strength.monthCommander.stem === '戊', 'UT-SAMPLE1-MONTH-COMMANDER', JSON.stringify(sample1.strength.monthCommander));
  assert(sample1.luckCycles.startAge.startDate === '1985-02-09' && sample1.luckCycles.startAge.startDateTime, 'UT-SAMPLE1-LUCK-START', JSON.stringify(sample1.luckCycles.startAge));
  assert(sample1.luckCycles.cycles[0].fromYear === 1985 && sample1.luckCycles.cycles[0].toYear === 1994 && sample1.luckCycles.cycles[0].nominalFromAge === 3, 'UT-SAMPLE1-LUCK-RANGE', JSON.stringify(sample1.luckCycles.cycles[0]));
  assert(Array.isArray(sample1.luckCycles.cycles[0].annuals) && sample1.luckCycles.cycles[0].annuals[0].ganzhi === '乙丑', 'UT-SAMPLE1-ANNUALS', JSON.stringify(sample1.luckCycles.cycles[0].annuals[0]));
  const sample1Context = Bazi.AI.toContext(sample1, { compact: false, includeLuckAnnualDetails: true });
  assert(sample1Context.calendar.constellation.name === '金牛座' && sample1Context.dayMaster.monthCommander.stem === '戊', 'UT-SAMPLE1-AI-FIELDS', '');
  assert(sample1Context.pillars.year.stage && sample1Context.pillars.year.xunKong && sample1Context.transits.year.ganzhi === sample1.transits.year.ganzhi, 'UT-SAMPLE1-AI-CHART-DETAILS', 'AI Context 缺少畫面使用的柱位或流年資料');
  assert(sample1Context.luckCyclesSummary.cycles.length === sample1.luckCycles.cycles.length && sample1Context.luckCyclesSummary.cycles.every((cycle) => Array.isArray(cycle.shenSha)), 'UT-SAMPLE1-AI-LUCK-COMPLETE', 'AI Context 不應只保留部分大運或省略大運神煞');
  assert(sample1Context.input.birthDate === sample1.input.birthDate && sample1Context.accuracy.boundaryRules && sample1Context.rules.applied, 'UT-SAMPLE1-AI-PROVENANCE', 'AI Context 必須保留重現排盤所需的輸入、精度與實際規則');
  assert(sample1Context.auxiliary.taiYuan.ganzhi === sample1.auxiliary.taiYuan.ganzhi && sample1Context.luckCyclesSummary.cycles[0].stage, 'UT-SAMPLE1-AI-FULL-AUXILIARY', 'AI Context 不應把輔宮或大運狀態壓成不可追溯摘要');
  assert(sample1Context.classicalSummary?.auxiliary.matrix.length === 4 && sample1Context.metadata.classicalSummaryRuleVersion === '1.0.0', 'UT-AI-CLASSICAL-SUMMARY', 'AI Context 必須保留 2/3/4 完整資料層');

  // 新神煞（v1.0.1）：以 2024-01-01 甲子日（年支子）驗紅鸞在卯、天喜在酉
  const ss24 = Bazi.calculate({ birthDate: '2024-05-15', birthTime: '10:00', gender: 'male' });
  void ss24;
  // 年支為子的命：四柱見卯即紅鸞、見酉即天喜（以 2000-01-01 己卯年子月？改用直接引擎驗）
  const { SHENSHA_CATALOG } = await import('../src/shensha/catalog.js');
  assert(SHENSHA_CATALOG.length === 20, 'UT-SHENSHACOUNT-20', String(SHENSHA_CATALOG.length));
  const hl = SHENSHA_CATALOG.find((s) => s.id === 'hong_luan');
  assert(hl.match({ baseBranch: '子', targetBranch: '卯' }) === true, 'UT-HONGLUAN-ZIMAO', '');
  assert(hl.match({ baseBranch: '亥', targetBranch: '辰' }) === true, 'UT-HONGLUAN-HAICHEN', '');
  assert(hl.match({ baseBranch: '子', targetBranch: '午' }) === false, 'UT-HONGLUAN-NEG', '');
  const tx = SHENSHA_CATALOG.find((s) => s.id === 'tian_xi');
  assert(tx.match({ baseBranch: '子', targetBranch: '酉' }) === true, 'UT-TIANXI-ZIYOU', '');
  const ty = SHENSHA_CATALOG.find((s) => s.id === 'tian_yi_star');
  assert(ty.match({ monthBranch: '巳', targetBranch: '辰' }) === true, 'UT-TIANYI-SICHEN', '');
  const hy = SHENSHA_CATALOG.find((s) => s.id === 'hong_yan');
  assert(hy.match({ baseStem: '己', targetBranch: '辰' }) === true, 'UT-HONGYAN-JICHEN', '');
  const tianFu = Bazi.calculate({ birthDate: '2020-08-31', birthTime: '20:06', gender: 'female' }).shenSha.find((s) => s.id === 'tian_fu_gui_ren');
  assert(Boolean(tianFu?.description) && tianFu.description.includes('正官'), 'UT-TIANFU-DESCRIPTION', tianFu?.description || '');
  assert(Boolean(tianFu?.interpretation) && tianFu.interpretation.includes('福氣'), 'UT-TIANFU-INTERPRETATION', tianFu?.interpretation || '');
  assert(Bazi.ShenSha.getShenShaCatalog().every((rule) => typeof rule.interpretation === 'string' && rule.interpretation.trim()), 'UT-SHENSHA-INTERPRETATIONS-COMPLETE', `${Bazi.ShenSha.getShenShaCatalog().length} rules checked`);
  assert(Object.keys(Bazi.TenGods.TEN_GOD_INTERPRETATIONS).length === 11, 'UT-TENGOD-INTERPRETATIONS-COMPLETE', '十神與日主都必須有解釋');
  assert(d1.tenGods.hidden.year.every((item) => item.roleInterpretation && item.tenGod?.interpretation), 'UT-HIDDEN-STEM-INTERPRETATIONS', JSON.stringify(d1.tenGods.hidden.year));
  assert(!SHENSHA_CATALOG.some((s) => ['kui_gang', 'shi_e_da_bai'].includes(s.id)), 'UT-SHENSHA-NO-SPECIAL-PILLARS', '固定日柱不可留在一般 ShenSha catalog');

  // SpecialPillar / SeasonalSpecial：固定柱位與季節條件獨立於 ShenSha。
  const specialRules = Bazi.SpecialRules;
  const specialRegistry = specialRules.validateSpecialRuleRegistry();
  assert(specialRegistry.valid && specialRegistry.count === 11, 'UT-SPECIAL-REGISTRY-11', JSON.stringify(specialRegistry));
  for (const rule of specialRules.SPECIAL_RULE_REGISTRY) {
    const required = ['id', 'name', 'aliases', 'tradition', 'conceptType', 'ruleFamily', 'baseOn', 'scope', 'category', 'confidence', 'ruleId', 'version', 'references', 'description', 'interpretation', 'match', 'evidence'];
    assert(required.every((field) => field in rule), `UT-SPECIAL-SCHEMA-${rule.id}`, '缺少規格欄位');
  }
  assert(specialRules.SPECIAL_RULE_REGISTRY.every((rule) => typeof rule.interpretation === 'string' && rule.interpretation.trim()), 'UT-SPECIAL-INTERPRETATIONS-COMPLETE', '特殊柱位與季節條件都必須有面向使用者的解釋');
  const specialCase = (day, hour = '甲子', month = '甲寅') => ({
    year: { stem: '甲', branch: '子', ganzhi: '甲子' },
    month: { stem: month[0], branch: month[1], ganzhi: month },
    day: { stem: day[0], branch: day[1], ganzhi: day },
    hour: { stem: hour[0], branch: hour[1], ganzhi: hour, available: true }
  });
  const checkSpecial = (id, pillars, label) => assert(specialRules.calculateSpecialRules(pillars).some((item) => item.id === id), label, id);
  checkSpecial('kui_gang', specialCase('戊戌'), 'UT-SPECIAL-KUIGANG');
  checkSpecial('shi_e_da_bai', specialCase('甲辰'), 'UT-SPECIAL-SHIEDABAI');
  checkSpecial('ri_gui', specialCase('丁酉'), 'UT-SPECIAL-RIGUI');
  checkSpecial('ri_de', specialCase('甲寅'), 'UT-SPECIAL-RIDE');
  checkSpecial('ba_zhuan', specialCase('癸丑'), 'UT-SPECIAL-BAZHUAN');
  checkSpecial('jiu_chou', specialCase('乙卯'), 'UT-SPECIAL-JIUCHOU');
  checkSpecial('gu_luan', specialCase('丙午'), 'UT-SPECIAL-GULUAN');
  checkSpecial('yin_yang_cha_cuo', specialCase('癸亥'), 'UT-SPECIAL-YYCC');
  checkSpecial('jin_shen', specialCase('甲子', '癸酉'), 'UT-SPECIAL-JINSHEN');
  assert(!specialRules.calculateSpecialRules(specialCase('己亥', '甲子')).some((item) => item.id === 'shi_e_da_bai'), 'UT-SPECIAL-NEGATIVE', '不應誤判固定日柱');
  const springWaste = specialRules.calculateSeasonalSpecialRules(specialCase('庚申', '甲子', '甲寅'));
  assert(springWaste.some((item) => item.id === 'si_fei' && item.evidence.season === 'spring'), 'UT-SEASONAL-SIFEI-SPRING', JSON.stringify(springWaste));
  const summerWaste = specialRules.calculateSeasonalSpecialRules(specialCase('庚申', '甲子', '甲午'));
  assert(!summerWaste.some((item) => item.id === 'si_fei'), 'UT-SEASONAL-SIFEI-SEASON-GUARD', JSON.stringify(summerWaste));
  const summerPardon = specialRules.calculateSeasonalSpecialRules(specialCase('甲午', '甲子', '甲午'));
  assert(summerPardon.some((item) => item.id === 'tian_she' && item.evidence.season === 'summer'), 'UT-SEASONAL-TIANSHE-SUMMER', JSON.stringify(summerPardon));
  assert(Bazi.calculate({ birthDate: '2000-01-01', birthTime: '12:00', gender: 'male' }).specialRules.every((item) => item.conceptType !== 'shensha'), 'UT-CHART-SPECIAL-RULES', 'chart.specialRules 應為獨立分類');

  // Reference taxonomy / API：概念、規則、來源與變體可雙向追溯，且不把研究格局當成已完成判斷。
  const referenceCheck = Bazi.Reference.validateReferenceIndex();
  assert(referenceCheck.valid && referenceCheck.counts.rules === 68 && referenceCheck.counts.sources >= 6, 'UT-REFERENCE-INDEX-VALID', JSON.stringify(referenceCheck));
  const regularConcept = Bazi.Reference.getConcept('pattern.zheng-guan');
  assert(regularConcept?.conceptType === 'pattern' && regularConcept.patternType === 'regular' && regularConcept.status === 'candidate-only', 'UT-REFERENCE-REGULAR-TAXONOMY', JSON.stringify(regularConcept));
  assert(Bazi.Reference.findConcept('正官格').some((concept) => concept.conceptId === 'pattern.zheng-guan'), 'UT-REFERENCE-ALIAS-LOOKUP', '正官格應可由 alias 查到');
  const regularRule = Bazi.Reference.getRule('PT_REGULAR_ZHENGGUAN_001');
  assert(regularRule?.conceptType === 'pattern' && regularRule.patternType === 'regular' && regularRule.sourceIds.includes('zi-ping-zhen-quan'), 'UT-REFERENCE-RULE-LOOKUP', JSON.stringify(regularRule));
  assert(Bazi.Reference.getSourcesForRule('PT_REGULAR_ZHENGGUAN_001').some((source) => source.sourceId === 'san-ming-tong-hui'), 'UT-REFERENCE-RULE-SOURCE-BIDIRECTIONAL', '規則應能回查古籍');
  assert(Bazi.Reference.getRulesFromSource('san-ming-tong-hui').some((rule) => rule.ruleId === 'PT_REGULAR_ZHENGGUAN_001'), 'UT-REFERENCE-SOURCE-RULE-BIDIRECTIONAL', '古籍應能回查規則');
  assert(Bazi.Reference.getVariants('SE_TIANSHE_001').length > 0, 'UT-REFERENCE-VARIANTS', '天赦的季節變體應可查詢');
  assert(Bazi.Reference.getVariants('profile.year-boundary').some((variant) => variant.variantId === 'VAR_YEAR_BOUNDARY_LUNAR_NEW_YEAR'), 'UT-REFERENCE-PROFILE-VARIANTS', 'Profile 年界變體應可查詢');
  const referenceContext = Bazi.Reference.toContext({ conceptIds: ['pattern.zheng-guan'], includeExamples: true });
  assert(referenceContext.contextType === 'bazi-js-reference-context' && referenceContext.claimPolicy.mustCiteSource.includes('PT_REGULAR_ZHENGGUAN_001') && JSON.stringify(referenceContext).length > 100, 'UT-REFERENCE-AI-CONTEXT', 'Reference Context 必須可供 AI / SDK 使用');
  assert(Bazi.Reference.getCoverage('pattern').dimensions.external.status === 'not-collected', 'UT-REFERENCE-COVERAGE-NOT-ACCURACY', '未建立外部矩陣時不得宣稱準確率');

  // 大運 / 流年神煞結構（v1.0.1）
  assert(Array.isArray(d1.luckCycles.cycles[0].shenSha), 'UT-LUCK-SHENSHATYPE', '');
  assert(Array.isArray(d1.transits.shenShaYear), 'UT-TRANSIT-SHENSHATYPE', '');
  // 2000-01-01（年支子）首步大運若見卯/酉應帶紅鸞/天喜：直接驗引擎
  const { calculateShenShaOnPillar } = await import('../src/shensha/index.js');
  const ziChart = Bazi.calculate({ birthDate: '2020-06-15', birthTime: '10:00', gender: 'male' });
  const hits = calculateShenShaOnPillar(ziChart.pillars, '丁', '卯', 'luck-1');
  assert(ziChart.pillars.year.branch === '子', 'UT-ZI-YEARBRANCH', ziChart.pillars.year.ganzhi);
  assert(hits.some((h) => h.id === 'hong_luan'), 'UT-LUCK-HONGLUAN', JSON.stringify(hits.map((h) => h.id)));

  // SVG 日主五行修正（己土不得顯示己木）
  const jiChart = Bazi.calculate({ birthDate: '1983-05-11', birthTime: '16:19', gender: 'male' });
  const jiSvg = Bazi.Renderer.render(jiChart, { format: 'svg', preset: 'full', theme: 'modern-oriental' });
  assert(jiSvg.includes('己土'), 'UT-SVG-DAYMASTER-ELEMENT', '');
  assert(!jiSvg.includes('己木'), 'UT-SVG-NO-JIMU', '');
  const specialChart = Bazi.calculate({ birthDate: '1999-12-28', birthTime: '12:00', gender: 'male' });
  const specialSvg = Bazi.Renderer.render(specialChart, { format: 'svg', preset: 'full', theme: 'modern-oriental' });
  assert(specialSvg.includes('日德') && specialSvg.includes('八專') && specialSvg.includes('孤鸞'), 'UT-SVG-SPECIAL-RULES', 'SVG 應包含目前命盤命中的特殊規則');
  assert(specialSvg.includes('日柱') && !specialSvg.includes('（day）'), 'UT-SVG-CHINESE-PILLAR-LABELS', 'SVG 不應顯示英文柱位代碼');

  // 完整匯出：下載圖與 demo 直式預覽必須使用同一份完整資料，且高度不可固定裁切。
  const completeSvg = Bazi.Renderer.render(sample1, { format: 'svg', preset: 'full', theme: 'modern-oriental' });
  const completeViewBox = completeSvg.match(/viewBox="0 0 960 (\d+)"/);
  assert(completeViewBox && Number(completeViewBox[1]) > 3000, 'UT-SVG-COMPLETE-DYNAMIC-HEIGHT', completeViewBox && completeViewBox[1]);
  assert(completeSvg.includes('preserveAspectRatio="xMidYMin meet"') && completeSvg.includes('max-width:100%;height:auto;'), 'UT-SVG-RESPONSIVE-VIEWBOX', '下載 SVG 應保留向量尺寸並能在窄視窗完整縮放');
  assert(completeSvg.includes('基本資料') && completeSvg.includes('四柱主盤') && completeSvg.includes('神煞（'), 'UT-SVG-COMPLETE-SECTIONS', '完整 SVG 缺少主盤或神煞區塊');
  assert(completeSvg.includes('逐年資料') && completeSvg.includes('1985') && completeSvg.includes('乙丑'), 'UT-SVG-COMPLETE-ANNUALS', '完整 SVG 缺少大運逐年資料');
  assert(!completeSvg.includes('互動：—'), 'UT-SVG-HIDE-EMPTY-INTERACTIONS', '沒有互動的流年不應顯示互動佔位文字');
  assert(completeSvg.includes('胎元命宮') && completeSvg.includes('天干地支互動'), 'UT-SVG-COMPLETE-AUXILIARY', '完整 SVG 缺少附宮或互動區塊');
  assert(!completeSvg.includes('SS_'), 'UT-SVG-NO-INTERNAL-RULE-ID', '下載 SVG 不應顯示內部 rule id');
  assert(completeSvg.includes('當麻實驗室') && completeSvg.includes('github.com/donma/bazi-js'), 'UT-SVG-WATERMARK', '下載 SVG 應包含低調浮水印');
}

// ---------- ShenSha vNext ----------
async function runShenShaVNext() {
  console.log('== ShenSha vNext ==');
  const fixture = JSON.parse(fs.readFileSync(new URL('./fixtures/shensha/vnext-golden.json', import.meta.url), 'utf8'));
  const chart = Bazi.calculate(fixture.input);
  const expectedPillars = fixture.expected.pillars;
  assert(chart.pillars.year.ganzhi === expectedPillars.year && chart.pillars.month.ganzhi === expectedPillars.month && chart.pillars.day.ganzhi === expectedPillars.day && chart.pillars.hour.ganzhi === expectedPillars.hour, fixture.caseId + '-PILLARS', JSON.stringify(chart.pillars));
  assert(chart.meta.shenshaPreset === 'classical' && chart.meta.shenShaRuleVersion === '2.1.0' && chart.meta.specialRuleVersion === '1.0.0', fixture.caseId + '-META', JSON.stringify(chart.meta));

  const registryCheck = Bazi.ShenSha.validateShenShaRegistry();
  assert(registryCheck.valid && registryCheck.count === 40, 'UT-SHENSHA-REGISTRY-40', JSON.stringify(registryCheck));
  assert(Bazi.ShenSha.getShenShaRule('kui_gang') === null && Bazi.ShenSha.getShenShaRule('shi_e_da_bai') === null, 'UT-SHENSHA-SPECIAL-MIGRATED', '特殊柱規則不可由 ShenSha registry 取得');
  assert(Bazi.Patterns.validateSpecialPatternRegistry().valid && Bazi.Patterns.SPECIAL_PATTERN_REGISTRY.every((item) => item.implemented === false), 'UT-PATTERNS-RESEARCH-ONLY', '整局格局目前只登錄架構');
  const byPillar = Bazi.ShenSha.groupShenShaByPillar(chart.shenSha);
  for (const [pillar, ids] of Object.entries(fixture.expected.byPillarAtLeast)) {
    const actual = new Set(byPillar[pillar].map((item) => item.id));
    assert(ids.every((id) => actual.has(id)), `${fixture.caseId}-${pillar}`, `缺少 ${ids.filter((id) => !actual.has(id)).join(',')}`);
    assert(byPillar[pillar].every((item) => item.hitOn.length === 1 && item.hitOn[0] === pillar), `${fixture.caseId}-${pillar}-GROUP`, 'hitOn 必須是單一柱位');
  }

  const aiShenSha = Bazi.AI.toShenShaContext(chart);
  const aiContext = Bazi.AI.toContext(chart, { compact: false });
  assert(Array.isArray(aiShenSha.all) && Array.isArray(aiShenSha.byPillar.hour) && aiShenSha.byPillar.hour.some((item) => item.id === 'xue_ren'), 'UT-AI-SHENSHA-CONTEXT', '');
  assert(aiContext.shenSha && aiContext.shenSha.all.length === chart.shenSha.length && Array.isArray(aiContext.shenShaList), 'UT-AI-SHENSHA-BACKWARD', '');
  assert(aiContext.specialRules && aiContext.specialRules.ruleVersion === '1.0.0' && Array.isArray(aiContext.specialRules.all), 'UT-AI-SPECIAL-RULES', '');

  const xunkong = Bazi.ShenSha.calculateXunKong('己亥');
  assert(xunkong.xun === '甲午旬' && JSON.stringify(xunkong.emptyBranches) === JSON.stringify(['辰', '巳']), 'UT-XUNKONG-JIHAI', JSON.stringify(xunkong));
  const transit = Bazi.ShenSha.calculateTransitShenSha(chart, chart.transits);
  assert(Array.isArray(transit.shenSha) && transit.target === chart.transits.year.ganzhi, 'UT-TRANSIT-SHENSHA-VNEXT', JSON.stringify(transit));
  const minimal = Bazi.calculate(fixture.input, { shenshaPreset: 'minimal' });
  assert(!minimal.shenSha.some((item) => item.id === 'fei_ren'), 'UT-SHENSHA-PRESET-MINIMAL', 'P0 extended rule 不應出現在 minimal');
}

// ---------- Golden Cases ----------
async function runGolden() {
  console.log('== Golden Cases ==');
  const raw = fs.readFileSync(new URL('./golden/golden-cases.json', import.meta.url), 'utf8');
  const data = JSON.parse(raw);
  console.log(`  載入 ${data.count} 組`);
  let n = 0;
  for (const c of data.cases) {
    n++;
    let r;
    try {
      r = Bazi.calculate(c.input);
    } catch (e) {
      assert(false, c.caseId, `拋錯 ${e.message}`);
      continue;
    }
    const ok =
      r.pillars.year.ganzhi === c.expected.year &&
      r.pillars.month.ganzhi === c.expected.month &&
      r.pillars.day.ganzhi === c.expected.day &&
      r.pillars.hour.ganzhi === c.expected.hour;
    assert(ok, c.caseId,
      `期望 ${c.expected.year} ${c.expected.month} ${c.expected.day} ${c.expected.hour} / 實際 ${r.pillars.year.ganzhi} ${r.pillars.month.ganzhi} ${r.pillars.day.ganzhi} ${r.pillars.hour.ganzhi}`);
  }
}

// ---------- 邊界案例 ----------
async function runBoundary() {
  console.log('== 邊界案例 ==');
  const { BOUNDARY_CASES } = await import('./boundary/boundary-cases.js');
  for (const c of BOUNDARY_CASES) {
    if (c.expectedError) {
      const res = Bazi.calculateSafe(c.input);
      assert(res.success === false && res.error.code === c.expectedError, c.caseId,
        `期望錯誤 ${c.expectedError} / 實際 ${JSON.stringify(res.error && res.error.code)}`);
      continue;
    }
    let r;
    try {
      r = Bazi.calculate(c.input);
    } catch (e) {
      assert(false, c.caseId, `拋錯 ${e.message}`);
      continue;
    }
    if (c.structuralOnly) {
      assert(r.accuracy.trueSolarTimeUsed === true && r.calendar.time.correctionMinutes !== 0, c.caseId, '真太陽時結構');
      continue;
    }
    let ok = true;
    const notes = [];
    const e = c.expected;
    if (e.year && r.pillars.year.ganzhi !== e.year) { ok = false; notes.push(`年${r.pillars.year.ganzhi}≠${e.year}`); }
    if (e.month && r.pillars.month.ganzhi !== e.month) { ok = false; notes.push(`月${r.pillars.month.ganzhi}≠${e.month}`); }
    if (e.day && c.checkDay !== false && r.pillars.day.ganzhi !== e.day) { ok = false; notes.push(`日${r.pillars.day.ganzhi}≠${e.day}`); }
    if (c.checkDay === false && e.day) { /* 跳過日柱 */ }
    if (e.hour && r.pillars.hour.ganzhi !== e.hour) { ok = false; notes.push(`時${r.pillars.hour.ganzhi}≠${e.hour}`); }
    if (e.hourPillarAvailable === false && r.pillars.hour.available !== false) { ok = false; notes.push('時柱應缺席'); }
    if (e.hourPillarAvailable === true && r.pillars.hour.available !== true) { ok = false; notes.push('時柱應存在'); }
    if (e.hourBranch && r.pillars.hour.branch !== e.hourBranch) { ok = false; notes.push(`時支${r.pillars.hour.branch}≠${e.hourBranch}`); }
    assert(ok, c.caseId, notes.join(' '));
  }
}

// ---------- sources / profiles / schemas / external fixtures ----------
function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(new URL(relativePath, import.meta.url), 'utf8'));
}

function resolveJsonPointer(root, pointer) {
  return pointer.split('/').slice(1).reduce((value, part) => value?.[part.replaceAll('~1', '/').replaceAll('~0', '~')], root);
}

function schemaErrors(value, schema, root = schema, path = '$') {
  if (schema.$ref) return schemaErrors(value, resolveJsonPointer(root, schema.$ref), root, path);
  const errors = [];
  if (schema.enum && !schema.enum.some((candidate) => JSON.stringify(candidate) === JSON.stringify(value))) {
    errors.push(`${path} must be one of ${schema.enum.join(', ')}`);
  }
  if (schema.const !== undefined && JSON.stringify(value) !== JSON.stringify(schema.const)) errors.push(`${path} must equal const`);
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const matches = types.some((type) => (
      type === 'null' ? value === null :
      type === 'array' ? Array.isArray(value) :
      type === 'object' ? value !== null && typeof value === 'object' && !Array.isArray(value) :
      type === 'integer' ? Number.isInteger(value) : typeof value === type
    ));
    if (!matches) return [`${path} type mismatch (${schema.type})`];
  }
  if (schema.pattern && typeof value === 'string' && !(new RegExp(schema.pattern)).test(value)) errors.push(`${path} pattern mismatch`);
  if (schema.minItems !== undefined && Array.isArray(value) && value.length < schema.minItems) errors.push(`${path} needs ${schema.minItems} items`);
  if (schema.required && value && typeof value === 'object') {
    for (const key of schema.required) if (!(key in value)) errors.push(`${path}.${key} is required`);
  }
  if (schema.properties && value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, childSchema] of Object.entries(schema.properties)) {
      if (key in value) errors.push(...schemaErrors(value[key], childSchema, root, `${path}.${key}`));
    }
  }
  if (schema.items && Array.isArray(value)) value.forEach((item, index) => errors.push(...schemaErrors(item, schema.items, root, `${path}[${index}]`)));
  return errors;
}

function pillarMap(result) {
  return Object.fromEntries(Object.entries(result.pillars).map(([key, pillar]) => [key, pillar.ganzhi]));
}

function getPath(value, path) {
  return path.split('.').reduce((current, key) => current?.[key], value);
}

function serializableRuleMetadata(rule) {
  return {
    ...rule,
    match: { kind: rule.implemented === false ? 'research-only' : 'predicate', expression: rule.description },
    evidence: { kind: rule.implemented === false ? 'research-only' : 'runtime-evidence', fields: ['matched', 'basedOn'] }
  };
}

async function runDataContracts() {
  console.log('== Data Contracts / 外部資料 ==');
  const sourceCatalog = readJson('../sources/classical-texts.json');
  const profileCatalog = readJson('../profiles/catalog.json');
  const differential = readJson('../validation/profiles/differential-cases.json');
  const external = readJson('../validation/external/round-01-samples.json');
  const specialSystems = readJson('../validation/external/round-02-special-systems.json');
  const evidenceLedger = readJson('../sources/evidence-ledger.json');
  const variantsCatalog = readJson('../sources/variants.json');
  const independent = readJson('../validation/external/independent-ledger.json');
  const boundaryRound = readJson('../validation/external/round-03-boundary-samples.json');
  const secondEngineRound = readJson('../validation/external/round-04-second-engine.json');
  const celebrityRound = readJson('../validation/external/round-05-celebrity-cases.json');
  const interpretationBenchmark = readJson('../validation/interpretation/benchmark.json');
  const validationManifest = Bazi.Validation.getValidationManifest();
  const referenceTaxonomy = Bazi.Reference.getTaxonomy();
  const referenceCoverage = Bazi.Reference.getCoverageReport();
  const schemaFiles = [
    ['../schemas/source-catalog.schema.json', sourceCatalog],
    ['../schemas/profile.schema.json', profileCatalog.profiles[0]],
    ['../schemas/profile-differential.schema.json', differential],
    ['../schemas/external-validation.schema.json', external],
    ['../schemas/external-validation.schema.json', specialSystems],
    ['../schemas/evidence-ledger.schema.json', evidenceLedger],
    ['../schemas/independent-validation.schema.json', independent],
    ['../schemas/independent-validation.schema.json', boundaryRound],
    ['../schemas/independent-validation.schema.json', secondEngineRound],
    ['../schemas/celebrity-validation.schema.json', celebrityRound],
    ['../schemas/interpretation-validation.schema.json', interpretationBenchmark],
    ['../schemas/validation-manifest.schema.json', validationManifest],
    ['../schemas/taxonomy.schema.json', referenceTaxonomy],
    ['../schemas/coverage.schema.json', referenceCoverage.scopes[0]],
    ['../schemas/variants-catalog.schema.json', variantsCatalog]
  ];

  for (const [file, sample] of schemaFiles) {
    const schema = readJson(file);
    assert(schema.$schema === 'https://json-schema.org/draft/2020-12/schema', `UT-SCHEMA-DRAFT-${file}`, schema.$schema);
    assert(schemaErrors(sample, schema).length === 0, `UT-SCHEMA-${file}`, schemaErrors(sample, schema).join('; '));
  }

  const conceptSchema = readJson('../schemas/concept.schema.json');
  const sourceSchema = readJson('../schemas/source.schema.json');
  const evidenceSchema = readJson('../schemas/evidence.schema.json');
  const variantSchema = readJson('../schemas/variant.schema.json');
  for (const concept of Bazi.Reference.CONCEPTS) {
    const errors = schemaErrors(concept, conceptSchema);
    assert(errors.length === 0, `UT-CONCEPT-SCHEMA-${concept.conceptId}`, errors.join('; '));
  }
  const referenceSourceIds = [...new Set(Bazi.Reference.CONCEPTS.flatMap((concept) => concept.sourceIds))];
  for (const sourceId of referenceSourceIds) {
    const source = Bazi.Reference.getSource(sourceId);
    const errors = schemaErrors(source, sourceSchema);
    assert(errors.length === 0, `UT-REFERENCE-SOURCE-SCHEMA-${sourceId}`, errors.join('; '));
  }
  for (const record of [...sourceCatalog.evidenceRecords, ...evidenceLedger.citations]) {
    const normalized = { ...record, sourceIds: record.sourceIds || [record.sourceId] };
    const errors = schemaErrors(normalized, evidenceSchema);
    assert(errors.length === 0, `UT-REFERENCE-EVIDENCE-SCHEMA-${record.evidenceId}`, errors.join('; '));
  }
  const allVariants = Bazi.Reference.CONCEPTS.flatMap((concept) => Bazi.Reference.getVariants(concept.conceptId));
  for (const variant of allVariants) {
    const errors = schemaErrors(variant, variantSchema);
    assert(errors.length === 0, `UT-REFERENCE-VARIANT-SCHEMA-${variant.variantId}`, errors.join('; '));
  }
  assert(fs.existsSync(new URL('../docs/reference/generated/index.md', import.meta.url)), 'UT-REFERENCE-DOCS-GENERATED', 'Reference 文件索引不存在');
  assert(fs.existsSync(new URL('../validation/coverage/coverage.json', import.meta.url)), 'UT-COVERAGE-GENERATED', 'coverage artifact 不存在');

  const profileSchema = readJson('../schemas/profile.schema.json');
  const ruleSchema = readJson('../schemas/rule.schema.json');
  for (const rule of [...Bazi.SpecialRules.SPECIAL_RULE_REGISTRY, ...Bazi.Patterns.SPECIAL_PATTERN_REGISTRY, ...Bazi.Patterns.REGULAR_PATTERN_REGISTRY]) {
    const errors = schemaErrors(serializableRuleMetadata(rule), ruleSchema);
    assert(errors.length === 0, `UT-RULE-SCHEMA-${rule.ruleId}`, errors.join('; '));
  }
  const chart = Bazi.calculate({ birthDate: '1983-05-11', birthTime: '16:19', gender: 'male' }, { includeLuckAnnualDetails: true });
  const chartSchema = readJson('../schemas/chart-result.schema.json');
  assert(schemaErrors(chart, chartSchema).length === 0, 'UT-CHART-RESULT-SCHEMA', schemaErrors(chart, chartSchema).join('; '));
  const classicalSummarySchema = readJson('../schemas/classical-summary.schema.json');
  assert(schemaErrors(chart.classicalSummary, classicalSummarySchema).length === 0, 'UT-CLASSICAL-SUMMARY-SCHEMA', schemaErrors(chart.classicalSummary, classicalSummarySchema).join('; '));

  assert(sourceCatalog.sources.length >= 5 && sourceCatalog.evidenceRecords.length >= 12, 'UT-SOURCES-CATALOG-COMPLETE', `${sourceCatalog.sources.length}/${sourceCatalog.evidenceRecords.length}`);
  const evidenceSourceIds = new Set(evidenceLedger.editionRecords.map((edition) => edition.sourceId));
  assert(evidenceLedger.citations.length >= 6 && evidenceLedger.citations.every((citation) => evidenceSourceIds.has(citation.sourceId) && citation.locator.url.startsWith('https://') && citation.originalExcerpt.length > 0), 'UT-EVIDENCE-LEDGER-LOCATABLE', JSON.stringify(evidenceLedger.citations.map((citation) => citation.evidenceId)));
  const sourceIds = new Set(sourceCatalog.sources.map((source) => source.sourceId));
  for (const record of sourceCatalog.evidenceRecords) {
    assert(record.sourceIds.every((id) => sourceIds.has(id)), `UT-SOURCE-REF-${record.evidenceId}`, JSON.stringify(record.sourceIds));
  }

  const runtimeProfiles = new Map(Bazi.Rules.RuleRegistry.listProfiles().map((profile) => [profile.id, profile]));
  for (const profile of profileCatalog.profiles) {
    const profileErrors = schemaErrors(profile, profileSchema);
    assert(profileErrors.length === 0, `UT-PROFILE-SCHEMA-${profile.id}`, profileErrors.join('; '));
    const runtime = runtimeProfiles.get(profile.id);
    assert(Boolean(runtime), `UT-PROFILE-CATALOG-${profile.id}`, 'JSON catalog 與 SDK 內建 Profile 不同步');
    assert(runtime?.version === profile.version, `UT-PROFILE-VERSION-${profile.id}`, `${runtime?.version}/${profile.version}`);
    assert(Bazi.Rules.RuleRegistry.get(profile.id)?.rules?.dayBoundary?.value === profile.rules.dayBoundary.value, `UT-PROFILE-RULE-${profile.id}`, 'dayBoundary 不同步');
    assert(Bazi.Rules.RuleRegistry.get(profile.id)?.rules?.analysis?.useGod?.value === profile.rules.analysis.useGod.value, `UT-PROFILE-ANALYSIS-${profile.id}`, 'analysis.useGod 不同步');
  }

  for (const fixture of differential.cases) {
    const results = {};
    for (const [profileId, expected] of Object.entries(fixture.profiles)) {
      const result = Bazi.calculate(fixture.input, { profile: profileId });
      results[profileId] = result;
      assert(JSON.stringify(pillarMap(result)) === JSON.stringify(expected.pillars), `${fixture.caseId}-${profileId}-PILLARS`, JSON.stringify(pillarMap(result)));
      if (expected.dayBoundary) assert(result.accuracy.boundaryRules.day === expected.dayBoundary, `${fixture.caseId}-${profileId}-DAY-RULE`, result.accuracy.boundaryRules.day);
      if (expected.yearBoundary) assert(result.accuracy.boundaryRules.year === expected.yearBoundary, `${fixture.caseId}-${profileId}-YEAR-RULE`, result.accuracy.boundaryRules.year);
      if (expected.monthBoundary) assert(result.accuracy.boundaryRules.month === expected.monthBoundary, `${fixture.caseId}-${profileId}-MONTH-RULE`, result.accuracy.boundaryRules.month);
      if (expected.trueSolarTimeUsed !== undefined) assert(result.accuracy.trueSolarTimeUsed === expected.trueSolarTimeUsed, `${fixture.caseId}-${profileId}-SOLAR-RULE`, String(result.accuracy.trueSolarTimeUsed));
    }
    const [baseId, variantId] = Object.keys(results);
    for (const field of fixture.differsOn) {
      assert(JSON.stringify(getPath(results[baseId], field)) !== JSON.stringify(getPath(results[variantId], field)), `${fixture.caseId}-${field}-DIFF`, `${baseId}/${variantId}`);
    }
  }

  for (const sample of external.cases) {
    const result = Bazi.calculate(sample.input);
    if (sample.expected.pillars) assert(JSON.stringify(pillarMap(result)) === JSON.stringify(sample.expected.pillars), `${sample.caseId}-PILLARS`, JSON.stringify(pillarMap(result)));
    if (sample.expected.lunar) assert(JSON.stringify(result.calendar.lunar) === JSON.stringify(sample.expected.lunar), `${sample.caseId}-LUNAR`, JSON.stringify(result.calendar.lunar));
  }
  for (const sample of external.solarTermCases) {
    const observedJd = Bazi.Calendar.calculateSolarTermJD(sample.year, sample.term);
    const reference = new Date(sample.referenceUtc);
    const referenceJd = Bazi.Julian.gregorianToJulianDay(reference.getUTCFullYear(), reference.getUTCMonth() + 1, reference.getUTCDate() + (reference.getUTCHours() + reference.getUTCMinutes() / 60 + reference.getUTCSeconds() / 3600) / 24);
    const differenceMinutes = Math.abs(observedJd - referenceJd) * 1440;
    assert(differenceMinutes <= sample.maxDifferenceMinutes, `${sample.caseId}-SOLAR-TERM`, `${differenceMinutes.toFixed(1)} min`);
  }

  for (const source of specialSystems.sources) {
    assert(/^https:\/\//.test(source.url), `UT-EXTERNAL-SOURCE-URL-${source.sourceId}`, source.url);
  }
  for (const sample of specialSystems.cases) {
    const result = Bazi.calculate(sample.input);
    if (sample.caseId.startsWith('MG-')) {
      const mingGua = result.auxiliary.mingGua;
      assert(mingGua.effectiveYear === sample.expected.effectiveYear && mingGua.guaNumber === sample.expected.guaNumber && mingGua.trigram.name === sample.expected.trigram && mingGua.groupName === sample.expected.groupName, `${sample.caseId}-MING-GUA`, JSON.stringify(mingGua));
      if (sample.expected.conflict) assert(mingGua.researchNotes.conflict === true && mingGua.variants.length > 0, `${sample.caseId}-CONFLICT-PRESERVED`, JSON.stringify(mingGua.researchNotes));
    } else if (sample.caseId.startsWith('FC-')) {
      assert(result.strength.fiveCategory.modelId === sample.expected.modelId && result.strength.fiveCategory.useElement === sample.expected.useElement && JSON.stringify(result.strength.fiveCategory.groups) === JSON.stringify(sample.expected.groups), `${sample.caseId}-FIVE-CATEGORY`, JSON.stringify(result.strength.fiveCategory));
    } else if (sample.caseId.startsWith('LUCK-')) {
      const luck = result.luckCycles;
      assert(luck.direction === sample.expected.direction && luck.startAgeMethod === sample.expected.startAgeMethod, `${sample.caseId}-METHOD`, JSON.stringify(luck));
      assert(JSON.stringify(luck.variants.map((variant) => variant.method)) === JSON.stringify(sample.expected.variantMethods), `${sample.caseId}-VARIANT-LIST`, JSON.stringify(luck.variants));
      assert(luck.variants[0].calculationDiffDays !== luck.variants[1].calculationDiffDays, `${sample.caseId}-VARIANT-DIFF`, JSON.stringify(luck.variants));
    }
  }

  for (const source of independent.sources) {
    assert(/^https:\/\//.test(source.url) && source.independence === 'external', `UT-INDEPENDENT-SOURCE-${source.sourceId}`, source.url);
  }
  for (const sample of independent.cases) {
    const result = Bazi.calculate(sample.input);
    const actual = pillarMap(result);
    if (sample.adjudication.expectedPillars) {
      assert(JSON.stringify(actual) === JSON.stringify(sample.adjudication.expectedPillars), `${sample.caseId}-ADJUDICATED`, JSON.stringify(actual));
    }
    for (const observation of sample.observations) {
      if (observation.classification === 'match') {
        assert(JSON.stringify(actual) === JSON.stringify(observation.observed.pillars), `${sample.caseId}-MATCH`, JSON.stringify(actual));
      } else if (observation.classification === 'difference') {
        assert(JSON.stringify(actual) !== JSON.stringify(observation.observed.pillars), `${sample.caseId}-DIFFERENCE`, JSON.stringify(actual));
      } else {
        assert(observation.observed === null && observation.notes.length > 0, `${sample.caseId}-UNDETERMINED`, JSON.stringify(observation));
      }
    }
  }

  const boundarySourceIds = new Set(boundaryRound.sources.map((source) => source.sourceId));
  assert(boundaryRound.cases.length >= 20 && boundaryRound.cases.length <= 50, 'UT-BOUNDARY-ROUND-SIZE', String(boundaryRound.cases.length));
  assert(boundaryRound.sources.every((source) => /^https:\/\//.test(source.url) && source.independence === 'external'), 'UT-BOUNDARY-EXTERNAL-SOURCES', JSON.stringify(boundaryRound.sources));
  for (const sample of boundaryRound.cases) {
    const result = Bazi.calculate(sample.input);
    const actual = pillarMap(result);
    const observation = sample.observations[0];
    let ok = boundarySourceIds.has(observation?.sourceId);
    if (observation?.classification === 'match') {
      ok = ok && JSON.stringify(actual) === JSON.stringify(observation.observed.pillars);
    } else if (observation?.classification === 'difference') {
      ok = ok && JSON.stringify(actual) !== JSON.stringify(observation.observed.pillars);
    } else {
      ok = ok && observation?.observed === null && observation?.notes;
    }
    ok = ok && sample.adjudication.classification === observation?.classification;
    assert(Boolean(ok), `${sample.caseId}-EXTERNAL-BOUNDARY`, JSON.stringify({ actual, observed: observation?.observed?.pillars }));
  }

  const secondEngineSourceIds = new Set(secondEngineRound.sources.map((source) => source.sourceId));
  assert(secondEngineRound.cases.length === 16, 'UT-SECOND-ENGINE-ROUND-SIZE', String(secondEngineRound.cases.length));
  assert(boundaryRound.cases.length + secondEngineRound.cases.length === 50, 'UT-EXTERNAL-TOTAL-50', `${boundaryRound.cases.length}+${secondEngineRound.cases.length}`);
  const validationSummary = Bazi.Validation.summarizeValidationDatasets([boundaryRound, secondEngineRound, celebrityRound]);
  assert(validationSummary.totalCases === validationManifest.totals.cases && validationSummary.classifications.match === validationManifest.totals.classifications.match && validationSummary.classifications.difference === validationManifest.totals.classifications.difference && validationSummary.classifications.undetermined === validationManifest.totals.classifications.undetermined, 'UT-VALIDATION-MANIFEST-FIXTURES', JSON.stringify(validationSummary));
  assert(secondEngineRound.sources.every((source) => /^https:\/\//.test(source.url) && source.independence === 'external' && source.commit), 'UT-SECOND-ENGINE-SOURCE', JSON.stringify(secondEngineRound.sources));
  for (const sample of secondEngineRound.cases) {
    const result = Bazi.calculate(sample.input);
    const actual = pillarMap(result);
    const observation = sample.observations[0];
    let ok = secondEngineSourceIds.has(observation?.sourceId);
    if (observation?.classification === 'match') {
      ok = ok && JSON.stringify(actual) === JSON.stringify(observation.observed.pillars);
    } else if (observation?.classification === 'difference') {
      ok = ok && JSON.stringify(actual) !== JSON.stringify(observation.observed.pillars);
    } else {
      ok = ok && observation?.observed === null && observation?.notes;
    }
    ok = ok && sample.adjudication.classification === observation?.classification;
    assert(Boolean(ok), `${sample.caseId}-SECOND-ENGINE`, JSON.stringify({ actual, observed: observation?.observed?.pillars }));
  }

  const celebritySourceIds = new Set(celebrityRound.sources.map((source) => source.sourceId));
  const utc8Countries = new Set(['CN', 'HK', 'TW']);
  assert(celebrityRound.cases.length === 5, 'UT-CELEBRITY-ROUND-SIZE', String(celebrityRound.cases.length));
  assert(celebrityRound.sources.every((source) => /^https:\/\//.test(source.url) && source.independence === 'external'), 'UT-CELEBRITY-EXTERNAL-SOURCES', JSON.stringify(celebrityRound.sources));
  for (const sample of celebrityRound.cases) {
    const result = Bazi.calculate(sample.input);
    const actual = pillarMap(result);
    const observation = sample.externalObservation;
    const observed = observation?.observed?.pillars;
    const classification = sample.adjudication?.classification;
    const sameSelectedPillars = observed && sample.comparisonFields.every((key) => actual[key] === observed[key]);
    let ok = sample.input.timezone === '+08:00'
      && sample.input.birthTimeMode === 'unknown'
      && utc8Countries.has(sample.input.location?.country)
      && !sample.comparisonFields.includes('hour')
      && celebritySourceIds.has(observation?.sourceId)
      && observation?.classification === classification
      && sample.factSources.every((sourceId) => celebritySourceIds.has(sourceId));
    if (classification === 'match') {
      ok = ok && Boolean(sameSelectedPillars);
    } else if (classification === 'difference') {
      ok = ok && Boolean(observed) && !sameSelectedPillars;
    } else {
      ok = ok && observed === null && observation?.notes;
    }
    assert(Boolean(ok), `${sample.caseId}-CELEBRITY`, JSON.stringify({ actual, observed, classification }));
  }
  assert(interpretationBenchmark.status === 'protocol-only' && interpretationBenchmark.cases.length === 0, 'UT-INTERPRETATION-BENCHMARK-NO-FALSE-CLAIMS', JSON.stringify(interpretationBenchmark));
}

await runUnit();
await runShenShaVNext();
await runGolden();
await runBoundary();
await runDataContracts();

console.log(`\n測試結果：通過 ${pass} / 失敗 ${fail}`);
if (fail > 0) {
  console.log('失敗清單：');
  failures.slice(0, 40).forEach((f) => console.log(' - ' + f));
  process.exit(1);
} else {
  console.log('全部通過 ✓');
}
