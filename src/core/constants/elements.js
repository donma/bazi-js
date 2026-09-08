// 五行資料模型
// 五行：木、火、土、金、水
// 相生：木生火、火生土、土生金、金生水、水生木
// 相剋：木剋土、土剋水、水剋火、火剋金、金剋木

export const ELEMENTS = [
  { id: 'wood',  char: '木', generates: '火', restricts: '土', generatedBy: '水', restrictedBy: '金', color: '#2d6a4f' },
  { id: 'fire',  char: '火', generates: '土', restricts: '金', generatedBy: '木', restrictedBy: '水', color: '#b23a22' },
  { id: 'earth', char: '土', generates: '金', restricts: '水', generatedBy: '火', restrictedBy: '木', color: '#9c6644' },
  { id: 'metal', char: '金', generates: '水', restricts: '木', generatedBy: '土', restrictedBy: '火', color: '#b38d38' },
  { id: 'water', char: '水', generates: '木', restricts: '火', generatedBy: '金', restrictedBy: '土', color: '#1d3557' }
];

export const ELEMENT_INDEX = Object.fromEntries(ELEMENTS.map((e, i) => [e.char, i]));

export function elementIndex(char) {
  return ELEMENT_INDEX[char];
}

export function elementAt(index) {
  const i = ((index % 5) + 5) % 5;
  return ELEMENTS[i];
}

// 判斷 e1 對 e2 的五行關係 (e1 主動對 e2)
// 返回: 'same' (同), 'generate' (生), 'drain' (洩=被生), 'restrict' (剋), 'counter' (耗=被剋)
export function elementRelation(e1, e2) {
  if (e1 === e2) return 'same';
  const data = ELEMENTS[ELEMENT_INDEX[e1]];
  if (!data) return 'unknown';
  if (data.generates === e2) return 'generate';
  if (data.restricts === e2) return 'restrict';
  if (data.generatedBy === e2) return 'drain';
  if (data.restrictedBy === e2) return 'counter';
  return 'unknown';
}
