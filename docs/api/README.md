# API 速覽（docs/api/README.md）

```js
const result = Bazi.calculate({
  birthDate: '1983-06-21', birthTime: '12:30', gender: 'male',
  timezone: '+08:00',
  location: { country: 'TW', city: 'Taipei', latitude: 25.033, longitude: 121.5654 },
  trueSolarTime: false
});

const safe = Bazi.calculateSafe(input); // { success, data | error }
const chart = new Bazi.Chart(input);    // .getPillars/.getShenSha/.getStrength/.getLuckCycles
const svg = Bazi.Renderer.render(result, { format: 'svg', preset: 'full', theme: 'modern-oriental' });
const png = await Bazi.Renderer.render(result, { format: 'png', preset: 'mobile-share', theme: 'modern-oriental' });
const ctx = Bazi.AI.toContext(result, { compact: true, includeRules: true, includeEvidence: true });
const profile = Bazi.Rules.RuleRegistry.createProfile({ id: 'x', base: 'canonical', overrides: { dayBoundary: '00:00' } });
const transit = Bazi.Transit.calculateTransit(chart.getPillars(), { datetime: '2026-09-08T12:00:00+08:00' });
```

模組：Calendar / Solar / Lunar / Julian / TrueSolarTime / Rules / ShenSha / Strength /
Luck / Transit / AI / Renderer / Validation / Errors / Constants。
錯誤碼：BIRTH_DATE_OUT_OF_RANGE / BAZI_VALIDATION_ERROR / BAZI_ERROR（皆 stable ID）。
