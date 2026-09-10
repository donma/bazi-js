# 古典子平特殊規則分類

最後整理日期：2026-09-09

## 目的與分類結論

本文件是 BaziJS 對古典子平特殊規則的 audit 與實作邊界。規則名稱在古籍中不代表同一種概念：有些是以干支查出的神煞，有些是固定日柱或時柱，有些必須合併季節，另有些是整局格局。BaziJS 因此分成四個命名空間：

| 類型 | 說明 | BaziJS 位置 |
|---|---|---|
| `ShenSha` | 年干、日干、月令、年支、日支查其他干支的神煞 | `src/shensha/` |
| `SpecialPillar` | 固定日柱或時柱型條件，只識別原始條件 | `src/special-rules/` |
| `SeasonalSpecial` | 季節/月令與特殊日柱的合併條件 | `src/special-rules/` |
| `SpecialPatterns` | 需要多柱、透干、合局、虛神或破格條件的格局 | `src/patterns/` |

`SpecialPillar` 命中不代表完整格局成格；`SeasonalSpecial` 會把季節來源寫入 `evidence`；`SpecialPatterns` 目前只登錄研究架構，不會被當作神煞或自動宣告成格。

## P0：SpecialPillar

| 名稱 | 類型 | 判定基準 | 干支列表/算法 | 古籍 | 目前是否實作 | 舊版差異 |
|---|---|---|---|---|---|---|
| 魁罡 | `special-pillar` / `day-pillar-special` | 日柱 | 庚辰、壬辰、戊戌、庚戌 | 《三命通會》卷六、《淵海子平》 | 是 | 從舊 `ShenSha` 移至 `SP_KUIGANG_001`；不再稱「魁罡貴人」 |
| 十惡大敗日 | `special-pillar` / `day-pillar-special` | 日柱 | 甲辰、乙巳、丙申、丁亥、戊戌、己丑、庚辰、辛巳、壬申、癸亥 | 《三命通會》卷五、《淵海子平》 | 是 | 從舊 `ShenSha` 移至 `SP_SHIEDABAI_002` |
| 日貴 | `special-pillar` / `day-pillar-special` | 日柱 | 丁酉、丁亥、癸巳、癸卯 | 《三命通會》卷六、《淵海子平》 | 是 | 新增 `SP_RIGUI_003`；晝貴/夜貴異文留在 `variants` |
| 日德 | `special-pillar` / `day-pillar-special` | 日柱 | 甲寅、丙辰、戊辰、庚辰、壬戌 | 《三命通會》卷六、《淵海子平》 | 是 | 新增 `SP_RIDE_004`；只識別日例，不宣告日德格 |
| 八專 | `special-pillar` / `day-pillar-special` | 日柱 | 甲寅、乙卯、己未、丁未、庚申、辛酉、戊戌、癸丑 | 《三命通會》卷六、《淵海子平》 | 是 | 新增 `SP_BAZHUAN_005`；四日核心與八日表並存 |
| 九醜 | `special-pillar` / `day-pillar-special` | 日柱 | 戊子、戊午、己卯、己酉、辛卯、辛酉、壬子、壬午、丁酉、乙卯（原典列十日） | 《三命通會》卷三；《欽定古今圖書集成》藝術典第728卷可作異文比對 | 是 | 新增 `SP_JIUCHOU_006`；保留「九名十日」與後世九日表衝突 |
| 孤鸞 | `special-pillar` / `day-pillar-special` | 日柱 | 乙巳、丁巳、辛亥、戊申、甲寅、丙午、戊午、壬子 | 《三命通會》卷三、卷六 | 是 | 新增 `SP_GULUAN_007`；舊 vNext 五柱改為原典八日，五柱留作 variant |
| 陰陽差錯 | `special-pillar` / `day-pillar-special` | 日柱 | 丙子、丁丑、戊寅、辛卯、壬辰、癸巳、丙午、丁未、戊申、辛酉、壬戌、癸亥 | 《三命通會》卷三、《淵海子平》 | 是 | 從 `SS_YYCC_044` 移至 `SP_YYCC_008` |
| 金神 | `special-pillar` / `hour-pillar-special` | 時柱 | 癸酉、己巳、乙丑 | 《淵海子平》、《三命通會》卷六 | 是 | 新增 `SP_JINSHEN_009`；只判時柱，不把火制、月令喜忌硬編入單柱規則 |

每條實作規則都具有 `id`、`name`、`aliases`、`tradition`、`conceptType`、`ruleFamily`、`baseOn`、`scope`、`category`、`confidence`、`ruleId`、`version`、`references`、`description`、`match` 與 `evidence`。範例：

```js
import Bazi from './dist/bazi-sdk.js';

const chart = Bazi.calculate({
  birthDate: '2024-01-01',
  birthTime: '12:00',
  gender: 'male'
});

console.log(chart.specialRules);
// 每筆結果都有 conceptType、ruleFamily、ruleId、references、evidence
console.log(Bazi.SpecialRules.getSpecialRule('kui_gang'));
```

金神的三個固定時柱，以及其他固定日柱，都刻意不使用一般 ShenSha 引擎的「掃描四柱查目標支」模型。需要完整取用、成格或破格判斷時，應使用 Patterns 研究登錄並另行實作。

## P1：SeasonalSpecial

