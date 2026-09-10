import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Bazi from '../src/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsonFile = path.join(root, 'validation', 'coverage', 'coverage.json');
const markdownFile = path.join(root, 'docs', 'coverage', 'coverage-matrix.md');
const checkOnly = process.argv.includes('--check');
const report = Bazi.Reference.getCoverageReport();
const json = `${JSON.stringify(report, null, 2)}\n`;

const rows = report.scopes.map((scope) => {
  const d = scope.dimensions;
  return `| ${scope.scope} | ${scope.totals.concepts} | ${scope.totals.rules} | ${d.sourceLinked.percent}% | ${d.locatorBacked.percent}% | ${d.variantsDocumented.percent}% | ${d.implemented.percent}% | ${d.tests.status} | ${d.external.status} |`;
});
const markdown = [
  '# BaziJS Reference Coverage Matrix',
  '',
  '> 這是工程覆蓋率，不是古典命理正確率。`tests` 與 `external` 若尚未掛接專用矩陣，會明確標記為 `not-collected`。',
  '',
  `- taxonomy: \`${report.taxonomyVersion}\``,
  `- source catalog: \`${report.catalogVersion}\``,
  '',
  '| scope | concepts | rules | source linked | locator backed | variants | implemented | tests | external |',
  '|---|---:|---:|---:|---:|---:|---:|---|---|',
  ...rows,
  '',
  '## 維度定義',
  '',
  '- source linked：概念至少連到一筆 sources/ 來源。',
  '- locator backed：來源有卷次、scope、原始依據或可定位 citation。',
  '- variants：規則或 evidence 已登錄流派／傳本差異。',
  '- implemented：已有可執行 registry；candidate-only 仍不代表完整成格。',
  '- tests / external：等待專用 fixture 矩陣接入時保持 `not-collected`，不自行宣稱準確。',
  ''
].join('\n');

if (checkOnly) {
  const failures = [];
  if (!fs.existsSync(jsonFile) || fs.readFileSync(jsonFile, 'utf8') !== json) failures.push(path.relative(root, jsonFile));
  if (!fs.existsSync(markdownFile) || fs.readFileSync(markdownFile, 'utf8') !== markdown) failures.push(path.relative(root, markdownFile));
  if (failures.length) {
    console.error(`Coverage artifacts out of date:\n${failures.join('\n')}`);
    process.exit(1);
  }
  console.log('PASS coverage artifacts');
} else {
  fs.mkdirSync(path.dirname(jsonFile), { recursive: true });
  fs.mkdirSync(path.dirname(markdownFile), { recursive: true });
  fs.writeFileSync(jsonFile, json, 'utf8');
  fs.writeFileSync(markdownFile, markdown, 'utf8');
  console.log(`Generated coverage artifacts for ${report.scopes[0].totals.concepts} concepts`);
}
