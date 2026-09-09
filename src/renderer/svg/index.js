// SVG 排盤 Renderer 實作（Browser/Node 共用、純向量）
//
// 匯出圖必須與 demo 的完整直式預覽保持同一份資料範圍：
// - 不縮小四柱文字來塞進固定寬度表格
// - 不用固定高度，避免下方神煞、流年或 evidence 被裁切
// - 每個 preset 只控制要不要顯示該區塊，顯示的資料完整保留

import { getTheme } from '../themes/index.js';
import { getPreset } from '../presets/index.js';
import { STEMS, STEM_INDEX } from '../../core/constants/stems.js';
import { calculateXunKong, groupShenShaByPillar } from '../../shensha/index.js';

const PILLAR_LABELS = {
  year: '年柱', month: '月柱', day: '日柱', hour: '時柱', 'transit-year': '流年'
};

const BASE_LABELS = {
  yearStem: '年干', monthStem: '月干', dayStem: '日干',
  yearBranch: '年支', monthBranch: '月支', dayBranch: '日支',
  yearPillar: '年柱', dayPillar: '日柱', hourPillar: '時柱', wholeChart: '整局'
};

const CATEGORY_LABELS = { auspicious: '吉', inauspicious: '凶', neutral: '中性' };
const CONFIDENCE_LABELS = {
  classical: '經典', traditional: '傳統', 'modern-common': '通行',
  'school-specific': '流派', folk: '民俗', experimental: '實驗'
};

function escapeXml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
  }[char]));
}
function formatPillarLabel(value) {
  if (PILLAR_LABELS[value]) return PILLAR_LABELS[value];
  const luckMatch = String(value ?? '').match(/^luck-(\d+)$/);
  if (luckMatch) return `初運第${luckMatch[1]}步`;
  return value || '—';
}

function formatBasedOn(values = []) {
  return values.map((value) => BASE_LABELS[value] || formatPillarLabel(value)).join('、');
}

function displayName(item) {
  return item && (item.displayName || item.name) || '—';
}

function formatHitOn(hitOn = []) {
  return hitOn.map(formatPillarLabel).join('／');
}

function formatShenShaName(item) {
  const hitOn = item && item.hitOn && item.hitOn.length ? `（${formatHitOn(item.hitOn)}）` : '';
  return `${displayName(item)}${hitOn}`;
}

function shenShaToneClass(category) {
  if (category === 'auspicious') return 'shensha-auspicious';
  if (category === 'inauspicious') return 'shensha-inauspicious';
  if (category === 'neutral') return 'shensha-neutral';
  return 'body-strong';
}

function formatShenShaList(list = []) {
  return list.length ? list.map(formatShenShaName).join('、 ') : '—';
}

// SVG 的字體寬度依中英文做保守估算，避免長字串超出卡片。
function wrapText(value, maxUnits = 44) {
  const text = String(value ?? '—');
  const lines = [];
  let line = '';
  let units = 0;
  for (const char of text) {
    if (char === '\n') {
      lines.push(line || '—');
      line = '';
      units = 0;
      continue;
    }
    const charUnits = /[\u0000-\u00ff]/.test(char) ? 0.58 : 1;
    if (line && units + charUnits > maxUnits) {
      lines.push(line);
      line = char;
      units = charUnits;
    } else {
      line += char;
      units += charUnits;
    }
  }
  if (line || !lines.length) lines.push(line || '—');
  return lines;
}

function textNode(x, y, value, className, extra = '') {
  return `<text x="${x}" y="${y}" class="${className}"${extra ? ` ${extra}` : ''}>${escapeXml(value)}</text>`;
}

function wrappedText(nodes, value, options = {}) {
  const {
    x = 0, y = 0, maxUnits = 44, lineHeight = 24,
    className = 'body', extra = ''
  } = options;
  const lines = wrapText(value, maxUnits);
  lines.forEach((line, index) => nodes.push(textNode(x, y + index * lineHeight, line, className, extra)));
  return y + lines.length * lineHeight;
}

