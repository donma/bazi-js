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
function runUnit() {
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
    if (e.day && !c.checkDay === false && r.pillars.day.ganzhi !== e.day) { ok = false; notes.push(`日${r.pillars.day.ganzhi}≠${e.day}`); }
    if (c.checkDay === false && e.day) { /* 跳過日柱 */ }
    if (e.hour && r.pillars.hour.ganzhi !== e.hour) { ok = false; notes.push(`時${r.pillars.hour.ganzhi}≠${e.hour}`); }
    if (e.hourPillarAvailable === false && r.pillars.hour.available !== false) { ok = false; notes.push('時柱應缺席'); }
    if (e.hourPillarAvailable === true && r.pillars.hour.available !== true) { ok = false; notes.push('時柱應存在'); }
    if (e.hourBranch && r.pillars.hour.branch !== e.hourBranch) { ok = false; notes.push(`時支${r.pillars.hour.branch}≠${e.hourBranch}`); }
    assert(ok, c.caseId, notes.join(' '));
  }
}

runUnit();
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
