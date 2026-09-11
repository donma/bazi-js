import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Bazi from '../src/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(root, 'docs', 'reference', 'generated');
const checkOnly = process.argv.includes('--check');
if (!checkOnly) fs.mkdirSync(outputDir, { recursive: true });

const writeOrCheck = (file, content, failures) => {
  if (checkOnly) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) failures.push(path.relative(root, file));
    return;
  }
  fs.writeFileSync(file, content, 'utf8');
};

const conceptFile = (concept) => `${concept.conceptId.replace(/[^a-z0-9.-]+/gi, '-').replace(/\./g, '--')}.md`;
const concepts = Bazi.Reference.findConcept('');
const failures = [];
const indexRows = concepts.map((concept) => {
  const file = conceptFile(concept);
  const rules = concept.ruleIds.map((ruleId) => Bazi.Reference.getRule(ruleId)).filter(Boolean);
  const variants = Bazi.Reference.getVariants(concept.conceptId);
  const content = [
    `# ${concept.name}`,
    '',
    `- conceptId: \`${concept.conceptId}\``,
    `- type: \`${concept.conceptType}\`${concept.patternType ? ` / patternType: \`${concept.patternType}\`` : ''}`,
    `- status: \`${concept.status}\``,
    `- tradition: ${concept.traditions.join('、') || '未記錄'}`,
    `- ruleId: ${concept.ruleIds.map((id) => `\`${id}\``).join('、') || '未記錄'}`,
    `- sourceId: ${concept.sourceIds.map((id) => `\`${id}\``).join('、') || '未建立來源連結'}`,
    '',
    '## 說明',
    '',
    concept.description || '尚未建立摘要。',
    '',
    '## 判定範圍',
    '',
    ...rules.map((rule) => `- ${rule.ruleId}: ${rule.baseOn.join('、')}（scope: ${rule.scope}；ruleFamily: ${rule.ruleFamily}）`),
    ...(rules.some((rule) => rule.api?.length) ? ['', '## SDK API 與輸出', '', `- API：${[...new Set(rules.flatMap((rule) => rule.api || []))].map((item) => `\`${item}\``).join('、')}`, `- 輸出欄位：${[...new Set(rules.flatMap((rule) => rule.outputFields || []))].map((item) => `\`${item}\``).join('、')}`] : []),
    '',
    '## 來源與變體',
    '',
    variants.length ? variants.map((variant) => `- ${variant.variantId}: ${variant.condition}（${variant.sourceIds.join('、')}）`).join('\n') : '目前沒有額外變體記錄。',
    '',
    '## 實作狀態',
    '',
    rules.map((rule) => `- ${rule.implementation?.status || 'unknown'}；模組：${rule.implementation?.module || '未記錄'}。`).join('\n'),
    '',
    '> 本頁由 Reference registry 與 sources/ 資料生成；完整 rule、evidence、variants 請使用 `Bazi.Reference.getRule()` 或 `Bazi.Reference.toContext()`。',
    ''
  ].join('\n');
  writeOrCheck(path.join(outputDir, file), content, failures);
  return `| [${concept.name}](${file}) | \`${concept.conceptId}\` | \`${concept.conceptType}\`${concept.patternType ? ` / ${concept.patternType}` : ''} | ${concept.status} | ${concept.sourceIds.length} |`;
});

const index = [
  '# BaziJS Reference Concepts',
  '',
  '> 此目錄由 `src/reference` 與 `sources/` 生成，作為規則、概念與來源的可追溯索引；不是準確率或命理斷語排名。',
  '',
  `- taxonomy: \`${Bazi.Reference.getTaxonomy().version}\``,
  `- concepts: ${concepts.length}`,
  `- rules: ${Bazi.Reference.CANONICAL_RULES.length}`,
  '',
  '| 名稱 | conceptId | 類型 | 狀態 | 來源數 |',
  '|---|---|---|---|---:|',
  ...indexRows,
  ''
].join('\n');
writeOrCheck(path.join(outputDir, 'index.md'), index, failures);

if (!checkOnly) console.log(`Generated ${concepts.length} concept pages in ${path.relative(root, outputDir)}`);
if (failures.length) {
  console.error(`Reference docs out of date (${failures.length}):`);
  console.error(failures.join('\n'));
  process.exit(1);
}