function addLabelValue(nodes, label, value, options = {}) {
  const {
    x = 0, y = 0, labelWidth = 86, maxUnits = 34,
    lineHeight = 23, labelClass = 'label', valueClass = 'value'
  } = options;
  nodes.push(textNode(x, y, label, labelClass));
  const lines = wrapText(value, maxUnits);
  lines.forEach((line, index) => {
    nodes.push(textNode(x + labelWidth, y + index * lineHeight, line, valueClass));
  });
  return y + Math.max(1, lines.length) * lineHeight;
}

function sectionFrame(width, height, title, innerNodes) {
  return `<g>
    <rect x="0" y="0" width="${width}" height="${height}" class="card" />
    ${textNode(24, 32, title, 'section-title')}
    <g transform="translate(24, 58)">${innerNodes.join('')}</g>
  </g>`;
}

function getPillarColumns(result) {
  const p = result.pillars;
  return [
    { key: 'year', title: '年柱', data: p.year, tenGod: result.tenGods.stems.year, hidden: result.tenGods.hidden.year, nayin: result.nayin.year, stage: result.twelveStages.byDayMaster.year, selfStage: result.twelveStages.selfSeated.year },
    { key: 'month', title: '月柱', data: p.month, tenGod: result.tenGods.stems.month, hidden: result.tenGods.hidden.month, nayin: result.nayin.month, stage: result.twelveStages.byDayMaster.month, selfStage: result.twelveStages.selfSeated.month },
    { key: 'day', title: '日柱', data: p.day, tenGod: { full: '日主' }, hidden: result.tenGods.hidden.day, nayin: result.nayin.day, stage: result.twelveStages.byDayMaster.day, selfStage: result.twelveStages.selfSeated.day },
    { key: 'hour', title: '時柱', data: p.hour, tenGod: result.tenGods.stems.hour, hidden: result.tenGods.hidden.hour, nayin: result.nayin.hour, stage: result.twelveStages.byDayMaster.hour, selfStage: result.twelveStages.selfSeated.hour }
  ];
}

function renderEvidence(nodes, item, startY, maxUnits) {
  const evidence = item && item.evidence || {};
  let y = startY;
  const details = Array.isArray(evidence.details) ? evidence.details : [];
  if (details.length) {
    nodes.push(textNode(20, y, `判定證據（${details.length} 筆）`, 'evidence-title'));
    y += 21;
    details.forEach((detail) => {
      const detailText = [
        detail.baseValue ? `基準 ${detail.baseValue}` : '',
        detail.targetValue ? `命中 ${detail.targetValue}` : '',
        detail.reason || ''
      ].filter(Boolean).join(' · ') || '符合規則';
      y = wrappedText(nodes, `• ${detailText}`, { x: 20, y, maxUnits, lineHeight: 19, className: 'evidence' });
    });
  }
  return y;
}

