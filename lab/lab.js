// Geek Lab 互動邏輯（引用 dist/bazi-sdk.js 全域 Bazi）
/* global Bazi */

let activeInput = {
  birthDate: '1984-02-04',
  birthTimeMode: 'exact',
  birthTime: '12:00',
  gender: 'male',
  timezone: '+08:00',
  dayBoundary: '23:00'
};

let currentResult = null;

// 預設案例庫
const CASES = {
  // 1984年立春約在 1984-02-04 16:19 (UTC+8)
  'lichun-before': {
    birthDate: '1984-02-04',
    birthTime: '15:00',
    gender: 'male',
    timezone: '+08:00',
    description: '1984年立春前，年柱應歸屬癸亥（豬年），非甲子'
  },
  'lichun-after': {
    birthDate: '1984-02-04',
    birthTime: '17:30',
    gender: 'male',
    timezone: '+08:00',
    description: '1984年立春後，年柱正式交入甲子（鼠年）'
  },
  'zishi-2259': {
    birthDate: '2024-05-15',
    birthTime: '22:59',
    gender: 'female',
    timezone: '+08:00',
    description: '22:59 子初換日前，日柱歸屬 5/15 當日'
  },
  'zishi-2300': {
    birthDate: '2024-05-15',
    birthTime: '23:00',
    gender: 'female',
    timezone: '+08:00',
    description: '23:00 子初換日，日柱自動推進至 5/16 次日'
  },
  'zishi-2359': {
    birthDate: '2024-05-15',
    birthTime: '23:59',
    gender: 'male',
    timezone: '+08:00',
    description: '23:59 夜子時，日柱為次日，時柱為子時'
  },
  'zishi-0000': {
    birthDate: '2024-05-16',
    birthTime: '00:00',
    gender: 'male',
    timezone: '+08:00',
    description: '00:00 午夜時分'
  },
  'time-unknown': {
    birthDate: '1995-10-24',
    birthTimeMode: 'unknown',
    gender: 'female',
    timezone: '+08:00',
    description: '時間完全未知，時柱不猜測，命宮身宮不強行計算'
  },
  'time-branch': {
    birthDate: '1990-08-08',
    birthTimeMode: 'branch',
    birthHourBranch: '午',
    gender: 'male',
    timezone: '+08:00',
    description: '只知時辰為午時，時支為午'
  },
  'true-solar': {
    birthDate: '1983-06-21',
    birthTimeMode: 'exact',
    birthTime: '12:00',
    gender: 'male',
    timezone: '+08:00',
    trueSolarTime: true,
    location: { country: 'TW', city: 'Taipei', longitude: 121.5654 },
    description: '啟用真太陽時修正（經度 121.56 + 均時差）'
  },
  'leap-month': {
    birthDate: '2023-04-05',
    birthTimeMode: 'exact',
    birthTime: '10:00',
    gender: 'female',
    timezone: '+08:00',
    description: '2023年農曆閏二月'
  },
  'boundary-1900': {
    birthDate: '1900-01-01',
    birthTimeMode: 'exact',
    birthTime: '06:00',
    gender: 'male',
    timezone: '+08:00',
    description: 'SDK 承諾之最左邊界 1900-01-01'
  },
  'boundary-2100': {
    birthDate: '2100-12-31',
    birthTimeMode: 'exact',
    birthTime: '18:00',
    gender: 'female',
    timezone: '+08:00',
    description: 'SDK 承諾之最右邊界 2100-12-31'
  },
  'out-of-range': {
    birthDate: '1899-12-31',
    birthTimeMode: 'exact',
    birthTime: '12:00',
    gender: 'male',
    timezone: '+08:00',
    description: '超出範圍邊界案例，應拋出明確錯誤'
  }
};

