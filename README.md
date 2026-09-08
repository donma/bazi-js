# BaziJS

## 先介紹：BaziJS 是什麼？

BaziJS 是一套用 JavaScript 寫成的八字（四柱）排盤工具。它可以直接放進一般網站、PWA 或 WebView 使用，使用者在瀏覽器輸入出生資料後，就能取得完整的排盤結果。

它目前可以處理：

- 公曆、農曆、節氣與四柱干支
- 年柱、月柱、日柱、時柱
- 十神、藏干、納音、十二長生與空亡
- 五行分布、日主強弱與判定依據
- 天干地支合沖刑害等互動
- 大運、流年與流運神煞
- 原局神煞、四柱分組神煞與規則證據
- SVG、PNG 命盤輸出
- 適合交給 AI 使用的結構化 Context

簡單來說，BaziJS 負責「計算與整理資料」，畫面要怎麼呈現則由你的 HTML、CSS 和 JavaScript 決定。專案內的 `demo/` 是一個可以直接參考的使用端範例。

> 注意：八字與強弱分析屬於傳統命理規則模型，不是科學量測，也不應取代醫療、法律、財務或其他專業判斷。

## 30 秒開始使用

瀏覽器使用 BaziJS 不需要後端。把編譯好的檔案放在網頁旁邊，使用 `<script>` 載入即可。

```html
<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <title>我的八字排盤</title>
</head>
<body>
  <pre id="output">計算中……</pre>

  <!-- 路徑請依你的 HTML 位置調整 -->
  <script src="./dist/bazi-sdk.min.js"></script>
  <script>
    const result = Bazi.calculate({
      birthDate: '1983-05-11',
      birthTimeMode: 'exact',
      birthTime: '16:19',
      gender: 'male',
      timezone: '+08:00'
    });

    document.querySelector('#output').textContent = [
      `年柱：${result.pillars.year.ganzhi}`,
      `月柱：${result.pillars.month.ganzhi}`,
      `日柱：${result.pillars.day.ganzhi}`,
      `時柱：${result.pillars.hour.ganzhi}`
    ].join('\n');
  </script>
</body>
</html>
```

如果你是直接下載本專案，檔案通常位於：

```text
dist/bazi-sdk.js       未壓縮版，方便除錯
dist/bazi-sdk.min.js   壓縮版，適合正式網站
```

兩個檔案都會提供全域物件 `Bazi`。上面的 `Bazi.calculate(...)` 就是最常用的入口。

## 安裝與建置

一般使用者只需要取得 `dist/` 裡的檔案，放入自己的前端專案即可，不必安裝 Node.js。

如果你要修改 BaziJS 原始碼或重新產生 `dist/`，才需要在專案目錄執行：

```bash
npm install
npm run build
```

建置完成後，重新載入你的網頁就會使用新的 `dist/bazi-sdk.js` 或 `dist/bazi-sdk.min.js`。

## 第一個重要觀念：輸入是一個 JavaScript 物件

排盤時把資料放在 `{ ... }` 裡，傳給 `Bazi.calculate()`。最常用的欄位如下：

| 欄位 | 必填 | 說明 | 範例 |
| --- | --- | --- | --- |
| `birthDate` | 是 | 公曆日期，格式為 `YYYY-MM-DD`，SDK 保證範圍為 1900-01-01 至 2100-12-31 | `'1983-05-11'` |
| `birthTimeMode` | 建議填 | `exact` 精確時間、`branch` 只知道時辰、`unknown` 不知道時間 | `'exact'` |
| `birthTime` | `exact` 時必填 | 24 小時制 `HH:mm` | `'16:19'` |
| `birthHourBranch` | `branch` 時必填 | 十二地支之一 | `'申'` |
| `gender` | 是 | 只能填 `'male'` 或 `'female'` | `'male'` |
| `timezone` | 否 | 出生地時區，未填時預設 `+08:00` | `'+08:00'` |
| `location` | 使用真太陽時時建議填 | 出生地與經緯度 | `{ longitude: 121.5654 }` |
| `trueSolarTime` | 否 | 是否套用真太陽時，預設為 `false` | `false` |
| `shenshaPreset` | 否 | 神煞資料量：`minimal`、`classical`、`full`；預設 `classical` | `'classical'` |

### 最簡單的完整輸入

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

