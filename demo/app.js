// Demo 互動邏輯（引用 dist/bazi-sdk.js 全域 Bazi，支援雙擊 file:// 開啟）
/* global Bazi */

let currentResult = null;
// file:// 與 http:// 預覽共用同一個 DOM 渲染路徑，避免依 viewport 切換造成兩種畫面。
let responsivePreview = true;

const LAST_INPUT_STORAGE_KEY = 'bazijs.demo.last-input.v1';
const VALID_TIME_MODES = ['exact', 'branch', 'unknown'];

function setStorageStatus(message, isError = false) {
  const status = document.getElementById('storage-status');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('is-error', isError);
}

function getLocalStorage() {
  try {
    return window.localStorage;
  } catch (error) {
    return null;
  }
}

function loadLastInput() {
  const storage = getLocalStorage();
  if (!storage) {
    setStorageStatus('此瀏覽器未允許使用儲存空間，資料不會被保存。', true);
    return null;
  }

  try {
    const raw = storage.getItem(LAST_INPUT_STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== 'object') return null;
    if (typeof saved.birthDate !== 'string' || !['male', 'female'].includes(saved.gender)) return null;
    if (!VALID_TIME_MODES.includes(saved.birthTimeMode)) return null;
    return saved;
  } catch (error) {
    try {
      storage.removeItem(LAST_INPUT_STORAGE_KEY);
    } catch (removeError) {
      // 儲存空間不可寫入時，維持預設表單即可。
    }
    return null;
  }
}

function saveLastInput(input) {
  const storage = getLocalStorage();
  if (!storage) {
    setStorageStatus('此瀏覽器未允許使用儲存空間，資料不會被保存。', true);
    return false;
  }

  const payload = {
    birthDate: input.birthDate,
    gender: input.gender,
    birthTimeMode: input.birthTimeMode,
    birthTime: input.birthTime || '',
    birthHourBranch: input.birthHourBranch || '',
    timezone: input.timezone,
    trueSolarTime: Boolean(input.trueSolarTime),
    longitude: input.location && Number.isFinite(input.location.longitude) ? input.location.longitude : 121.5654
  };

  try {
    storage.setItem(LAST_INPUT_STORAGE_KEY, JSON.stringify(payload));
    setStorageStatus('已儲存本次輸入，下次開啟此頁面會自動帶入。');
    return true;
  } catch (error) {
    setStorageStatus('無法儲存本次輸入，可能是瀏覽器儲存空間已被停用。', true);
    return false;
  }
}

function restoreLastInput(saved) {
  if (!saved) return;

  const birthDate = document.getElementById('birthDate');
  const birthTime = document.getElementById('birthTime');
  const birthHourBranch = document.getElementById('birthHourBranch');
  const timezone = document.getElementById('timezone');
  const longitude = document.getElementById('longitude');
  const trueSolarTime = document.getElementById('trueSolarTime');

  if (saved.birthDate) birthDate.value = saved.birthDate;
  if (saved.birthTime) birthTime.value = saved.birthTime;
  if (saved.birthHourBranch && [...birthHourBranch.options].some((option) => option.value === saved.birthHourBranch)) {
    birthHourBranch.value = saved.birthHourBranch;
  }
  if (saved.timezone && [...timezone.options].some((option) => option.value === saved.timezone)) {
    timezone.value = saved.timezone;
  }
  if (Number.isFinite(Number(saved.longitude))) longitude.value = saved.longitude;
  trueSolarTime.checked = saved.trueSolarTime === true;

  document.querySelectorAll('#gender-control button').forEach((button) => {
    button.classList.toggle('active', button.getAttribute('data-val') === saved.gender);
  });
  document.getElementById('gender').value = saved.gender;

  const mode = VALID_TIME_MODES.includes(saved.birthTimeMode) ? saved.birthTimeMode : 'exact';
  document.querySelectorAll('#time-mode-control button').forEach((button) => {
    button.classList.toggle('active', button.getAttribute('data-val') === mode);
  });
  document.getElementById('exact-time-group').style.display = mode === 'exact' ? 'block' : 'none';
  document.getElementById('branch-time-group').style.display = mode === 'branch' ? 'block' : 'none';
  document.getElementById('location-group').style.display = saved.trueSolarTime === true ? 'block' : 'none';
}

