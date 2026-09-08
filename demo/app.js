// Demo 互動邏輯（引用 dist/bazi-sdk.js 全域 Bazi，支援雙擊 file:// 開啟）
/* global Bazi */

let currentResult = null;

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

  const svgStr = Bazi.Renderer.render(currentResult, {
    format: 'svg',
    theme,
    preset
  });

  document.getElementById('chart-container').innerHTML = svgStr;
  document.getElementById('json-output').textContent = JSON.stringify(currentResult, null, 2);
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
