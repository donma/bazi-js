# BaziJS

## 先介紹

BaziJS 是一套給瀏覽器使用的 JavaScript 八字（四柱）排盤 SDK。
它會把出生資料整理成可讀的四柱、十神、神煞、大運、流年與判定證據，讓你的網站可以自行決定畫面怎麼呈現。

線上展示：[BaziJS Demo](https://donma.github.io/bazi-js/demo/index.html)

主要功能：

- 公曆、農曆、節氣與四柱干支
- 十神、藏干、納音、十二長生與空亡
- 五行分布、日主強弱與判定依據
- 分層強弱 evidence：`rawQi`、互動折損後的 `effectiveQi`、轉化候選與日主 assessment
- 用神推導的用／喜／閒／仇／忌五分類（明確標示模型假設）
- 天干地支合、沖、刑、害、破等互動
- 大運、流年與流運神煞
- 八宅輔助命卦與東四／西四命分類
- 起運精確法與整日比較法的可追溯 variants
- SVG、PNG 命盤輸出
- 可交給 AI 使用的結構化 Context

> 八字與強弱分析是傳統命理規則模型，不是科學量測，也不能取代醫療、法律、財務或其他專業判斷。

## 1. 在網頁載入 SDK

一般 HTML 直接載入瀏覽器版：

```html
<script src="./dist/bazi-sdk.min.js"></script>
<script>
  const result = Bazi.calculate({
    birthDate: '1983-05-11',
    birthTimeMode: 'exact',
    birthTime: '16:19',
    gender: 'male',
    timezone: '+08:00'
  });

  console.log(result.pillars.day.ganzhi);
</script>
```

使用 ES Module 時：

```html
<script type="module">
  import Bazi from './dist/bazi-sdk.esm.js';

  const result = Bazi.calculate({
    birthDate: '1983-05-11',
    birthTimeMode: 'exact',
    birthTime: '16:19',
    gender: 'male',
    timezone: '+08:00'
  });

  console.log(result.pillars);
</script>
```

## 2. 排盤輸入

排盤就是建立一個 JavaScript 物件，再傳給 `Bazi.calculate()`。

| 欄位 | 必填 | 意思 | 範例 |
| --- | --- | --- | --- |
| `birthDate` | 是 | 公曆出生日期，格式 `YYYY-MM-DD` | `'1983-05-11'` |
| `birthTimeMode` | 建議填 | `exact` 精確時間、`branch` 只知道時辰、`unknown` 不知道時間 | `'exact'` |
| `birthTime` | exact 必填 | 24 小時制時間 | `'16:19'` |
| `birthHourBranch` | branch 必填 | 十二地支時辰 | `'申'` |
| `gender` | 是 | 乾造或坤造 | `'male'` |
| `timezone` | 否 | 出生地時區，預設 `+08:00` | `'+08:00'` |
| `yearBoundary` | 否 | 年柱切年：`lichun` 立春、`lunar_new_year` 正月初一；SDK canonical 預設 `lichun` | `'lunar_new_year'` |
| `location` | trueSolarTime 時建議填 | 出生地與經緯度 | `{ longitude: 121.5654 }` |
| `trueSolarTime` | 否 | 是否使用真太陽時，預設 `false` | `true` |
| `shenshaPreset` | 否 | 神煞資料量：`minimal`、`classical`、`full` | `'classical'` |

最常用的輸入：

```js
const input = {
  birthDate: '1983-05-11',
  birthTimeMode: 'exact',
  birthTime: '16:19',
  gender: 'male',
  timezone: '+08:00',
  trueSolarTime: false
};

const result = Bazi.calculate(input);
```

日期與時間使用字串，能讓不同瀏覽器與時區得到較一致的結果。

Demo 的「年柱切年方式」預設選擇 `lunar_new_year`，但會把選項明確傳入 SDK；SDK 的 `canonical` 預設仍是 `lichun`。因此使用端若未指定 `yearBoundary`，不會受到 Demo 預設值影響。

### 三種出生時間模式

`exact`：知道出生時間。

```js
{
  birthDate: '1983-05-11',
  birthTimeMode: 'exact',
  birthTime: '16:19',
  gender: 'male'
}
```

`branch`：只知道出生時辰，例如申時。

```js
{
  birthDate: '1983-05-11',
  birthTimeMode: 'branch',
  birthHourBranch: '申',
  gender: 'male'
}
```

`unknown`：完全不知道時間。此時時柱會標記為不可用。

```js
const result = Bazi.calculate({
  birthDate: '1983-05-11',
  birthTimeMode: 'unknown',
  gender: 'male'
});

console.log(result.pillars.hour.available); // false
```

## 3. `calculate()` 與 `calculateSafe()`

已經確定輸入正確時使用 `calculate()`：

```js
try {
  const result = Bazi.calculate(input);
  showChart(result);
} catch (error) {
  console.error(error.code, error.message);
}
```

表單接收使用者輸入時，使用 `calculateSafe()` 比較方便：

```js
const response = Bazi.calculateSafe(input);

if (response.success) {
  showChart(response.data);
} else {
  showError(response.error.message);
}
```

## 4. 如何讀取排盤結果

`Bazi.calculate()` 回傳的 `result` 是一個完整物件。各區塊的用途如下。

| 欄位 | 代表內容 |
| --- | --- |
| `result.input` | 這次實際使用的出生輸入 |
| `result.meta` | SDK、規則與結果格式版本 |
| `result.calendar` | 公曆、農曆、生肖、星座、節氣與時間修正 |
| `result.pillars` | 年柱、月柱、日柱、時柱 |
| `result.tenGods` | 天干與藏干對日主的十神 |
| `result.hiddenStems` | 每個地支藏有哪些天干及其比例 |
| `result.nayin` | 每柱納音 |
| `result.twelveStages` | 日主在各柱的十二長生與自坐狀態 |
| `result.kongWang` | 旬空／空亡 |
| `result.strength` | 五行比例、日主旺衰、喜用與判定 evidence |
| `result.interactions` | 原局天干地支的合沖刑害等互動 |
| `result.shenSha` | 一般神煞與命中的柱位 |
| `result.specialRules` | 特殊日柱、特殊季節條件，不冒充一般神煞 |
| `result.luckCycles` | 起運資料與大運；可選擇附加逐年資料 |
| `result.transits` | 目前流年及流年與原局的互動 |
| `result.auxiliary` | 胎元、胎息、命宮、身宮 |
| `result.classicalSummary` | 可供畫面、JSON 與 AI Context 共用的 2／3／4 完整可追溯資料摘要 |
| `result.rules` | 本次實際採用的規則 |
| `result.accuracy` | 時區、邊界、真太陽時與計算假設 |

### 讀取四柱

每柱常用欄位：

- `ganzhi`：完整干支，例如「庚辰」
- `stem`：天干
- `branch`：地支
- `sexagenaryIndex`：六十甲子索引
- `stemInfo`／`branchInfo`：天干／地支的五行、陰陽與可讀標籤，例如 `辛`／`酉` 都會標示為 `陰金`；這不是納音
- `available`：是否有這柱資料；未知時間的時柱為 `false`

```js
const labels = {
  year: '年柱',
  month: '月柱',
  day: '日柱',
  hour: '時柱'
};

for (const [key, label] of Object.entries(labels)) {
  const pillar = result.pillars[key];
  console.log(label, pillar.available === false ? '未知' : pillar.ganzhi);
}

console.log(result.pillars.year.stemInfo.label);   // 陰金
console.log(result.pillars.year.branchInfo.label);  // 陰金
```

### 讀取農曆、節氣與生肖

```js
console.log(result.calendar.solar);       // 公曆日期與有效計算時間
console.log(result.calendar.lunar);       // 農曆年月日
console.log(result.calendar.solarTerms);  // 前後節氣
console.log(result.calendar.zodiac.name); // 生肖
console.log(result.calendar.constellation.name); // 公曆星座
```

### 讀取五行與強弱

```js
console.log(result.strength.dayMaster);          // 日主五行
console.log(result.strength.score);              // 模型分數
console.log(result.strength.level);              // 旺、偏旺、平、偏弱等
console.log(result.strength.distribution);       // 木火土金水比例
console.log(result.strength.favorableElements);  // 喜用方向
console.log(result.strength.unfavorableElements);// 忌仇方向
console.log(result.strength.evidence);           // 判定依據
console.log(result.strength.rawQi);               // 互動折損前的五行氣數
console.log(result.strength.effectiveQi);         // 套用既有互動折損後的氣數
console.log(result.strength.transformations);     // 合局／會局的成化候選與 evidence
console.log(result.strength.assessment);           // 日主強弱 assessment（不等同特殊格）
```

多模型用神與流年 graph 目前以可追溯資料形式提供：

```js
console.log(result.analysis.useGodResolver.candidates); // 扶抑、格局、調候、通關等候選
console.log(result.analysis.useGodResolver.finalDecision); // 只有已實作模型才會有決定
console.log(result.transits.transitGraph.nodes);           // 原局／大運／流年月日時節點
console.log(result.transits.transitGraph.edges);           // 時間層連線與已觀測到的跨層互動
console.log(result.transits.transitGraph.events);          // 結構事件；不直接等同吉凶
```

分數與旺衰是目前規則模型的結果，不是科學測量值。

## 5. 規格欄位代表什麼

排盤結果裡有些欄位是給程式與追溯使用的，不是額外的命理解釋。

### 版本與規則

`result.meta` 用來知道「這份結果是由哪一版引擎和規則產生」：

```js
console.log(result.meta.engineVersion);      // SDK 版本
console.log(result.meta.ruleSetVersion);     // 主規則版本
console.log(result.meta.profileId);          // 使用的規則 Profile
console.log(result.meta.shenShaRuleVersion);  // 神煞規則版本
console.log(result.meta.resultSchemaVersion);// 回傳格式版本
```

`result.rules.applied` 是本次真正採用的規則，例如年界、月界與換日界線。
`result.accuracy` 則記錄真太陽時是否使用、未知時間如何處理，以及節氣等計算的精度提醒。

`result.accuracy.assumptions` 很重要：它說明 SDK 在資料不完整時採用了什麼假設，使用者介面可以把它顯示出來。

### 神煞欄位

`result.shenSha` 的每一筆通常包含：

| 欄位 | 代表內容 |
| --- | --- |
| `id` | 程式穩定識別碼 |
| `name` / `displayName` | 神煞名稱 |
| `hitOn` | 命中哪一柱，值為 `year`、`month`、`day`、`hour` |
| `category` | `auspicious` 吉、`inauspicious` 凶、`neutral` 中性 |
| `confidence` | 規則信心層級，例如 `classical` 經典、`traditional` 傳統 |
| `ruleId` | 可以追查的規則編號 |
| `reference` / `references` | 古籍或規則來源 |
| `evidence` | 為什麼命中，以及使用了哪些基準 |

`hitOn` 的英文值是給程式使用的穩定代碼；顯示給使用者時請換成中文：

```js
const pillarNames = {
  year: '年柱',
  month: '月柱',
  day: '日柱',
  hour: '時柱'
};

for (const item of result.shenSha) {
  const places = item.hitOn.map((key) => pillarNames[key] || key);
  console.log(item.displayName, places.join('、'));
}
```

依四柱分組：

```js
const grouped = Bazi.ShenSha.groupShenShaByPillar(result.shenSha);
console.log(grouped.year);
console.log(grouped.month);
console.log(grouped.day);
console.log(grouped.hour);
```

### 特殊規則分類

古籍中稱為「格」的內容不一定是神煞，BaziJS 分開保存：

| 類型 | 意思 | 位置 |
| --- | --- | --- |
| `ShenSha` | 一般以年干、日干、月令或支查找的神煞 | `result.shenSha` |
| `SpecialPillar` | 固定日柱或時柱條件，如魁罡、日德 | `result.specialRules` |
| `SeasonalSpecial` | 季節／月令加特殊日柱條件 | `result.specialRules` |
| `SpecialPatterns` | 需要多柱、透干、合局等全局條件的格局 | 研究架構，另行處理 |

讀取特殊規則：

```js
for (const item of result.specialRules) {
  console.log(item.name);
  console.log(item.conceptType);
  console.log(item.baseOn);
  console.log(item.evidence);
}
```

### 大運與逐年資料

一般排盤可直接讀取大運：

```js
for (const cycle of result.luckCycles.cycles) {
  console.log(cycle.ganzhi, cycle.fromYear, cycle.toYear);
}
```

需要每一步大運的十年流年時，開啟選項：

```js
const detailed = Bazi.calculate(input, {
  includeLuckAnnualDetails: true,
  includeAnnualLuckShenSha: true
});

console.log(detailed.luckCycles.cycles[0].annuals[0]);
```

逐年資料包含流年干支、十神、十二長生、納音、旬空、流年神煞，以及流年與原局的互動。

### 用／喜／閒／仇／忌五分類

這是依本次 `strength.favorableElements` 第一順位推導的分析結果，不會覆蓋不同流派的用神判法：

```js
console.log(result.strength.fiveCategory.groups);
// { use: ['金'], joy: ['土'], idle: ['水'], adversary: ['木'], taboo: ['火'] }
console.log(result.strength.fiveCategory.evidence);
```

請一起讀取 `modelId`、`references`、`variants` 與 `researchNotes`；它們說明這是可重現模型，不是跨流派唯一答案。

### 2／3／4 的完整資料摘要

若要製作密集但不干擾主盤的表格，讀取 `result.classicalSummary`：

```js
const summary = result.classicalSummary;

// 2. 用／喜／閒／仇／忌：每列含五行、與用神關係、強弱分布與月令狀態
console.log(summary.fiveCategory.rows);

// 3. 人元用事、日空、年空：含節氣起點、分段、旬名、空亡地支與命中矩陣
console.log(summary.monthCommand);
console.log(summary.voids.rows);

// 4. 胎元、胎息、命宮、身宮：matrix 可直接供表格或 SVG 使用
console.log(summary.auxiliary.matrix);
```

`classicalSummary` 不會把這些資料改成固定斷語。`monthCommand` 的分日表、五分類的取用方式、命宮／身宮公式都保留 `variants` 與 `researchNotes`；旬空則保留日空與年空兩套索引及四柱命中矩陣。完整來源索引見 [`docs/references/special-systems.md`](/D:/AI_PROJECTS/BaZi/docs/references/special-systems.md) 與 [`sources/classical-texts.json`](/D:/AI_PROJECTS/BaZi/sources/classical-texts.json)。

### 命卦與東四／西四

命卦是獨立的八宅輔助欄位，不屬於子平神煞：

```js
const mingGua = result.auxiliary.mingGua;
console.log(mingGua.trigram.name, mingGua.groupName);
// 兌 西四命（範例輸入不同時會不同）
```

結果內會保留 `effectiveYear`、`yearBoundary`、`method` 與 evidence，方便檢查立春切年、性別及餘數 5 的處理方式。

### 起運方法比較

canonical 預設使用精確節氣差除三；同一結果也會附上整日取整的比較摘要：

```js
console.log(result.luckCycles.startAge.methodLabel);
console.log(result.luckCycles.variants.map((item) => ({
  method: item.method,
  display: item.display,
  startDate: item.startDate
})));

// 要把比較法當成實際 Profile 使用：
const comparison = Bazi.calculate(input, { profile: 'jieqi-whole-day' });
console.log(comparison.luckCycles.startAge);
```

## 6. 可追溯資料、Profile 與 Schema

這三層是給程式與維護者使用的資料，不會自動增加 Demo 畫面文字：

| 位置 | 內容 | 讀取目的 |
| --- | --- | --- |
| [`sources/`](sources/) | 古籍書目、卷次、原始判定依據、版本差異與 evidence | 查「這條規則從哪裡來」 |
| [`sources/variants.json`](sources/variants.json) | 年界、月界、子時、真太陽時、起運、命宮、人元分日與模型差異 | 查「不同約定會差在哪裡」 |
| [`profiles/`](profiles/) | canonical 與比較用多流派設定 | 查「這次用哪套切界」 |
| [`schemas/`](schemas/) | 規則、概念、來源、變體、命盤結果與驗證資料的 JSON Schema | 驗證資料格式 |
| [`src/reference/`](src/reference/) | 統一 taxonomy、規則／來源索引、coverage 與 AI Context | 查「這個概念屬於哪一類、有哪些證據」 |
| [`docs/reference/generated/`](docs/reference/generated/) | 由 registry 與 sources 生成的概念文件 | 快速瀏覽規則狀態 |
| [`docs/coverage/`](docs/coverage/)、[`validation/coverage/`](validation/coverage/) | 概念、來源、定位、變體、實作與驗證覆蓋率 | 查看資料完整度，不宣稱命理準確率 |
| [`validation/external/`](validation/external/) | 公開來源抽樣資料與擷取日期 | 重跑外部交叉比對 |
| [`validation/interpretation/`](validation/interpretation/) | 解讀驗證的獨立校核資料契約 | 目前只有 protocol-only，未宣稱解讀已驗證 |
| [`docs/governance/`](docs/governance/) | 規則分級、來源要求、升版與 CI 治理 | 查「怎麼新增與升版」 |

使用內建 Profile：

```js
console.log(Bazi.Rules.RuleRegistry.listProfiles());

const chart = Bazi.calculate(input, { profile: 'civil-midnight' });
console.log(chart.meta.profileId);              // 實際使用的 Profile
console.log(chart.rules.applied);               // 實際採用的規則
console.log(Bazi.Rules.RuleRegistry.getDiff('civil-midnight'));
```

目前內建 `canonical`、`civil-midnight`、`lunar-calendar`、`true-solar`、`jieqi-whole-day`、`classical-sanming`、`research-tiaohou`、`research-tongguan`、`research-patterns`。`canonical` 是預設的官方正統（子平術規範）；其他是明確標示的比較或研究模型，不會假裝不同傳承沒有差異。每次讀取命盤時，請一起保存 `result.meta`、`result.rules.applied`、`result.accuracy`，之後才能重現同一份結果。

SDK 也提供不增加主盤內容的驗證資料索引：

```js
const manifest = Bazi.Validation.getValidationManifest();
console.log(manifest.totals); // 目前固定索引：55 組、12 個外部來源

const datasets = await Promise.all(
  manifest.datasets.map((item) => fetch(`./${item.fixture}`).then((response) => response.json()))
);
console.log(Bazi.Validation.summarizeValidationDatasets(datasets));
```

`result.meta.profile` 是本次排盤採用的完整 Profile 快照；`result.accuracy.precision` 則說明節氣模型、固定 UTC offset、真太陽時模型與已知限制。這些欄位供 Lab、JSON 與 AI Context 使用，不需要全部顯示在命盤畫面。

### Profile 分析選擇

Profile 的 `rules.analysis` 會記錄六個分析維度：月令人元分日、命宮／身宮掌訣、用神模型、季節模型、通關模型與特殊格模型。這些選擇會進入 `result.analysis`：

```js
const research = Bazi.calculate(input, { profile: 'research-tiaohou' });
console.log(research.analysis.selected.useGod.modelId); // tiaohou-research
console.log(research.analysis.models.useGod.finalDecision); // false：研究中，不覆寫 canonical

const classicalVariant = Bazi.calculate(input, { profile: 'classical-sanming' });
console.log(classicalVariant.strength.monthCommander.modelId); // san-ming-volume-2
```

只有 `fuyi-canonical` 與既有 canonical 掌訣會產生目前已實作的決定；其餘研究模型會明確回傳 `research-only`、`finalDecision: false` 與證據，不會讓畫面出現未完成的斷語。

### Reference API：給 SDK 使用者與 AI 的規則索引

Reference API 不會改變 `Bazi.calculate()` 的命盤結果，也不會增加 Demo 主畫面的文字；它把「概念、規則、古籍、變體與狀態」整理成可查詢資料。

```js
const concept = Bazi.Reference.getConcept('pattern.zheng-guan');
console.log(concept.conceptType, concept.patternType, concept.status);

const rule = Bazi.Reference.getRule('PT_REGULAR_ZHENGGUAN_001');
console.log(rule.sourceIds, rule.baseOn, rule.references, rule.evidence);

const sources = Bazi.Reference.getSourcesForRule('PT_REGULAR_ZHENGGUAN_001');
const variants = Bazi.Reference.getVariants('SE_TIANSHE_001');
const context = Bazi.Reference.toContext({
  conceptIds: ['pattern.zheng-guan'],
  includeSources: true,
  includeVariants: true
});

// 現有 SDK 功能也可作為系統級 Concept 查詢
const strength = Bazi.Reference.getConcept('strength.engine');
console.log(strength.rules[0].implementation.api);
console.log(strength.rules[0].outputFields);
```

分類的重點是：`shensha` 是一般神煞；`special-rule` 是固定柱位／季節條件；`pattern` 再用 `regular` 或 `special` 區分正格候選與特殊格研究架構。`candidate-only`、`research-only` 不代表已完成成格或跨流派定論；請讀 `status`、`variants`、`researchNotes` 與 `claimPolicy`。概念總表見 [`docs/reference/generated/`](docs/reference/generated/)，覆蓋率見 [`docs/coverage/coverage-matrix.md`](docs/coverage/coverage-matrix.md)。

現有系統功能也有獨立 Concept：`calendar.engine`、`ten-god.relation`、`hidden-stem.registry`、`interaction.chart-relationships`、`strength.engine`、`luck.cycles`、`transit.graph`、`use-god.resolver`。這些描述的是 SDK API、版本與輸出契約，不會把功能名稱誤當成新的神煞或古籍格局。

需要在自己的工具查看證據索引時：

```js
const evidence = await fetch('./sources/classical-texts.json').then((res) => res.json());
console.log(evidence.evidenceRecords);
```

Schema 是資料格式契約；它不替古籍裁決流派。遇到異文，請讀 `variants` 與 `researchNotes`；`SpecialPatterns` 目前只在 `Bazi.Patterns` 登錄研究架構，不會混進一般 `result.shenSha`。

`validation/external/round-01-samples.json` 保存曆法抽樣；`round-02-special-systems.json` 保存命卦、五分類與起運方法的網路抽樣；`round-03-boundary-samples.json` 保存 34 組獨立引擎的跨日期、時區、子時、節氣與真太陽時邊界觀察；`round-04-second-engine.json` 再以第二個獨立引擎保存 16 組民用日期／真太陽時抽樣，兩輪合計 50 組；[`round-05-celebrity-cases.json`](validation/external/round-05-celebrity-cases.json) 另保存 5 組中國、台灣、香港華人公開人物案例，統一以 `+08:00`、未知時辰比對三柱。每輪資料都包含來源、擷取日期、輸入與分類。驗證是把當時公開資料固定下來再重跑，避免網站改版、廣告或即時內容讓結果無法重現；它能保證「在指定 Profile、版本與證據範圍內可重現」，不能宣稱傳統命理存在跨流派的絕對唯一答案。

`sources/evidence-ledger.json` 另保存古籍版本狀態、原文摘錄、定位 URL、頁碼（未知時為 `null`）、OCR／校勘註記。`validation/external/independent-ledger.json` 專門保存獨立引擎的觀察，並分成 `match`、`difference`、`undetermined`；沒有外部輸出的案例不會被 SDK 自己的結果填補。現行治理規則見 [`authority-model.md`](docs/governance/authority-model.md)、[`rule-addition-protocol.md`](docs/governance/rule-addition-protocol.md) 與下一階段目標 [`vNext.md`](docs/governance/vNext.md)。

計算驗證與解讀驗證分開：`validation/external/` 可核對四柱與規則輸出；`validation/interpretation/benchmark.json` 目前是 `protocol-only`，因為沒有獨立專業校核資料時，不應把 SDK 自己的結果當作解讀真值。

## 7. SVG、PNG 與 AI Context

### SVG

SVG 是向量格式，適合下載、列印與放大：

```js
const svg = Bazi.Renderer.render(result, {
  format: 'svg',
  preset: 'full',
  theme: 'modern-oriental'
});

document.querySelector('#chart').innerHTML = svg;
```

### PNG

PNG 是非同步產生的：

```js
const image = await Bazi.Renderer.render(result, {
  format: 'png',
  preset: 'mobile-share',
  theme: 'modern-oriental'
});

document.querySelector('#preview').src = image.dataUrl;
console.log(image.blob, image.width, image.height);
```

可用版式：

| `preset` | 用途 |
| --- | --- |
| `full` | 完整命盤，含四柱、強弱、神煞、大運與輔助資料 |
| `mobile-share` | 手機直式分享 |
| `a4` | 列印 |
| `compact` | 精簡小卡 |

主題有 `modern-oriental`、`classic`、`dark`。

### AI Context

`Bazi.AI.toContext()` 會把排盤結果整理成適合 AI 讀取的結構，避免 AI 自行猜算四柱：

```js
const context = Bazi.AI.toContext(result, {
  compact: false,
  includeRules: true,
  includeEvidence: true,
  includeInteractions: true,
  includeLuckAnnualDetails: true,
  maxLuckCycles: 10
});

console.log(context.pillars);
console.log(context.shenSha.byPillar);
console.log(context.luckCyclesSummary.cycles);
```

設定 `compact: true` 時，回傳 JSON 字串；設定 `false` 時，回傳 JavaScript 物件。

## 8. 真太陽時

需要依出生地修正時間時，提供經度並開啟 `trueSolarTime`：

```js
const result = Bazi.calculate({
  birthDate: '1983-05-11',
  birthTimeMode: 'exact',
  birthTime: '16:19',
  gender: 'male',
  timezone: '+08:00',
  location: {
    country: 'TW',
    city: 'Taipei',
    latitude: 25.033,
    longitude: 121.5654
  },
  trueSolarTime: true
});

console.log(result.calendar.time.trueSolarTime);
console.log(result.accuracy.trueSolarTimeUsed);
```

只知道時辰或完全不知道時間時，SDK 會在 `accuracy.assumptions` 說明起運時間的估算方式。

## 9. 常見使用問題

| 情況 | 處理方式 |
| --- | --- |
| 日期格式錯誤 | 使用 `YYYY-MM-DD` |
| 精確時間沒有填時間 | 補上 `birthTime`，或改用 `branch`／`unknown` |
| 只知道時辰沒有填地支 | 補上 `birthHourBranch` |
| 時柱是空的 | 先檢查 `result.pillars.hour.available` |
| 想知道神煞為何命中 | 讀取 `item.evidence` |
| 想知道採用哪套規則 | 讀取 `result.meta` 與 `result.rules.applied` |
| 要在畫面顯示柱位 | 將 `year/month/day/hour` 轉成中文，不要直接顯示內部代碼 |

## 更新紀錄

### 2026-09-10（vNext 施工）

- 依 [`VERSIONS.md`](VERSIONS.md) 對齊 package／lock／engine 版本契約，修正 `npm ls` 對 `esbuild` 的 invalid dependency 狀態；這項整理不改變命盤計算。
- 強弱計算增加 `result.strength.rawQi`、`effectiveQi`、`transformations`、`assessment`、`decision` 與 `layers`。`rawQi` 是未套用六沖折損的五行氣數，`effectiveQi` 是目前 canonical 的互動調整結果；合局／會局只作可追溯候選，未冒充已成化。
- 新增 `result.analysis.useGodResolver` 與 `result.transits.transitGraph`：前者集中保存扶抑、格局、調候、通關、從化的模型候選與未決衝突，後者保存原局／大運／流年月日時節點與已觀測互動；研究模型仍不覆寫 canonical。
- 本批未實作完整從格／專旺、調候、通關與歲運多層轉化；它們仍依治理規範留在 Patterns／研究模型，待獨立條件與驗證資料完成後再升級。
- 新增 `src/patterns/regular.js` 的十個正格結構候選（正官、七殺、正財、偏財、正印、偏印、食神、傷官、建祿、月刃），只辨識月令／祿刃結構，不直接宣告成格；特殊格仍維持獨立 `research-only`。
- 新增 `validation/interpretation/` 與 `schemas/interpretation-validation.schema.json`，明確把「計算驗證」與「命理解讀校核」分開；目前維持 `protocol-only`，沒有自行製造解讀 expected value。
- 建立 Reference ontology 與查詢 API：`Bazi.Reference.getConcept()`、`getRule()`、`getSourcesForRule()`、`getRulesFromSource()`、`getVariants()`、`getCoverage()` 與 `toContext()`；既有 68 條規則加上 8 個系統級 Concept，共 76 條 Reference rule、76 個概念與 6 個來源可雙向追溯，且不改變 `Bazi.calculate()` 或 Demo 主畫面。
- 將 Calendar、TenGod、HiddenStem、Interactions、Strength、Luck、Transit、UseGod 升格為系統級 Reference Concept；每項保留模組、公開 API、輸出欄位、版本與 sourceCoverage，沒有古籍定位的功能明確標示為 `sdk-contract-only`。
- 正格候選改以 `pattern/regular` 表達，壬騎龍背等全局格局以 `pattern/special/research-only` 表達；舊 runtime 分類仍保留相容欄位，避免將特殊格混入 ShenSha。
- 新增 `schemas/concept.schema.json`、`taxonomy.schema.json`、`source.schema.json`、`evidence.schema.json`、`variant.schema.json`、`coverage.schema.json`；新增自動生成的 [`Reference 概念文件`](docs/reference/generated/index.md) 與 [`Coverage Matrix`](docs/coverage/coverage-matrix.md)。
- 新增 [`sources/variants.json`](sources/variants.json) 與 `variants-catalog.schema.json`，將 Profile 與算法差異提升為可查詢資料；包含年界、月界、子時、真太陽時、起運、命宮、人元分日、神煞查法與用神模型。
- 新增 taxonomy／Reference／coverage CI gate 與相關資料契約斷言；`npm test` 通過 724/724，外部 coverage 仍誠實標記 `not-collected`，不把來源覆蓋率冒充準確率。

### 2026-09-10

- 建立 [`docs/governance/vNext.md`](docs/governance/vNext.md) 作為下一階段治理目標：明確定義 canonical／comparison／research-only／undetermined、文獻衝突、Profile 實際運算、breaking change、升版門檻與 P0–P4 施工階段；此文件不改變 SDK 或 Demo 行為。
- 新增 [`round-05-celebrity-cases.json`](validation/external/round-05-celebrity-cases.json) 與 [`round-05-celebrity-cross-validation.md`](validation/reports/round-05-celebrity-cross-validation.md)：改用高行健、姚明、成龍、元彪、林青霞 5 組華人公開人物樣板，出生地限定中國／台灣／香港，輸入統一為 `+08:00`；Nobel Prize、FIBA、香港電影資料館與台灣文化部核對出生事實，Deep Oracle 只作外部三柱 observation。
- 五案公開時辰都不可核實，因此只比較年、月、日；5/5 `match`、0 `difference`、0 `undetermined`，不把成龍與林青霞頁面的示意時柱當成出生資料，也不因此修改 canonical。
- 驗證 manifest 更新為 55 組案例、12 個外部來源；新增 `schemas/celebrity-validation.schema.json`，`npm test` 通過 534/534，`npm run validate` 通過所有固定案例。
- 完成第二個獨立引擎交叉驗證：新增 `baziflow-core@0.1.0` 固定 source commit、16 組外部 observation 與可重現擷取腳本；12 組民用日期、4 組真太陽時全部一致。
- round-03 的 34 組邊界資料與 round-04 的 16 組第二引擎資料合計 50 組；測試會檢查兩批來源、分類、差異與總數，不會把 BaziJS 自己的輸出當成外部 expected。
- `npm run ci` 驗證結果：`npm test` 515/515、`npm run validate` 全部通過、`npm run build` 與 `npm run check:demo` 全部通過。

### 2026-09-09

- Demo 新增低資訊量的「古典資料摘要」收合卡：預設只顯示五分類、人元司令、日空／年空與輔助宮位數量；展開後才顯示 2／3／4 的精簡資料，完整 evidence 仍留在 JSON／AI Context。
- 新增 `Bazi.Strength.calculateFiveElementCategories()` 與 `result.strength.fiveCategory`，將用／喜／閒／仇／忌作為明確標示模型的分析欄位，不混入 ShenSha。
- 新增 `Bazi.Auxiliary.calculateMingGua()` 與 `result.auxiliary.mingGua`，獨立提供八宅命卦及東四／西四命，並保留跨世紀與餘數 5 的方法差異。
- 新增 `jieqi-whole-day` 比較 Profile；`result.luckCycles.variants` 同時保存精確節氣差與整日取整的起運摘要，canonical 預設不變。
- 新增 `validation/external/round-02-special-systems.json`，保存命卦、五分類與起運方法的公開網路抽樣，並將衝突來源保留在 `variants`／`researchNotes`。
- 新增 `docs/references/special-systems.md`，記錄資料來源、適用範圍與「可重現不等於絕對真理」的驗收界線。
- 新增 `result.classicalSummary` 與 `Bazi.Summary`：集中提供五分類、月令人元司令、日空／年空、胎元／胎息／命宮／身宮及可直接繪表的 `matrix`，每區保留 ruleId、版本、來源、variants 與 evidence。
- 新增 `EV-FC-CLASSICAL-007`、`EV-MC-REN-YUAN-008`、`EV-KW-XUN-009`、`EV-AUX-PALACE-010`，並加入 `MC-2020-F`、`KW-2020-F`、`PALACE-2020-F` 可重跑抽樣驗證；修正胎元／命宮古籍參考卷次為《三命通會》卷二。
- `schemas/chart-result.schema.json` 現在要求 `classicalSummary` 的四個 section 與 evidence；另提供 `schemas/classical-summary.schema.json` 讓使用端單獨驗證摘要；`Bazi.AI.toContext()` 同步保留完整摘要。
- Demo 的起運走勢改為依目前年份自動展開大運逐年資料並粗框今年；尚未起運時顯示粗框的「起運前目前歲數」卡片，命盤預設流年也改用當下日期。
- 新增 `sources/classical-texts.json` 古籍證據索引：5 筆書目、16 組規則／研究 evidence，保留卷次、原始判定依據、版本差異與未實作狀態。
- 新增多流派 Profile 目錄與 SDK 內建 Profile：`canonical`、`civil-midnight`、`lunar-calendar`、`true-solar`；新增 `validation/profiles/differential-cases.json` 驗證切界差異會反映到實際四柱。
- 新增 `schemas/` 正式 JSON Schema：古籍來源、Profile、規則 metadata、命盤結果、外部驗證資料集。
- 新增 `schemas/analysis-result.schema.json`、`schemas/evidence-ledger.schema.json` 與 `schemas/independent-validation.schema.json`，讓 Profile 分析選擇、古籍 evidence ledger 與獨立驗證資料都可機器檢查。
- 新增 `sources/evidence-ledger.json`：保存《三命通會》卷二／卷六可定位摘錄、數位版本狀態、頁碼未知註記、OCR／校勘註記與特殊格不冒充神煞的研究邊界。
- 新增 `classical-sanming`、`research-tiaohou`、`research-tongguan`、`research-patterns` Profile；研究 Profile 只記錄可切換邊界，不覆寫 canonical 結論。
- 新增 `validation/external/independent-ledger.json` 與獨立驗證分類：Day Pillar 案例有一致與約定差異，baziflow-core 本輪因沒有獨立執行輸出標示 `undetermined`。
- 新增 `docs/governance/` 治理文件與 `.github/workflows/ci.yml`；CI 會執行測試、Schema／外部 ledger、bundle 與 Demo 靜態檢查，且不即時依賴第三方網站。
- 新增 `validation/external/round-01-samples.json`，保存公開抽樣的日柱、農曆與節氣資料，並接入自動驗證。
- `sources/`、`profiles/`、`schemas/` 已納入發布檔案清單，使用端可取得同一份證據與資料契約。
- 公開 Demo 與 SVG 已移除內部比對檔名 `sample1`；該名稱只保留在內部 audit／測試追溯，並新增公開輸出防護測試。
- 四柱主盤的視覺順序改為傳統由左至右「時柱、日柱、月柱、年柱」；SDK 結果欄位與 JSON／AI Context 仍維持 `year/month/day/hour`。
- 驗證結果：`npm run ci` 全部通過；`npm test` 為 450/450，`npm run validate` 通過 3 組日柱、2 組節氣、8 組既有特殊系統與 4 組獨立 ledger，`npm run build` 產出三種瀏覽器 bundle，`npm run check:demo` 的 8 項靜態檢查全數通過。
- 新增 `validation/external/round-03-boundary-samples.json` 與 [`round-03-boundary-cross-validation.md`](validation/reports/round-03-boundary-cross-validation.md)：以固定 commit 的獨立開源引擎抽樣 34 組邊界案例，28 組一致、6 組保留為已解釋的差異；`npm test` 與 `npm run validate` 會離線重跑這批 observation。
- 新增 `round-03-difference-adjudication.md`：逐項裁決 6 組差異，確認 1 組為尚未支援的 DST 輸入、1 組為午夜晚子時 Profile 變體、4 組為低精度節氣模型在分鐘邊界提前切界；未把差異誤標成 canonical 錯誤或刪除資料。
- 新增 `scripts/capture-external-round-04.mjs` 與 `validation/external/round-04-second-engine.json`：以固定 commit 的第二個獨立開源引擎 `baziflow-core` 抽樣 16 組，12 組民用日期與 4 組真太陽時全部 `match`；明確記錄該引擎沒有 timezone／DST／子時換日 API。
- 新增 `round-04-second-engine.md`：保存第二引擎的版本、source commit、抽樣範圍、限制與可重現命令；round-03 + round-04 合計 50 組，`npm test`／`npm run validate` 離線重跑兩批 observation。
- 驗證結果：第二引擎 round-04 為 16/16 一致；資料契約檢查要求兩輪合計正好 50 組，並保留 `match`、`difference`、`undetermined` 的分類語義。

## License

Apache-2.0
