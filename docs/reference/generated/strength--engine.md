# 五行強弱與氣數

- conceptId: `strength.engine`
- type: `strength`
- status: `implemented`
- tradition: bazi-js-sdk
- ruleId: `STRENGTH_ENGINE_001`
- sourceId: `di-tian-sui-yan-wei`

## 說明

以得令、得地、得勢、同黨異黨、互動折損與轉化候選建立可追溯強弱模型；分數是 SDK 模型輸出，不是科學測量。

## 判定範圍

- STRENGTH_ENGINE_001: dayMaster、monthCommander、hiddenStems、interactions（scope: whole-chart；ruleFamily: whole-chart-strength）

## SDK API 與輸出

- API：`Bazi.Strength`、`Bazi.calculate`
- 輸出欄位：`strength.score`、`strength.level`、`strength.distribution`、`strength.rawQi`、`strength.effectiveQi`、`strength.transformations`、`strength.assessment`、`strength.evidence`

## 來源與變體

目前沒有額外變體記錄。

## 實作狀態

- implemented；模組：src/strength。

> 本頁由 Reference registry 與 sources/ 資料生成；完整 rule、evidence、variants 請使用 `Bazi.Reference.getRule()` 或 `Bazi.Reference.toContext()`。
