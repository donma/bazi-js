# 神煞總論（shensha.md）

- 規則名稱：神煞判定引擎（Data-driven）
- ruleId：SS_*（每條見 shensha-catalog.md）
- 採用方法：每條神煞為一筆資料（含 id/name/category/baseOn/match/ruleId/version/reference），
  引擎掃描四柱逐條比對，命中輸出 hitOn/basedOn/evidence。魁罡等整柱型以 matchChart 判定。
- 公式：`src/shensha/catalog.js` + `src/shensha/index.js`。
- 範例：甲日主，四支見丑/未即天乙貴人（SS_TYGR_001）。
- 已知流派差異：神煞無單一公認全集；v1 完整性定義為「官方目錄所列全部實作、測試、附來源」
  （規範 §11.1），不得宣稱涵蓋所有流派。爭議條目記於 rule-differences.md。
- canonical 選擇理由：以《三命通會》《淵海子平》 common subset 為 v1 目錄。
- 參考文獻：見各條目 reference 欄。
- 測試案例：Lab evidence 頁籤；單元抽查天乙/驛馬/桃花。
- 最後驗證日期：2026-09-08。
