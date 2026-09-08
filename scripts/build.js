// esbuild 打包腳本
// 產出：
// 1. dist/bazi-sdk.js (IIFE / UMD 供一般 script 標籤引用，window.Bazi)
// 2. dist/bazi-sdk.min.js (壓縮版)
// 3. dist/bazi-sdk.min.js.map (Source Map)
// 4. dist/bazi-sdk.esm.js (ES Module 供 modern bundler 引用)

import * as esbuild from 'esbuild';
import fs from 'fs';

async function build() {
  console.log('[BaziJS] 正在編譯打包 SDK...');

  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // 1. 瀏覽器通用版 (IIFE, 掛在 window.Bazi)
  await esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: 'dist/bazi-sdk.js',
    format: 'iife',
    globalName: 'Bazi',
    platform: 'browser',
    target: ['es2020'],
    sourcemap: true
  });
  console.log('✔ dist/bazi-sdk.js (IIFE bundle)');

  // 2. 瀏覽器壓縮版 (Minified)
  await esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    minify: true,
    outfile: 'dist/bazi-sdk.min.js',
    format: 'iife',
    globalName: 'Bazi',
    platform: 'browser',
    target: ['es2020'],
    sourcemap: true
  });
  console.log('✔ dist/bazi-sdk.min.js + map (Minified bundle)');

  // 3. ESM 模組版
  await esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: 'dist/bazi-sdk.esm.js',
    format: 'esm',
    platform: 'browser',
    target: ['es2020'],
    sourcemap: true
  });
  console.log('✔ dist/bazi-sdk.esm.js (ES Module)');

  console.log('[BaziJS] 打包編譯完成！');
}

build().catch(err => {
  console.error('打包失敗:', err);
  process.exit(1);
});
