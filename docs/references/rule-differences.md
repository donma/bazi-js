# 流派差異紀錄（rule-differences.md）

> 無法確認唯一正解的命理規則，一律記錄於此，不得偷偷猜測或迎合單一網站。

1. **年柱分界**：立春 vs 正月初一。canonical 採立春（YEAR_BOUNDARY_LICHUN）。
2. **月柱分界**：十二節 vs 農曆初一。canonical 採十二節（MONTH_BOUNDARY_JIE）。
3. **換日**：23:00 子初 vs 00:00 午夜。canonical 採 23:00（DAY_BOUNDARY_ZISHI_2300）。
4. **真太陽時**：用 vs 不用。canonical 預設關閉；啟用時同時保留 civilTime 與修正分鐘數。
5. **土長生寄位**：寄火（寅）vs 寄水（申）。canonical 採寄火。
6. **陰干長生**：陽順陰逆 vs 陰陽同順。canonical 採陽順陰逆。
7. **命宮起法**：掌訣數公式 vs 中氣過宮。canonical 採掌訣數公式。
8. **起運算法**：節氣差÷3 vs 天數÷3 以外簡法、虛歲 vs 周歲。canonical 採節差÷3＋周歲＋精確到月日。
9. **神煞全集**：無公認全集；v1 以官方 17 條目錄為完整性定義。
10. **強弱權重**：各派得令/得地/得勢權重不同；v1 權重 Profile 化可調。
11. **節氣時刻**：各軟體內建表互差數分鐘，屬曆算精度（本引擎 ±10 分鐘）非流派，見 solar-terms.md。
12. **大運方向**：另有不分陰陽一律順排之簡派；canonical 採陰陽年＋性別。
