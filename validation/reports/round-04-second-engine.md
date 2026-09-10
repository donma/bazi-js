# Round 04：第二獨立引擎交叉驗證

## 結論

本輪以固定 source commit 的 `baziflow-core` 做第二個獨立開源引擎交叉比對，保存 16 組觀察；與 round-03 的 34 組合計 50 組。16 組在本輪明確設定的範圍內全部一致：

- 民用日期／時間四柱：12 組
- 真太陽時四柱：4 組
- `match`：16 組
- `difference`：0 組
- `undetermined`：0 組

這代表「在指定輸入、版本、真太陽時設定與非邊界案例範圍內可重現」，不代表古典命理或不同流派存在唯一答案。

## 外部來源

| 欄位 | 固定值 |
| --- | --- |
| 引擎 | `baziflow-core` |
| 版本 | `0.1.0` |
| source commit | `ede8eb34620dbe31f072c34659be4077178e6cda` |
| repository | <https://github.com/Eastern-Sunrise/bazi-core> |
| 擷取日期 | `2026-09-10` |
| fixture | [`round-04-second-engine.json`](../external/round-04-second-engine.json) |

外部引擎使用自己的曆法依賴與算法，沒有被加入 BaziJS runtime。fixture 的 `observations` 是當時固定執行輸出，`comparison` 同時保留 BaziJS 與外部四柱，避免把 BaziJS 自己的結果偽裝成外部 expected。

## 範圍與限制

本輪只使用 `baziflow-core` 公開的 `computeChart` API。它提供四柱與真太陽時，但沒有 timezone／DST／子時換日的輸入契約，因此本輪沒有把這些維度宣稱為已驗證；這些邊界由 round-03 的 `@openfate/bazi-engine` 覆蓋。

真太陽時案例刻意避開節氣與子時切界，目的是隔離「地理位置校正」本身。節氣分鐘邊界、夏令時間與午夜換日的差異，仍依 round-03 的差異裁決保存，不以本輪 16 組一致結果覆蓋。

## 重現方式

```powershell
git clone https://github.com/Eastern-Sunrise/bazi-core.git
cd bazi-core
npm ci
npm run build
cd <BaziJS-repository>
node scripts/capture-external-round-04.mjs <path-to-bazi-core> validation/external/round-04-second-engine.json
npm test
npm run validate
```

正式驗證不會即時連線外部網站；它會以 fixture 保存的 source commit 與觀察結果離線重跑，並要求每一筆 `match`／`difference`／`undetermined` 分類仍與目前 SDK 一致。
