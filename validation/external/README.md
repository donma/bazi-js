# 外部驗證資料集

`round-01-samples.json` 把 `validation/reports/round-01-cross-validation.md` 的公開抽樣紀錄整理成機器可讀格式。它保留來源名稱、比對範圍與分類；`npm test` 會重跑本地 SDK 對固定 expected 的比對，`npm run validate` 會重跑日柱錨點與節氣誤差門檻。

這不是即時抓站測試。公開排盤站內容可能改版，因此每次新增一輪資料都應保存擷取日期與報告，並把「外部來源一致」和「本地引擎通過」分開記錄。
