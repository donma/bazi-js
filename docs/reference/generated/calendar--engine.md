# 曆法與節氣

- conceptId: `calendar.engine`
- type: `calendar`
- status: `implemented`
- tradition: bazi-js-sdk
- ruleId: `CALENDAR_ENGINE_001`
- sourceId: 未建立來源連結

## 說明

處理公曆、農曆、儒略日、節氣、生肖、星座與真太陽時修正，並把時間精度與假設留在結果中。

## 判定範圍

- CALENDAR_ENGINE_001: birthDate、birthTime、timezone、solarTerms（scope: calendar；ruleFamily: calendar-and-solar-terms）

## SDK API 與輸出

- API：`Bazi.Calendar`、`Bazi.Solar`、`Bazi.Lunar`、`Bazi.TrueSolarTime`
- 輸出欄位：`calendar.solar`、`calendar.lunar`、`calendar.solarTerms`、`calendar.time`、`accuracy.precision`

## 來源與變體

目前沒有額外變體記錄。

## 實作狀態

- implemented；模組：src/calendar。

> 本頁由 Reference registry 與 sources/ 資料生成；完整 rule、evidence、variants 請使用 `Bazi.Reference.getRule()` 或 `Bazi.Reference.toContext()`。
