// Demo 互動邏輯（引用 dist/bazi-sdk.js 全域 Bazi，支援雙擊 file:// 開啟）
/* global Bazi */

let currentResult = null;
// file:// 與 http:// 預覽共用同一個 DOM 渲染路徑，避免依 viewport 切換造成兩種畫面。
let responsivePreview = true;

function init() {
  // 性別切換
  const genderBtns = document.querySelectorAll('#gender-control button');
  genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      genderBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('gender').value = btn.getAttribute('data-val');
      runCalculation();
    });
  });

  // 時間模式切換
  const modeBtns = document.querySelectorAll('#time-mode-control button');
  let currentMode = 'exact';
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.getAttribute('data-val');

      document.getElementById('exact-time-group').style.display = currentMode === 'exact' ? 'block' : 'none';
      document.getElementById('branch-time-group').style.display = currentMode === 'branch' ? 'block' : 'none';
      runCalculation();
    });
  });

  // 真太陽時 checkbox
  const tstCheckbox = document.getElementById('trueSolarTime');
  tstCheckbox.addEventListener('change', () => {
    document.getElementById('location-group').style.display = tstCheckbox.checked ? 'block' : 'none';
    runCalculation();
  });

  // 主題與版式切換
  document.getElementById('theme-select').addEventListener('change', updateRender);
  document.getElementById('preset-select').addEventListener('change', updateRender);

  // 排盤按鈕
  document.getElementById('calc-btn').addEventListener('click', runCalculation);

  // 下載與複製
  document.getElementById('download-svg-btn').addEventListener('click', downloadSvg);
  document.getElementById('download-png-btn').addEventListener('click', downloadPng);
  document.getElementById('copy-json-btn').addEventListener('click', copyJson);
  document.getElementById('copy-ai-btn').addEventListener('click', copyAiContext);

  // 初始執行一次
  runCalculation();
}

function runCalculation() {
  const birthDate = document.getElementById('birthDate').value;
  const gender = document.getElementById('gender').value;
  const activeModeBtn = document.querySelector('#time-mode-control button.active');
  const birthTimeMode = activeModeBtn ? activeModeBtn.getAttribute('data-val') : 'exact';
  const birthTime = document.getElementById('birthTime').value;
  const birthHourBranch = document.getElementById('birthHourBranch').value;
  const timezone = document.getElementById('timezone').value;
  const trueSolarTime = document.getElementById('trueSolarTime').checked;
  const longitude = parseFloat(document.getElementById('longitude').value) || 121.5654;

  const input = {
    birthDate,
    gender,
    birthTimeMode,
    birthTime: birthTimeMode === 'exact' ? birthTime : undefined,
    birthHourBranch: birthTimeMode === 'branch' ? birthHourBranch : undefined,
    timezone,
    trueSolarTime,
    location: {
      country: 'TW',
      city: 'Taipei',
      longitude
    }
  };

  const res = Bazi.calculateSafe(input);
  if (!res.success) {
    alert('排盤錯誤: ' + res.error.message);
    return;
  }

  currentResult = res.data;
  updateRender();
}