日期和時間請使用字串，不要直接傳 `Date` 物件。這樣在不同瀏覽器和時區下比較容易得到一致結果。

## `calculate()` 和 `calculateSafe()` 的差別

### 直接計算：`calculate()`

輸入正確時最簡單：

```js
const result = Bazi.calculate(input);
console.log(result);
```

如果輸入錯誤，`calculate()` 會拋出錯誤。適合你已經先做好表單驗證的情況。

### 安全計算：`calculateSafe()`

使用者輸入表單時，建議使用 `calculateSafe()`。它不會讓錯誤直接中斷頁面，而是回傳成功或失敗：

```js
const response = Bazi.calculateSafe(input);

if (!response.success) {
  console.error('排盤失敗：', response.error.message);
  // 這裡可以把錯誤顯示在表單下方
} else {
  const result = response.data;
  console.log('排盤成功：', result);
}
```

表單程式通常可以這樣寫：

```js
function calculateFromForm() {
  const input = {
    birthDate: document.querySelector('#birthDate').value,
    birthTimeMode: 'exact',
    birthTime: document.querySelector('#birthTime').value,
    gender: document.querySelector('#gender').value,
    timezone: '+08:00'
  };

  const response = Bazi.calculateSafe(input);
  const message = document.querySelector('#message');

  if (!response.success) {
    message.textContent = response.error.message;
    return;
  }

  message.textContent = '排盤完成';
  showChart(response.data);
}
```

## 三種出生時間模式

### 1. 知道精確時間：`exact`

```js
const result = Bazi.calculate({
  birthDate: '1983-05-11',
  birthTimeMode: 'exact',
  birthTime: '16:19',
  gender: 'male',
  timezone: '+08:00'
});
```

### 2. 只知道時辰：`branch`

例如只知道出生在申時：

```js
const result = Bazi.calculate({
  birthDate: '1983-05-11',
  birthTimeMode: 'branch',
  birthHourBranch: '申',
  gender: 'male',
  timezone: '+08:00'
});
```

### 3. 完全不知道時間：`unknown`

```js
const result = Bazi.calculate({
  birthDate: '1983-05-11',
  birthTimeMode: 'unknown',
  gender: 'male',
  timezone: '+08:00'
});

console.log(result.pillars.hour.available); // false
```

不知道時間時，年、月、日三柱仍可使用；時柱會標記為不可用，不要把它當成已計算出的時柱。

## 規則 Profile 與可重現性

BaziJS 不把流派差異藏在程式碼裡。`canonical` 是預設 Profile，但年界、月界、換日界線與真太陽時都會寫入結果：

```js
const result = Bazi.calculate({
  birthDate: '2024-02-09',
  birthTimeMode: 'exact',
  birthTime: '12:00',
  gender: 'male',
  timezone: '+08:00',
  yearBoundary: 'lunar_new_year', // 或 lichun
  monthBoundary: 'lunar_month',   // 或 jie
  dayBoundary: '23:00'            // 或 00:00
});

console.log(result.rules.applied);       // 實際採用的 ruleId 與 value
console.log(result.accuracy.boundaryRules);
console.log(result.accuracy.assumptions);
```

目前可用的邊界值：`yearBoundary` 為 `lichun`／`lunar_new_year`，`monthBoundary` 為 `jie`／`lunar_month`，`dayBoundary` 為 `23:00`／`00:00`。輸入日期會檢查實際月日，時區支援 UTC-14:00 至 UTC+14:00；錯誤會在曆法計算前回傳穩定的 error code。

建立自訂 Profile 時，未知 Profile、重複 id、非法覆寫欄位都會明確失敗，不會靜默改用 canonical：

```js
const midnight = Bazi.Rules.RuleRegistry.createProfile({
  id: 'midnight-school',
  name: '午夜換日派',
  base: 'canonical',
  overrides: { dayBoundary: '00:00' }
});

console.log(midnight.diff);
```

## 如何讀取排盤結果

`Bazi.calculate()` 回傳一個物件。最常用的資料都在以下欄位：

