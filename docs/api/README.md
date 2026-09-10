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
const manifest = Bazi.Validation.getValidationManifest();
```

模組：Calendar / Solar / Lunar / Julian / TrueSolarTime / Rules / ShenSha / Strength /
Luck / Transit / AI / Renderer / Validation / Errors / Constants。
錯誤碼：BIRTH_DATE_OUT_OF_RANGE / BAZI_VALIDATION_ERROR / BAZI_ERROR（皆 stable ID）。

`result.meta.profile` 會保存本次實際使用的 Profile 快照，`result.accuracy.precision` 會保存節氣模型、固定時區、真太陽時模型與限制。`Bazi.Validation.getValidationManifest()` 只回傳小型索引；完整外部 observation 仍應從 `validation/external/` 或自己的靜態資料來源載入，再交給 `summarizeValidationDataset()`／`summarizeValidationDatasets()` 統計。這些資料是可重現驗證紀錄，不是跨流派唯一答案。
