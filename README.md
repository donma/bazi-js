# BaziJS

## 先介紹

BaziJS 是一套給瀏覽器使用的 JavaScript 八字（四柱）排盤 SDK。
它會把出生資料整理成可讀的四柱、十神、神煞、大運、流年與判定證據，讓你的網站可以自行決定畫面怎麼呈現。

線上展示：[BaziJS Demo](https://donma.github.io/bazi-js/demo/index.html)

主要功能：

- 公曆、農曆、節氣與四柱干支
- 十神、藏干、納音、十二長生與空亡
- 五行分布、日主強弱與判定依據
- 天干地支合、沖、刑、害、破等互動
- 大運、流年與流運神煞
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
| `result.rules` | 本次實際採用的規則 |
| `result.accuracy` | 時區、邊界、真太陽時與計算假設 |

### 讀取四柱

每柱常用欄位：

- `ganzhi`：完整干支，例如「庚辰」
- `stem`：天干
- `branch`：地支
- `sexagenaryIndex`：六十甲子索引
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

## 6. 可追溯資料、Profile 與 Schema

這三層是給程式與維護者使用的資料，不會自動增加 Demo 畫面文字：

| 位置 | 內容 | 讀取目的 |
| --- | --- | --- |
| [`sources/`](sources/) | 古籍書目、卷次、原始判定依據、版本差異與 evidence | 查「這條規則從哪裡來」 |
| [`profiles/`](profiles/) | canonical 與比較用多流派設定 | 查「這次用哪套切界」 |
| [`schemas/`](schemas/) | 規則、Profile、命盤結果與驗證資料的 JSON Schema | 驗證資料格式 |
| [`validation/external/`](validation/external/) | 公開來源抽樣資料與擷取日期 | 重跑外部交叉比對 |

使用內建 Profile：

```js
console.log(Bazi.Rules.RuleRegistry.listProfiles());

const chart = Bazi.calculate(input, { profile: 'civil-midnight' });
console.log(chart.meta.profileId);              // 實際使用的 Profile
console.log(chart.rules.applied);               // 實際採用的規則
console.log(Bazi.Rules.RuleRegistry.getDiff('civil-midnight'));
```

目前內建 `canonical`、`civil-midnight`、`lunar-calendar`、`true-solar`。`canonical` 是預設的官方正統（子平術規範）；其他三個是明確標示的比較模型，不會假裝不同傳承沒有差異。每次讀取命盤時，請一起保存 `result.meta`、`result.rules.applied`、`result.accuracy`，之後才能重現同一份結果。

需要在自己的工具查看證據索引時：

```js
const evidence = await fetch('./sources/classical-texts.json').then((res) => res.json());
console.log(evidence.evidenceRecords);
```

Schema 是資料格式契約；它不替古籍裁決流派。遇到異文，請讀 `variants` 與 `researchNotes`；`SpecialPatterns` 目前只在 `Bazi.Patterns` 登錄研究架構，不會混進一般 `result.shenSha`。

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

### 2026-09-09

- 新增 `sources/classical-texts.json` 古籍證據索引：6 筆書目、12 組規則／研究 evidence，保留卷次、原始判定依據、版本差異與未實作狀態。
- 新增多流派 Profile 目錄與 SDK 內建 Profile：`canonical`、`civil-midnight`、`lunar-calendar`、`true-solar`；新增 `validation/profiles/differential-cases.json` 驗證切界差異會反映到實際四柱。
- 新增 `schemas/` 正式 JSON Schema：古籍來源、Profile、規則 metadata、命盤結果、外部驗證資料集。
- 新增 `validation/external/round-01-samples.json`，保存公開抽樣的日柱、農曆與節氣資料，並接入自動驗證。
- `sources/`、`profiles/`、`schemas/` 已納入發布檔案清單，使用端可取得同一份證據與資料契約。
- 驗證結果：`npm test` 通過 363/363；`npm run validate` 的 3 組日柱錨點與 2 組節氣精度檢查全部通過；瀏覽器 bundle 已重新編譯。

## License

Apache-2.0
