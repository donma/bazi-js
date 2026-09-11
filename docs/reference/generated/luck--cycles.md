# 大運與起運

- conceptId: `luck.cycles`
- type: `luck`
- status: `implemented`
- tradition: bazi-js-sdk
- ruleId: `LUCK_CYCLES_ENGINE_001`
- sourceId: `san-ming-tong-hui`

## 說明

依 Profile 與起運方法計算順逆、起運歲數、大運干支與可選逐年資料，並保留精確節氣法與整日比較法。

## 判定範圍

- LUCK_CYCLES_ENGINE_001: gender、yearStem、monthPillar、solarTerms（scope: natal-to-luck；ruleFamily: luck-cycle-calculation）

## SDK API 與輸出

- API：`Bazi.Luck`、`Bazi.calculate`
- 輸出欄位：`luckCycles.direction`、`luckCycles.startAge`、`luckCycles.variants`、`luckCycles.cycles`、`luckCycles.cycles[].annuals`

## 來源與變體

目前沒有額外變體記錄。

## 實作狀態

- implemented；模組：src/luck。

> 本頁由 Reference registry 與 sources/ 資料生成；完整 rule、evidence、variants 請使用 `Bazi.Reference.getRule()` 或 `Bazi.Reference.toContext()`。
