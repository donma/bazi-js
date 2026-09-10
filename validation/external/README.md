# 外部驗證資料集

`round-01-samples.json` 把 `validation/reports/round-01-cross-validation.md` 的公開抽樣紀錄整理成機器可讀格式。它保留來源名稱、比對範圍與分類；`npm test` 會重跑本地 SDK 對固定 expected 的比對，`npm run validate` 會重跑日柱錨點與節氣誤差門檻。

`round-02-special-systems.json` 保存命卦、用／喜／閒／仇／忌五分類與起運方法 variants 的公開抽樣。命卦案例同時保留公式／表格衝突，五分類標示為「定義匹配、結果由模型推導」，起運則驗證古典三日一歲方法與整日比較方法確實分開。

這不是即時抓站測試。公開排盤站內容可能改版，因此每次新增一輪資料都應保存擷取日期與報告，並把「外部來源一致」和「本地引擎通過」分開記錄。通過代表指定 Profile／版本／證據範圍內可重現，不代表傳統流派有絕對唯一答案。

`independent-ledger.json` 是獨立驗證專用資料集：`match` 表示同一輸入約定下結果一致，`difference` 表示已知約定或算法差異，`undetermined` 表示沒有足夠外部輸出。特別是只確認某個開源引擎「有此功能」時，不得把 BaziJS 自己的結果填入外部 expected。

`round-03-boundary-samples.json` 是第一輪跨邊界獨立抽樣：共 34 組，涵蓋一般日期、不同時區、夏令時間、子時換日、節氣切界與真太陽時。外部來源與差異解讀見 [`validation/reports/round-03-boundary-cross-validation.md`](../reports/round-03-boundary-cross-validation.md)。

`round-04-second-engine.json` 是第二個獨立引擎抽樣：共 16 組，使用固定 commit 的 `baziflow-core`，涵蓋 12 組民用日期與 4 組真太陽時。它沒有 timezone／DST／子時換日 API，所以這些維度不在本輪宣稱範圍；與 round-03 合計 50 組。詳細範圍與重現方式見 [`validation/reports/round-04-second-engine.md`](../reports/round-04-second-engine.md)。