function renderPillar(result, col, shenSha, width, theme) {
  const nodes = [];
  const available = col.data && col.data.available !== false;
  const stem = available ? col.data.stem : '？';
  const branch = available ? col.data.branch : '？';
  let y = 30;

  nodes.push(`<rect x="0" y="0" width="${width}" height="1" fill="${theme.border}" />`);
  nodes.push(textNode(width / 2, y, col.title, 'pillar-title', 'text-anchor="middle"'));
  y += 32;
  y = addLabelValue(nodes, '主星', col.tenGod && (col.tenGod.full || col.tenGod.short), { y, maxUnits: 42, valueClass: 'value-accent' });
  y += 7;
  nodes.push(`<g class="character-box"><rect x="0" y="${y - 20}" width="${width}" height="78" rx="6" fill="${theme.gridBg}" stroke="${theme.border}" />`);
  nodes.push(textNode(24, y, '天干', 'label'));
  nodes.push(textNode(132, y + 6, stem, 'character'));
  nodes.push(textNode(width / 2 + 24, y, '地支', 'label'));
  nodes.push(textNode(width / 2 + 132, y + 6, branch, 'character'));
  nodes.push('</g>');
  y += 75;

  nodes.push(textNode(0, y, '藏幹', 'label'));
  y += 21;
  const hidden = col.hidden || [];
  if (hidden.length) {
    hidden.forEach((item) => {
      const line = `${item.stem}  ${item.tenGod && item.tenGod.full || ''} · ${item.role || ''} · ${item.days || ''}日/${Math.round((Number(item.weight) || 0) * 100)}%`;
      y = wrappedText(nodes, line, { x: 20, y, maxUnits: 50, lineHeight: 20, className: 'body' });
    });
  } else {
    y = wrappedText(nodes, '—', { x: 20, y, maxUnits: 50, lineHeight: 20, className: 'body' });
  }
  y += 10;
  nodes.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${theme.border}" />`);
  y += 24;
  y = addLabelValue(nodes, '地勢', col.stage && col.stage.name, { y, maxUnits: 40 });
  y = addLabelValue(nodes, '自坐', col.selfStage && col.selfStage.name, { y, maxUnits: 40 });
  const xunkong = available && col.data.ganzhi ? calculateXunKong(col.data.ganzhi).emptyBranches.join('') : '—';
  y = addLabelValue(nodes, '空亡', xunkong, { y, maxUnits: 40 });
  y = addLabelValue(nodes, '納音', col.nayin, { y, maxUnits: 40 });
  y += 12;

  nodes.push(`<rect x="0" y="${y - 8}" width="${width}" height="1" fill="${theme.border}" />`);
  y += 18;
  nodes.push(textNode(0, y, `神煞（${shenSha.length}）`, 'subsection-title'));
  y += 25;
  if (!shenSha.length) {
    y = wrappedText(nodes, '— 此柱無命中神煞', { x: 20, y, maxUnits: 50, lineHeight: 20, className: 'muted' });
  } else {
    shenSha.forEach((item) => {
      const itemStart = y;
      const category = CATEGORY_LABELS[item.category] || item.category || '—';
      const confidence = CONFIDENCE_LABELS[item.confidence] || item.confidence || '—';
      const head = `${formatShenShaName(item)}　${category} · ${confidence}`;
      y = wrappedText(nodes, head, { x: 20, y, maxUnits: 50, lineHeight: 21, className: shenShaToneClass(item.category) });
      y = addLabelValue(nodes, '基準', formatBasedOn(item.basedOn || []), { x: 20, y, labelWidth: 58, maxUnits: 43, lineHeight: 19, labelClass: 'meta', valueClass: 'meta' });
      y = addLabelValue(nodes, '依據', item.reference || '未提供', { x: 20, y, labelWidth: 58, maxUnits: 43, lineHeight: 19, labelClass: 'meta', valueClass: 'meta' });
      y = renderEvidence(nodes, item, y + 2, 43);
      y = Math.max(y, itemStart + 28) + 13;
    });
  }

  const height = y + 16;
  return { height, nodes: [`<g><rect x="0" y="0" width="${width}" height="${height}" rx="8" fill="${theme.cardBg}" stroke="${theme.border}" />${nodes.join('')}</g>`] };
}

