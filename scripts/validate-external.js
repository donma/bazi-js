// 外部驗證錨點重跑腳本（node scripts/validate-external.js）
// 比對寫死的外部核定值（見 validation/reports/round-01-cross-validation.md），
// 任何回歸立刻失敗。Runtime SDK 本身不依賴外部網站。

import Bazi from '../src/index.js';
import fs from 'fs';

const ANCHORS = [
  { input: { birthDate: '2000-01-01', birthTime: '12:00', gender: 'male' }, expect: ['己卯', '丙子', '戊午', '戊午'] },
  { input: { birthDate: '2024-01-01', birthTime: '12:00', gender: 'male' }, expect: ['癸卯', '甲子', '甲子', '庚午'] },
  { input: { birthDate: '1900-01-01', birthTime: '12:00', gender: 'male' }, expect: ['己亥', '丙子', '甲戌', '庚午'] }
];

let fail = 0;
for (const a of ANCHORS) {
  const r = Bazi.calculate(a.input);
  const got = [r.pillars.year.ganzhi, r.pillars.month.ganzhi, r.pillars.day.ganzhi, r.pillars.hour.ganzhi];
  const ok = JSON.stringify(got) === JSON.stringify(a.expect);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${a.input.birthDate} => ${got.join(' ')}（期望 ${a.expect.join(' ')}）`);
  if (!ok) fail++;
}

// 節氣精度門檻：與年曆公布值差距須 < 15 分鐘
const TERMS = [
  { y: 2024, t: 'li_chun', refUT: 2460344.5 + (8 + 26 / 60 + 53 / 3600) / 24 },
  { y: 2023, t: 'li_chun', refUT: 2459979.5 + (2 + 42 / 60 + 21 / 3600) / 24 }
];
for (const s of TERMS) {
  const jd = Bazi.Calendar.calculateSolarTermJD(s.y, s.t);
  const diffMin = Math.abs((jd - s.refUT) * 1440);
  const ok = diffMin < 15;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${s.y} ${s.t} 誤差 ${diffMin.toFixed(1)} 分鐘（門檻 15）`);
  if (!ok) fail++;
}

// 新增系統抽樣資料同樣固定在 repo 內；驗證時不即時抓網站，確保可重跑。
const specialSystems = JSON.parse(fs.readFileSync(new URL('../validation/external/round-02-special-systems.json', import.meta.url), 'utf8'));
for (const sample of specialSystems.cases) {
  const result = Bazi.calculate(sample.input);
  let ok = true;
  if (sample.caseId.startsWith('MG-')) {
    const mingGua = result.auxiliary.mingGua;
    ok = mingGua.effectiveYear === sample.expected.effectiveYear
      && mingGua.guaNumber === sample.expected.guaNumber
      && mingGua.trigram.name === sample.expected.trigram
      && mingGua.groupName === sample.expected.groupName;
  } else if (sample.caseId.startsWith('FC-')) {
    ok = result.strength.fiveCategory.modelId === sample.expected.modelId
      && result.strength.fiveCategory.useElement === sample.expected.useElement
      && JSON.stringify(result.strength.fiveCategory.groups) === JSON.stringify(sample.expected.groups);
  } else if (sample.caseId.startsWith('MC-')) {
    const commander = result.classicalSummary.monthCommand;
    ok = commander.monthBranch === sample.expected.monthBranch
      && commander.stem === sample.expected.stem
      && commander.element === sample.expected.element
      && commander.elapsedDays === sample.expected.elapsedDays
      && commander.phase === sample.expected.phase
      && JSON.stringify(commander.phases) === JSON.stringify(sample.expected.phases)
      && commander.evidence.matched === true;
  } else if (sample.caseId.startsWith('KW-')) {
    const voids = result.classicalSummary.voids;
    ok = voids.byDay.xunName === sample.expected.day.xunName
      && JSON.stringify(voids.byDay.branches) === JSON.stringify(sample.expected.day.branches)
      && voids.byYear.xunName === sample.expected.year.xunName
      && JSON.stringify(voids.byYear.branches) === JSON.stringify(sample.expected.year.branches)
      && voids.evidence.matched === true;
  } else if (sample.caseId.startsWith('PALACE-')) {
    const rows = result.classicalSummary.auxiliary.palaceRows;
    const values = Object.fromEntries(rows.map((row) => [row.id, row.value?.ganzhi || null]));
    ok = values.taiYuan === sample.expected.taiYuan
      && values.taiXi === sample.expected.taiXi
      && values.mingGong === sample.expected.mingGong
      && values.shenGong === sample.expected.shenGong
      && result.classicalSummary.auxiliary.evidence.matched === true;
  } else if (sample.caseId.startsWith('LUCK-')) {
    const luck = result.luckCycles;
    ok = luck.direction === sample.expected.direction
      && luck.startAgeMethod === sample.expected.startAgeMethod
      && JSON.stringify(luck.variants.map((variant) => variant.method)) === JSON.stringify(sample.expected.variantMethods)
      && luck.variants[0].calculationDiffDays !== luck.variants[1].calculationDiffDays;
  }
  ok = ok && result.classicalSummary?.evidence?.matched === true;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${sample.caseId}（${sample.external.classification}）`);
  if (!ok) fail++;
}

// 獨立驗證 ledger：只比較已捕獲的外部觀察，不以 SDK 自己的輸出建立 expected。
const independent = JSON.parse(fs.readFileSync(new URL('../validation/external/independent-ledger.json', import.meta.url), 'utf8'));
const independentSourceIds = new Set(independent.sources.map((source) => source.sourceId));
const pillarMap = (result) => Object.fromEntries(['year', 'month', 'day', 'hour'].map((key) => [key, result.pillars[key]?.ganzhi || null]));
const samePillars = (actual, expected) => expected && ['year', 'month', 'day', 'hour'].every((key) => actual[key] === expected[key]);
for (const sample of independent.cases) {
  const result = Bazi.calculate(sample.input);
  const actual = pillarMap(result);
  let ok = true;
  for (const observation of sample.observations) {
    if (!independentSourceIds.has(observation.sourceId)) ok = false;
    if (observation.classification === 'match') {
      ok = ok && samePillars(actual, observation.observed?.pillars);
    } else if (observation.classification === 'difference') {
      ok = ok && Boolean(observation.observed?.pillars) && !samePillars(actual, observation.observed.pillars);
    } else if (observation.classification === 'undetermined') {
      ok = ok && observation.observed === null && Boolean(observation.notes);
    }
  }
  if (sample.adjudication.expectedPillars) {
    ok = ok && samePillars(actual, sample.adjudication.expectedPillars);
  }
  console.log(`${ok ? 'PASS' : 'FAIL'} ${sample.caseId}（${sample.adjudication.classification}）`);
  if (!ok) fail++;
}

process.exit(fail ? 1 : 0);