function updateRender() {
  if (!currentResult) return;

  const theme = document.getElementById('theme-select').value;
  const preset = document.getElementById('preset-select').value;

  const chartContainer = document.getElementById('chart-container');
  const chartHint = document.querySelector('.chart-hint');
  chartContainer.classList.toggle('is-responsive-preview', responsivePreview);

  if (responsivePreview) {
    chartContainer.innerHTML = renderResponsivePreview(currentResult, { theme, preset });
    chartHint.textContent = '直式閱讀版：文字不縮放、無需水平捲軸；file:// 與 localhost 共用此畫面。';
  } else {
    const svgStr = Bazi.Renderer.render(currentResult, {
      format: 'svg',
      theme,
      preset
    });
    chartContainer.innerHTML = svgStr;
    chartHint.textContent = '窄螢幕請在命盤區內左右滑動，以保留完整文字清晰度。';
  }
  document.getElementById('json-output').textContent = JSON.stringify(currentResult, null, 2);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function displayText(value, fallback = '—') {
  return escapeHtml(value === undefined || value === null || value === '' ? fallback : value);
}

function formatShenSha(list, limit = 14) {
  const names = (list || []).slice(0, limit).map((item) => {
    const hitOn = Array.isArray(item.hitOn) && item.hitOn.length ? `(${item.hitOn.join('/')})` : '';
    return `${item.displayName || item.name || ''}${hitOn}`;
  });
  if (!names.length) return '—';
  const suffix = (list || []).length > limit ? `……（共${list.length}顆）` : '';
  return `${names.join('、 ')}${suffix}`;
}

function renderResponsivePreview(result, options) {
  const theme = Bazi.Renderer.themes[options.theme] || Bazi.Renderer.themes['modern-oriental'];
  const preset = Bazi.Renderer.presets[options.preset] || Bazi.Renderer.presets.full;
  const styles = [
    `--responsive-bg:${theme.background}`,
    `--responsive-card:${theme.cardBg}`,
    `--responsive-text:${theme.textPrimary}`,
    `--responsive-secondary:${theme.textSecondary}`,
    `--responsive-muted:${theme.textMuted}`,
    `--responsive-accent:${theme.accent}`,
    `--responsive-gold:${theme.gold}`,
    `--responsive-border:${theme.border}`,
    `--responsive-grid:${theme.gridBg}`
  ].join(';');

  const p = result.pillars;
  const pillarCols = [
    { title: '時柱', data: p.hour, tenGod: result.tenGods.stems.hour, hidden: result.tenGods.hidden.hour, nayin: result.nayin.hour, stage: result.twelveStages.byDayMaster.hour },
    { title: '日柱', data: p.day, tenGod: { full: '日主' }, hidden: result.tenGods.hidden.day, nayin: result.nayin.day, stage: result.twelveStages.byDayMaster.day },
    { title: '月柱', data: p.month, tenGod: result.tenGods.stems.month, hidden: result.tenGods.hidden.month, nayin: result.nayin.month, stage: result.twelveStages.byDayMaster.month },
    { title: '年柱', data: p.year, tenGod: result.tenGods.stems.year, hidden: result.tenGods.hidden.year, nayin: result.nayin.year, stage: result.twelveStages.byDayMaster.year }
  ];

  const elementColors = theme.elementColors || {};
  const elementBars = ['木', '火', '土', '金', '水'].map((element) => {
    const data = result.strength.distribution[element] || { percentage: 0 };
    const percentage = Number(data.percentage) || 0;
    return `<div class="responsive-element-row">
      <span class="responsive-element-name" style="color:${elementColors[element] || theme.textPrimary}">${element}</span>
      <span class="responsive-element-track"><span style="width:${Math.min(100, Math.max(0, percentage))}%;background:${elementColors[element] || theme.textPrimary}"></span></span>
      <strong>${percentage}%</strong>
    </div>`;
  }).join('');

  const pillars = pillarCols.map((col) => {
    const available = col.data && col.data.available !== false;
    const hidden = (col.hidden || []).map((item) => `<li>${displayText(item.stem)} <small>(${displayText(item.tenGod && item.tenGod.short, '')})</small></li>`).join('');
    return `<article class="responsive-pillar">
      <header>${displayText(col.title)}</header>
      <div class="responsive-pillar-god">${displayText(col.tenGod && (col.tenGod.full || col.tenGod.short))}</div>
      <div class="responsive-ganzhi">${available ? displayText(col.data.stem) : '？'}<br>${available ? displayText(col.data.branch) : '？'}</div>
      <ul>${hidden || '<li>—</li>'}</ul>
      <div class="responsive-pillar-meta">納音：${displayText(col.nayin)}<br>長生：${displayText(col.stage && col.stage.name)}</div>
    </article>`;
  }).join('');

  const luckCycles = preset.includeLuckCycles && result.luckCycles
    ? `<section class="responsive-section">
        <h4>起運走勢 <span>（${displayText(result.luckCycles.directionText)} · ${displayText(result.luckCycles.startAge.display)}起運）</span></h4>
        <div class="responsive-luck-grid">${result.luckCycles.cycles.slice(0, 8).map((cycle) => `<article>
          <span>${displayText(cycle.fromAge)}歲</span>
          <strong>${displayText(cycle.ganzhi)}</strong>
          <small>${displayText(cycle.tenGodStem && cycle.tenGodStem.short)}</small>
          <em>${displayText(cycle.fromYear)}年</em>
        </article>`).join('')}</div>
      </section>`
    : '';

  const shenSha = preset.includeShenSha && result.shenSha
    ? `<section class="responsive-section responsive-shensha">
        <h4>神煞吉凶與命宮身宮</h4>
        <div class="responsive-detail-list">
          <div><strong>原局神煞</strong><p>${escapeHtml(formatShenSha(result.shenSha, 14))}</p></div>
          <div><strong>流年神煞</strong><p>${escapeHtml(formatShenSha(result.transits && result.transits.shenShaYear, 10))}</p></div>
          <div><strong>初運神煞</strong><p>${escapeHtml(formatShenSha(result.luckCycles && result.luckCycles.cycles[0] && result.luckCycles.cycles[0].shenSha, 10))}</p></div>
          <div><strong>胎元命宮</strong><p>胎元：${displayText(result.auxiliary.taiYuan && result.auxiliary.taiYuan.ganzhi)} ｜ 胎息：${displayText(result.auxiliary.taiXi && result.auxiliary.taiXi.ganzhi)} ｜ 命宮：${displayText(result.auxiliary.mingGong && result.auxiliary.mingGong.ganzhi)} ｜ 身宮：${displayText(result.auxiliary.shenGong && result.auxiliary.shenGong.ganzhi)}</p></div>
        </div>
      </section>`
    : '';

  const strength = preset.includeStrength
    ? `<section class="responsive-section">
        <h4>五行氣數與強弱平衡</h4>
        <div class="responsive-strength-summary">
          <p><strong>日主旺衰得分</strong><span>${displayText(result.strength.score)} 分 · 【${displayText(result.strength.level)}】</span></p>
          <p><strong>喜用五行</strong><span>${displayText((result.strength.favorableElements || []).join('、'))}</span></p>
          <p><strong>忌仇五行</strong><span>${displayText((result.strength.unfavorableElements || []).join('、'))}</span></p>
        </div>
        <div class="responsive-element-bars">${elementBars}</div>
      </section>`
    : '';

  const dayMasterStem = result.pillars.day.stem;
  const stem = (Bazi.Constants.STEMS || []).find((item) => item.char === dayMasterStem);
  const dayMaster = `${dayMasterStem}${stem ? stem.element : ''}`;

  return `<div class="responsive-chart" style="${styles}">
    <header class="responsive-chart-header">
      <h3>八字命盤 · 子平四柱</h3>
      <p>BaziJS Metaphysical Engine v${displayText(result.meta.engineVersion)} · 規範流派：${displayText(result.meta.profileName)}</p>
    </header>
    <section class="responsive-info-grid">
      <div><span>公曆</span><strong>${displayText(result.calendar.solar.year)}年${displayText(result.calendar.solar.month)}月${displayText(result.calendar.solar.day)}日 ${displayText(result.input.birthTime, '未知')}</strong></div>
      <div><span>農曆</span><strong>${displayText(result.calendar.lunar.monthName)}${displayText(result.calendar.lunar.dayName)}</strong></div>
      <div><span>性別</span><strong>${result.input.gender === 'male' ? '乾造（男）' : '坤造（女）'}</strong></div>
      <div><span>日主</span><strong>${displayText(dayMaster)}（${displayText(result.strength.level)}）</strong></div>
    </section>
    <section class="responsive-section responsive-pillars-section">
      <h4>四柱主盤</h4>
      <div class="responsive-pillar-grid">${pillars}</div>
    </section>
    ${strength}
    ${luckCycles}
    ${shenSha}
    <footer>Produced by BaziJS Open Source Metaphysical Engine · Apache-2.0 License</footer>
  </div>`;
}

function downloadSvg() {
  if (!currentResult) return;
  const theme = document.getElementById('theme-select').value;
  const preset = document.getElementById('preset-select').value;
  const svgStr = Bazi.Renderer.render(currentResult, { format: 'svg', theme, preset });

  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bazi_${currentResult.input.birthDate}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

async function downloadPng() {
  if (!currentResult) return;
  const theme = document.getElementById('theme-select').value;
  const preset = document.getElementById('preset-select').value;

  try {
    const pngResult = await Bazi.Renderer.render(currentResult, { format: 'png', theme, preset });
    if (pngResult.dataUrl) {
      const a = document.createElement('a');
      a.href = pngResult.dataUrl;
      a.download = `bazi_${currentResult.input.birthDate}.png`;
      a.click();
    }
  } catch (err) {
    alert('PNG 轉出失敗: ' + err.message);
  }
}

function copyJson() {
  if (!currentResult) return;
  navigator.clipboard.writeText(JSON.stringify(currentResult, null, 2)).then(() => {
    alert('JSON 已複製至剪貼簿！');
  });
}

function copyAiContext() {
  if (!currentResult) return;
  const aiCtx = Bazi.AI.toContext(currentResult, { compact: false });
  navigator.clipboard.writeText(JSON.stringify(aiCtx, null, 2)).then(() => {
    alert('AI Context 已複製至剪貼簿，可直接提供給 LLM 作為系統提示！');
  });
}

window.addEventListener('DOMContentLoaded', init);