function renderBasicInfo(result, width, theme) {
  const nodes = [];
  const dayMasterStem = result.pillars.day.stem;
  const stem = STEMS[STEM_INDEX[dayMasterStem]] || {};
  const yearStem = STEMS[STEM_INDEX[result.pillars.year.stem]] || {};
  const zodiac = result.calendar.zodiac && result.calendar.zodiac.name || '—';
  const constellation = result.calendar.constellation && result.calendar.constellation.name || '—';
  const prevJie = result.calendar.solarTerms && result.calendar.solarTerms.prevJie;
  const seasonNames = { 寅: '春', 卯: '春', 辰: '春', 巳: '夏', 午: '夏', 未: '夏', 申: '秋', 酉: '秋', 戌: '秋', 亥: '冬', 子: '冬', 丑: '冬' };
  const infoItems = [
    ['公曆', `${result.calendar.solar.year}年${result.calendar.solar.month}月${result.calendar.solar.day}日 ${result.input.birthTime || '未知'}`],
    ['農曆', `${result.calendar.lunar.monthName}${result.calendar.lunar.dayName}`],
    ['造向', result.input.gender === 'male' ? '乾造（男）' : '坤造（女）'],
    ['陰陽', yearStem.yinYang === 'yang' ? '陽' : '陰'],
    ['生肖', zodiac],
    ['星座', constellation],
    ['節氣', prevJie ? prevJie.name : '—'],
    ['季節', seasonNames[result.pillars.month.branch] || '—'],
    ['司令', result.strength.monthCommander ? `${result.strength.monthCommander.stem}${result.strength.monthCommander.element}` : '—'],
    ['日主', `${dayMasterStem}${stem.element || ''}（${result.strength.level}）`],
    ['月令格局', `${result.tenGods.stems.month ? result.tenGods.stems.month.full : '—'}格`],
    ['強弱分數', `${result.strength.score} 分`],
    ['月令旺衰', result.strength.monthState ? result.strength.monthState.name : '—'],
    ['命宮／身宮', `${result.auxiliary.mingGong ? result.auxiliary.mingGong.ganzhi : '—'}／${result.auxiliary.shenGong ? result.auxiliary.shenGong.ganzhi : '—'}`],
    ['胎元／胎息', `${result.auxiliary.taiYuan ? result.auxiliary.taiYuan.ganzhi : '—'}／${result.auxiliary.taiXi ? result.auxiliary.taiXi.ganzhi : '—'}`],
    ['起運', result.luckCycles && result.luckCycles.startAge ? `${result.luckCycles.startAge.display}${result.luckCycles.startAge.startDateTime ? `（${result.luckCycles.startAge.startDateTime}）` : ''}` : '—'],
    ['規則版本', `神煞 ${result.meta.shenShaRuleVersion || '—'}`]
  ];
  const columns = width >= 700 ? 2 : 1;
  const cellWidth = (width - (columns - 1) * 24) / columns;
  const cellUnits = columns === 2 ? 40 : Math.max(26, Math.floor(cellWidth / 10));
  const rows = Math.ceil(infoItems.length / columns);
  const rowHeight = 38;
  infoItems.forEach(([label, value], index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = col * (cellWidth + 24);
    const y = row * rowHeight + 24;
    nodes.push(`<rect x="${x}" y="${y - 22}" width="${cellWidth}" height="30" rx="5" fill="${theme.gridBg}" />`);
    nodes.push(textNode(x + 12, y - 2, label, 'label'));
    const lines = wrapText(value, cellUnits);
    nodes.push(textNode(x + 92, y - 2, lines[0], 'value'));
    if (lines.length > 1) nodes.push(textNode(x + 92, y + 16, lines.slice(1).join(''), 'value'));
  });
  return { height: rows * rowHeight + 30, nodes };
}

function renderSpecialRules(result) {
  const nodes = [];
  let y = 0;
  const rules = result.specialRules || [];
  if (!rules.length) return { height: 76, nodes: [textNode(0, 24, '— 本命盤沒有命中特殊柱位或季節條件', 'muted')] };
  rules.forEach((item) => {
    const evidence = item.evidence || {};
    const seasonNames = { spring: '春', summer: '夏', autumn: '秋', winter: '冬' };
    const evidenceText = [
      `基準：${formatBasedOn(item.baseOn || item.basedOn || [])}`,
      evidence.targetValue ? `命中：${evidence.targetValue}` : '',
      evidence.season ? `季節：${seasonNames[evidence.season] || evidence.season}（月令${evidence.monthBranch || '—'}）` : ''
    ].filter(Boolean).join(' · ');
    nodes.push(textNode(0, y, `${item.name || displayName(item)}`, 'body-strong'));
    y += 23;
    y = wrappedText(nodes, evidenceText, { x: 18, y, maxUnits: 50, lineHeight: 20, className: 'meta' });
    y = wrappedText(nodes, item.description || '—', { x: 18, y: y + 2, maxUnits: 50, lineHeight: 20, className: 'body' });
    y += 13;
  });
  return { height: y + 10, nodes };
}

