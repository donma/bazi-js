// Capture a reproducible external-validation round.
//
// Usage (run from a checked-out independent engine with tsx installed):
//   node --import tsx scripts/capture-external-round-03.mjs <external-repo>
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

const externalModule = await import(pathToFileURL(path.join(externalRepo, 'src/index.ts')).href);
const external = externalModule.default?.calculateBaziChart
  ? externalModule.default
  : externalModule;
const calculateExternal = external.calculateBaziChart;
if (typeof calculateExternal !== 'function') {
  throw new Error('External engine does not expose calculateBaziChart.');
}

const sourceCommit = process.env.EXTERNAL_COMMIT || 'recorded-from-local-checkout';
const capturedAt = process.env.CAPTURED_AT || new Date().toISOString().slice(0, 10);

const cases = [
  // Ordinary calendar coverage.
  { id: 'R03-NORMAL-1998-1213', group: 'ordinary-date', date: '1998-12-13', time: '12:00', tz: 8, lon: 116.39 },
  { id: 'R03-NORMAL-2000-0101', group: 'ordinary-date', date: '2000-01-01', time: '12:00', tz: 8, lon: 120 },
  { id: 'R03-NORMAL-1900-0101', group: 'ordinary-date', date: '1900-01-01', time: '12:00', tz: 8, lon: 120 },
  { id: 'R03-NORMAL-2024-0101', group: 'ordinary-date', date: '2024-01-01', time: '12:00', tz: 8, lon: 120 },
  { id: 'R03-NORMAL-2026-0615', group: 'ordinary-date', date: '2026-06-15', time: '12:00', tz: 8, lon: 116.39 },
  { id: 'R03-NORMAL-1970-0101', group: 'ordinary-date', date: '1970-01-01', time: '12:00', tz: 8, lon: 120 },
  { id: 'R03-NORMAL-2002-0808', group: 'ordinary-date', date: '2002-08-08', time: '12:00', tz: 8, lon: 114.29 },
  { id: 'R03-NORMAL-1949-1001', group: 'ordinary-date', date: '1949-10-01', time: '15:00', tz: 8, lon: 116.39 },
  { id: 'R03-NORMAL-2000-0229', group: 'ordinary-date', date: '2000-02-29', time: '10:00', tz: 8, lon: 120 },
  { id: 'R03-NORMAL-1911-1010', group: 'ordinary-date', date: '1911-10-10', time: '12:00', tz: 8, lon: 114.30 },

  // Timezone and civil-clock coverage. These cases deliberately disable TST
  // so timezone is an explicit input dimension without mixing algorithms.
  { id: 'R03-TZ-INDIA-0530', group: 'timezone', date: '2024-01-01', time: '12:00', tz: 5.5, lon: 77.2 },
  { id: 'R03-TZ-NEPAL-0575', group: 'timezone', date: '2024-01-01', time: '12:00', tz: 5.75, lon: 85.3 },
  { id: 'R03-TZ-TEHRAN-0330', group: 'timezone', date: '2024-11-03', time: '12:00', tz: 3.5, lon: 51.4 },
  { id: 'R03-TZ-REYKJAVIK-0000', group: 'timezone', date: '2024-02-11', time: '12:00', tz: 0, lon: -21.9 },
  { id: 'R03-TZ-SYDNEY-DST', group: 'timezone', date: '2008-10-05', time: '12:00', tz: 10, dst: 1, lon: 151.2 },
  { id: 'R03-TZ-NEWYORK-DST', group: 'timezone', date: '2023-11-05', time: '01:30', tz: -5, dst: 1, lon: -74 },

  // Zi-hour and day-boundary coverage.
  { id: 'R03-ZI-2359-2300', group: 'zi-hour', date: '2024-05-20', time: '23:59', tz: 8, lon: 120, dayBoundary: '23:00' },
  { id: 'R03-ZI-2359-0000', group: 'zi-hour', date: '2024-05-20', time: '23:59', tz: 8, lon: 120, dayBoundary: '00:00' },
  { id: 'R03-ZI-0000-2300', group: 'zi-hour', date: '2024-05-21', time: '00:00', tz: 8, lon: 120, dayBoundary: '23:00' },
  { id: 'R03-ZI-0000-0000', group: 'zi-hour', date: '2024-05-21', time: '00:00', tz: 8, lon: 120, dayBoundary: '00:00' },
  { id: 'R03-ZI-2000-2330', group: 'zi-hour', date: '2000-06-15', time: '23:30', tz: 8, lon: 116.39, dayBoundary: '23:00' },
  { id: 'R03-ZI-2024-0101', group: 'zi-hour', date: '2024-01-01', time: '00:30', tz: 8, lon: 120, dayBoundary: '23:00' },

  // Solar-term boundary coverage, using the published boundary anchors in
  // the external engine's regression suite.
  { id: 'R03-JIE-LICHUN-2024-BEFORE', group: 'solar-term', date: '2024-02-04', time: '16:26', tz: 8, lon: 120 },
  { id: 'R03-JIE-LICHUN-2024-AFTER', group: 'solar-term', date: '2024-02-04', time: '16:28', tz: 8, lon: 120 },
  { id: 'R03-JIE-LICHUN-2025-BEFORE', group: 'solar-term', date: '2025-02-03', time: '22:09', tz: 8, lon: 120 },
  { id: 'R03-JIE-LICHUN-2025-AFTER', group: 'solar-term', date: '2025-02-03', time: '22:12', tz: 8, lon: 120 },
  { id: 'R03-JIE-JINGZHE-2024-BEFORE', group: 'solar-term', date: '2024-03-05', time: '10:21', tz: 8, lon: 120 },
  { id: 'R03-JIE-JINGZHE-2024-AFTER', group: 'solar-term', date: '2024-03-05', time: '10:24', tz: 8, lon: 120 },
  { id: 'R03-JIE-QINGMING-2024-BEFORE', group: 'solar-term', date: '2024-04-04', time: '15:00', tz: 8, lon: 120 },
  { id: 'R03-JIE-QINGMING-2024-AFTER', group: 'solar-term', date: '2024-04-04', time: '15:05', tz: 8, lon: 120 },

  // True-solar-time cases are retained as an explicit algorithm comparison.
  { id: 'R03-TST-KASHGAR', group: 'true-solar-time', date: '2024-02-11', time: '13:00', tz: 8, lon: 76, trueSolarTime: true },
  { id: 'R03-TST-FUYUAN', group: 'true-solar-time', date: '2024-11-03', time: '10:50', tz: 8, lon: 134, trueSolarTime: true },
  { id: 'R03-TST-SINGAPORE', group: 'true-solar-time', date: '1985-10-08', time: '15:20', tz: 8, lon: 103.82, trueSolarTime: true },
  { id: 'R03-TST-REYKJAVIK', group: 'true-solar-time', date: '2024-02-11', time: '15:00', tz: 0, lon: -21.9, trueSolarTime: true },
];

