# 官方神煞目錄（shensha-catalog.md）

> v1 完整性定義（規範 §11.1）：以下所列 17 條即 BaziJS v1 官方神煞全集，
> 均已實作、測試、附文獻來源。不得在 README 宣稱涵蓋所有流派神煞。

| # | id | 名稱 | 吉凶 | 查法基準 | ruleId | 出處 |
|---|---|---|---|---|---|---|
| 1 | tian_yi_gui_ren | 天乙貴人 | 吉 | 日干/年干→支 | SS_TYGR_001 | 《淵海子平》卷二、《三命通會》卷三 |
| 2 | tai_ji_gui_ren | 太極貴人 | 吉 | 日干/年干→支 | SS_TJGR_002 | 《三命通會》卷三 |
| 3 | tian_de_gui_ren | 天德貴人 | 吉 | 月支→干/支 | SS_TDGR_003 | 《淵海子平》、《子平真詮》 |
| 4 | yue_de_gui_ren | 月德貴人 | 吉 | 月支→干 | SS_YDGR_004 | 《三命通會》卷三 |
| 5 | wen_chang_gui_ren | 文昌貴人 | 吉 | 日干/年干→支 | SS_WCGR_005 | 《三命通會》卷三 |
| 6 | lu_shen | 祿神 | 吉 | 日干→支 | SS_LUSHEN_006 | 《三命通會》卷三 |
| 7 | yang_ren | 羊刃 | 凶 | 日干→支 | SS_YANGREN_007 | 《淵海子平》、《三命通會》 |
| 8 | yi_ma | 驛馬 | 中 | 年支/日支→支 | SS_YIMA_008 | 《三命通會》卷三 |
| 9 | tao_hua | 桃花（咸池） | 中 | 年支/日支→支 | SS_TAOHUA_009 | 《三命通會》卷三 |
| 10 | hua_gai | 華蓋 | 中 | 年支/日支→支 | SS_HUAGAI_010 | 《三命通會》卷三 |
| 11 | jiang_xing | 將星 | 吉 | 年支/日支→支 | SS_JIANGXING_011 | 《三命通會》卷三 |
| 12 | jie_sha | 劫煞 | 凶 | 年支/日支→支 | SS_JIESHA_012 | 《三命通會》卷三 |
| 13 | wang_shen | 亡神 | 凶 | 年支/日支→支 | SS_WANGSHEN_013 | 《三命通會》卷三 |
| 14 | gu_chen | 孤辰 | 凶 | 年支→支 | SS_GUCHEN_014 | 《三命通會》卷三 |
| 15 | gua_su | 寡宿 | 凶 | 年支→支 | SS_GUASU_015 | 《三命通會》卷三 |
| 16 | jin_yu | 金輿 | 吉 | 日干→支 | SS_JINYU_016 | 《三命通會》卷三 |
| 17 | kui_gang | 魁罡貴人 | 中 | 日柱整柱 | SS_KUIGANG_017 | 《三命通會》卷五、《淵海子平》 |

查法口訣與判定式見 `src/shensha/catalog.js`（每條含 match 函數與 evidence 輸出）。
最後驗證日期：2026-09-08。