function renderStrength(result, width, theme) {
  const nodes = [];
  let y = 0;
  y = addLabelValue(nodes, '日主旺衰得分', `${result.strength.score} 分 · 【${result.strength.level}】`, { y, maxUnits: 48, valueClass: 'value-accent' });
  y = addLabelValue(nodes, '喜用五行', (result.strength.favorableElements || []).join('、') || '無特別標記', { y, maxUnits: 48 });
  y = addLabelValue(nodes, '忌仇五行', (result.strength.unfavorableElements || []).join('、') || '無特別標記', { y, maxUnits: 48 });
  if (result.strength.monthState) {
    y = addLabelValue(nodes, '月令旺衰', `月支 ${result.strength.monthState.branch}：${result.strength.monthState.name}（係數 ${result.strength.monthState.factor}）`, { y, maxUnits: 48 });
  }
  y += 12;
  nodes.push(textNode(0, y, '五行比例', 'subsection-title'));
  y += 28;
  const colors = theme.elementColors || {};
  ['木', '火', '土', '金', '水'].forEach((element) => {
    const data = result.strength.distribution[element] || { percentage: 0 };
    const state = result.strength.seasonalStates && result.strength.seasonalStates[element];
    const percentage = Number(data.percentage) || 0;
    nodes.push(textNode(0, y + 13, `${element} ${state ? state.name : ''}`, 'label', `fill="${colors[element] || theme.textPrimary}"`));
    nodes.push(`<rect x="86" y="${y + 3}" width="${Math.max(120, width - 190)}" height="13" rx="6" fill="${theme.gridBg}" />`);
    nodes.push(`<rect x="86" y="${y + 3}" width="${Math.max(0, Math.min(width - 190, (width - 190) * percentage / 100))}" height="13" rx="6" fill="${colors[element] || theme.textPrimary}" />`);
    nodes.push(textNode(width - 62, y + 14, `${percentage}%`, 'value', 'text-anchor="end"'));
    y += 29;
  });
  if (result.strength.evidence && result.strength.evidence.length) {
    y += 12;
    nodes.push(textNode(0, y, `強弱判定 evidence（${result.strength.evidence.length} 筆）`, 'subsection-title'));
    y += 24;
    result.strength.evidence.forEach((item) => {
      y = wrappedText(nodes, `${item.ruleId || '規則'}：${item.reason || ''}`, { x: 18, y, maxUnits: 50, lineHeight: 19, className: 'evidence' });
    });
  }
  return { height: y + 12, nodes };
}

function renderUseGod(result) {
  const nodes = [];
  let y = 0;
  y = wrappedText(nodes, '以下為 BaziJS canonical 扶抑模型的可追溯摘要，不是固定斷語或醫療、財務建議。', { y, maxUnits: 52, lineHeight: 21, className: 'meta' });
  y += 10;
  y = addLabelValue(nodes, '扶助方向', (result.strength.favorableElements || []).join('、') || '—', { y, maxUnits: 46 });
  y = addLabelValue(nodes, '忌仇方向', (result.strength.unfavorableElements || []).join('、') || '—', { y, maxUnits: 46 });
  y = addLabelValue(nodes, '得令／得地／得勢', [result.strength.deLing ? '得令' : '不得令', result.strength.deDi ? '得地' : '不得地', result.strength.deShi ? '得勢' : '不得勢'].join('、'), { y, maxUnits: 46 });
  y = addLabelValue(nodes, '月令司令', result.strength.monthCommander ? `${result.strength.monthCommander.stem}${result.strength.monthCommander.element}（第${result.strength.monthCommander.phase}段）` : '—', { y, maxUnits: 46 });
  return { height: y + 10, nodes };
}