function init() {
  const savedInput = loadLastInput();
  restoreLastInput(savedInput);

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

  const res = Bazi.calculateSafe(input, {
    includeLuckAnnualDetails: true,
    includeAnnualLuckShenSha: true
  });
  if (!res.success) {
    alert('排盤錯誤: ' + res.error.message);
    return;
  }

  currentResult = res.data;
  saveLastInput(input);
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
    chartHint.textContent = '直式閱讀版：文字不縮放、無需水平捲軸；SVG／PNG 下載會保留同一份完整資料。';
  } else {
    const svgStr = Bazi.Renderer.render(currentResult, {
      format: 'svg',
      theme,
      preset
    });
    chartContainer.innerHTML = svgStr;
    chartHint.textContent = '窄螢幕會自動換行，文字保持清楚，不需要水平捲軸。';
  }
  document.getElementById('json-output').textContent = JSON.stringify(getExportResult(), null, 2);
}

function getPresentationOptions() {
  return {
    theme: document.getElementById('theme-select').value,
    preset: document.getElementById('preset-select').value,
    preview: responsivePreview ? 'responsive-html' : 'sdk-svg',
    watermark: {
      label: '當麻實驗室',
      url: 'https://github.com/donma/bazi-js'
    }
  };
}

function getExportResult() {
  return {
    ...currentResult,
    presentation: getPresentationOptions(),
    exportInfo: {
      schema: 'bazijs.demo.export.v2',
      source: 'current-chart-result',
      sameDataAsPreview: true,
      note: '此物件保留目前畫面使用的完整 SDK Result；presentation 只描述顯示設定。'
    }
  };
}

function copyText(text, successMessage) {
  const done = () => alert(successMessage);
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(text).then(done).catch(() => copyTextFallback(text, successMessage));
    return;
  }
  copyTextFallback(text, successMessage);
}

function copyTextFallback(text, successMessage) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    if (document.execCommand('copy')) alert(successMessage);
    else alert('目前瀏覽器不允許複製，請手動選取內容。');
  } finally {
    textarea.remove();
  }
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

const PILLAR_LABELS = { year: '年柱', month: '月柱', day: '日柱', hour: '時柱' };
const BASE_LABELS = {
  yearStem: '年干',
  monthStem: '月干',
  dayStem: '日干',
  yearBranch: '年支',
  monthBranch: '月支',
  dayBranch: '日支',
  yearPillar: '年柱',
  dayPillar: '日柱',
  hourPillar: '時柱',
  wholeChart: '整局'
};

function formatPillarLabel(value) {
  if (!value) return '—';
  if (PILLAR_LABELS[value]) return PILLAR_LABELS[value];
  if (value === 'transit-year') return '流年';
  const luckMatch = String(value).match(/^luck-(\d+)$/);
  if (luckMatch) return `初運第${luckMatch[1]}步`;
  return value;
}

function formatHitOn(hitOn) {
  return (hitOn || []).map(formatPillarLabel).join('／');
}

function formatBasedOn(basedOn) {
  return (basedOn || []).map((value) => BASE_LABELS[value] || value).join('、');
}

function formatShenSha(list, limit = 14) {
  const names = (list || []).slice(0, limit).map((item) => {
    const hitOn = Array.isArray(item.hitOn) && item.hitOn.length ? `（${formatHitOn(item.hitOn)}）` : '';
    return `${item.displayName || item.name || ''}${hitOn}`;
  });
  if (!names.length) return '—';
  const suffix = (list || []).length > limit ? `……（共${list.length}顆）` : '';
  return `${names.join('、 ')}${suffix}`;
}

