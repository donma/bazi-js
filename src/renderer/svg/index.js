// SVG 排盤 Renderer 實作（Browser-only、純向量、零依賴）
// 規範要求：
// - 與核心引擎完全分離，僅消費 SDK 計算結果
// - 支援 full, mobile-share, a4, compact
// - 支援 modern-oriental, classic, dark
// - 視覺採現代東方高質感美學

import { getTheme } from '../themes/index.js';
import { getPreset } from '../presets/index.js';
import { STEMS, STEM_INDEX } from '../../core/constants/stems.js';

export function renderSvg(chartResult, options = {}) {
  const theme = getTheme(options.theme || 'modern-oriental');
  const preset = getPreset(options.preset || 'full');

  const { width, height } = preset;
  const p = chartResult.pillars;
  const res = chartResult;

  // 四柱資料陣列（年、月、日、時）
  const pillarCols = [
    { title: '時柱', data: p.hour, tenGod: res.tenGods.stems.hour, hidden: res.tenGods.hidden.hour, nayin: res.nayin.hour, stage: res.twelveStages.byDayMaster.hour },
    { title: '日柱', data: p.day,  tenGod: { full: '日主' },      hidden: res.tenGods.hidden.day,  nayin: res.nayin.day,  stage: res.twelveStages.byDayMaster.day },
    { title: '月柱', data: p.month,tenGod: res.tenGods.stems.month,hidden: res.tenGods.hidden.month,nayin: res.nayin.month,stage: res.twelveStages.byDayMaster.month },
    { title: '年柱', data: p.year, tenGod: res.tenGods.stems.year, hidden: res.tenGods.hidden.year, nayin: res.nayin.year, stage: res.twelveStages.byDayMaster.year }
  ];

  // 日主五行（修正：不得寫死為木）
  const dayMasterEl = (STEMS[STEM_INDEX[res.pillars.day.stem]] || {}).element || '';

  // SVG 模板拼接
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: ${theme.background}; font-family: -apple-system, BlinkMacSystemFont, 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <style>
      .title { font-size: 26px; font-weight: 700; fill: ${theme.textPrimary}; letter-spacing: 1.5px; }
      .subtitle { font-size: 13px; fill: ${theme.textSecondary}; font-weight: 500; }
      .meta-label { font-size: 13px; fill: ${theme.textMuted}; font-weight: 500; }
      .meta-value { font-size: 14px; fill: ${theme.textPrimary}; font-weight: 700; }
      .col-header { font-size: 15px; fill: ${theme.textSecondary}; text-anchor: middle; font-weight: 700; }
      .tengod { font-size: 15px; fill: ${theme.gold}; text-anchor: middle; font-weight: 700; }
      .ganzhi { font-size: 38px; font-weight: 700; text-anchor: middle; }
      .hidden-stem { font-size: 13px; fill: ${theme.textSecondary}; text-anchor: middle; font-weight: 500; }
      .badge-text { font-size: 12px; fill: ${theme.cardBg}; font-weight: 700; text-anchor: middle; }
      .section-title { font-size: 17px; font-weight: 700; fill: ${theme.accent}; letter-spacing: 1px; }
      .card { fill: ${theme.cardBg}; stroke: ${theme.border}; stroke-width: 1; rx: 6px; }
      .grid-box { fill: ${theme.gridBg}; stroke: ${theme.border}; stroke-width: 1; }
    </style>
  </defs>

  <!-- 背景底色與外邊框 -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="${theme.background}" />
  <rect x="16" y="16" width="${width - 32}" height="${height - 32}" fill="none" stroke="${theme.border}" stroke-width="1.5" rx="8" />

  <!-- 頂部 Header -->
  <g transform="translate(40, 50)">
    <text x="0" y="0" class="title">八字命盤 · 子平四柱</text>
    <text x="0" y="24" class="subtitle">BaziJS Metaphysical Engine v${res.meta.engineVersion} · 規範流派: ${res.meta.profileName}</text>
  </g>

  <!-- 基本資料資訊列（雙行排版，避免單行字串重疊發糊） -->
  <g transform="translate(40, 95)">
    <rect x="0" y="0" width="${width - 80}" height="88" class="card" />
    <g transform="translate(20, 30)">
      <text x="0" y="0" class="meta-label">公曆：</text>
      <text x="52" y="0" class="meta-value">${res.calendar.solar.year}年${res.calendar.solar.month}月${res.calendar.solar.day}日 ${res.input.birthTime || '未知'}</text>

      <text x="340" y="0" class="meta-label">農曆：</text>
      <text x="392" y="0" class="meta-value">${res.calendar.lunar.monthName}${res.calendar.lunar.dayName}</text>

      <text x="0" y="34" class="meta-label">性別：</text>
      <text x="52" y="34" class="meta-value">${res.input.gender === 'male' ? '乾造（男）' : '坤造（女）'}</text>

      <text x="340" y="34" class="meta-label">日主：</text>
      <text x="392" y="34" class="meta-value" fill="${theme.accent}">${res.pillars.day.stem}${dayMasterEl}（${res.strength.level}）</text>
    </g>
  </g>

  <!-- 四柱主盤表格 -->
  <g transform="translate(40, 195)">
    <rect x="0" y="0" width="${width - 80}" height="280" class="card" />
`;

  // 四欄寬度
  const colWidth = (width - 80) / 4;

  // 繪製四柱各欄
  pillarCols.forEach((col, idx) => {
    const x = idx * colWidth;
    const centerX = x + colWidth / 2;
    const stemChar = col.data.available !== false ? col.data.stem : '？';
    const branchChar = col.data.available !== false ? col.data.branch : '？';
    const tengodName = col.tenGod ? (col.tenGod.full || col.tenGod.short) : '—';
    const nayinName = col.nayin || '—';
    const stageName = col.stage ? col.stage.name : '—';

    svg += `
    <!-- 柱位 Header: ${col.title} -->
    <rect x="${x}" y="0" width="${colWidth}" height="36" class="grid-box" />
    <text x="${centerX}" y="23" class="col-header">${col.title}</text>

    <!-- 天干十神 -->
    <text x="${centerX}" y="62" class="tengod">${tengodName}</text>

    <!-- 天干字元 -->
    <text x="${centerX}" y="105" class="ganzhi" fill="${theme.textPrimary}">${stemChar}</text>

    <!-- 地支字元 -->
    <text x="${centerX}" y="152" class="ganzhi" fill="${theme.textPrimary}">${branchChar}</text>

    <!-- 藏干列表 -->
    <g transform="translate(${centerX}, 180)">
    `;

    if (col.hidden && col.hidden.length > 0) {
      col.hidden.forEach((h, hIdx) => {
        const tgShort = h.tenGod ? h.tenGod.short : '';
        svg += `<text x="0" y="${hIdx * 18}" class="hidden-stem">${h.stem} <tspan fill="${theme.textMuted}">(${tgShort})</tspan></text>`;
      });
    } else {
      svg += `<text x="0" y="0" class="hidden-stem">—</text>`;
    }

    svg += `
    </g>

    <!-- 納音與長生 -->
    <text x="${centerX}" y="248" class="meta-label" text-anchor="middle">納音: ${nayinName}</text>
    <text x="${centerX}" y="266" class="meta-label" text-anchor="middle">長生: ${stageName}</text>
    `;

    // 垂直分隔線
    if (idx > 0) {
      svg += `<line x1="${x}" y1="0" x2="${x}" y2="280" stroke="${theme.border}" stroke-width="1" />`;
    }
  });

  svg += `  </g>`;

  // 若 preset 包含強弱與五行
  if (preset.includeStrength) {
    const yOffset = 490;
    svg += `
    <!-- 五行強弱分析區塊 -->
    <g transform="translate(40, ${yOffset})">
      <rect x="0" y="0" width="${width - 80}" height="130" class="card" />
      <text x="24" y="32" class="section-title">五行氣數與強弱平衡</text>

      <g transform="translate(24, 52)">
        <text x="0" y="20" class="meta-label">日主旺衰得分：</text>
        <text x="90" y="20" class="meta-value" font-size="16px" fill="${theme.accent}">${res.strength.score} 分 · 【${res.strength.level}】</text>

        <text x="0" y="50" class="meta-label">喜用五行：</text>
        <text x="70" y="50" class="meta-value" fill="${theme.elementColors['木'] || theme.textPrimary}">${res.strength.favorableElements.join('、') || '無特別標記'}</text>

        <text x="220" y="50" class="meta-label">忌仇五行：</text>
        <text x="290" y="50" class="meta-value" fill="${theme.elementColors['火'] || theme.textPrimary}">${res.strength.unfavorableElements.join('、') || '無特別標記'}</text>
      </g>

      <!-- 五行佔比條形圖 -->
      <g transform="translate(420, 48)">
    `;

    const elementsList = ['木', '火', '土', '金', '水'];
    elementsList.forEach((el, eIdx) => {
      const elData = res.strength.distribution[el] || { percentage: 20 };
      const barY = eIdx * 14;
      const barW = Math.max(4, (elData.percentage / 100) * 200);
      const color = theme.elementColors[el] || theme.textPrimary;
      svg += `
        <text x="0" y="${barY + 10}" font-size="11px" fill="${color}">${el}</text>
        <rect x="24" y="${barY + 2}" width="200" height="9" fill="${theme.gridBg}" rx="2" />
        <rect x="24" y="${barY + 2}" width="${barW}" height="9" fill="${color}" rx="2" />
        <text x="232" y="${barY + 10}" font-size="10px" fill="${theme.textMuted}">${elData.percentage}%</text>
      `;
    });

    svg += `
      </g>
    </g>
    `;
  }

  // 大運區塊（若 preset 包含）
  if (preset.includeLuckCycles && res.luckCycles) {
    const yOffset = 635;
    const cardW = width - 80;
    const stepW = Math.min(80, (cardW - 40) / Math.min(8, res.luckCycles.cycles.length));

    svg += `
    <!-- 大運走勢區塊 -->
    <g transform="translate(40, ${yOffset})">
      <rect x="0" y="0" width="${cardW}" height="160" class="card" />
      <text x="24" y="32" class="section-title">起運走勢（${res.luckCycles.directionText} · ${res.luckCycles.startAge.display}起運）</text>
      <g transform="translate(24, 50)">
    `;

    res.luckCycles.cycles.slice(0, 8).forEach((cyc, idx) => {
      const bx = idx * stepW;
      const bCenterX = bx + stepW / 2;
      svg += `
        <rect x="${bx}" y="0" width="${stepW - 6}" height="92" class="grid-box" rx="4" />
        <text x="${bCenterX - 3}" y="20" font-size="12px" font-weight="600" fill="${theme.textSecondary}" text-anchor="middle">${cyc.fromAge}歲</text>
        <text x="${bCenterX - 3}" y="48" font-size="19px" font-weight="bold" fill="${theme.textPrimary}" text-anchor="middle">${cyc.ganzhi}</text>
        <text x="${bCenterX - 3}" y="68" font-size="12px" font-weight="600" fill="${theme.gold}" text-anchor="middle">${cyc.tenGodStem ? cyc.tenGodStem.short : ''}</text>
        <text x="${bCenterX - 3}" y="84" font-size="11px" fill="${theme.textSecondary}" text-anchor="middle">${cyc.fromYear}年</text>
      `;
    });

    svg += `
      </g>
    </g>
    `;
  }

  // 神煞與四宮胎命區塊（若空間允許）
  // 神煞名以「、」連接並按卡片寬度自動換行，避免長串溢出卡片
  if (preset.includeShenSha && height >= 900) {
    const yOffset = 800;
    const cardW = width - 80;
    const maxCharsPerLine = Math.max(18, Math.floor((cardW - 130) / 13.5));
    // 行數上限：保證卡片不超出版面，超出的以「等共X顆」收尾（完整清單見 Lab）
    const cap = (lines, total, maxL) => {
      if (lines.length <= maxL) return lines;
      const cut = lines.slice(0, maxL);
      cut[maxL - 1] += `（等共${total}顆）`;
      return cut;
    };
    const wrapNames = (list, limit) => {
      const names = (list || []).slice(0, limit).map((s) => `${s.name}(${s.hitOn.join('/')})`);
      if (names.length === 0) return ['—'];
      const lines = [];
      let cur = '';
      for (const n of names) {
        const piece = cur ? '、 ' + n : n;
        if ((cur + piece).length > maxCharsPerLine && cur) {
          lines.push(cur);
          cur = n;
        } else {
          cur += piece;
        }
      }
      if (cur) lines.push(cur);
      return lines;
    };
    const natalLines = cap(wrapNames(res.shenSha, 14), (res.shenSha || []).length, 3);
    const yearList = res.transits && res.transits.shenShaYear ? res.transits.shenShaYear : [];
    const yearSSLines = cap(wrapNames(yearList, 10), yearList.length, 1);
    const firstLuck = res.luckCycles.cycles[0];
    const luckList = firstLuck && firstLuck.shenSha ? firstLuck.shenSha : [];
    const luckSSLines = cap(wrapNames(luckList, 10), luckList.length, 1);
    const luckLabel = firstLuck ? `${firstLuck.ganzhi}運：` : '';

    const rowGap = 24;
    const blockRows = 1 + natalLines.length + yearSSLines.length + luckSSLines.length;
    const cardH = 50 + blockRows * rowGap + 26;

    let shenShaInner = '';
    let ry = 0;
    const addRow = (label, lines) => {
      lines.forEach((ln, li) => {
        shenShaInner += `
        <text x="0" y="${ry}" class="meta-label">${li === 0 ? label : ''}</text>
        <text x="82" y="${ry}" class="meta-value" font-size="13px">${ln}</text>`;
        ry += rowGap;
      });
    };
    addRow('原局神煞：', natalLines);
    addRow('流年神煞：', yearSSLines);
    addRow('初運神煞：', luckSSLines.map((ln, li) => (li === 0 ? luckLabel + ln : ln)));

    svg += `
    <!-- 神煞與附宮 -->
    <g transform="translate(40, ${yOffset})">
      <rect x="0" y="0" width="${cardW}" height="${cardH}" class="card" />
      <text x="24" y="30" class="section-title">神煞吉凶與命宮身宮</text>
      <g transform="translate(24, 52)">
        ${shenShaInner}
        <text x="0" y="${ry}" class="meta-label">胎元命宮：</text>
        <text x="82" y="${ry}" class="meta-value" font-size="13px">胎元: ${res.auxiliary.taiYuan ? res.auxiliary.taiYuan.ganzhi : '—'} ｜ 胎息: ${res.auxiliary.taiXi ? res.auxiliary.taiXi.ganzhi : '—'} ｜ 命宮: ${res.auxiliary.mingGong ? res.auxiliary.mingGong.ganzhi : '—'} ｜ 身宮: ${res.auxiliary.shenGong ? res.auxiliary.shenGong.ganzhi : '—'}</text>
      </g>
    </g>
    `;
  }

  // 底部版權落款
  svg += `
  <text x="${width / 2}" y="${height - 24}" font-size="11px" fill="${theme.textMuted}" text-anchor="middle">
    Produced by BaziJS Open Source Metaphysical Engine · Apache-2.0 License
  </text>
</svg>`;

  return svg;
}