function init() {
  // 綁定案例載入按鈕
  document.querySelectorAll('.case-btn[data-case]').forEach(btn => {
    btn.addEventListener('click', () => {
      const caseId = btn.getAttribute('data-case');
      loadCase(caseId);
    });
  });

  // 綁定 Tab 切換
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');

      document.getElementById('tab-pane-json').style.display = tab === 'json' ? 'block' : 'none';
      document.getElementById('tab-pane-trace').style.display = tab === 'trace' ? 'block' : 'none';
      document.getElementById('tab-pane-evidence').style.display = tab === 'evidence' ? 'block' : 'none';
      document.getElementById('tab-pane-svg-source').style.display = tab === 'svg-source' ? 'block' : 'none';
    });
  });

  // 控制項
  document.getElementById('ctrl-day-boundary').addEventListener('change', (e) => {
    activeInput.dayBoundary = e.target.value;
    runLabCalculation();
  });

  document.getElementById('ctrl-year-boundary').addEventListener('change', (e) => {
    activeInput.yearBoundary = e.target.value;
    runLabCalculation();
  });

  // Benchmark 按鈕
  document.getElementById('run-benchmark-btn').addEventListener('click', runBenchmark);

  // 初始載入
  loadCase('lichun-before');
}

function loadCase(caseId) {
  const c = CASES[caseId];
  if (!c) return;

  activeInput = {
    ...c,
    dayBoundary: document.getElementById('ctrl-day-boundary').value,
    yearBoundary: document.getElementById('ctrl-year-boundary').value
  };

  runLabCalculation();
}

function runLabCalculation() {
  const safeRes = Bazi.calculateSafe(activeInput, { debug: true });

  if (!safeRes.success) {
    document.getElementById('lab-json-view').textContent = JSON.stringify(safeRes, null, 2);
    document.getElementById('lab-trace-view').textContent = `錯誤捕捉成功 [${safeRes.error.code}]:\n${safeRes.error.message}`;
    document.getElementById('lab-evidence-view').textContent = '計算失敗，無 Evidence 產出';
    document.getElementById('lab-svg-view').textContent = '無 SVG';
    return;
  }

  currentResult = safeRes.data;

  // 1. JSON
  document.getElementById('lab-json-view').textContent = JSON.stringify(currentResult, null, 2);

  // 2. Trace
  let traceText = '===== 計算流程 DEBUG TRACE =====\n\n';
  if (currentResult.debug) {
    traceText += `[年柱 Trace]\n${(currentResult.debug.yearPillarTrace || []).join('\n')}\n\n`;
    traceText += `[月柱 Trace]\n${(currentResult.debug.monthPillarTrace || []).join('\n')}\n\n`;
    traceText += `[日柱 Trace]\n${(currentResult.debug.dayPillarTrace || []).join('\n')}\n\n`;
    traceText += `[時柱 Trace]\n${(currentResult.debug.hourPillarTrace || []).join('\n')}\n\n`;
  }
  document.getElementById('lab-trace-view').textContent = traceText;

  // 3. Evidence
  let evText = '===== 強弱分析 EVIDENCE 證據鏈 =====\n\n';
  currentResult.strength.evidence.forEach((ev, idx) => {
    evText += `${idx + 1}. [${ev.ruleId}] (影響分: ${ev.effect})\n   理由: ${ev.reason}\n`;
  });

  evText += '\n===== 神煞判定 EVIDENCE 證據鏈 =====\n\n';
  currentResult.shenSha.forEach((ss, idx) => {
    evText += `${idx + 1}. [${ss.ruleId}] ${ss.name} (${ss.category})\n   命中柱位: ${ss.hitOn.join(', ')}\n   文獻來源: ${ss.reference}\n   證據依據: ${JSON.stringify(ss.evidence)}\n\n`;
  });
  document.getElementById('lab-evidence-view').textContent = evText;

  // 4. SVG Source
  const svg = Bazi.Renderer.render(currentResult, { format: 'svg', theme: 'dark', preset: 'full' });
  document.getElementById('lab-svg-view').textContent = svg;
}

function runBenchmark() {
  const benchBox = document.getElementById('benchmark-box');
  benchBox.style.display = 'block';

  const count = 10000;
  const testInput = {
    birthDate: '1988-08-08',
    birthTime: '08:08',
    gender: 'male',
    timezone: '+08:00'
  };

  const t0 = performance.now();
  for (let i = 0; i < count; i++) {
    Bazi.calculate(testInput);
  }
  const t1 = performance.now();

  const totalTime = t1 - t0;
  const ops = Math.round((count / (totalTime / 1000)));

  document.getElementById('bench-count').textContent = count.toLocaleString();
  document.getElementById('bench-time').textContent = `${totalTime.toFixed(1)} ms`;
  document.getElementById('bench-ops').textContent = `${ops.toLocaleString()} 次/秒`;
}

window.addEventListener('DOMContentLoaded', init);