```js
const result = Bazi.calculate(input);

// 四柱
console.log(result.pillars.year.ganzhi);  // 年柱，例如「癸亥」
console.log(result.pillars.month.ganzhi); // 月柱
console.log(result.pillars.day.ganzhi);   // 日柱
console.log(result.pillars.hour.ganzhi);  // 時柱；未知時間時先檢查 available

// 農曆、節氣與時間
console.log(result.calendar.lunar);
console.log(result.calendar.solarTerms);
console.log(result.calendar.time);
console.log(result.calendar.zodiac);        // 生肖，例如 { name: '豬' }
console.log(result.calendar.constellation); // 公曆星座，例如 { name: '金牛座' }

// 十神、藏干、納音、十二長生
console.log(result.tenGods);
console.log(result.hiddenStems);
console.log(result.nayin);
console.log(result.twelveStages);

// 五行強弱
console.log(result.strength.dayMaster);          // 日主五行
console.log(result.strength.score);              // 分數
console.log(result.strength.level);              // 例如「偏弱」
console.log(result.strength.favorableElements);  // 喜用方向的模型結果
console.log(result.strength.monthState);         // 月令對日主的旺衰狀態
console.log(result.strength.monthCommander);     // 人元司令與分段 evidence

// 大運、流年與輔助資料
console.log(result.luckCycles.cycles);
console.log(result.transits.year);
console.log(result.auxiliary.mingGong);
console.log(result.auxiliary.shenGong);
```

### 讀取星座、司令與逐年大運

`calendar.constellation` 和 `calendar.zodiac` 是顯示用資料，不會改變四柱計算。`strength.monthCommander` 會依「節」之後經過的整日，對照月令人元司令分段；結果同時帶有採用的分段，方便不同流派自行建立 profile。

需要像 `sample1.html` 一樣展開每一步大運的逐年資料時，明確開啟選項：

```js
const detailed = Bazi.calculate(input, {
  includeLuckAnnualDetails: true,
  includeAnnualLuckShenSha: true
});

const firstLuck = detailed.luckCycles.cycles[0];
console.log(firstLuck.startDate, firstLuck.endDate);
console.log(firstLuck.nominalFromAge, firstLuck.nominalToAge);
console.log(firstLuck.annuals[0]);
```

逐年資料提供年份、流年干支、十神、十二長生、納音、旬空、流年神煞與流年對原局的互動。SDK 不會產生沒有可追溯規則的「小運分數、實際運勢分數」或固定吉凶文案；這些內容若要加入，應先建立獨立且可引用的 rule profile。

### 顯示四柱的小範例

```js
function showPillars(result) {
  const labels = {
    year: '年柱',
    month: '月柱',
    day: '日柱',
    hour: '時柱'
  };

  for (const key of Object.keys(labels)) {
    const pillar = result.pillars[key];
    const text = pillar.available === false ? '未知' : pillar.ganzhi;
    console.log(`${labels[key]}：${text}`);
  }
}

showPillars(result);
```

## 真太陽時

若要依出生地修正時間，傳入 `trueSolarTime: true`，並提供經度：

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

console.log(result.accuracy.trueSolarTimeUsed);
console.log(result.calendar.time.trueSolarTime);
```

如果 `trueSolarTime` 沒有開啟，或出生時間不是 `exact`，`trueSolarTimeUsed` 會是 `false`。這個欄位可用來在畫面上清楚告訴使用者目前採用哪種時間。

只知時辰時，四柱只把時支視為確定資料；起運需要一個時刻，因此 SDK 會以該時辰中點估算並在 `result.luckCycles.startAge.timingAssumption` 揭露。完全未知時間則以民用中午作為起運計時假設，同樣不會假裝成精確出生時刻。

## 神煞：原局、四柱、大運與流年

神煞結果在 `result.shenSha`。每一筆包含中文名稱、出現在哪一柱、規則編號、參考資料與證據：

```js
const result = Bazi.calculate({
  ...input,
  shenshaPreset: 'classical'
});

for (const item of result.shenSha) {
  console.log(item.displayName); // 例如「天乙貴人」
  console.log(item.hitOn);        // 例如 ['month', 'hour']
  console.log(item.category);     // 吉神、凶煞或其他分類
  console.log(item.confidence);   // 規則信心等級
  console.log(item.ruleId);       // 可追查的規則編號
}
```

`hitOn` 是給程式判斷用的穩定欄位值：`year`、`month`、`day`、`hour`。顯示給使用者時，建議自行換成「年柱、月柱、日柱、時柱」，不要直接把英文代碼放到畫面上。

### 把神煞依四柱分組

```js
const grouped = Bazi.ShenSha.groupShenShaByPillar(result.shenSha);

