# CONTRIBUTING

1. 先讀 `BaziJS_v1_SPEC.md` 與 `docs/references/rule-differences.md`。
2. 命理規則必須資料化（data-driven），不得散落 if/switch；每條規則須有 ruleId＋version＋文獻。
3. 不可用 production code 產生 golden expected；新增規則須同步新增測試與參考文件。
4. 發現與外部來源差異時，先分類（match / rule-difference / source-error / local-bug），
   不得直接迎合單一網站，並記入 `validation/reports/`。
5. Breaking change 必須在 CHANGELOG 標 BREAKING 並說明欄位對照。
