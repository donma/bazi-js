// PNG 匯出轉換層（Browser-only、Canvas 原生實現）
// 規範要求：
// - 核心排盤零依賴、SVG Renderer 零依賴
// - PNG 僅作為轉換層，不得引入大型 UI 框架
// - 在瀏覽器環境直接利用 HTML5 Canvas 將 SVG 繪製並轉出為 PNG Blob / DataURL
// - 在純 Node.js 環境中提供友善降級與提示

import { renderSvg } from '../svg/index.js';

export async function renderPng(chartResult, options = {}) {
  const svgString = renderSvg(chartResult, options);

  // 檢查是否在瀏覽器環境 (window & document & Image 存在)
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // 非瀏覽器環境（如 Node.js 測試時）
    return {
      format: 'png',
      isNodeMock: true,
      svg: svgString,
      note: 'Node.js 環境無原生 DOM Image/Canvas，請在瀏覽器環境執行以取得 Blob 或使用 canvas 模組'
    };
  }

  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobUrl = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // SVG 本身是向量；PNG 以 2x 輸出，避免在高 DPI 螢幕或放大檢視時文字發糊。
        const scale = Number.isFinite(Number(options.pngScale)) && Number(options.pngScale) > 0
          ? Number(options.pngScale) : 2;
        const sourceWidth = img.naturalWidth || img.width || 960;
        const sourceHeight = img.naturalHeight || img.height || 980;
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(sourceWidth * scale);
        canvas.height = Math.ceil(sourceHeight * scale);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(blobUrl);

        canvas.toBlob((blob) => {
          resolve({
            format: 'png',
            blob,
            dataUrl: canvas.toDataURL('image/png'),
            width: canvas.width,
            height: canvas.height,
            scale
          });
        }, 'image/png');
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(blobUrl);
        reject(new Error('SVG 轉換 PNG 失敗: ' + (err.message || 'Image 載入錯誤')));
      };

      img.src = blobUrl;
    } catch (e) {
      reject(e);
    }
  });
}