function renderLuckCycles(result, width, theme) {
  const nodes = [];
  let y = 0;
  const currentYear = new Date().getFullYear();
  const cycles = (result.luckCycles && result.luckCycles.cycles || []).slice(0, 8);
  cycles.forEach((cycle, index) => {
    const cardNodes = [];
    let cy = 25;
    cardNodes.push(textNode(18, cy, `${cycle.nominalFromAge ?? cycle.fromAge}歲起　${cycle.ganzhi}　${cycle.tenGodStem && cycle.tenGodStem.full || cycle.tenGodStem && cycle.tenGodStem.short || ''}`, 'body-strong'));
    cy += 23;
    cy = addLabelValue(cardNodes, '年份', `${cycle.fromYear}–${cycle.toYear}`, { x: 18, y: cy, labelWidth: 58, maxUnits: 44, labelClass: 'meta', valueClass: 'meta' });
    cy = addLabelValue(cardNodes, '大運神煞', formatShenShaList(cycle.shenSha || []), { x: 18, y: cy, labelWidth: 78, maxUnits: 39, lineHeight: 20, labelClass: 'meta', valueClass: 'meta' });
    const annuals = Array.isArray(cycle.annuals) ? cycle.annuals : [];
    if (annuals.length) {
      cy += 8;
      cardNodes.push(textNode(18, cy, `逐年資料（${annuals.length} 年）`, 'subsection-title'));
      cy += 24;
      annuals.forEach((annual) => {
        const isCurrentYear = Number(annual.year) === currentYear;
        const annualStartY = cy;
        const annualNodes = [];
        const headline = `${annual.age}歲 · ${annual.year}年 · ${annual.ganzhi} · ${annual.tenGod && (annual.tenGod.full || annual.tenGod.short) || ''}`;
        annualNodes.push(`<line x1="18" y1="${cy - 17}" x2="${width - 42}" y2="${cy - 17}" stroke="${theme.border}" />`);
        cy = wrappedText(annualNodes, headline, { x: 24, y: cy, maxUnits: 49, lineHeight: 19, className: 'body-strong' });
        const detail = [
          annual.stage && annual.stage.name ? `地勢 ${annual.stage.name}` : '',
          annual.nayin ? `納音 ${annual.nayin}` : '',
          annual.xunKong && annual.xunKong.emptyBranches ? `旬空 ${annual.xunKong.emptyBranches.join('')}` : ''
        ].filter(Boolean).join(' · ');
        cy = wrappedText(annualNodes, detail || '—', { x: 24, y: cy, maxUnits: 49, lineHeight: 18, className: 'meta' });
        const interactionText = (annual.interactions || []).map((item) => item.description || item.name).filter(Boolean).join('、');
        if (interactionText) {
          cy = wrappedText(annualNodes, `互動：${interactionText}`, { x: 24, y: cy, maxUnits: 49, lineHeight: 18, className: 'body' });
        }
        cy = wrappedText(annualNodes, `神煞：${formatShenShaList(annual.shenSha || [])}`, { x: 24, y: cy, maxUnits: 49, lineHeight: 18, className: 'body' });
        if (isCurrentYear) {
          const annualHeight = cy - annualStartY + 14;
          cardNodes.push(`<rect x="18" y="${annualStartY - 17}" width="${width - 60}" height="${annualHeight}" rx="5" fill="${theme.accent}" fill-opacity="0.06" stroke="${theme.accent}" stroke-width="2" />`);
          cardNodes.push(textNode(width - 74, annualStartY + 2, '今年', 'current-badge', 'text-anchor="end"'));
        }
        cardNodes.push(...annualNodes);
        cy += 8;
      });
    }
    const cardHeight = cy + 16;
    nodes.push(`<g transform="translate(0, ${y})"><rect x="0" y="0" width="${width}" height="${cardHeight}" rx="7" fill="${theme.gridBg}" stroke="${theme.border}" />${cardNodes.join('')}</g>`);
    y += cardHeight + (index < cycles.length - 1 ? 14 : 0);
  });
  return { height: Math.max(78, y + 4), nodes };
}

