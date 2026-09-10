# BaziJS 版本契約

本檔案記錄發布套件與 SDK runtime 的版本對齊方式。實際規則版本仍由 `src/rules/versions.js` 匯出，不能只讀 npm 套件版本推定規則版本。

| 項目 | 目前值 | 來源／用途 |
| --- | --- | --- |
| npm package | `1.0.2` | `package.json`、`package-lock.json`；與目前 engine runtime 對齊 |
| engine | `1.0.2` | `src/rules/versions.js` 的 `ENGINE_VERSION` |
| API | `1.0.0` | `src/rules/versions.js` 的 `API_VERSION`；既有 API 相容契約 |
| result schema | `2.1.0` | `src/rules/versions.js` 的 `RESULT_SCHEMA_VERSION`；本輪只新增 optional 輸出 |
| strength rules | `1.0.0` | 既有 canonical 分數規則；新增氣數層為 additive metadata |
| strength qi layers | `1.1.0` | `src/strength/qi-layers.js`；raw/effective/transformation evidence |
| use-god resolver | `0.1.0` | `src/analysis/use-god-resolver.js`；多模型 candidates/conflicts/finalDecision |
| transit graph | `0.1.0` | `src/transit/index.js`；原局／大運／流年月日時節點與已觀測 edge |
| regular patterns | `0.2.0` | `src/patterns/regular.js`；十個正格的月令／祿刃結構候選 |

## 對齊規則

- 修改既有輸出語義、預設 Profile 或必要輸入前，先更新 API／Schema 版本與 migration note。
- 新增 optional 輸出或 evidence 欄位，不刪除舊欄位；通常走 minor 版本並補 unit test。
- `package.json` 與 `package-lock.json` 的套件名稱、版本、license、依賴範圍必須一致；CI 一律使用 `npm ci`。
- Changelog 的 Unreleased 項目必須說明是否改變 canonical 結果；本輪氣數層不改變既有 `score`、`level` 或 `distribution`。
