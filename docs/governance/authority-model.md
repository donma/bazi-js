# BaziJS 規則治理與可信度模型

本文件定義 BaziJS 如何把古籍資料、可重現算法與研究中假說分開。BaziJS 可以成為可審核的參考實作，但不宣稱古典命理存在跨傳本、跨流派的唯一答案。

## 規則狀態

| 狀態 | 意義 | 可否改變 canonical 結果 |
| --- | --- | --- |
| `canonical` / `implemented` | 已有明確算法、來源索引、unit test 與結果契約 | 可以，但必須走版本治理 |
| `comparison` | 可重現的替代約定，例如換日或人元分日變體 | 只在明確選取 Profile 時改變 |
| `research-only` | 已登錄概念與證據，但尚未完成全局 predicate 或跨來源核對 | 不可以 |
| `undetermined` | 外部資料不足，不能判定一致或差異 | 不可以 |
| `deprecated` | 舊版保留供相容或遷移，不再作為新預設 | 不可以 |

## 憑據層級

1. `source-located`：可定位到古籍卷次／篇名／公開連結，頁碼未知時必須明寫 `null`。
2. `classical`：原始古籍條文或可核對傳本；短摘錄只證明條文，不自動推出完整算法。
3. `external-observation`：獨立排盤引擎或人工校核的已保存觀察。
4. `runtime-evidence`：BaziJS 本次執行產生的匹配欄位。它不能單獨充當外部驗證。

## Profile 原則

Profile 必須能重現選擇：年／月／日界線、真太陽時、起運法，以及分析層的月令人元、命宮掌訣、用神模型、季節模型、通關模型與特殊格研究模型。研究 Profile 可以被選取來檢查邊界，但研究模型的 `finalDecision` 必須是 `false`，直到有完整 predicate 與測試。

## 外部驗證分類

- `match`：同一輸入約定、同一比較範圍下，SDK 與外部觀察一致。
- `difference`：結果不同，且已說明是算法／輸入約定差異或待調查差異。
- `undetermined`：沒有足夠的獨立輸出，不得自行補值。

固定在 repository 的 expected value 只能作回歸測試；`validation/external/independent-ledger.json` 才是獨立觀察的登錄處。

## 版本與 breaking change

- 新增 optional 輸出欄位、證據欄位或 research-only model：通常為 minor change。
- 改變 canonical 四柱、既有 ruleId、既有欄位意義、Profile 預設值或輸出型別：視為 breaking change，需 major version 或明確 migration note。
- 新增 required Schema 欄位：必須同步更新 `RESULT_SCHEMA_VERSION`、fixtures、README log 與 migration 說明。
- 古籍衝突不得以覆蓋方式消失；必須保存 `variants`、`researchNotes` 與比較 Profile。
