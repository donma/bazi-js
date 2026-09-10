# Round 03 差異追查與裁決紀錄

本文件針對 [`round-03-boundary-samples.json`](../external/round-03-boundary-samples.json) 的 6 組 `difference` 逐項說明。`difference` 是可重現的觀察分類，不等於已證明 BaziJS 或外部引擎錯誤。

## 1. `R03-TZ-NEWYORK-DST`

- BaziJS：`癸卯 壬戌 丁卯 辛丑`
- 外部引擎：`癸卯 壬戌 丁卯 庚子`
- 原因：測試輸入帶有 `dstOffset: 1`，但 BaziJS 目前沒有把夏令時間偏移列入公開輸入契約，會保留原始 `01:30`；外部引擎則按 `01:30 DST → 00:30 standard` 處理。
- 裁決：`difference / unsupported-input-option`
- 後續：若要支援歷史夏令時間，應新增明確的 `dstOffset` 契約、結果 evidence 與跨日測試；不能讓使用者以為 SDK 已自動判斷政治時區。

## 2. `R03-ZI-2359-0000`

- BaziJS：`甲辰 己巳 甲申 甲子`
- 外部引擎：`甲辰 己巳 甲申 丙子`
- 原因：兩者都保留 `00:00` 日柱不換日；外部引擎的午夜模式採古法「夜子時日用本日、時用明日之干」，因此以次日乙日取丙子時。BaziJS 的 `00:00` 比較 Profile 目前仍以顯示日柱直接套五鼠遁。
- 裁決：`difference / profile-variant`
- 後續：不能把外部變體直接改寫 canonical；應在 Profile 中明確命名「午夜同日取時干」或「午夜夜子取次日干」。

## 3. `R03-JIE-LICHUN-2024-BEFORE`

- BaziJS：`甲辰 丙寅 戊戌 庚申`
- 外部引擎：`癸卯 乙丑 戊戌 庚申`
- 公開曆算參考：2024 年立春約為 UTC+8 `16:26:53`；測試輸入為 `16:26`，外部引擎仍在立春前，BaziJS 已切換。
- BaziJS 自身節氣模型估算的立春約為 `16:20`，比公開參考提前約 7 分鐘。
- 裁決：`difference / solar-term-precision`
- 後續：這不是命理流派差異；需要提升節氣模型或建立 1900～2100 的版本化節氣資料，才可把分鐘邊界作為可靠切界。

## 4. `R03-JIE-LICHUN-2025-BEFORE`

- BaziJS：`乙巳 戊寅 癸卯 癸亥`
- 外部引擎：`甲辰 丁丑 癸卯 癸亥`
- 公開曆算參考：2025 年立春約為 UTC+8 `22:10`；測試輸入為 `22:09`，外部引擎仍在立春前，BaziJS 已切換。
- BaziJS 自身節氣模型估算約為 `22:07`，仍有數分鐘提前。
- 裁決：`difference / solar-term-precision`
- 後續：與 2024 立春同屬節氣模型精度問題，不能用單一網站結果覆寫 canonical，應改用可定位的天文年曆或更高精度算法。

## 5. `R03-JIE-JINGZHE-2024-BEFORE`

- BaziJS：`甲辰 丁卯 戊辰 丁巳`
- 外部引擎：`甲辰 丙寅 戊辰 丁巳`
- 公開曆算參考：2024 年驚蟄約為 UTC+8 `10:22`；測試輸入為 `10:21`，外部引擎仍在寅月，BaziJS 已切換卯月。
- BaziJS 自身模型估算約為 `10:14`，提前約 8 分鐘。
- 裁決：`difference / solar-term-precision`

## 6. `R03-JIE-QINGMING-2024-BEFORE`

- BaziJS：`甲辰 戊辰 戊戌 庚申`
- 外部引擎：`甲辰 丁卯 戊戌 庚申`
- 公開曆算參考：2024 年清明約為 UTC+8 `15:02`；測試輸入為 `15:00`，外部引擎仍在卯月，BaziJS 已切換辰月。
- BaziJS 自身模型估算約為 `14:54`，提前約 8 分鐘。
- 裁決：`difference / solar-term-precision`

## 外部曆算參考

- [臺北市政府／中央氣象署 2024 天文年鑑資料](https://www.cwa.gov.tw/Data/astronomy/2024cal.pdf)：可校核 2024 年驚蟄、清明等節氣時刻。
- [香港天文台 2025 年曆](https://www.hko.gov.hk/tc/gts/astron2025/files/HKO_almanac_2025.pdf)：可校核 2025 年立春時刻。
- [2024 二十四節氣表](https://mip.wannianli.tianqi.com/news/290617.html)：提供 2024 年立春 `16:26:53` 等分鐘／秒級公開對照值。

## 結論

本輪 6 組差異中：

- 1 組是 BaziJS 尚未支援的夏令時間輸入能力。
- 1 組是 `00:00` Profile 的晚子時時干變體，屬 Profile 設計議題。
- 4 組揭露目前低精度節氣模型會在切界前數分鐘提前換月／換年，屬待修正的曆算精度問題。

因此本輪不修改 canonical 四柱，也不把 6 組差異刪除；先完成證據與分類，後續再分別處理 DST 契約、晚子時 Profile 與節氣模型升級。
