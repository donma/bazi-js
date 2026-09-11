# BaziJS vNext 治理與品質目標

> 狀態：規劃文件　｜　版本：vNext-1.0　｜　建立日期：2026-09-10

這份文件定義 BaziJS 下一階段要完成的治理與品質工作。它是 roadmap，不取代目前生效的規範；目前的規則分級請讀 [`authority-model.md`](authority-model.md)，新增規則流程請讀 [`rule-addition-protocol.md`](rule-addition-protocol.md)，CI 執行契約請讀 [`ci-contract.md`](ci-contract.md)。

## 1. 目標與邊界

BaziJS vNext 的目標，是讓每一個公開計算結果都能回答三個問題：

1. 這個結果使用哪個 Profile 與哪個版本？
2. 這條規則的原始依據、算法範圍與文獻差異是什麼？
3. 這個結果是否有獨立資料可以重跑與比對？

vNext 不把「資料很多」等同於「一定正確」，也不把某個排盤網站的輸出、命理斷語或單一傳本升格為跨流派唯一答案。

## 2. 規則與模型分級

所有規則、模型與資料集都必須明確標記狀態：

| 狀態 | 定義 | 預設行為 |
| --- | --- | --- |
| `canonical` | 已有可定位依據、明確算法、正反例測試與穩定輸出契約 | 可作預設結果 |
| `comparison` | 可重現的替代約定，例如子時換日或人元分日變體 | 只有選取對應 Profile 才啟用 |
| `research-only` | 概念已登錄，但算法、證據或全局條件尚未完成 | 不得覆寫 canonical |
| `undetermined` | 外部資料不足，無法判定一致或差異 | 不得自行補值 |
| `deprecated` | 舊版保留供遷移或相容，不再作新預設 | 只能由明確相容設定使用 |

「特殊格」與需要多柱條件的模型，應留在 `SpecialPatterns`／`Patterns`；不能因為古籍或網站使用「格」字，就放入一般 `ShenSha Catalog`。

## 3. 證據與資料要求

新增或升級規則時，資料至少要分開保存：

- `sources/`：書名、卷次／篇名、版本、原文摘錄、頁碼或 `null`、OCR／校勘註記與可定位連結。
- 規則 metadata：`id`、`ruleId`、`version`、`conceptType`、`ruleFamily`、`baseOn`、`scope`、`confidence`、`references`、`description`、`match`、`evidence`。
- 差異記錄：不同傳本、算法或流派不能互相覆蓋；保留 `variants` 與 `researchNotes`。
- 外部驗證：來源、擷取日期、固定輸入、比較欄位與 `match`／`difference`／`undetermined` 必須一起保存。

官方、學術、國家檔案或專業機構資料可用來核對出生事實；專業命理網站只作外部 chart observation，不把其用神、格局、神煞或生平解讀當作驗證真值。公開人物若時辰不可核實，只比較可證明的年、月、日，不能補入示意時柱。

## 4. Profile 必須真的可重現

Profile 不能只是一張差異說明表。下一階段每個可宣稱「可切換」的設定都必須：

1. 由 `Bazi.calculate(input, { profile })` 實際讀取。
2. 在 `result.meta.profile` 與 `result.rules.applied` 留下完整快照。
3. 對年界、月界、日界、子時、時區、真太陽時、起運法或分析模型的差異，提供固定 fixture。
4. 若只屬研究模型，回傳 `research-only` 與 `finalDecision: false`，不可悄悄改變 canonical 結論。

Profile 的差異是有意義的輸入契約；不能用畫面上的標籤取代實際運算。

## 5. 版本與 breaking change

| 變更 | 版本方向 | 必要處理 |
| --- | --- | --- |
| 修正文案、來源註記或非必要 metadata | patch | 更新 changelog；不得改變既有計算結果 |
| 新增 optional 輸出、證據欄位、比較 Profile 或 research model | minor | 更新 Schema、測試與 README |
| 改變 canonical 四柱、既有 `ruleId` 意義、預設 Profile、輸出型別或 required Schema 欄位 | major | migration note、舊版差異報告與完整回歸測試 |
| 將研究規則升為 canonical | minor 或 major | 必須通過升級門檻，依是否改變既有結果決定 |

以下任一情況視為 breaking change：

- 同一輸入與同一 Profile 得到不同的 canonical 四柱或既有欄位語義。
- 既有 `ruleId` 被重命名、刪除或改成不同判定含義。
- 原本可省略的輸入或輸出欄位變成必要欄位。
- 預設年界、月界、日界、時區或 Profile 行為改變。

