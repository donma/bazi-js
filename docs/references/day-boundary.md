# 日柱換日規則（day-boundary.md）

- 規則名稱：子初換日（23:00）vs 民用午夜換日（00:00）
- ruleId：DAY_BOUNDARY_ZISHI_2300（canonical）/ DAY_BOUNDARY_MIDNIGHT_0000
- 採用方法：
  - 23:00：當地時刻 ≥23:00 即進次日計日柱（23:00–23:59 為次日子時）。
  - 00:00：僅 ≥24:00 進次日（23:00–23:59 仍屬當日，稱夜子時）。
- 公式：`src/chart/day-pillar.js`（跨日以 JD+1 換算，正確處理跨月年）。
- 範例：2024-05-15 23:00 → 庚辰日丙子時（canonical）；00:00 profile 下 23:30 → 己卯日甲子時。
- 已知流派差異：子平古法多主子初換日；現代部分軟體用午夜換日。兩派並存，無絕對對錯。
- canonical 選擇理由：古法子初為正統，且與時辰（23:00 起子時）自洽。
- 參考文獻：《三命通會》卷一「子時」論；docs/references/rule-differences.md。
- 測試案例：BD-ZISHI-01/02/03、BD-MIDNIGHT-01。
- 最後驗證日期：2026-09-08。