function formatSpecialRules(list) {
  if (!list || !list.length) return '— 本命盤沒有命中特殊柱位或季節條件';
  return list.map((item) => {
    const evidence = item.evidence || {};
    const basis = formatBasedOn(item.baseOn || item.basedOn);
    const season = evidence.season ? `季節：${evidence.season === 'spring' ? '春' : evidence.season === 'summer' ? '夏' : evidence.season === 'autumn' ? '秋' : '冬'}（月令${evidence.monthBranch || '—'}）` : '';
    const target = evidence.targetValue ? `命中：${evidence.targetValue}` : '';
    return `${item.name || item.displayName || ''}（${basis}）${[target, season].filter(Boolean).join('，')}`;
  }).join('、 ');
}

const SHENSHA_CATEGORY_LABELS = { auspicious: '吉', inauspicious: '凶', neutral: '中性' };
const SHENSHA_CONFIDENCE_LABELS = {
  classical: '經典',
  traditional: '傳統',
  'modern-common': '通行',
  'school-specific': '流派',
  folk: '民俗',
  experimental: '實驗'
};
const HIDDEN_ROLE_LABELS = { primary: '本氣', secondary: '中氣', residual: '餘氣' };

function renderPillarShenSha(items) {
  if (!items || !items.length) return '<p class="responsive-shensha-empty">— 此柱無命中神煞</p>';
  return `<ul class="responsive-pillar-shensha-list">${items.map((item) => {
    const category = SHENSHA_CATEGORY_LABELS[item.category] || item.category || '—';
    const confidence = SHENSHA_CONFIDENCE_LABELS[item.confidence] || item.confidence || '—';
    const evidence = (item.evidence && item.evidence.details || []).map((detail) => {
      const base = detail.baseValue ? `基準 ${detail.baseValue}` : '';
      const target = detail.targetValue ? `命中 ${detail.targetValue}` : '';
      return `<li>${displayText([base, target, detail.reason].filter(Boolean).join(' · '), '符合規則')}</li>`;
    }).join('');
    return `<li class="responsive-pillar-shensha-item">
      <div class="responsive-shensha-name"><strong>${displayText(item.displayName || item.name)}</strong><span>${displayText(category)} · ${displayText(confidence)}</span></div>
      <div class="responsive-shensha-meta">基準：${displayText(formatBasedOn(item.basedOn))}</div>
      <div class="responsive-shensha-reference">依據：${displayText(item.reference, '未提供')}</div>
      ${evidence ? `<details><summary>判定證據（${(item.evidence.details || []).length} 筆）</summary><ul>${evidence}</ul></details>` : ''}
    </li>`;
  }).join('')}</ul>`;
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
  const shenShaByPillar = Bazi.ShenSha.groupShenShaByPillar(result.shenSha || []);
  const pillarCols = [
    { key: 'year', title: '年柱', data: p.year, tenGod: result.tenGods.stems.year, hidden: result.tenGods.hidden.year, nayin: result.nayin.year, stage: result.twelveStages.byDayMaster.year, selfStage: result.twelveStages.selfSeated.year },
    { key: 'month', title: '月柱', data: p.month, tenGod: result.tenGods.stems.month, hidden: result.tenGods.hidden.month, nayin: result.nayin.month, stage: result.twelveStages.byDayMaster.month, selfStage: result.twelveStages.selfSeated.month },
    { key: 'day', title: '日柱', data: p.day, tenGod: { full: '日主' }, hidden: result.tenGods.hidden.day, nayin: result.nayin.day, stage: result.twelveStages.byDayMaster.day, selfStage: result.twelveStages.selfSeated.day },
    { key: 'hour', title: '時柱', data: p.hour, tenGod: result.tenGods.stems.hour, hidden: result.tenGods.hidden.hour, nayin: result.nayin.hour, stage: result.twelveStages.byDayMaster.hour, selfStage: result.twelveStages.selfSeated.hour }
  ];

  const elementColors = theme.elementColors || {};
  const elementBars = ['木', '火', '土', '金', '水'].map((element) => {
    const data = result.strength.distribution[element] || { percentage: 0 };
    const state = result.strength.seasonalStates && result.strength.seasonalStates[element];
    const percentage = Number(data.percentage) || 0;
    return `<div class="responsive-element-row">
      <span class="responsive-element-name" style="color:${elementColors[element] || theme.textPrimary}">${element}<small>${displayText(state && state.name, '')}</small></span>
      <span class="responsive-element-track"><span style="width:${Math.min(100, Math.max(0, percentage))}%;background:${elementColors[element] || theme.textPrimary}"></span></span>
      <strong>${percentage}%</strong>
    </div>`;
  }).join('');

  const pillars = pillarCols.map((col) => {
    const available = col.data && col.data.available !== false;
    const xunkong = available && Bazi.ShenSha.calculateXunKong(col.data.ganzhi).emptyBranches.join('') || '—';
    const hidden = (col.hidden || []).map((item) => `<li><strong>${displayText(item.stem)}</strong> <small>${displayText(item.tenGod && item.tenGod.full, '')} · ${displayText(HIDDEN_ROLE_LABELS[item.role] || item.role, '')} · ${displayText(item.days, '')}日/${Math.round((Number(item.weight) || 0) * 100)}%</small></li>`).join('');
    const shensha = shenShaByPillar[col.key] || [];
    return `<article class="responsive-pillar">
      <header>${displayText(col.title)}</header>
      <div class="responsive-pillar-primary"><span>主星</span><strong>${displayText(col.tenGod && (col.tenGod.full || col.tenGod.short))}</strong></div>
      <div class="responsive-pillar-characters"><div><span>天干</span><strong>${available ? displayText(col.data.stem) : '？'}</strong></div><div><span>地支</span><strong>${available ? displayText(col.data.branch) : '？'}</strong></div></div>
      <div class="responsive-pillar-field"><span>藏幹</span><ul>${hidden || '<li>—</li>'}</ul></div>
      <div class="responsive-pillar-meta"><div><span>地勢</span>${displayText(col.stage && col.stage.name)}</div><div><span>自坐</span>${displayText(col.selfStage && col.selfStage.name)}</div><div><span>空亡</span>${displayText(xunkong)}</div><div><span>納音</span>${displayText(col.nayin)}</div></div>
      <div class="responsive-pillar-shensha"><h5>神煞（${shensha.length}）</h5>${renderPillarShenSha(shensha)}</div>
    </article>`;
  }).join('');

  const currentYear = new Date().getFullYear();
  const visibleLuckCycles = result.luckCycles ? result.luckCycles.cycles.slice(0, 8) : [];
  const currentLuckCycle = visibleLuckCycles.find((cycle) => currentYear >= Number(cycle.fromYear) && currentYear <= Number(cycle.toYear));
  const luckCycles = preset.includeLuckCycles && result.luckCycles
    ? `<section class="responsive-section">
        <h4>起運走勢 <span>（${displayText(result.luckCycles.directionText)} · ${displayText(result.luckCycles.startAge.display)}起運${currentLuckCycle ? ` · ${currentYear}年已自動展開` : ''}）</span></h4>
        <div class="responsive-luck-grid">${visibleLuckCycles.map((cycle) => {
          const isCurrentCycle = currentLuckCycle === cycle;
          return `<article class="${isCurrentCycle ? 'is-current-cycle' : ''}"${isCurrentCycle ? ` aria-label="${currentYear}年所在大運，已自動展開"` : ''}>
          <span>${displayText(cycle.nominalFromAge ?? cycle.fromAge)}歲起</span>
          <strong>${displayText(cycle.ganzhi)}</strong>
          <small>${displayText(cycle.tenGodStem && cycle.tenGodStem.short)}</small>
          <em>${displayText(cycle.fromYear)}-${displayText(cycle.toYear)}</em>
          <small class="responsive-luck-shensha">神煞：${displayText(formatShenSha(cycle.shenSha, 5))}</small>
          ${Array.isArray(cycle.annuals) ? `<details class="responsive-luck-annuals"${isCurrentCycle ? ' open' : ''}><summary>${isCurrentCycle ? `${currentYear}年所在大運 · ` : ''}展開逐年資料（${cycle.annuals.length} 年）</summary><div class="responsive-annual-list">${cycle.annuals.map((annual) => {
            const isCurrentYear = Number(annual.year) === currentYear;
            return `<div class="responsive-annual-item${isCurrentYear ? ' is-current-year' : ''}"${isCurrentYear ? ` aria-label="${currentYear}年流年"` : ''}><div><strong>${displayText(annual.age)}歲 · ${displayText(annual.year)}年 · ${displayText(annual.ganzhi)}</strong>${isCurrentYear ? '<span class="responsive-current-badge">今年</span>' : ''}<span>${displayText(annual.tenGod && (annual.tenGod.full || annual.tenGod.short))} · ${displayText(annual.stage && annual.stage.name)} · ${displayText(annual.nayin)}</span></div><p>互動：${displayText((annual.interactions || []).map((item) => item.description || item.name).join('、'))}<br>神煞：${displayText(formatShenSha(annual.shenSha, 8))}</p></div>`;
          }).join('')}</div></details>` : ''}
        </article>`;
        }).join('')}</div>
      </section>`
    : '';

  const transitYear = result.transits && result.transits.year;
  const transitShenSha = result.transits && (result.transits.shenShaYear || (transitYear && transitYear.shenSha)) || [];
  const transitSection = preset.includeShenSha && transitYear
    ? `<section class="responsive-section responsive-transit">
        <h4>流年詳細</h4>
        <div class="responsive-transit-grid">
          <div><span>流年</span><strong>${displayText(transitYear.ganzhi)}</strong></div>
          <div><span>十神</span><strong>${displayText(transitYear.tenGod && (transitYear.tenGod.full || transitYear.tenGod.short))}</strong></div>
          <div><span>地勢</span><strong>${displayText(transitYear.stage && transitYear.stage.name)}</strong></div>
          <div><span>納音</span><strong>${displayText(transitYear.nayin)}</strong></div>
        </div>
        <div class="responsive-transit-shensha"><strong>流年神煞（${transitShenSha.length}）</strong><p>${displayText(formatShenSha(transitShenSha, 20))}</p></div>
      </section>`
    : '';

  const interactionItems = [
    ...(result.interactions && result.interactions.stems || []).map((item) => `天干：${item.name}`),
    ...(result.interactions && result.interactions.branches || []).map((item) => `地支：${item.name}`)
  ];
  const interactions = preset.includeInteractions && interactionItems.length
    ? `<section class="responsive-section responsive-interactions">
        <h4>天干地支互動</h4>
        <ul>${interactionItems.map((item) => `<li>${displayText(item)}</li>`).join('')}</ul>
      </section>`
    : '';

  const elementStates = result.strength.monthState
    ? `<div class="responsive-month-state"><strong>月令旺衰</strong><span>月支 ${displayText(result.strength.monthState.branch)}：${displayText(result.strength.monthState.name)}（係數 ${displayText(result.strength.monthState.factor)}）</span></div>`
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

  const specialRules = preset.includeShenSha
    ? `<section class="responsive-section responsive-special-rules">
        <h4>特殊柱位與季節條件</h4>
        <div class="responsive-detail-list">
          <div><strong>命中結果</strong><p>${escapeHtml(formatSpecialRules(result.specialRules))}</p></div>
          ${(result.specialRules || []).map((item) => {
            const evidence = item.evidence || {};
            const season = evidence.season ? `季節：${evidence.season === 'spring' ? '春' : evidence.season === 'summer' ? '夏' : evidence.season === 'autumn' ? '秋' : '冬'}（月令${evidence.monthBranch || '—'}）` : '';
            const evidenceText = [
              `基準：${formatBasedOn(item.baseOn)}`,
              evidence.targetValue ? `命中：${evidence.targetValue}` : '',
              season,
            ].filter(Boolean).join(' · ');
            return `<div><strong>${displayText(item.name || item.displayName)}</strong><p>${displayText(evidenceText)}<br><small>${displayText(item.description, '—')}</small></p></div>`;
          }).join('')}
        </div>
      </section>`
    : '';

  const strength = preset.includeStrength
    ? `<section class="responsive-section">
        <h4>五行分析 · 氣數與強弱平衡</h4>
        <div class="responsive-strength-summary">
          <p><strong>日主旺衰得分</strong><span>${displayText(result.strength.score)} 分 · 【${displayText(result.strength.level)}】</span></p>
          <p><strong>喜用五行</strong><span>${displayText((result.strength.favorableElements || []).join('、'))}</span></p>
          <p><strong>忌仇五行</strong><span>${displayText((result.strength.unfavorableElements || []).join('、'))}</span></p>
        </div>
        ${elementStates}
        <div class="responsive-element-bars">${elementBars}</div>
        <details class="responsive-evidence-details"><summary>查看強弱判定 evidence（${(result.strength.evidence || []).length} 筆）</summary><ul>${(result.strength.evidence || []).map((item) => `<li><strong>${displayText(item.ruleId)}</strong> ${displayText(item.reason)}</li>`).join('')}</ul></details>
      </section>`
    : '';

  const useGod = preset.includeStrength
    ? `<section class="responsive-section responsive-use-god">
        <h4>用神模型</h4>
        <p class="responsive-model-note">以下為 BaziJS canonical 扶抑模型的可追溯摘要，不是 sample1 的固定斷語或醫療、財務建議。</p>
        <div class="responsive-use-god-grid">
          <div><strong>扶助方向</strong><span>${displayText((result.strength.favorableElements || []).join('、'))}</span></div>
          <div><strong>忌仇方向</strong><span>${displayText((result.strength.unfavorableElements || []).join('、'))}</span></div>
          <div><strong>得令／得地／得勢</strong><span>${displayText([result.strength.deLing ? '得令' : '不得令', result.strength.deDi ? '得地' : '不得地', result.strength.deShi ? '得勢' : '不得勢'].join('、'))}</span></div>
          <div><strong>月令司令</strong><span>${displayText(result.strength.monthCommander ? `${result.strength.monthCommander.stem}${result.strength.monthCommander.element}（第${result.strength.monthCommander.phase}段）` : '—')}</span></div>
        </div>
      </section>`
    : '';

  const dayMasterStem = result.pillars.day.stem;
  const stem = (Bazi.Constants.STEMS || []).find((item) => item.char === dayMasterStem);
  const dayMaster = `${dayMasterStem}${stem ? stem.element : ''}`;
  const zodiacNames = { 子: '鼠', 丑: '牛', 寅: '虎', 卯: '兔', 辰: '龍', 巳: '蛇', 午: '馬', 未: '羊', 申: '猴', 酉: '雞', 戌: '狗', 亥: '豬' };
  const seasonNames = { 寅: '春', 卯: '春', 辰: '春', 巳: '夏', 午: '夏', 未: '夏', 申: '秋', 酉: '秋', 戌: '秋', 亥: '冬', 子: '冬', 丑: '冬' };
  const yearStemInfo = (Bazi.Constants.STEMS || []).find((item) => item.char === result.pillars.year.stem) || {};
  const prevJie = result.calendar.solarTerms && result.calendar.solarTerms.prevJie;
  const infoItems = [
    ['公曆', `${result.calendar.solar.year}年${result.calendar.solar.month}月${result.calendar.solar.day}日 ${result.input.birthTime || '未知'}`],
    ['農曆', `${result.calendar.lunar.monthName}${result.calendar.lunar.dayName}`],
    ['乾造', result.input.gender === 'male' ? '男' : '女'],
    ['陰陽', yearStemInfo.yinYang === 'yang' ? '陽' : '陰'],
    ['生肖', zodiacNames[result.pillars.year.branch] || '—'],
    ['星座', result.calendar.constellation ? result.calendar.constellation.name : '—'],
    ['節氣', prevJie ? prevJie.name : '—'],
    ['季節', seasonNames[result.pillars.month.branch] || '—'],
    ['司令', result.strength.monthCommander ? `${result.strength.monthCommander.stem}${result.strength.monthCommander.element}` : '—'],
    ['日主', `${dayMaster}（${result.strength.level}）`],
    ['月令格局', `${result.tenGods.stems.month ? result.tenGods.stems.month.full : '—'}格`],
    ['強弱分數', `${result.strength.score} 分`],
    ['五行月令', result.strength.monthState ? result.strength.monthState.name : '—'],
    ['命宮', result.auxiliary.mingGong ? result.auxiliary.mingGong.ganzhi : '—'],
    ['身宮', result.auxiliary.shenGong ? result.auxiliary.shenGong.ganzhi : '—'],
    ['胎元', result.auxiliary.taiYuan ? result.auxiliary.taiYuan.ganzhi : '—'],
    ['胎息', result.auxiliary.taiXi ? result.auxiliary.taiXi.ganzhi : '—'],
    ['起運', result.luckCycles && result.luckCycles.startAge ? `${result.luckCycles.startAge.display}${result.luckCycles.startAge.startDateTime ? `（${result.luckCycles.startAge.startDateTime}）` : ''}` : '—'],
    ['規則版本', `神煞 ${result.meta.shenShaRuleVersion || '—'}`]
  ];
  const basicInfo = infoItems.map(([label, value]) => `<div><span>${displayText(label)}</span><strong>${displayText(value)}</strong></div>`).join('');

  return `<div class="responsive-chart" style="${styles}">
    <header class="responsive-chart-header">
      <h3>八字命盤 · 子平四柱</h3>
      <p>BaziJS 命理引擎 v${displayText(result.meta.engineVersion)} · 規範流派：${displayText(result.meta.profileName)}</p>
    </header>
    <section class="responsive-info-grid">${basicInfo}</section>
    <section class="responsive-section responsive-pillars-section">
      <h4>四柱主盤</h4>
      <div class="responsive-pillar-grid">${pillars}</div>
    </section>
    ${specialRules}
    ${strength}
    ${useGod}
    ${luckCycles}
    ${transitSection}
    ${interactions}
    ${shenSha}
    <div class="responsive-watermark" aria-hidden="true">當麻實驗室 · github.com/donma/bazi-js</div>
    <footer>BaziJS 開源命理引擎 · Apache-2.0 授權</footer>
  </div>`;
}

