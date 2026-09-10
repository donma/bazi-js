# CI 契約

每次 commit 的 CI 應執行：

- `npm test`：unit、golden、Profile、Schema 與固定 fixture。
- `npm run validate`：外部 ledger 的可重現比對，以及節氣精度門檻。
- `npm run build`：瀏覽器 dist bundle 可產出。
- `npm run check:demo`：確認 demo 的必要資產、公開連結與核心 DOM 存在；不渲染或新增畫面內容。

CI 不即時依賴第三方網站。外部網站改版時，先保存新的擷取資料與分類，再更新 fixture；沒有輸出的案例保持 `undetermined`。
