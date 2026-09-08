// Renderer 統一接口導出

import { renderSvg } from './svg/index.js';
import { renderPng } from './png/index.js';
import { THEMES } from './themes/index.js';
import { PRESETS } from './presets/index.js';

export function render(chartResult, options = {}) {
  const format = options.format || 'svg';
  if (format === 'svg') {
    return renderSvg(chartResult, options);
  }
  if (format === 'png') {
    return renderPng(chartResult, options);
  }
  throw new Error(`不支援的渲染格式: ${format}，僅支援 "svg" 或 "png"`);
}

export const Renderer = {
  render,
  renderSvg,
  renderPng,
  themes: THEMES,
  presets: PRESETS
};
