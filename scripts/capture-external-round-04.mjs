// Capture a reproducible second-engine validation round.
//
// Usage (run after building the external checkout):
//   node scripts/capture-external-round-04.mjs <external-repo> [output-path]
//
// The external engine is intentionally not a BaziJS dependency. This script
// records its pinned output as an observation; it does not promote that output
// to a canonical answer.

import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import Bazi from '../src/index.js';

const externalRepo = process.argv[2];
if (!externalRepo) throw new Error('Missing external engine repository path.');
const outputPath = process.argv[3] || null;

const externalModule = await import(pathToFileURL(path.join(externalRepo, 'dist/index.js')).href);
const calculateExternal = externalModule.computeChart || externalModule.default?.computeChart;
if (typeof calculateExternal !== 'function') {
  throw new Error('External engine does not expose computeChart from dist/index.js. Run npm run build first.');
}

const sourceCommit = process.env.EXTERNAL_COMMIT || 'recorded-from-local-checkout';
const capturedAt = process.env.CAPTURED_AT || new Date().toISOString().slice(0, 10);

const cases = [
  // Civil-date cases: no true-solar correction, so this round isolates the
  // ordinary calendar/pillar implementation without mixing location models.
  { id: 'R04-NORMAL-1988-0229', group: 'ordinary-date', date: '1988-02-29', time: '12:00', lon: 120 },
  { id: 'R04-NORMAL-1966-1001', group: 'ordinary-date', date: '1966-10-01', time: '08:30', lon: 120 },
  { id: 'R04-NORMAL-2001-0909', group: 'ordinary-date', date: '2001-09-09', time: '18:45', lon: 120 },
  { id: 'R04-NORMAL-2024-0601', group: 'ordinary-date', date: '2024-06-01', time: '11:10', lon: 120 },
  { id: 'R04-NORMAL-2026-0910', group: 'ordinary-date', date: '2026-09-10', time: '09:00', lon: 120 },
  { id: 'R04-NORMAL-1976-0101', group: 'ordinary-date', date: '1976-01-01', time: '22:00', lon: 120 },
  { id: 'R04-NORMAL-2012-1212', group: 'ordinary-date', date: '2012-12-12', time: '06:15', lon: 116.39 },
  { id: 'R04-NORMAL-2030-0715', group: 'ordinary-date', date: '2030-07-15', time: '14:20', lon: 103.82 },

  // True-solar-time cases are deliberately away from solar-term and Zi-hour
  // boundaries; they test the second engine's location correction itself.
  { id: 'R04-TST-KASHGAR-MIDDAY', group: 'true-solar-time', date: '2024-02-11', time: '13:00', lon: 76, trueSolarTime: true },
  { id: 'R04-TST-SINGAPORE-MIDDAY', group: 'true-solar-time', date: '1985-10-08', time: '15:20', lon: 103.82, trueSolarTime: true },
  { id: 'R04-TST-FUYUAN-MIDDAY', group: 'true-solar-time', date: '2024-11-03', time: '10:50', lon: 134, trueSolarTime: true },
  { id: 'R04-TST-LISBON-MIDDAY', group: 'true-solar-time', date: '2022-05-06', time: '15:00', lon: -9.14, trueSolarTime: true },
  { id: 'R04-NORMAL-1945-0815', group: 'ordinary-date', date: '1945-08-15', time: '12:00', lon: 120 },
  { id: 'R04-NORMAL-2019-0131', group: 'ordinary-date', date: '2019-01-31', time: '17:30', lon: 120 },
  { id: 'R04-NORMAL-1990-0515', group: 'ordinary-date', date: '1990-05-15', time: '08:00', lon: 120 },
  { id: 'R04-TST-WINNIPEG-MIDDAY', group: 'true-solar-time', date: '2020-07-20', time: '16:00', lon: -97.14, trueSolarTime: true },
];

function parts(date) {
  return date.split('-').map(Number);
}

