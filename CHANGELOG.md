# CHANGELOG

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
