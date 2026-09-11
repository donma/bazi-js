# 地支藏干

- conceptId: `hidden-stem.registry`
- type: `hidden-stem`
- status: `implemented`
- tradition: bazi-js-sdk
- ruleId: `HIDDEN_STEM_REGISTRY_001`
- sourceId: 未建立來源連結

## 說明

提供每個地支所藏天干、本氣／中氣／餘氣角色、日數與比例；不把藏干本身誤當成透干。

## 判定範圍

- HIDDEN_STEM_REGISTRY_001: branch（scope: pillar；ruleFamily: branch-hidden-stems）

## SDK API 與輸出

- API：`Bazi.TenGods`、`Bazi.calculate`
- 輸出欄位：`hiddenStems.year`、`hiddenStems.month`、`hiddenStems.day`、`hiddenStems.hour`、`tenGods.hidden`

## 來源與變體

目前沒有額外變體記錄。

## 實作狀態

- implemented；模組：src/core/constants/hidden-stems-data.js。

> 本頁由 Reference registry 與 sources/ 資料生成；完整 rule、evidence、variants 請使用 `Bazi.Reference.getRule()` 或 `Bazi.Reference.toContext()`。
