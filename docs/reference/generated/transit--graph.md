# 流年與時間運

- conceptId: `transit.graph`
- type: `transit`
- status: `implemented`
- tradition: bazi-js-sdk
- ruleId: `TRANSIT_ENGINE_001`
- sourceId: 未建立來源連結

## 說明

計算指定時間的流年、流月、流日、流時，並以 transit graph 保存時間層節點、互動與結構事件；事件不直接等同吉凶。

## 判定範圍

- TRANSIT_ENGINE_001: datetime、timezone、yearBoundary、monthBoundary、dayBoundary（scope: time-layer；ruleFamily: time-layer-transit）

## SDK API 與輸出

- API：`Bazi.Transit`、`Bazi.calculate`
- 輸出欄位：`transits.year`、`transits.month`、`transits.day`、`transits.hour`、`transits.interactions`、`transits.shenShaYear`、`transits.transitGraph`

## 來源與變體

目前沒有額外變體記錄。

## 實作狀態

- implemented；模組：src/transit。

> 本頁由 Reference registry 與 sources/ 資料生成；完整 rule、evidence、variants 請使用 `Bazi.Reference.getRule()` 或 `Bazi.Reference.toContext()`。
