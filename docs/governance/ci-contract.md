# CI 契約

每次 commit 的 CI 應執行：

- `npm test`：unit、golden、Profile、Schema 與固定 fixture。
- `npm run validate`：外部 ledger 的可重現比對，以及節氣精度門檻。
- `npm run build`：瀏覽器 dist bundle 可產出。
- `npm run check:demo`：確認 demo 的必要資產、公開連結與核心 DOM 存在；不渲染或新增畫面內容。
- `npm run validate:taxonomy`：確認 canonical conceptType／patternType 與 legacy mapping 完整。
- `npm run validate:references`：確認規則、概念、來源與 variants 沒有孤兒或未知連結。
- `npm run check:reference-docs`：確認生成的 Reference 概念文件沒有與 registry／sources 脫節。
- `npm run validate:coverage`：確認 coverage JSON 與矩陣可由目前資料重生成。

本 repo 的 GitHub Actions 以 `npm ci` 安裝後執行 `npm run ci`，因此上述 gate 會在 push 與 pull request 一起執行。`coverage` 的 `tests`／`external` 若尚未建立專用概念矩陣，必須標示 `not-collected`，不能用 100% source link 取代外部正確率。

CI 不即時依賴第三方網站。外部網站改版時，先保存新的擷取資料與分類，再更新 fixture；沒有輸出的案例保持 `undetermined`。