function pillarMap(result) {
  return {
    year: result.year ? `${result.year.gan}${result.year.zhi}` : null,
    month: result.month ? `${result.month.gan}${result.month.zhi}` : null,
    day: result.day ? `${result.day.gan}${result.day.zhi}` : null,
    hour: result.hour ? `${result.hour.gan}${result.hour.zhi}` : null,
  };
}

function baziPillarMap(result) {
  return Object.fromEntries(['year', 'month', 'day', 'hour'].map((key) => [
    key,
    result.pillars[key]?.ganzhi || null,
  ]));
}

function samePillars(a, b) {
  return ['year', 'month', 'day', 'hour'].every((key) => a[key] === b[key]);
}

function toBaziInput(sample) {
  return {
    birthDate: sample.date,
    birthTime: sample.time,
    gender: 'male',
    timezone: '+08:00',
    trueSolarTime: sample.trueSolarTime === true,
    dayBoundary: '23:00',
    location: { longitude: sample.lon },
  };
}

function toExternalInput(sample) {
  const [year, month, day] = parts(sample.date);
  const [hour, minute] = sample.time.split(':').map(Number);
  return {
    year, month, day, hour, minute, gender: 'male',
    longitude: sample.lon,
    standardLongitude: 120,
    useTrueSolarTime: sample.trueSolarTime === true,
  };
}

const output = {
  schemaVersion: '1.0.0',
  datasetId: 'bazi-js-independent-second-engine-round-04',
  capturedAt,
  purpose: '以第二個獨立開源排盤引擎固定 16 組民用日期與真太陽時抽樣；與 round-03 合計 50 組，不把外部輸出宣稱為跨流派唯一答案。',
  sources: [{
    sourceId: 'baziflow-core',
    name: 'baziflow-core',
    url: 'https://github.com/Eastern-Sunrise/bazi-core',
    sourceType: 'independent-open-source-engine',
    scope: ['pillars', 'true-solar-time'],
    independence: 'external',
    version: '0.1.0',
    commit: sourceCommit,
    notes: '固定 source commit；本輪只使用其四柱與真太陽時 API。該引擎沒有 timezone／day-boundary API，因此不把這些維度的結果冒充為已驗證。外部引擎未納入 BaziJS runtime。',
  }],
  cases: [],
};

for (const sample of cases) {
  const input = toBaziInput(sample);
  const externalInput = toExternalInput(sample);
  const bazi = Bazi.calculate(input);
  const externalResult = calculateExternal(externalInput);
  const actual = baziPillarMap(bazi);
  const observed = pillarMap(externalResult);
  const match = samePillars(actual, observed);
  const classification = match ? 'match' : 'difference';
  const reason = match
    ? '同一輸入與相同真太陽時設定下，兩個獨立引擎四柱一致。'
    : sample.group === 'true-solar-time'
      ? '真太陽時修正或其曆法依賴的模型不同；保存差異，不自行判定哪個唯一正確。'
      : '兩個獨立引擎在相同民用日期輸入下輸出不同，待逐項追查。';

  output.cases.push({
    caseId: sample.id,
    group: sample.group,
    input,
    externalInput,
    scope: 'pillars',
    observations: [{
      sourceId: 'baziflow-core',
      classification,
      observed: {
        pillars: observed,
        solarDate: externalResult.solarDate,
        solarTime: externalResult.solarTime,
        trueSolarTime: externalResult.trueSolarTime,
        dayMaster: externalResult.dayMaster,
        dayMasterElement: externalResult.dayMasterElement,
      },
      notes: `外部引擎 baziflow-core ${sourceCommit} 的固定執行輸出。`,
    }],
    comparison: {
      baziJsPillars: actual,
      externalPillars: observed,
    },
    adjudication: {
      classification,
      ...(match ? { expectedPillars: observed } : {}),
      reason,
    },
  });
}

const serialized = JSON.stringify(output, null, 2);
if (outputPath) {
  fs.writeFileSync(outputPath, `${serialized}\n`, 'utf8');
  console.log(`Wrote ${output.cases.length} cases to ${outputPath}`);
} else {
  console.log(serialized);
}
