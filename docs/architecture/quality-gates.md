# BaziJS 品質門檻與可信度模型

這份文件定義 BaziJS 何時可以被當作「可重建、可審查、可引用」的命理軟體 SDK。目標是讓其他開發者或 AI 能沿著同一套資料契約重建結果，而不是把某一個網站的顯示文字誤當成唯一真理。

## 一、資料流與責任邊界

```text
輸入
  → Validation
  → Calendar（公曆、JD、節氣、農曆、真太陽時）
  → Four Pillars（年、月、日、時）
  → Derived Engines（十神、藏干、納音、長生、空亡、輔宮、八宅命卦）
  → Interactions / Strength / ShenSha / SpecialRules / Patterns
  → Structured Result
  → AI Context / Renderer / Demo
```

- `src/` 是唯一的計算來源；`demo/`、`lab/` 只能消費 SDK 結果。
- Renderer 不得重新推算四柱；AI Context 不得用自然語言猜算四柱。
- 一般神煞放在 `ShenSha`；固定柱位條件放在 `SpecialRules`；整局格局保留在 `Patterns` 研究登錄。
- 每個可能改變命盤的選擇，都必須出現在 `result.meta`、`result.accuracy` 或 `result.rules.applied`。
- `sources/`、`profiles/`、`schemas/` 與 `validation/` 是可審核資料層；它們不應被 Demo 當成額外解說文字，也不能繞過 `src/` 的唯一計算來源。
- 五分類是 `Strength` 的明示推導模型；命卦是 `Auxiliary` 的八宅資料；兩者都不得被序列化成一般 ShenSha。

## 二、不可違反的不變量

1. 同一輸入、同一 Profile、同一規則版本，核心計算必須得到相同結果。
2. 1900-01-01 至 2100-12-31 是目前公曆與農曆換算的保證範圍；範圍外不得靜默產生農曆結果。
3. 無效日期、時區、經緯度、出生時辰與規則選項，必須在進入計算引擎前失敗。
4. `birthTimeMode: 'unknown'` 不得猜測時柱；`branch` 只知道時支，起運時刻必須標示中點估算。
5. 節氣採 Meeus 低精度太陽黃經模型，節氣交界附近約 ±10 分鐘必須在結果中揭露精度限制。
6. 古籍名稱中含有「格」不代表它就是神煞；需要整局條件的項目不得塞進 ShenSha Catalog。
7. `result.rules.applied` 必須反映實際採用值，而不是只回傳 Profile 的預設值。
8. 起運的實際方法必須出現在 `luckCycles.startAge.method`；比較方法只能放在 `luckCycles.variants`，不得混入 active 結果。
9. 外部網路抽樣必須保存網址、擷取日期、分類與衝突註記；測試不依賴即時網站，避免不可重現。

## 三、發布前必跑檢查

```bash
npm test
npm run build
npm run validate
git diff --check
```

目前測試分層如下：

| 層級 | 內容 | 目的 |
| --- | --- | --- |
| Unit | 日柱錨點、輸入契約、Profile、邊界規則、Renderer、AI Context | 防止局部回歸 |
| Golden | 140 組跨年份四柱完整比對 | 防止公式或時區改動造成大面積偏移 |
| Boundary | 立春、子初、午夜、未知時間、時辰、真太陽時、1900/2100 | 覆蓋高風險邊界 |
| ShenSha vNext | Catalog schema、證據、流運神煞、特殊規則分類 | 防止概念分類污染 |
| Data Contracts | sources、profiles、schemas、Profile differential、外部資料集 | 防止證據、流派設定與結果格式漂移 |
| External | 日柱錨點、節氣公布時刻、命卦案例、五分類定義、起運方法差異 | 確認生產算法不是只對自己生成的 expected |

## 四、可接受限制與使用者提示

- 節氣不是固定公曆日期；交界附近應提供 `debug` 或 `calendar.solarTerms` 供人工覆核。
- 本 SDK 沒有內建歷史時區、夏令時間與地點政治時區資料庫；使用者需傳入正確的 `timezone`，真太陽時則需提供 `location.longitude`。
- 強弱分數是明確命名的 canonical 扶抑模型，不是科學測量，也不代表所有子平流派的唯一答案。
- 大運起運以「順逆、節氣差除三」為 canonical；不同古籍或流派採氣、虛歲或其他折算方式時，應建立 Profile 或在輸出中標示差異。
- 八宅命卦與五分類存在現代算法及流派差異；BaziJS 只能保證指定方法、Profile、版本與證據範圍內的可重現，不能宣稱跨流派絕對正確。
- `Bazi.Transit.calculateTransit()` 若未指定 `datetime` 會使用執行當下時間；要做測試、快取或出版品，必須傳入明確時刻。

## 五、引用規則的最低要求

新增命理規則前，至少要有：

- 穩定 `id`、`ruleId`、`version`、`conceptType`、`ruleFamily`。
- 原始判定依據、適用範圍、流派差異與 `references`。
- 對應 `evidence`，讓使用者知道是哪個干支、柱位、季節或整局條件命中。
- 正向與反向 unit test；若古籍有不同版本，必須保存 `variants` 或 `researchNotes`。
- 文件要明確寫出「目前是否實作」，不得用研究登錄冒充已完成格局。
