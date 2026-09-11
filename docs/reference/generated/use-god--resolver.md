# 用神模型與候選解析

- conceptId: `use-god.resolver`
- type: `use-god`
- status: `implemented`
- tradition: bazi-js-sdk
- ruleId: `USE_GOD_RESOLVER_001`
- sourceId: `di-tian-sui-yan-wei`

## 說明

集中保存扶抑、格局、調候、通關與從化候選；目前只有已實作模型可作決定，其餘保留 research-only 與 conflict evidence。

## 判定範圍

- USE_GOD_RESOLVER_001: strength、patterns、profile（scope: whole-chart-analysis；ruleFamily: multi-model-analysis）

## SDK API 與輸出

- API：`Bazi.Analysis`、`Bazi.AI`、`Bazi.calculate`
- 輸出欄位：`analysis.useGodResolver.candidates`、`analysis.useGodResolver.conflicts`、`analysis.useGodResolver.finalDecision`、`analysis.selected.useGod`

## 來源與變體

目前沒有額外變體記錄。

## 實作狀態

- implemented；模組：src/analysis。

> 本頁由 Reference registry 與 sources/ 資料生成；完整 rule、evidence、variants 請使用 `Bazi.Reference.getRule()` 或 `Bazi.Reference.toContext()`。
