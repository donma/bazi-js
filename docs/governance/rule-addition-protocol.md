# 新增規則流程

新增一條古典規則前，依序完成以下項目：

1. 判定概念類型：`shensha`、`special-pillar`、`seasonal-special` 或 `special-pattern`。固定日柱與整局格局不得混放在 ShenSha Catalog。
2. 建立來源記錄：書名、卷次／篇名、版本或數位轉錄狀態、原文摘錄、定位 URL、頁碼；未知頁碼寫 `null`，不可猜頁碼。
3. 記錄原始判定依據：是日柱、時柱、月令、季節、透干、合局、沖破，還是多柱 predicate。
4. 保存差異：不同傳本或流派規則不同時，加入 `variants` 與 `researchNotes`，不要假裝只有一個答案。
5. 實作可重現函數：輸出 `ruleId`、`version`、`confidence`、`references`、`description`、`match` 與 `evidence`。
6. 新增正例、反例與邊界 unit test；研究規則至少測試「不應宣告命中」。
7. 更新相關 Schema、外部 fixture、治理文件與 README 更新紀錄。
8. 通過 `npm test`、`npm run validate`、`npm run build` 與 demo 靜態檢查後，才可提出 canonical 升版。

## canonical 升級門檻

規則必須有可定位古籍證據、至少一組獨立外部或人工校核、明確的反例、沒有未處理的重大版本衝突，並由 review 確認不會把格局冒充神煞。若仍有文獻衝突，先停留在 comparison 或 research-only。
