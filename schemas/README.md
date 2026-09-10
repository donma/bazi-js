# BaziJS 資料 Schema

這些是給使用端、驗證工具與資料維護者使用的 JSON Schema，不會把額外說明文字塞進 `demo/index.html`。

- `source-catalog.schema.json`：古籍書目與 evidence 索引。
- `profile.schema.json`：可重現的規則 Profile。
- `rule.schema.json`：可序列化的規則 metadata；執行時的 `match` / `evidence` 函式以 metadata 形式描述。
- `chart-result.schema.json`：SDK 排盤結果的穩定主欄位契約。
- `external-validation.schema.json`：外部抽樣驗證資料集。
- `validation-manifest.schema.json`：SDK 提供的驗證資料索引與總數契約。
- `profile-differential.schema.json`：不同 Profile 的可重現差異案例。

Schema 只規定資料形狀，不替古籍做流派裁決。實際規則仍須回看 `sources/`、各 rule 的 `references`、`variants` 與 `researchNotes`。
