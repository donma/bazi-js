# `ai-guide/sample1.html` 與 BaziJS SDK 差異 audit

最後整理日期：2026-09-09

## 結論

`sample1.html` 是一張完整的靜態展示頁，除了四柱計算，也混合了西洋星座、袁天罡稱骨、命卦、星宿、用神文案、流年分數和盲派串宮。BaziJS 的 SDK 規格則要求計算結果可追溯、規則可辨識、古典格局不可冒充神煞。因此本次補齊「可以由目前 SDK 計算且能輸出 evidence」的差異；無法證明演算法或屬於另一套術數的內容，保留在 audit，不直接寫入 `result`。

## 可計算差異與目前狀態

| sample1 區塊 | BaziJS 欄位/畫面 | 狀態 | 說明 |
|---|---|---|---|
| 公曆、農曆、生肖 | `calendar.solar`、`calendar.lunar`、`calendar.zodiac` | 已補 | 生肖沿用四柱的節氣年界，不用國曆年份硬猜。 |
| 星座 | `calendar.constellation` | 已補 | 只做公曆顯示輔助，不參與子平計算。 |
| 節氣、季節 | `calendar.solarTerms`、`pillars.month.branch` | 已有/已補強顯示 | canonical 季節按節令月支；巳月是夏，不沿用 sample1 靜態的「立夏但季節春」。 |
| 司令 | `strength.monthCommander` | 已補 | 以節後整日配人元司令分段，回傳分段、天數與演算法。不同傳本分日不同，不能視為唯一標準。 |
| 命格、強弱、五行 | `strength`、`tenGods` | 已有/已補強顯示 | 目前輸出可重現的強弱模型與五行分布；不複製 sample1 的矛盾文案（同時寫身弱與偏旺）。另提供用／喜／閒／仇／忌模型摘要。 |
| 四柱表格 | `pillars`、`tenGods`、`hiddenStems`、`twelveStages`、`kongWang`、`nayin` | 已有 | demo 以四張直式卡片呈現，神煞置於各柱下方並可展開 evidence。 |
| 天干/地支留意 | `interactions.stems`、`interactions.branches` | 已有/已顯示 | 不把互動名稱改寫成未經規則定義的吉凶句。 |
| 起運日期、起訖年份 | `luckCycles.startAge`、`cycles[].startDate/endDate` | 已補 | 大運年份改為與實際起運日期所在年份對齊；舊的 `fromAge/toAge` 保留，另提供 nominal age。 |
| 大運神煞 | `cycles[].shenSha` | 已有 | 仍使用 ShenSha registry，不把大運格局混入神煞。 |
| 每一步逐年流年 | `cycles[].annuals` | 已補（選配） | `includeLuckAnnualDetails: true` 時提供 10 年結構、流年神煞與原局互動；demo 預設開啟。 |
| 五行旺衰卡片 | `strength.seasonalStates` | 已補 | 每個五行都有月令狀態與係數，demo 同時顯示比例和狀態。 |
| 八宅命卦、東四西四 | `auxiliary.mingGua` | 已補（獨立輔助系統） | 採立春切年、年末兩位數與性別算法；保留跨世紀、餘 5 與來源衝突，不混入子平神煞。 |
| 起運方法差異 | `luckCycles.variants` | 已補 | canonical 使用精確節氣差；另提供整日取整的 comparison Profile，兩者不互相覆蓋。 |
| 流年運勢評分圖 | 無 | 未實作 | sample1 的小限/流年/實際分數沒有可核對的公開計分規格；SDK 不輸出假精確分數。 |

## 刻意不直接加入 SDK 的區塊

### 袁天罡稱骨

這是以農曆年月日時套表的另一套民俗重量法，sample1 的「4兩8錢」與其批註不能從目前子平四柱規則推導。現階段沒有把它放入 `strength` 或 `luckCycles`，避免誤稱為子平結果。若日後要支援，應獨立成 `folk/weight`，為每一筆重量與批註提供版本、表格來源、異文與 opt-in profile。

### 本命星宿