function renderTransit(result) {
  const nodes = [];
  const transit = result.transits && result.transits.year;
  if (!transit) return { height: 60, nodes: [textNode(0, 24, '— 無流年資料', 'muted')] };
  let y = 0;
  y = addLabelValue(nodes, '流年', transit.ganzhi, { y, maxUnits: 45 });
  y = addLabelValue(nodes, '十神', transit.tenGod && (transit.tenGod.full || transit.tenGod.short), { y, maxUnits: 45 });
  y = addLabelValue(nodes, '地勢／納音', `${transit.stage && transit.stage.name || '—'} · ${transit.nayin || '—'}`, { y, maxUnits: 45 });
  const list = result.transits.shenShaYear || transit.shenSha || [];
  y = addLabelValue(nodes, `流年神煞（${list.length}）`, formatShenShaList(list), { y: y + 4, labelWidth: 108, maxUnits: 37, lineHeight: 20 });
  return { height: y + 10, nodes };
}

function renderInteractions(result) {
  const nodes = [];
  const items = [
    ...(result.interactions && result.interactions.stems || []).map((item) => `天干：${item.name}`),
    ...(result.interactions && result.interactions.branches || []).map((item) => `地支：${item.name}`)
  ];
  if (!items.length) return { height: 60, nodes: [textNode(0, 24, '— 無明顯互動', 'muted')] };
  let y = 0;
  items.forEach((item) => { y = wrappedText(nodes, `• ${item}`, { x: 8, y, maxUnits: 52, lineHeight: 23, className: 'body' }); });
  return { height: y + 10, nodes };
}

function renderShenShaSummary(result) {
  const nodes = [];
  let y = 0;
  const rows = [
    ['原局神煞', result.shenSha || []],
    ['流年神煞', result.transits && result.transits.shenShaYear || []],
    ['初運神煞', result.luckCycles && result.luckCycles.cycles[0] && result.luckCycles.cycles[0].shenSha || []]
  ];
  rows.forEach(([label, list]) => {
    y = addLabelValue(nodes, label, formatShenShaList(list), { y, labelWidth: 92, maxUnits: 42, lineHeight: 21 });
    y += 4;
  });
  const auxiliary = result.auxiliary || {};
  y = addLabelValue(nodes, '胎元命宮', `胎元：${auxiliary.taiYuan && auxiliary.taiYuan.ganzhi || '—'} ｜ 胎息：${auxiliary.taiXi && auxiliary.taiXi.ganzhi || '—'} ｜ 命宮：${auxiliary.mingGong && auxiliary.mingGong.ganzhi || '—'} ｜ 身宮：${auxiliary.shenGong && auxiliary.shenGong.ganzhi || '—'}`, { y, labelWidth: 92, maxUnits: 42, lineHeight: 21 });
  return { height: y + 10, nodes };
}

