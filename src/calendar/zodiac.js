// 生肖顯示資料。年支已由四柱引擎按節氣年界定，這裡只做中文名稱映射。

export const ZODIAC_ANIMALS = Object.freeze({
  子: { id: 'rat', name: '鼠' },
  丑: { id: 'ox', name: '牛' },
  寅: { id: 'tiger', name: '虎' },
  卯: { id: 'rabbit', name: '兔' },
  辰: { id: 'dragon', name: '龍' },
  巳: { id: 'snake', name: '蛇' },
  午: { id: 'horse', name: '馬' },
  未: { id: 'goat', name: '羊' },
  申: { id: 'monkey', name: '猴' },
  酉: { id: 'rooster', name: '雞' },
  戌: { id: 'dog', name: '狗' },
  亥: { id: 'pig', name: '豬' }
});

export function getZodiacAnimal(branch) {
  const animal = ZODIAC_ANIMALS[branch];
  return animal ? { ...animal, branch } : null;
}
