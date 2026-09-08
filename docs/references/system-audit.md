# BaziJS 全系統審查紀錄

## 審查目標

本次審查以「可被 GitHub 開發者與 AI 當作參考實作」為目標，重點不是宣稱命理有唯一答案，而是確保每個計算選擇都可重現、每個差異都可說明、每個輸出都不會悄悄遺漏資料。

## 模組盤點

| 模組 | 目前狀態 | 可追溯資料 |
| --- | --- | --- |
| Input Validation | 已強化 | 錯誤 code、field、allowedRange |
| JD / ΔT | 已實作 | calendar rule version、公式文件 |
| 節氣 | 已實作，低精度模型 | `solarTerms`、debug trace、精度聲明 |
| 農曆 | 已實作 1900–2100 | 壓縮表、閏月資料、超範圍錯誤 |
| 年柱 | 已實作立春／農曆正月初一 | `YEAR_BOUNDARY_*`、trace |
| 月柱 | 已實作十二節／農曆月 | `MONTH_BOUNDARY_*`、trace |
| 日柱 | 已實作 23:00／00:00 | `DAY_BOUNDARY_*`、effectiveDate |
| 時柱 | exact／branch／unknown | `available`、mode、trace |
| 十神／藏干／納音／長生／空亡 | 已實作 | 結構化結果與 unit tests |
| 合沖刑害破 | 已實作 | interaction type、pillars、chars |
| 強弱 | canonical 模型 | score、level、evidence、模型限制 |
| ShenSha | vNext data-driven | registry schema、ruleId、references、evidence |
| SpecialRules | SpecialPillar／SeasonalSpecial | conceptType、variants、researchNotes |
| Patterns | 研究登錄 | `implemented: false`、研究證據，不宣告成格 |
| 大運／流年 | 已實作 | 起運依據、完整年度資料、時間假設 |
| AI Context | 完整投影 | 原始輸入、rules、accuracy、全大運與流運 |
| SVG／PNG | 完整渲染 | 動態高度、同一 Result、浮水印 |

## 本輪修正的高風險問題

1. 修正只知時辰的地支驗證運算子錯誤，非法地支不再進入引擎。
2. 補上實際月日合法性判定，`2024-02-30` 等日期會被拒絕。
3. 補上時區數值範圍與經緯度範圍，並統一所有模組的時區解析。
4. 真正實作 `lunar_new_year` 與 `lunar_month` Profile 邊界。
5. 流年解析補上 UTC、負時區、半時區與 invalid Date 的處理。
6. 修正 `result.rules.applied` 在使用 input override 時仍顯示舊 ruleId 的問題。
7. 大運在 unknown／branch 模式下揭露起運時間的中午或時辰中點假設。
8. AI Context 補齊完整輸入、精度、實際規則、輔宮物件與大運欄位。
9. 修正 boundary test 原本沒有真正檢查大部分日柱的條件判斷。

## 目前仍刻意不冒充完成的部分

- 節氣仍是 Meeus 低精度模型，接近交界時需人工覆核。
- 歷史時區與夏令時間資料庫尚未內建。
- 整局特殊格（壬騎龍背、六陰朝陽、六乙鼠貴、日祿歸時、拱祿、拱貴、福德秀氣）仍在 `Patterns` 研究架構，沒有硬塞進神煞。
- 強弱、喜用與神煞吉凶仍是可配置的傳統模型，不應包裝成科學診斷或唯一流派答案。

## 審查結論

BaziJS 的參考價值應建立在「資料契約、證據鏈、版本化與可重現測試」上，而不是用「絕對權威」四字掩蓋流派差異或曆算限制。只要新增規則遵守 [`quality-gates.md`](../architecture/quality-gates.md) 與 CONTRIBUTING.md，第三方就能清楚分辨已實作算法、canonical 選擇、研究項目與需要人工覆核的邊界。
