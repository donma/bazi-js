# RELEASE CHECKLIST（v1.0.0 / 2026-09-08）

- [x] Browser 可直接使用（dist IIFE，demo/lab 雙擊 file:// 可開）
- [x] 不需要後端
- [x] 核心零依賴（package.json dependencies 為空；esbuild 僅 dev）
- [x] 日期範圍正確限制（1900-01-01~2100-12-31，越界 BIRTH_DATE_OUT_OF_RANGE）
- [x] 四柱正確（140 golden＋三外部錨點全對）
- [x] 節氣邊界正確（±10 分鐘精度內；BD-LICHUN-01/02 pass）
- [x] 日柱換日 Profile 正確（23:00/00:00，BD-ZISHI/MIDNIGHT pass）
- [x] 真太陽時可切換（保留 civilTime＋修正分鐘數，BD-TST-01 pass）
- [x] 農曆正確（含閏月、1900/2100 邊界）
- [x] 十神完成／藏干完成／納音完成／十二長生完成／空亡完成
- [x] 胎元完成／胎息完成／命宮完成／身宮完成（未知時辰為 null）
- [x] 合沖刑害完成（三合三會半合拱合六合六沖刑害破＋天干合沖）
- [x] 強弱引擎完成（非數個數＋evidence＋喜忌；定位聲明已寫）
- [x] 神煞目錄全部完成（17 條＋ruleId＋文獻，shensha-catalog.md）
- [x] 大運完成／流年完成／流月完成／流日完成／流時完成
- [x] Rule Profile 完成（繼承/override/diff/版本/ruleId）
- [x] AI Context 完成
- [x] SVG 完成／PNG 完成／4 presets 完成／3 themes 完成
- [x] index.html 完成／lab.html 完成
- [x] 100+ Golden Tests 全過（140 golden＋15 boundary＋19 unit＝174/174）
- [x] 外部抽樣驗證完成（round-01：3 錨點＋7 節氣＋農曆，多站交叉）
- [x] validation report 完成
- [x] docs/references 完成（11 篇）
- [x] README 完成／Apache-2.0 完成（LICENSE＋NOTICE）
- [x] dist build 完成（bazi-sdk.js／min.js＋map／esm.js＋map）
- [x] RELEASE_CHECKLIST 全過（本文件）

驗證指令：`npm run build && npm test && node scripts/validate-external.js`（2026-09-08 全綠）。
已知限制：節氣 ±10 分鐘（solar-terms.md）、強弱為流派模型（strength-analysis.md）。