任何 breaking change 都必須在 README 更新紀錄中說明原因、影響範圍與遷移方式，不能只在 commit message 中帶過。

## 6. 規則升級門檻

規則從 `research-only`／`comparison` 升為 `canonical` 前，必須全部具備：

- 至少一個可定位的古典或正式來源；來源不完整時保持原狀態。
- 清楚寫出原始判定依據：日柱、時柱、季節、月令或整局條件。
- 正例、反例與邊界 unit test。
- Schema 與資料契約驗證。
- 至少一組獨立外部 observation；外部資料不足時標示 `undetermined`。
- 文獻衝突的 `variants`／`researchNotes` 已保存。
- 不把特殊格局、網站斷語或推定時辰混入一般神煞。
- `npm test`、`npm run validate`、`npm run build` 與 `npm run check:demo` 全部通過。

未達門檻時，可以新增研究資料，但不能改變 canonical 預設結果。

## 7. vNext 施工階段

### P0：資料與引用完整度

- 補齊重要古籍的版本、卷次／篇名、原文、頁碼狀態、OCR／校勘與定位連結。
- 將每條規則的 `conceptType`、`ruleFamily`、`scope` 與信心等級整理一致。
- 為來源衝突建立可查詢的 variants 表。

### P1：曆法與時空精度

- 補強節氣分鐘精度、歷史時區、子時換日與真太陽時的邊界案例。
- 對無法支援的 DST 或歷史時區明確回傳限制，不猜測結果。

### P2：Profile 實際運算

- 讓人元分日、子時換日、命宮算法、用神模型等 Profile 透過同一 API 可重現。
- 為每個會影響結果的 Profile 建立 differential fixture。

### P3：外部驗證擴充

- 持續增加中國、台灣、香港等 `+08:00` 公開人物樣板。
- 出生事實來源與命盤 observation 分離保存。
- 所有差異標示原因，不把「一致」誤寫成「傳統命理已被證明」。

### P4：發布與相容性

- 依本文件判定 patch／minor／major。
- 每次 breaking change 附 migration note。
- 確保 `src`、`dist`、Schema、fixtures、README 與 Demo 靜態檢查同步。

## 8. 每次變更的完成定義

一項治理或規則變更只有在以下項目全部完成後，才算可合併：

- 文件寫清楚目的、範圍、狀態與限制。
- 實作與資料沒有跨分類混放。
- 測試能在離線環境重跑。
- 外部資料有來源 URL、擷取日期與獨立性說明。
- 變更沒有意外改動 Demo 公開文字；若確實改變命盤結果，附上 Profile 與版本說明。
- README 更新紀錄已寫入實際測試結果。

## 9. 本輪施工狀態（2026-09-10）

已完成且不改變 Demo 主畫面的資料／治理層：

- P0 核心：新增 `src/reference/taxonomy.js`，統一 `shensha`、`special-rule`、`pattern/regular`、`pattern/special`，並保留舊 runtime 分類作相容。
- P1 證據索引：現有 6 個來源、古籍 evidence ledger 與 9 組可查詢 variants；未知頁碼仍保留 `null`，沒有虛構版本資訊。
- P2／P5 API：新增 `Bazi.Reference` 的概念、規則、來源、變體、coverage 與 AI context 查詢；Profile 差異集中於 `sources/variants.json`。
- 系統級索引：Calendar、TenGod、HiddenStem、Interactions、Strength、Luck、Transit、UseGod 已各自建立 Reference Concept；這些是 SDK 功能契約，不會被誤分類為 ShenSha 或特殊格。
- P3／P4：新增 coverage artifact、生成式概念文件與對應 Schema；文件由 registry／sources 生成，不手工複製規則內容。
- P13：GitHub Actions 改由 `npm run ci` 執行測試、外部 ledger、taxonomy、Reference、coverage、bundle 與 Demo 檢查。

保留在研究狀態：完整古籍全文／影像校勘、所有 Profile 的實際替換算法、特殊格完整成格判定，以及以概念為單位的外部正確率矩陣。這些若資料不足，維持 `research-only` 或 `not-collected`，不為了填滿數字而升格。

## 10. 非目標

vNext 不承諾：

- 為每位公開人物找到可核實的出生時辰。
- 把單一外部網站輸出當成跨流派標準答案。
- 以大量斷語、醫療、財務或人生預測充當 SDK 驗證。
- 因為資料被收錄，就自動把研究規則升為 canonical。

## 11. 更新方式

本文件若修改治理定義或升版門檻，必須同步更新 README 更新紀錄；若只是新增施工項目，保留原有項目的完成狀態與限制，不刪除歷史決策。