export function renderSvg(chartResult, options = {}) {
  const theme = getTheme(options.theme || 'modern-oriental');
  const preset = getPreset(options.preset || 'full');
  const result = chartResult;
  const width = preset.width;
  const contentWidth = width - 80;
  const body = [];
  let y = 36;

  body.push(textNode(40, y, '八字命盤 · 子平四柱', 'title'));
  body.push(textNode(40, y + 29, `BaziJS 命理引擎 v${result.meta.engineVersion} · 規範流派：${result.meta.profileName}`, 'subtitle'));
  y += 86;

  const addSection = (title, builder) => {
    const built = builder(contentWidth);
    const height = Math.max(76, built.height + 64);
    body.push(`<g transform="translate(40, ${y})">${sectionFrame(contentWidth, height, title, built.nodes)}</g>`);
    y += height + 24;
  };

  addSection('基本資料', (innerWidth) => renderBasicInfo(result, innerWidth, theme));

  if (preset.includePillars) {
    addSection('四柱主盤', (innerWidth) => {
      const group = groupShenShaByPillar(result.shenSha || []);
      const nodes = [];
      let innerY = 0;
      getPillarColumns(result).forEach((col) => {
        const rendered = renderPillar(result, col, group[col.key] || [], innerWidth, theme);
        nodes.push(`<g transform="translate(0, ${innerY})">${rendered.nodes.join('')}</g>`);
        innerY += rendered.height + 14;
      });
      return { height: innerY, nodes };
    });
  }

  if (preset.includeShenSha) addSection('特殊柱位與季節條件', (innerWidth) => renderSpecialRules(result, innerWidth, theme));
  if (preset.includeStrength) {
    addSection('五行分析 · 氣數與強弱平衡', (innerWidth) => renderStrength(result, innerWidth, theme));
    addSection('用神模型', (innerWidth) => renderUseGod(result, innerWidth, theme));
  }
  if (preset.includeLuckCycles && result.luckCycles) {
    addSection(`起運走勢（${result.luckCycles.directionText} · ${result.luckCycles.startAge.display}起運）`, (innerWidth) => renderLuckCycles(result, innerWidth, theme));
  }
  if (preset.includeShenSha) addSection('流年詳細', (innerWidth) => renderTransit(result, innerWidth, theme));
  if (preset.includeInteractions) addSection('天干地支互動', (innerWidth) => renderInteractions(result, innerWidth, theme));
  if (preset.includeShenSha) addSection('神煞吉凶與命宮身宮', (innerWidth) => renderShenShaSummary(result, innerWidth, theme));

  y += 10;
  const height = y + 42;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMin meet" overflow="visible" style="display:block;width:${width}px;max-width:100%;height:auto;" role="img" aria-label="BaziJS 完整八字命盤">
  <defs>
    <style>
      .title { font-size: 28px; font-weight: 800; fill: ${theme.textPrimary}; letter-spacing: 1.5px; }
      .subtitle { font-size: 15px; font-weight: 600; fill: ${theme.textSecondary}; }
      .section-title { font-size: 20px; font-weight: 800; fill: ${theme.accent}; letter-spacing: 1px; }
      .pillar-title { font-size: 19px; font-weight: 800; fill: ${theme.accent}; }
      .subsection-title { font-size: 15px; font-weight: 800; fill: ${theme.accent}; }
      .label { font-size: 14px; font-weight: 700; fill: ${theme.textSecondary}; }
      .value { font-size: 15px; font-weight: 700; fill: ${theme.textPrimary}; }
      .value-accent { font-size: 15px; font-weight: 800; fill: ${theme.accent}; }
      .character { font-size: 38px; font-weight: 800; fill: ${theme.textPrimary}; }
      .body { font-size: 14px; font-weight: 600; fill: ${theme.textPrimary}; }
      .body-strong { font-size: 15px; font-weight: 800; fill: ${theme.textPrimary}; }
      .shensha-auspicious { font-size: 15px; font-weight: 800; fill: ${theme.shenShaColors?.auspicious || theme.textPrimary}; }
      .shensha-inauspicious { font-size: 15px; font-weight: 800; fill: ${theme.shenShaColors?.inauspicious || theme.textPrimary}; }
      .shensha-neutral { font-size: 15px; font-weight: 800; fill: ${theme.shenShaColors?.neutral || theme.textPrimary}; }
      .meta { font-size: 13px; font-weight: 600; fill: ${theme.textSecondary}; }
      .evidence-title { font-size: 13px; font-weight: 800; fill: ${theme.accent}; }
      .evidence { font-size: 12px; font-weight: 600; fill: ${theme.textSecondary}; }
      .muted { font-size: 14px; font-weight: 600; fill: ${theme.textMuted}; }
      .current-badge { font-size: 12px; font-weight: 800; fill: ${theme.accent}; }
      .watermark { font-size: 11px; font-weight: 600; fill: ${theme.textSecondary}; opacity: 0.52; letter-spacing: 0.35px; }
      .card { fill: ${theme.cardBg}; stroke: ${theme.border}; stroke-width: 1.2; }
    </style>
  </defs>
  <rect x="0" y="0" width="${width}" height="${height}" fill="${theme.background}" />
  <rect x="16" y="16" width="${width - 32}" height="${height - 32}" rx="12" fill="none" stroke="${theme.border}" stroke-width="1.5" />
  ${body.join('')}
  ${textNode(width - 40, height - 44, '當麻實驗室 · github.com/donma/bazi-js', 'watermark', 'text-anchor="end"')}
  ${textNode(width / 2, height - 24, 'BaziJS 開源命理引擎 · Apache-2.0 授權', 'muted', 'text-anchor="middle"')}
</svg>`;
}
