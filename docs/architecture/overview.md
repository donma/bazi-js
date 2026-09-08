# 架構總覽（docs/architecture/overview.md）

```
Input（ birthDate/gender/time/timezone/location/profile ）
  ↓  Validation（範圍 1900-01-01~2100-12-31、格式、時區）
  ↓  Calendar Engine（JDN / 節氣 / 農曆 / 真太陽時）
  ↓  Four Pillars Engine（年/月/日/時，Profile 化邊界）
  ↓  Rule Engines（十神 / 藏干 / 納音 / 長生 / 空亡 / 輔宮 / 合沖刑害 / 強弱 / 神煞 / 大運 / 流運）
  ↓  Structured Result（meta/input/accuracy/calendar/pillars/.../rules/debug）
  ↓  Renderer / AI Context / UI（純消費結果，不重算）
```

- 核心零依賴、Browser-only runtime；Node 僅作 build/test。
- 所有流派差異經 RuleRegistry Profile 化；每條規則輸出 ruleId + version。
- UI（demo/lab）僅消費 SDK，不得內嵌命理計算。
