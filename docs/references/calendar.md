# 曆法計算（calendar.md）

- 規則名稱：公曆 ↔ 儒略日、ΔT（TT−UT）、農曆換算
- ruleId：CAL_JDN_001 / CAL_DELTAT_002 / CAL_LUNAR_003
- 採用方法：
  - JDN：Meeus《Astronomical Algorithms》ch.7 公曆轉 JD 公式（-1524.5 常數式）。
  - ΔT：Espenak & Meeus《Five Millennium Canon》七段式（1900–1920 / 1920–1941 / 1941–1961 / 1961–1986 / 1986–2005 / 2005–2050 / 2050–2150）。
  - 農曆：紫金山天文台曆算結構之 1900–2100 壓縮編碼表（LUNAR_INFO），1900-01-31 為正月初一錨點。
- 公式：見 `src/calendar/julian.js`、`src/calendar/lunar.js`。
- 範例：2000-01-01 → 農曆冬月廿五；2024-02-10 → 正月初一；2023-03-22 → 閏二月初一。
- 已知流派差異：無（天文曆算）。1900-01-01..30 歸 1899 年臘月（臘月大 30 天）。
- canonical 選擇理由：唯一天文事實，無流派。
- 參考文獻：Meeus 2nd ed. ch.7；NASA Eclipse Web Site ΔT 多項式；紫金山天文台《中國天文年曆》。
- 測試案例：UT-DAY-1900/2000/2024、BD-EDGE-1900/2100、農曆閏月斷言（tests/run.js）。
- 最後驗證日期：2026-09-08（validation/reports/round-01）。

## 已知限制
- ΔT 為預測多項式，2100 端外推誤差可達數十秒，不影響日柱/農曆，僅節氣時刻有秒級漂移。
