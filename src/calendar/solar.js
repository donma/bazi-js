// 太陽黃經計算（Apparent Solar Longitude）
// 參考：Jean Meeus, Astronomical Algorithms 2nd ed., ch.25（低精度日星位置，精度約 0.01°）
// 亦納入章節 22 的章動與近點角修正，以得視黃經（相對於當天春分點）。

const D2R = Math.PI / 180;

// 公元(儒略曆?公曆)年分 → 儒略世紀數（J2000）
function julianCenturies(jdTT) {
  return (jdTT - 2451545.0) / 36525;
}

// 由 JD(TT) 計算太陽視黃經（0..360 度）
export function solarLongitude(jdTT) {
  const T = julianCenturies(jdTT);

  // 太陽平黃經
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  // 太陽平近點角
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  // 地球軌道離心率
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;

  // 中心差（equation of center）
  const Mr = M * D2R;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) +
    0.000289 * Math.sin(3 * Mr);

  // 真黃經（幾何黃經，相對於當日平春分點）
  const theta = L0 + C;

  // 章動主項 Ω
  const Omega = 125.04 - 1934.136 * T;
  // 章動黃經 Δψ（主項近似，秒）→ 度
  const deltaPsi = -17.20 * Math.sin(Omega * D2R) / 3600;
  // 周年光行差 -20.4898"
  const aberration = -20.4898 / 3600;

  // 視黃經 = 幾何黃經 + 章動 + 光行差
  let lambda = theta + deltaPsi + aberration;
  lambda = ((lambda % 360) + 360) % 360;
  return lambda;
}

// 黃經每天變化量約 0.9856°；用於牛頓迭代導數
const SOLAR_RATE = 360 / 365.2422;

// 求太陽黃經等於 target（度，0..360）的最近 JD(TT)
// guessJD 為初始猜測值
export function findSolarLongitudeTime(target, guessJD) {
  target = ((target % 360) + 360) % 360;
  let jd = guessJD;
  for (let i = 0; i < 10; i++) {
    const lon = solarLongitude(jd);
    // 計算角差（處理 0/360 環繞）
    let diff = lon - target;
    // 修正到 [-180, 180)
    diff = ((diff + 180) % 360 + 360) % 360 - 180;
    jd = jd - diff / SOLAR_RATE;
  }
  return jd;
}