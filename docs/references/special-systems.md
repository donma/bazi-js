# 特殊分析系統：五分類、命卦與起運方法

本文件記錄 BaziJS 新增的三項可選分析。它們不是同一個傳統系統：五分類屬於用神推導，命卦屬於八宅輔助法，起運則屬於子平大運計算的換算 variant。

## 1. 用／喜／閒／仇／忌

### 資料模型

欄位位置：`result.strength.fiveCategory`

| 欄位 | 意義 |
| --- | --- |
| `modelId` | `canonical-use-derived` |
| `useElement` | 本次 canonical 強弱模型 `favorableElements[0]` |
| `groups.use` | 用神五行 |
| `groups.joy` | 生用神的五行 |
| `groups.idle` | 對用神無直接主要生剋方向的剩餘五行 |
| `groups.adversary` | 生忌神的五行 |
| `groups.taboo` | 直接制約用神的五行 |
| `evidence` | 每一步生剋推導 |

現代教學資料通常將用神、喜神、忌神、仇神、閒神依「平衡命局」及五行生剋關係說明；這可作為術語與分類的比較來源，但不是古籍已裁決的唯一演算法：[命理堂〈喜用神與忌神〉](https://www.minglitang.com.au/learn/favourable-unfavourable)。因此 SDK 不把這個五分類改寫成 ShenSha，也不把 `useElement` 說成所有流派共同的用神。

### 古典資料摘要（2／3／4）

`result.classicalSummary` 是給 UI、JSON 匯出與 AI Context 共用的資料層，不是新的斷語引擎。它固定包含四個 section：

| section | 內容 | 判定範圍 |
| --- | --- | --- |
| `fiveCategory` | 用／喜／閒／仇／忌、五行分布、月令狀態與推導 evidence | 全局扶抑模型 |
| `monthCommand` | 月令、人元藏干、分段日數、節氣起點與十神 | 月令／季節 |
| `voids` | 日空、年空、旬名、空亡地支與四柱命中矩陣 | 日柱／年柱旬空 |
| `auxiliary` | 胎元、胎息、命宮、身宮及可供密集表格使用的 `matrix` | 輔助宮位 |

每個 section 都保留 `ruleId`、版本、古典來源、`variants`、`researchNotes` 與 `evidence`。其中月令分日表、五分類取用、命宮身宮公式都標為 profile／流派敏感；空亡的六旬計算則可由六十甲子索引直接重現。這樣畫面可以只顯示摘要，使用端仍能取得完整可追溯資料。

主要古典對讀：[《三命通會》卷二](https://zh.wikisource.org/zh-hant/三命通會/卷二)（人元司事、胎元、坐命官）、[《三命通會》卷三](https://zh.wikisource.org/zh-hant/三命通會/卷三)（空亡）、[《滴天髓闡微》](https://zh.wikisource.org/zh-hant/滴天髓闡微)（月令與喜忌術語）。

## 2. 八宅命卦／東四西四

### 採用 Profile

`bazhai-ming-gua-last-two-digits`：

1. 先使用本次四柱實際採用的年份切界；canonical 為立春。
2. 取年份末兩位數。
3. 男命使用 `100 - 年末兩位`，女命使用 `年末兩位 - 4`。
4. 化為 1–9；餘數 5 另依性別寄卦，男寄坤（2），女寄艮（8）。
5. 依後天八卦表輸出卦名、方位與東四／西四命。

此欄位位置：`result.auxiliary.mingGua`。它只作八宅輔助資料，不會進入 `result.shenSha`、`result.specialRules` 或子平 `Patterns`。

網路資料可以互相校對，但不能假裝沒有差異。本次保存的抽樣包括八宅算法說明與 1984 女性艮卦案例：[八宅工具說明](https://www.d02.cn/tool/bazhai/)、[K366 1984 命卦案例](https://m.k366.com/minggua/1984.htm)。另有來源在完整年份、跨世紀與 2020 案例上出現公式／表格矛盾，故列入衝突來源：[觀音堂命卦計算說明](https://guanyitang.com/tools/kua-number)。

## 3. 起運換算 variants

### canonical

`jieqi-diff-divide-3`：依順逆取前／後一個「節」，用出生時刻與節的精確日差換算；一日折四個月，並保留起運公曆日期。古籍文本中有「大運一辰十歲」及「折除以三日為年」的判定依據，見[《三命通會》卷二〈論坐命官〉與〈論大運〉](https://zh.wikisource.org/zh-hant/三命通會_(四庫全書本)/卷02)。

### comparison

`jieqi-whole-days-divide-3` 先取整日再除三，只用來比較不同排盤工具的取整差異。它不是 canonical 預設，也不會覆蓋精確法。

結果中的 `luckCycles.startAge` 是實際使用的方法；`luckCycles.variants` 是同一出生資料的摘要比較。兩者都會帶 `rawDiffDays`、`calculationDiffDays`、`method`、`references` 與 `caveat`。

## 驗證界線

網路抽樣資料固定在 `validation/external/round-02-special-systems.json`，每筆包含來源、網址、範圍、分類與期望值。測試驗證的是：

- 同一輸入、同一 Profile、同一版本能得到同一結果。
- 公開來源在指定範圍內的案例能重現。
- 來源衝突不被刪除，會保留在 `variants`、`researchNotes` 或驗證資料集。
- `npm test` 與 `npm run validate` 不需要即時連線，避免外部網站改版造成不可重現。

這種驗證可以保證 SDK 的可重現性與證據鏈，不能保證古典命理跨流派存在一個不受爭議的絕對答案。
