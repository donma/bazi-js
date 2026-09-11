# 十神關係

- conceptId: `ten-god.relation`
- type: `ten-god`
- status: `implemented`
- tradition: bazi-js-sdk
- ruleId: `TENGOD_RELATION_001`
- sourceId: 未建立來源連結

## 說明

以日主天干為基準，計算四柱天干與地支藏干的十神關係，並保留角色與解釋欄位。

## 判定範圍

- TENGOD_RELATION_001: dayMaster、stems、hiddenStems（scope: natal；ruleFamily: day-master-relation）

## SDK API 與輸出

- API：`Bazi.TenGods`
- 輸出欄位：`tenGods.dayMaster`、`tenGods.stems`、`tenGods.hidden`

## 來源與變體

目前沒有額外變體記錄。

## 實作狀態

- implemented；模組：src/tengods。

> 本頁由 Reference registry 與 sources/ 資料生成；完整 rule、evidence、variants 請使用 `Bazi.Reference.getRule()` 或 `Bazi.Reference.toContext()`。
