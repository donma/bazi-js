# 大運起運（luck-cycle.md）

- 規則名稱：順逆排大運、起運歲數（三天一歲）與可比較換算法
- ruleId：LUCK_DIR_GENDER_YINYANG（canonical）/ LUCK_START_DIFF_DIV_3
- 採用方法：
  - 方向：年干陽＋男、年干陰＋女 → 順行；反之逆行。
  - 起運：順行取出生至「下一節」之日差、逆行取至「上一節」之日差；總月數 = 日差 × 4
    （三天折一歲 ⇒ 一日折四月），換算歲/月/日，並以 日差 × 365.2422/3 天推公曆起運日。
  - 大運干支自月柱順/逆推移，每步十年，共 10 步。
  - canonical `startAgeMethod` 為 `jieqi-diff-divide-3`，保留精確日差；`jieqi-whole-days-divide-3` 先取整日，僅作比較 Profile。
  - `result.luckCycles.variants` 同時輸出兩種方法的起運摘要；實際採用哪一種由 Profile 決定，不能把比較值混回 canonical。
- 公式：`src/luck/index.js`。
- 範例：見 Lab 大運頁籤（1983-06-21 男，癸亥年陰＋男 → 逆行）。
- 已知流派差異：另有一天一歲（不除三）、虛歲起運、只計整歲等簡法；亦有以「氣」非「節」計者。本 SDK 目前只實作有明確資料契約的精確法與整日比較法，其餘保留為研究事項。
  canonical 採節＋除三＋精確到月日。
- 出生時間若為 `branch` 或 `unknown`，起運日期不是精確值：前者採時辰中點，後者採民用中午；
  兩者都會在 `startAge.timingAssumption`、`timingDate`、`timingTime` 揭露。
- canonical 選擇理由：子平正統（三天折一歲、一日折四月、一時折五日之完整換算精神）。
- 參考文獻：《三命通會》卷二「論大運」；《子平真詮》。
- 測試案例：結構斷言（方向/步數/十年區間連續性）＋ Lab 手工核對。
- 最後驗證日期：2026-09-08。