function downloadSvg() {
  if (!currentResult) return;
  const presentation = getPresentationOptions();
  const svgStr = Bazi.Renderer.render(getExportResult(), {
    format: 'svg', theme: presentation.theme, preset: presentation.preset
  });

  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `bazi_${currentResult.input.birthDate}.svg`, true);
}

async function downloadPng() {
  if (!currentResult) return;
  const presentation = getPresentationOptions();

  try {
    const pngResult = await Bazi.Renderer.render(getExportResult(), {
      format: 'png', theme: presentation.theme, preset: presentation.preset
    });
    if (pngResult.blob) {
      const url = URL.createObjectURL(pngResult.blob);
      triggerDownload(url, `bazi_${currentResult.input.birthDate}.png`, true);
    } else if (pngResult.dataUrl) {
      triggerDownload(pngResult.dataUrl, `bazi_${currentResult.input.birthDate}.png`);
    }
  } catch (err) {
    alert('PNG 轉出失敗: ' + err.message);
  }
}

function triggerDownload(href, filename, revoke = false) {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  link.setAttribute('aria-label', `下載 ${filename}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  if (revoke) window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}

function copyJson() {
  if (!currentResult) return;
  copyText(JSON.stringify(getExportResult(), null, 2), 'JSON 已複製至剪貼簿！');
}

function copyAiContext() {
  if (!currentResult) return;
  const aiCtx = Bazi.AI.toContext(currentResult, {
    compact: false,
    includeLuckAnnualDetails: true,
    maxLuckCycles: 10
  });
  aiCtx.presentation = getPresentationOptions();
  aiCtx.exportInfo = {
    schema: 'bazijs.demo.ai-context-export.v2',
    source: 'current-chart-result',
    sameDataAsPreview: true,
    note: '此 Context 已包含畫面顯示的完整柱位、流年、大運神煞與判定證據。'
  };
  copyText(JSON.stringify(aiCtx, null, 2), 'AI Context 已複製至剪貼簿，可直接提供給 LLM 作為系統提示！');
}

window.addEventListener('DOMContentLoaded', init);
