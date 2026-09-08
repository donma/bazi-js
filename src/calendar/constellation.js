// 公曆星座（Western zodiac）
//
// 這是依公曆月日的顯示輔助資料，不參與四柱、節氣、神煞或強弱判定。
// 邊界採常見熱帶黃道日期；若產品需要天文星座或不同流派，請另建 profile。

const CONSTELLATIONS = [
  { id: 'capricorn', name: '摩羯座', english: 'Capricorn', start: [12, 22], end: [1, 19] },
  { id: 'aquarius', name: '水瓶座', english: 'Aquarius', start: [1, 20], end: [2, 18] },
  { id: 'pisces', name: '雙魚座', english: 'Pisces', start: [2, 19], end: [3, 20] },
  { id: 'aries', name: '牡羊座', english: 'Aries', start: [3, 21], end: [4, 19] },
  { id: 'taurus', name: '金牛座', english: 'Taurus', start: [4, 20], end: [5, 20] },
  { id: 'gemini', name: '雙子座', english: 'Gemini', start: [5, 21], end: [6, 21] },
  { id: 'cancer', name: '巨蟹座', english: 'Cancer', start: [6, 22], end: [7, 22] },
  { id: 'leo', name: '獅子座', english: 'Leo', start: [7, 23], end: [8, 22] },
  { id: 'virgo', name: '處女座', english: 'Virgo', start: [8, 23], end: [9, 22] },
  { id: 'libra', name: '天秤座', english: 'Libra', start: [9, 23], end: [10, 23] },
  { id: 'scorpio', name: '天蠍座', english: 'Scorpio', start: [10, 24], end: [11, 22] },
  { id: 'sagittarius', name: '射手座', english: 'Sagittarius', start: [11, 23], end: [12, 21] }
];

function dayOfYear(month, day) {
  const monthDays = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  return monthDays[month - 1] + day;
}

export function getWesternConstellation(month, day) {
  const value = dayOfYear(month, day);
  const capricornStart = dayOfYear(12, 22);
  const capricornEnd = dayOfYear(1, 19);

  const definition = value >= capricornStart || value <= capricornEnd
    ? CONSTELLATIONS[0]
    : CONSTELLATIONS.slice(1).find((item) => {
      const start = dayOfYear(item.start[0], item.start[1]);
      const end = dayOfYear(item.end[0], item.end[1]);
      return value >= start && value <= end;
    });

  return definition ? { ...definition } : null;
}

export { CONSTELLATIONS };