console.log(grouped.year);  // 年柱神煞
console.log(grouped.month); // 月柱神煞
console.log(grouped.day);   // 日柱神煞
console.log(grouped.hour);  // 時柱神煞
```

這種分組方式適合放在四柱卡片正下方，讓使用者一眼看出每顆神煞落在哪一柱。`demo/index.html` 也採用這種方式，並且會在手機寬度下自動換行。

### 神煞資料量設定

```js
// 核心神煞，資料較少
const minimal = Bazi.calculate({ ...input, shenshaPreset: 'minimal' });

// 預設值，適合一般完整排盤
const classical = Bazi.calculate({ ...input, shenshaPreset: 'classical' });

// 全覽設定，適合需要最多資料的畫面
const full = Bazi.calculate({ ...input, shenshaPreset: 'full' });
```

若要確認實際採用哪個設定，可讀取：

```js
console.log(result.meta.shenshaPreset);
console.log(result.meta.shenShaRuleVersion);
```

### 讀取神煞規則證據

```js
const first = result.shenSha[0];

console.log(first.reference);
console.log(first.references);
console.log(first.evidence.details);

for (const detail of first.evidence.details) {
  console.log(detail.basedOn, detail.targetPillar, detail.reason);
}
```

如果你的網站要提供「為什麼有這顆神煞」的展開說明，可以把 `evidence.details` 放在 `<details>` 元素裡；不要只顯示神煞名稱，這樣使用者比較容易理解排盤結果。

## 特殊規則：不要把特殊格當成神煞

BaziJS 把古典子平規則分成不同類型，避免只因為古籍用了相近名稱，就把格局當成一顆神煞：

- `ShenSha`：年干、日干、月令、年支、日支查其他干支的一般神煞。
- `SpecialPillar`：固定日柱或時柱，例如魁罡、日貴、日德、八專、九醜、孤鸞、陰陽差錯、金神。
- `SeasonalSpecial`：季節/月令加特殊日柱，例如天赦、四廢。
- `SpecialPatterns`：必須看多柱、透干、合局、虛神或破格條件的格局，例如壬騎龍背、拱祿、拱貴。

固定柱位與季節規則會放在 `result.specialRules`，而不是 `result.shenSha`：

```js
const result = Bazi.calculate(input);

for (const item of result.specialRules) {
  console.log(item.name);          // 例如「日德」或「四廢」
  console.log(item.conceptType);   // special-pillar / seasonal-special
  console.log(item.ruleFamily);    // day-pillar-special / seasonal-day-special
  console.log(item.baseOn);        // 例如 ['dayPillar']
  console.log(item.evidence);      // 四廢會包含 season、monthBranch 等證據
}
```

要讀取規則定義或研究中的整局格局：

```js
const definition = Bazi.SpecialRules.getSpecialRule('kui_gang');
const patterns = Bazi.Patterns.listResearchPatterns();

console.log(definition.references);
console.log(patterns); // P2 目前只提供研究架構，不會宣告已成格
```

完整的古籍依據、版本差異與目前實作狀態，請看 [`docs/references/classical-special-rules.md`](docs/references/classical-special-rules.md)。

## SVG 與 PNG 命盤

### 產生清楚的 SVG

SVG 是向量格式，放大或下載後通常比把 HTML 畫面截圖更清楚：

```js
const svg = Bazi.Renderer.render(result, {
  format: 'svg',
  preset: 'full',
  theme: 'modern-oriental'
});

// 顯示在頁面上
document.querySelector('#chart').innerHTML = svg;
```

HTML 需要先有容器：

```html
<div id="chart"></div>
```

### 下載 SVG

```js
function downloadSvg(svg) {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'bazi-chart.svg';
  link.click();
  URL.revokeObjectURL(url);
}

downloadSvg(svg);
```

### 產生 PNG

PNG 產生是非同步的，請使用 `await`：

```js
async function createPng(result) {
  const image = await Bazi.Renderer.render(result, {
    format: 'png',
    preset: 'mobile-share',
    theme: 'modern-oriental'
  });

  // image.dataUrl 可直接放到 <img src="...">
  document.querySelector('#preview').src = image.dataUrl;
}

