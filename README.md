# BaziJS

BaziJS is an open-source, browser-first BaZi calculation SDK written in JavaScript.

It provides deterministic Four Pillars calculation, lunar calendar conversion, solar terms, Ten Gods, hidden stems, NaYin, Twelve Stages, interactions, ShenSha, strength analysis, luck cycles, transit calculations, SVG rendering, and AI-ready structured output.

## Goals

- Browser-first
- No backend required
- Zero-dependency core
- Deterministic structured output
- Rule-profile support
- Traceable calculation rules
- Reproducible validation
- Suitable for websites, PWA, WebView and AI applications

## Quick Start

```html
<script src="./dist/bazi-sdk.min.js"></script>

<script>
const result = Bazi.calculate({
  birthDate: "1983-06-21",
  birthTimeMode: "exact",
  birthTime: "12:30",
  gender: "male",
  timezone: "+08:00",
  location: {
    country: "TW",
    city: "Taipei",
    latitude: 25.033,
    longitude: 121.5654
  },
  trueSolarTime: false
});

console.log(result);
</script>
```

## Safe API

```js
const result = Bazi.calculateSafe(input);

if (!result.success) {
  console.error(result.error);
}
```

## Rendering

```js
const svg = Bazi.Renderer.render(result, {
  format: "svg",
  preset: "full",
  theme: "modern-oriental"
});
```

## AI Context

```js
const context = Bazi.AI.toContext(result, {
  compact: true,
  includeRules: true,
  includeEvidence: true
});
```

## Validation

BaziJS maintains Golden Cases, boundary tests and external cross-validation reports.

See:

- docs/references/
- tests/golden/
- validation/reports/

## 精度聲明

- 日柱/農曆：與多站萬年曆零差異（1900–2100 全範圍抽樣）。
- 節氣：Meeus 低精度公式，系統性偏早 2–9 分鐘；僅影響出生於節氣前後 10 分鐘內的命例
  （詳 docs/references/solar-terms.md）。此類命例請以天文台年曆人工覆核。
- 強弱分數為命理規則模型，非科學量測。

## License

Apache-2.0
