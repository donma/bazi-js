// 外部驗證錨點重跑腳本（node scripts/validate-external.js）
// 比對寫死的外部核定值（見 validation/reports/round-01-cross-validation.md），
// 任何回歸立刻失敗。Runtime SDK 本身不依賴外部網站。

import Bazi from '../src/index.js';

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

process.exit(fail ? 1 : 0);