createPng(result);
```

可用的版式：

| `preset` | 適合用途 |
| --- | --- |
| `full` | 完整命盤，包含四柱、強弱、神煞、大運與輔助資料 |
| `mobile-share` | 手機直式預覽與社群分享 |
| `a4` | 列印或 A4 版面 |
| `compact` | 精簡小卡，不包含完整神煞與大運 |

可用的主題：`modern-oriental`、`classic`、`dark`。

Demo 的 SVG／PNG 會依目前選取的 `theme` 與 `preset` 匯出同一份完整命盤資料；SVG 會自動計算長度，PNG 會以高解析度轉換，因此不會遺漏下方的大運、流年或神煞內容。下載圖底部會保留低調浮水印：「當麻實驗室 · github.com/donma/bazi-js」。

## AI Context：把排盤資料交給 AI

如果你的網站有 AI 解說功能，建議先用 SDK 整理資料，再把整理後的文字傳給 AI。不要讓 AI 自己從出生日期重新猜算四柱。

```js
const contextJson = Bazi.AI.toContext(result, {
  compact: true,
  includeRules: true,
  includeEvidence: true,
  includeInteractions: true,
  // 要與 demo 的完整命盤對齊，保留全部大運與逐年資料
  includeLuckAnnualDetails: true,
  maxLuckCycles: 10
});

console.log(contextJson); // JSON 字串，可放入 API request
```

如果你想在前端先查看物件內容，把 `compact` 設為 `false`：

```js
const context = Bazi.AI.toContext(result, { compact: false });
console.log(context.pillars);
console.log(context.shenSha.byPillar);
console.log(context.transits.year); // 畫面上的目前流年
console.log(context.luckCyclesSummary.cycles); // 全部大運、神煞與逐年資料
```

`toContext` 會保留畫面會用到的完整結構：每柱的藏幹明細、地勢、自坐、空亡、流年四柱、流年神煞、大運神煞與逐年資料。`maxLuckCycles` 預設為 10；若只要較小的 AI 輸入，再自行降低數量。Demo 的「複製 AI Context」會固定啟用完整逐年資料與 10 步大運，確保和目前命盤一致。

只需要神煞時，可以使用更小的 Context：

```js
const shenShaContext = Bazi.AI.toShenShaContext(result, {
  compact: false,
  includeRules: true,
  includeEvidence: true
});

console.log(shenShaContext.byPillar.hour);
```

## 在自己的表單中使用

下面是一個最小可用的前端範例：

```html
<label>
  出生日期
  <input id="birthDate" type="date" value="1983-05-11">
</label>

<label>
  出生時間
  <input id="birthTime" type="time" value="16:19">
</label>

<label>
  性別
  <select id="gender">
    <option value="male">男</option>
    <option value="female">女</option>
  </select>
</label>

<button id="calculate">開始排盤</button>
<p id="message"></p>
<pre id="result"></pre>

<script>
  document.querySelector('#calculate').addEventListener('click', () => {
    const response = Bazi.calculateSafe({
      birthDate: document.querySelector('#birthDate').value,
      birthTimeMode: 'exact',
      birthTime: document.querySelector('#birthTime').value,
      gender: document.querySelector('#gender').value,
      timezone: '+08:00'
    });

    if (!response.success) {
      document.querySelector('#message').textContent = response.error.message;
      return;
    }

    const result = response.data;
    document.querySelector('#message').textContent = '排盤完成';
    document.querySelector('#result').textContent = [
      `年柱：${result.pillars.year.ganzhi}`,
      `月柱：${result.pillars.month.ganzhi}`,
      `日柱：${result.pillars.day.ganzhi}`,
      `時柱：${result.pillars.hour.ganzhi}`
    ].join('\n');
  });
</script>
```

實際專案中，建議把畫面切成幾個區塊：

1. 上方放出生資料與重新排盤按鈕。
2. 中間放四柱，神煞直接放在各柱下方。
3. 下方放強弱、大運、流年、命宮身宮與證據說明。
4. 手機版讓區塊自然換行，避免固定寬度造成水平卷軸。

## `file://` 和 `http://localhost` 的差異