| 名稱 | 類型 | 判定基準 | 干支列表/算法 | 古籍 | 目前是否實作 | 舊版差異 |
|---|---|---|---|---|---|---|
| 天赦 | `seasonal-special` / `seasonal-day-special` | 季節（月令）+ 日柱 | 春戊寅、夏甲午、秋戊申、冬甲子 | 《淵海子平》、《欽定協紀辨方書》卷五 | 是 | 新增 `SE_TIANSHE_001`；`evidence` 明示 season、monthBranch、seasonBranches |
| 四廢 | `seasonal-special` / `seasonal-day-special` | 季節（月令）+ 日柱 | 春庚申/辛酉、夏壬子/癸亥、秋甲寅/乙卯、冬丙午/丁巳 | 《三命通會》卷六、《淵海子平》 | 是 | 從 `SS_SIFEI_045` 移出 ShenSha；季節判定及原始依據獨立輸出 |

BaziJS canonical 的季節來源是節令月支：寅卯辰為春、巳午未為夏、申酉戌為秋、亥子丑為冬。這不是把國曆月份直接當季節；例如四廢命中結果會包含：

```js
const waste = chart.specialRules.find((item) => item.id === 'si_fei');
console.log(waste?.evidence);
// {
//   basedOn: ['monthBranch', 'dayPillar'],
//   season: 'spring',
//   seasonSource: 'month-branch (節令月令)',
//   monthBranch: '寅',
//   targetValue: '庚申',
//   ...
// }
```

天赦的季節日例在不同曆書、版本及季節邊界說明中可能出現異文；本版沒有刪掉異文，而以 `variants` / `researchNotes` 保留待後續逐版本核校。

## P2：SpecialPatterns（只建架構）

下列項目現在登錄於 `src/patterns/registry.js`，`implemented: false`、`status: 'research-only'`，不會出現在 `chart.shenSha`，也不會被 `chart.specialRules` 當成已成格：

| 名稱 | 類型 | 原始判定架構 | 古籍 | 目前是否實作 |
|---|---|---|---|---|
| 壬騎龍背 | `special-pattern` / `whole-chart-pattern` | 壬日坐辰、辰多、寅合及財官印等全局條件，另有壬寅日變例 | 《三命通會》卷六 | 否，研究登錄 |
| 六陰朝陽 | `special-pattern` / `whole-chart-pattern` | 辛日、戊子時，並檢查子數、午丑及官殺財印等破格條件 | 《三命通會》卷六 | 否，研究登錄 |
| 六乙鼠貴 | `special-pattern` / `whole-chart-pattern` | 乙日、丙子時，配合子中癸水及全局刑沖破害、官星條件 | 《三命通會》卷六 | 否，研究登錄 |
| 日祿歸時 | `special-pattern` / `whole-chart-pattern` | 日干之祿落時支，再查官殺、傷官、沖破與月令 | 《三命通會》卷六 | 否，研究登錄 |
| 拱祿 | `special-pattern` / `whole-chart-pattern` | 日時相鄰夾出虛祿，須同干、無填實、無沖破並看全局 | 《三命通會》卷六 | 否，研究登錄 |
| 拱貴 | `special-pattern` / `whole-chart-pattern` | 日時夾出虛貴，須辨貴人、填實、沖破與月令 | 《三命通會》卷六 | 否，研究登錄 |
| 福德秀氣 | `special-pattern` / `whole-chart-pattern` | 巳酉丑金局等組合，合併季節、日干、透干、刑沖 | 《三命通會》卷六 | 否，研究登錄 |

這些項目不是「固定名稱清單多幾顆」而已，後續需要 whole-chart predicate、虛神表示法及可解釋的破格 evidence；在此之前禁止直接放進 ShenSha Catalog。

## Audit 回報

### 已有規則

- 一般 ShenSha 原目錄原有 22 條；其中固定日柱的魁罡、十惡大敗已辨識為分類錯誤。
- 一般 ShenSha 現在保留 20 條，仍由 `src/shensha/catalog.js` 與 extended registry 處理。
- 原有孤鸞、陰陽差錯、四廢已從 extended ShenSha 移到 SpecialRules。

### 新增規則

- SpecialPillar：日貴、日德、八專、九醜、孤鸞、陰陽差錯、金神，以及分類遷移後的魁罡、十惡大敗，共 9 條。
- SeasonalSpecial：天赦、四廢，共 2 條。
- `chart.specialRules`、`Bazi.SpecialRules` 與 `Bazi.AI.toContext()` 均可取得這些獨立結果。

### 尚未實作

- P2 七個整局特殊格只做研究登錄，沒有 matcher，也不會被當作命盤已成格。
- 金神後續火制、月令、喜忌與完整金神格；日德、魁罡等完整格局取用也未由單柱識別器代判。

### 文獻衝突

- 日貴有晝貴/夜貴配對差異。
- 八專有四日核心與八日表差異。
- 九醜名稱為九但原典列十日，後世另有九日表。
- 孤鸞有原典八日、舊 BaziJS 五日及後世增減表。
- 天赦及四廢的季節日例、節令邊界和傳本說明需要逐版本核對。
- 因此每條衝突規則都保留 `variants` / `researchNotes`，沒有把某一現代網站表格假裝成唯一古典標準。

### 不應屬於神煞、應移到 Patterns 的項目

壬騎龍背、六陰朝陽、六乙鼠貴、日祿歸時、拱祿、拱貴、福德秀氣。它們需要日時組合、整局透干、合局、虛神或破格條件；放入 ShenSha Catalog 會把「格局」錯誤簡化成查一支或查一柱。

## 測試與驗證

- `tests/run.js` 驗證 11 條 SpecialRules metadata schema、每條 P0 命中、固定條件反例、天赦/四廢季節 evidence，以及 Patterns 目前為研究登錄。
- `npm test` 必須通過。
- `npm run build` 會同步更新 `dist/bazi-sdk.js`、`dist/bazi-sdk.min.js` 與 ESM bundle，供瀏覽器端使用。
