# Round 03：跨邊界外部交叉驗證

## 目的

本輪不是把 repo 內的 expected value 當成外部證據，而是使用獨立開源引擎固定執行輸出，抽樣檢查 BaziJS 在日期、時區、子時、節氣與真太陽時邊界的可重現性。

資料集：[`validation/external/round-03-boundary-samples.json`](../external/round-03-boundary-samples.json)

## 外部來源

- 引擎：[`@openfate/bazi-engine`](https://github.com/openfate-ai/bazi-engine)
- 版本：`1.1.2`
- 固定 commit：`c6e21ac4fd07ca6762de9e84d45c68339cb84c02`
- 擷取日期：2026-09-10
- 使用範圍：四柱、節氣切界、時區輸入、子時換日、真太陽時
- BaziJS 沒有把此引擎加入 runtime；只保存外部 observation。

## 抽樣覆蓋

| 群組 | 組數 | 一致 | 差異 |
| --- | ---: | ---: | ---: |
| 一般日期與歷史日期 | 10 | 10 | 0 |
| 不同時區與夏令時間 | 6 | 5 | 1 |
| 子時與換日界線 | 6 | 5 | 1 |
| 節氣切界 | 8 | 4 | 4 |
| 真太陽時 | 4 | 4 | 0 |
| **合計** | **34** | **28** | **6** |

## 差異解讀

差異不是直接判定 BaziJS 錯誤，而是保留待追查的外部觀察：

- 紐約夏令時間案例：民用時間正規化政策不同。
- 午夜換日案例：民用午夜模式下，晚子時的時干取法不同。
- 節氣「之前」案例：兩個引擎在分鐘級節氣切界的算法／精度不同；「之後」案例則一致。

這些差異正是邊界測試要揭露的內容，不能為了讓統計全數一致而刪除。

## 重現方式

1. 取出來源 repo 的指定 commit。
2. 在來源 repo 安裝其依賴。
3. 執行：

   ```text
   node --import tsx scripts/capture-external-round-03.mjs <external-repo> validation/external/round-03-boundary-samples.json
   ```

4. `npm test` 驗證資料契約與 34 組固定 observation。
5. `npm run validate` 重跑 BaziJS 對 `match`／`difference` 的比對。

CI 不即時連線外部網站；它驗證已保存的外部 commit、輸入與輸出是否仍與目前 SDK 的分類一致。這不代表跨流派只有一個絕對答案。