開啟 `file:///.../demo/index.html` 和 `http://127.0.0.1:4173/demo/index.html` 時，瀏覽器可能因為來源、安全限制、相對路徑或快取而顯示不同結果。開發時建議用簡單的本機伺服器：

```bash
python -m http.server 4173
```

然後開啟：

```text
http://127.0.0.1:4173/demo/index.html
```

本專案的 demo 使用同一套響應式畫面，並對 JavaScript 加上版本查詢字串，修改後重新整理即可取得最新檔案。若仍看到舊畫面，請使用瀏覽器的強制重新整理。

## RWD 使用重點

BaziJS 本身只負責資料與 SVG/PNG，不會限制你的 CSS。要做 RWD，可以遵循這幾點：

- 不要把四柱區塊寫死成超過手機寬度的固定寬度。
- 桌面版可以四欄排列，手機版改成一欄或兩欄。
- 長的神煞名稱、規則證據與輔助文字要允許換行。
- 命盤需要下載或列印時，使用 SVG 或 `a4` preset，不要把縮小後的畫面當成圖片。
- 用 `max-width: 100%`、`overflow-wrap: anywhere` 和彈性 Grid/Flex 配合內容。

範例：

```css
.pillars {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 720px) {
  .pillars {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 420px) {
  .pillars {
    grid-template-columns: 1fr;
  }
}

.shen-sha-name,
.evidence {
  overflow-wrap: anywhere;
}
```

## 常見錯誤

| 情況 | 解決方法 |
| --- | --- |
| `birthDate` 錯誤 | 使用 `YYYY-MM-DD`，例如 `1983-05-11` |
| `birthTime` 錯誤 | 使用 `HH:mm`，例如 `16:19` |
| `birthTimeMode: 'exact'` 沒有時間 | 加上 `birthTime`，或改用 `branch` / `unknown` |
| `branch` 沒有 `birthHourBranch` | 加上十二地支，例如 `申` |
| `gender` 錯誤 | 只能使用 `'male'` 或 `'female'` |
| 畫面沒有更新 | 重新整理或強制重新整理，檢查 `dist/` 路徑是否正確 |
| 手機出現水平卷軸 | 檢查自訂 CSS 是否有固定寬度，並允許文字換行 |
| SVG 很清楚但 HTML 很糊 | 放大查看時使用 SVG；不要把小尺寸 HTML 截圖放大 |

## 專案內的參考位置

```text
demo/index.html       可直接開啟的使用端範例
demo/app.js           demo 的排盤與畫面邏輯
demo/styles.css       demo 的 RWD 樣式
dist/                 可直接給瀏覽器載入的編譯檔
src/                  BaziJS 原始碼
tests/                單元測試與 Golden Cases
docs/                 規則、精度與研究資料
validation/           外部驗證報告
```

## 開發者驗證

修改原始碼後，在專案目錄執行：

```bash
npm test
npm run build
npm run validate
git diff --check
```

其中：

- `npm test` 執行單元測試、邊界案例與 Golden Cases。
- `npm run build` 重新產生瀏覽器用的 `dist/` 檔案。
- `npm run validate` 執行外部交叉驗證。
- `git diff --check` 檢查常見的空白與格式問題。

## 版本與精度說明

每次排盤結果都包含版本與規則資訊，可用來追蹤結果：

```js
console.log(result.meta.engineVersion);
console.log(result.meta.ruleSetVersion);
console.log(result.meta.shenShaRuleVersion);
console.log(result.meta.specialRuleVersion);
console.log(result.meta.patternRuleVersion);
console.log(result.rules);
```

目前的精度注意事項：

- 日柱與農曆計算提供 1900–2100 的 SDK 保證範圍。
- 節氣使用 Meeus 低精度公式，系統性可能提早約 2–9 分鐘。
- 出生時間接近節氣前後約 10 分鐘時，請用天文台年曆人工覆核。
- 真太陽時、夏令時間、出生地經度等資料，會影響實際排盤方式，請在表單中清楚標示。
- 強弱分數是傳統命理規則模型，不是科學測量值。

完整的系統責任邊界、不可違反的不變量與發布前檢查，請參考 [`docs/architecture/quality-gates.md`](docs/architecture/quality-gates.md)；本輪全系統審查紀錄見 [`docs/references/system-audit.md`](docs/references/system-audit.md)。

## License

Apache-2.0
