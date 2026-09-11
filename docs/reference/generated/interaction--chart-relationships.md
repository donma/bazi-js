# 天干地支互動

- conceptId: `interaction.chart-relationships`
- type: `interaction`
- status: `implemented`
- tradition: bazi-js-sdk
- ruleId: `INTERACTIONS_ENGINE_001`
- sourceId: 未建立來源連結

## 說明

辨識天干五合／相沖與地支合、沖、刑、害、破、三合、三會、半合、拱合，並將觀測到的結構與成化候選分開。

## 判定範圍

- INTERACTIONS_ENGINE_001: pillars、stemPairs、branchGroups（scope: whole-chart；ruleFamily: chart-relationship）

## SDK API 與輸出

- API：`Bazi.Interactions`
- 輸出欄位：`interactions.stems`、`interactions.branches`、`interactions.formation`、`interactions.transformability`、`interactions.evidence`

## 來源與變體

目前沒有額外變體記錄。

## 實作狀態

- implemented；模組：src/interactions。

> 本頁由 Reference registry 與 sources/ 資料生成；完整 rule、evidence、variants 請使用 `Bazi.Reference.getRule()` 或 `Bazi.Reference.toContext()`。