function parts(date) {
  return date.split('-').map(Number);
}

function pillarMap(result) {
  return Object.fromEntries(['year', 'month', 'day', 'hour'].map((key) => [
    key,
    result.pillars[key]?.ganzhi || result.pillars[key]?.ganZhi || null,
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
    timezone: `${sample.tz >= 0 ? '+' : '-'}${String(Math.floor(Math.abs(sample.tz))).padStart(2, '0')}:${String(Math.round((Math.abs(sample.tz) % 1) * 60)).padStart(2, '0')}`,
    trueSolarTime: sample.trueSolarTime === true,
    dayBoundary: sample.dayBoundary || '23:00',
    ...(sample.dst ? { dstOffset: sample.dst } : {}),
    location: { longitude: sample.lon },
  };
}

function toExternalInput(sample) {
  const [year, month, day] = parts(sample.date);
  const [hour, minute] = sample.time.split(':').map(Number);
  return {
    year, month, day, hour, minute, gender: 'male',
    longitude: sample.lon,
    timezone: sample.tz,
    enableTrueSolarTime: sample.trueSolarTime === true,
    dayBoundaryMode: sample.dayBoundary === '23:00' ? 'ZI_HOUR_23' : 'MIDNIGHT_00',
    ...(sample.dst ? { dstOffset: sample.dst } : {}),
  };
}

const output = {
  schemaVersion: '1.0.0',
  datasetId: 'bazi-js-independent-boundary-round-03',
  capturedAt,
  purpose: '以獨立開源排盤引擎固定 30 組跨日期、時區、子時、節氣與真太陽時邊界觀察；不把外部輸出宣稱為跨流派唯一答案。',
  sources: [{
    sourceId: 'openfate-bazi-engine',
    name: '@openfate/bazi-engine',
    url: 'https://github.com/openfate-ai/bazi-engine',
    sourceType: 'independent-open-source-engine',
    scope: ['pillars', 'solar-term-boundary', 'timezone', 'zi-hour', 'true-solar-time'],
    independence: 'external',
    version: '1.1.2',
    commit: sourceCommit,
    notes: '固定 source commit；支援 dayBoundaryMode、timezone、DST 與 True Solar Time。外部引擎使用其自身依賴與算法，未納入 BaziJS runtime。',
  }],
  cases: [],
};

for (const sample of cases) {
  const input = toBaziInput(sample);
  const externalInput = toExternalInput(sample);
  const bazi = Bazi.calculate(input);
  const externalResult = calculateExternal(externalInput);
  const actual = pillarMap(bazi);
  const observed = pillarMap(externalResult);
  const match = samePillars(actual, observed);
  const classification = match ? 'match' : 'difference';
  const reason = match
    ? '同一輸入、相同換日與真太陽時設定下，四柱一致。'
    : sample.id === 'R03-TZ-NEWYORK-DST'
      ? '歷史／夏令時間的民用時刻正規化不同；保存差異，不自行判定哪個唯一正確。'
      : sample.group === 'zi-hour'
        ? '晚子時在午夜換日模式下的時干取法不同；保存差異，待 Profile 明確指定夜子／早子規範。'
        : sample.group === 'solar-term'
          ? '節氣切界在分鐘邊界出現算法或精度差異；BaziJS 與外部引擎的輸出均保留供追查。'
          : sample.trueSolarTime
            ? '真太陽時算法或天文校正模型不同；保存差異，不自行判定哪個唯一正確。'
            : '兩個獨立引擎在相同輸入與指定邊界設定下輸出不同，待逐項追查。';

  output.cases.push({
    caseId: sample.id,
    group: sample.group,
    input,
    externalInput,
    scope: 'pillars',
    observations: [{
      sourceId: 'openfate-bazi-engine',
      classification,
      observed: {
        pillars: observed,
        metadata: externalResult.metadata,
        solarTimeInfo: externalResult.solarTimeInfo,
      },
      notes: `外部引擎 @openfate/bazi-engine ${sourceCommit} 的固定執行輸出。`,
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
