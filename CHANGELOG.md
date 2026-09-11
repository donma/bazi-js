# CHANGELOG

# [Unreleased] - 2026-09-10
- 版本契約對齊：`package.json`／`package-lock.json` 統一為 `bazijs@1.0.2`、Apache-2.0 與 `esbuild ^0.28.2`；新增 [`VERSIONS.md`](VERSIONS.md) 說明 package、engine、API 與規則版本的責任邊界。
- 強弱引擎新增可追溯氣數層：`rawQi`、`effectiveQi`、`transformations`、`assessment`、`decision` 與 `layers`；既有 `score`、`level`、`distribution` 與喜忌結果維持不變。合局／會局先列為轉化候選，不在 canonical 中自動化氣。
- 新增多模型用神 resolver 與流年多層 graph：`result.analysis.useGodResolver` 保留扶抑、格局、調候、通關與從化研究 candidate／conflict；`result.transits.transitGraph` 保留原局／大運／流年／流月／流日／流時節點、時間層連線與可機器核對的歲運事件，兩者都不新增未驗證斷語。
- 新增強弱氣數層 unit test；完整驗證仍以 `npm test`、`npm run validate`、`npm run build` 與 `npm run check:demo` 為準。
- 新增十個正格的保守結構候選引擎與 `result.patterns`；它只依月令司令／建祿／月刃辨識候選，不宣告完整成格或破格，特殊格仍獨立留在 research registry。
- 新增解讀驗證資料契約 `validation/interpretation/`；目前為 `protocol-only`，不把 BaziJS 自己的輸出當成命理解讀的外部真值。
- 建立 Reference ontology 與 API，統一 `shensha`、`special-rule`、`pattern/regular`、`pattern/special` 分類；68 條規則與 68 個概念可連到 6 個來源，提供規則／來源雙向查詢、variants、coverage 與 AI reference context。
- 新增概念、taxonomy、來源、evidence、variant、coverage schemas，以及生成式概念文件與 CI gate；這批是資料與治理層，不改變 `Bazi.calculate()` 的 canonical 結果或 Demo 畫面。
- 新增 `sources/variants.json`，把 Profile／算法差異改成可查詢的 first-class 資料，並加入 variants catalog schema 與測試。
- 將 Calendar、TenGod、HiddenStem、Interactions、Strength、Luck、Transit、UseGod 升格為 8 個系統級 Reference Concept；Reference 索引擴為 76 條 rule／76 個概念，保留 API、輸出欄位、版本與「古籍來源尚待補齊」狀態。
- 全系統輸入契約強化：實際日期、時區、經緯度、規則值與時辰地支均在計算前驗證。
- 真正支援 `lunar_new_year` 年界與 `lunar_month` 月界，並將實際 ruleId 寫入 `result.rules.applied`。
- 流年解析支援 UTC、負時區、半時區與明確 invalid Date 錯誤。
- AI Context 補齊可重現輸入、精度假設、實際規則、完整輔宮與大運資料。
- 新增全系統品質門檻與審查文件；boundary test 修正為實際檢查日柱。

## [1.0.1] - 2026-09-08
- 神煞目錄 17 → 22 條（紅鸞星、天喜星、天醫星、紅艷煞、十惡大敗日，SHENSHA_RULE_VERSION 1.1.0）
- 新增大運神煞（每步大運）與流年神煞（當期流年），SVG 增「流年神煞」「初運神煞」行
- 可讀性：主題對比加深、SVG 字級放大、資訊列改雙行、窄螢幕橫向捲動保可讀
- 修正 SVG 日主五行寫死為「木」（己土曾顯示「己木」）
- 無 breaking change（僅新增 `shenSha`、`shenShaYear` 欄位）
首個正式版本（v1 規範全數交付）：
- Calendar / Solar Terms / Lunar / True Solar Time
- Four Pillars / Ten Gods / Hidden Stems / NaYin / Twelve Stages / KongWang
- TaiYuan / TaiXi / MingGong / ShenGong
- Interactions（合沖刑害破、三合三會、半合拱合）
- Strength Engine（得令得地得勢＋同黨異黨量化＋evidence）
- ShenSha Engine（17 條 data-driven 規則，ruleId＋文獻）
- Luck Cycles（順逆＋三天一歲精確到月日）/ Transit（流年/月/日/時）
- Rule Profiles（canonical＋可 override）
- AI Context / SVG Renderer（4 presets / 3 themes）/ PNG 轉換層
- Demo 首頁 / Geek Lab
- 140 組 Golden Tests＋15 組邊界案例＋19 單元斷言（174/174 pass）
- 外部交叉驗證報告 round-01
- Apache-2.0
