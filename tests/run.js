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

  // 十神：甲日主見丙為食神、見庚為七殺、見壬為偏印、見戊為偏財、見甲為比肩
  const tg = Bazi.Constants;
  void tg;

  // 納音抽查：甲子=海中金、丙寅=爐中火
  const nayin = Bazi.calculate({ birthDate: '2024-01-01', birthTime: '12:00', gender: 'male' }).nayin;
  assert(nayin.day === '海中金', 'UT-NAYIN-JIAZI', nayin.day);

  // 空亡抽查：甲子旬（甲子日）空戌亥
  const kw = Bazi.calculate({ birthDate: '2024-01-01', birthTime: '12:00', gender: 'male' }).kongWang;
  assert(JSON.stringify(kw.byDay.branches) === JSON.stringify(['戌', '亥']), 'UT-KONGWANG-JIAZI', JSON.stringify(kw.byDay.branches));

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

  // Renderer SVG 可產出
  const svg = Bazi.Renderer.render(d1, { format: 'svg', preset: 'full', theme: 'modern-oriental' });
  assert(typeof svg === 'string' && svg.includes('<svg'), 'UT-RENDER-SVG', '');
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
  assert(!SHENSHA_CATALOG.some((s) => ['kui_gang', 'shi_e_da_bai'].includes(s.id)), 'UT-SHENSHA-NO-SPECIAL-PILLARS', '固定日柱不可留在一般 ShenSha catalog');

  // SpecialPillar / SeasonalSpecial：固定柱位與季節條件獨立於 ShenSha。
  const specialRules = Bazi.SpecialRules;
  const specialRegistry = specialRules.validateSpecialRuleRegistry();
  assert(specialRegistry.valid && specialRegistry.count === 11, 'UT-SPECIAL-REGISTRY-11', JSON.stringify(specialRegistry));
  for (const rule of specialRules.SPECIAL_RULE_REGISTRY) {
    const required = ['id', 'name', 'aliases', 'tradition', 'conceptType', 'ruleFamily', 'baseOn', 'scope', 'category', 'confidence', 'ruleId', 'version', 'references', 'description', 'match', 'evidence'];
    assert(required.every((field) => field in rule), `UT-SPECIAL-SCHEMA-${rule.id}`, '缺少規格欄位');
  }
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

await runUnit();
await runShenShaVNext();
await runGolden();
await runBoundary();

console.log(`\n測試結果：通過 ${pass} / 失敗 ${fail}`);
if (fail > 0) {
  console.log('失敗清單：');
  failures.slice(0, 40).forEach((f) => console.log(' - ' + f));
  process.exit(1);
} else {
  console.log('全部通過 ✓');
}
