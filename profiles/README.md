# 多流派 Profile

`catalog.json` 是可審核的 Profile 目錄；SDK 也內建同樣的 Profile，直接用 `RuleRegistry` 取用：

```js
const profiles = Bazi.Rules.RuleRegistry.listProfiles();
const chart = Bazi.calculate(input, { profile: 'civil-midnight' });

console.log(profiles);
console.log(Bazi.Rules.RuleRegistry.getDiff('civil-midnight'));
```

`canonical` 是 BaziJS 的官方正統（子平術規範）預設。其他 Profile 是明確標示的比較模型，並不宣稱所有傳承都是同一套規則：

- `civil-midnight`：00:00 換日。
- `lunar-calendar`：農曆正月初一切年、農曆初一切月、00:00 換日。
- `true-solar`：開啟真太陽時。

每次排盤仍可從 `result.meta.profileId`、`result.rules.applied` 與 `result.accuracy.boundaryRules` 看到實際採用的設定。差異案例在 `validation/profiles/differential-cases.json`。
