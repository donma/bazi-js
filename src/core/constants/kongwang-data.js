// 空亡速查：由日柱（或年柱）旬空查出旬內空亡的兩個地支
// 六十甲子分為六旬，每旬10干配10支，剩下的2支為旬空

export const XUN_KONGWANG = [
  // 甲子旬 (0-9): 戌、亥空
  { start: 0,  end: 9,  name: '甲子旬', kong: ['戌', '亥'] },
  // 甲戌旬 (10-19): 申、酉空
  { start: 10, end: 19, name: '甲戌旬', kong: ['申', '酉'] },
  // 甲申旬 (20-29): 午、未空
  { start: 20, end: 29, name: '甲申旬', kong: ['午', '未'] },
  // 甲午旬 (30-39): 辰、巳空
  { start: 30, end: 39, name: '甲午旬', kong: ['辰', '巳'] },
  // 甲辰旬 (40-49): 寅、卯空
  { start: 40, end: 49, name: '甲辰旬', kong: ['寅', '卯'] },
  // 甲寅旬 (50-59): 子、丑空
  { start: 50, end: 59, name: '甲寅旬', kong: ['子', '丑'] }
];

export function getKongWang(sexagenaryIdx) {
  const i = ((sexagenaryIdx % 60) + 60) % 60;
  const xun = XUN_KONGWANG.find(x => i >= x.start && i <= x.end);
  return xun ? xun.kong : [];
}