二十八宿依賴獨立天文資料系統，不是四柱、十神或子平神煞的同一層。sample1 顯示的是固定解說文章，沒有可審核的完整演算法輸入與版本，仍未納入 SDK。八宅命卦已移到 `src/auxiliary/ming-gua.js`，但明確標示為另一套輔助系統，不塞入 ShenSha Catalog。

### 命盤程式分析、流年分數、盲派串宮

sample1 內的 `pibazi-pane` 多為固定斷語；流年頁還混合小運、用忌神文字、健康/婚姻/父母等推斷。這些不是 SDK 目前的可驗證計算層，也不應因畫面上有文字就冒充 evidence。盲派串宮同樣是獨立流派，應另建 profile 與資料模型；本次只補足共用的流年干支、互動、神煞基礎資料。

## sample1 抽樣比對

抽樣輸入：

```js
{ birthDate: '1983-05-11', birthTime: '16:19', gender: 'male', timezone: '+08:00' }
```

canonical SDK 與 sample1 可一致重現的項目：

- 四柱：`癸亥／丁巳／己亥／壬申`
- 農曆：`癸亥年三月廿九日`
- 節氣：`立夏`
- 生肖：`豬`
- 星座：`金牛座`
- 月令司令：`戊土`（節後整日 `5`，採巳月前段）
- 首步大運：`丙辰`，實際起運年份 `1985`，年度資料可展開
- 原局互動：丁癸沖、丁壬合木、巳亥沖、亥亥自刑、申亥害、巳申合水等

本次保留為差異、不是偷偷改成 sample1 數字的項目：

- sample1 靜態資料把季節寫成「春」，但 canonical 依巳月判為「夏」。
- sample1 的命宮/身宮是 `丙辰／甲寅`；BaziJS canonical 依現有輔助宮位公式輸出 `甲寅／甲子`。兩者是規則 profile 差異，不能在沒有來源確認時宣稱哪個唯一正確。
- sample1 顯示起運時間 `1985-02-09 18:18:00`；BaziJS 依目前 `jieqi-diff-divide-3` 與天文節氣 JD 產生 `1985-02-09 23:57`。本次輸出精確時間與計算方法，讓差異可被測試，而不是刪掉時間欄位。
- sample1 的「4兩8錢」、星宿、流年分數、盲派斷語未納入 canonical SDK；命卦已以獨立八宅 Profile 加入，不冒充子平核心結果。

## 古典考據與分類邊界

整局特殊格仍維持 `src/patterns/registry.js` 的 research-only 架構。比如《三命通會》卷六的「壬騎龍背」描述壬日坐辰、辰多、暗衝戌、再看寅合與財官等全局條件；「日祿歸時」也明列日時、官星、刑沖破害及月令取捨。它們不能簡化為一個 `dayPillar` 名稱，更不能進一般神煞表。

人元司令則是月令的時間分段資料，與月支、節氣差有關；本專案保留分段 evidence。參考《三命通會》卷六、卷七的子平格局文字與《滴天髓闡微》的「人元司令」說明，以及目前可查的司令分段整理：

- https://zh.wikisource.org/zh-hant/三命通會/卷六
- https://zh.wikisource.org/zh-hans/三命通會_(四庫全書本)/卷07
- https://upload.wikimedia.org/wikipedia/commons/d/db/SSID-11335994_%E6%BB%B4%E5%A4%A9%E9%AB%93%E9%97%A1%E5%BE%AE.pdf

## 驗證方式

- `tests/run.js`：sample1 抽樣欄位、星座、生肖、司令、起運年份、逐年資料及 AI Context。
- `npm test`：完整單元、ShenSha vNext、140 組 golden cases、邊界案例。
- `npm run build`：同步產生瀏覽器使用的 `dist/bazi-sdk.js`、minified 與 ESM bundle。
- 瀏覽器抽樣：`http://127.0.0.1:4173/demo/index.html` 強制重新載入，檢查新欄位、逐年展開、四柱神煞與手機窄寬不出現水平卷軸。
