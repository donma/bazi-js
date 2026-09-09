# 古籍證據庫

這個目錄是 BaziJS 的可追溯證據索引，不是把古籍全文複製進套件。`classical-texts.json` 收錄書目、卷次、原始判定依據、適用範圍、版本差異與目前實作狀態。

使用原則：

- `sourceStatus: primary` 代表古典原典或原典傳本，並不代表不同版本沒有異文。
- 每筆 `evidenceRecord` 都要能回指 `ruleId` 或研究中的 Pattern ID。
- 只要古籍、傳本或後世整理有差異，就放在 `variants` / `researchNotes`，不靜默合併。
- `textStatus` 明確標示本檔是書目與判定索引，不冒充完整校勘本。

對外使用時，請同時讀取 `references` 與 `evidenceRecords`；只顯示名稱而不顯示依據，不能算可審核的命理規則。
