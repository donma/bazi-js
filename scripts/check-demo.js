import fs from 'fs';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const html = read('demo/index.html');
const app = read('demo/app.js');
const styles = read('demo/styles.css');
const checks = [
  ['demo index exists', html.length > 0],
  ['demo loads app module', /app\.js/.test(html)],
  ['demo has chart mount', /id=["']chart["']|id=["']chart-container["']/.test(html)],
  ['demo has selectable year boundary', /id=["']yearBoundary["']/.test(html) && /lunar_new_year/.test(html + app) && /yearBoundary/.test(app)],
  ['demo has export actions', /下載\s*SVG|下載\s*PNG|複製\s*JSON|複製\s*AI Context/.test(html)],
  ['demo footer has repository link', /github\.com\/donma\/bazi-js/.test(html + app)],
  ['demo footer has lab link', /\/lab\/index\.html/.test(html + app)],
  ['demo renders all ShenSha info triggers', /renderShenShaInfo\(item, categoryClass\)/.test(app)],
  ['demo renders hidden-stem and ten-god info tooltips', /renderHiddenStemInfo/.test(app) && /hidden-label:/.test(app) && /ten-god:hidden:/.test(app)],
  ['demo renders summary ShenSha info triggers inline', /renderShenShaInline\(result\.shenSha/.test(app) && /responsive-inline-shensha/.test(app + styles)],
  ['demo renders transit-detail ShenSha info triggers inline', /responsive-transit-shensha[\s\S]*renderShenShaInline\(transitShenSha/.test(app)],
  ['demo renders transit structural events only when present', /transitGraph[\s\S]*events/.test(app) && /transitEvents\.length \?/.test(app) && /responsive-transit-events/.test(app + styles)],
  ['demo renders special-rule info triggers inline', /formatSpecialRulesInline\(result\.specialRules\)/.test(app) && /responsive-inline-special-rule/.test(app + styles)],
  ['demo has ShenSha info tooltip', /shensha-info-tooltip/.test(app + styles)],
  ['demo tooltip avoids viewport clipping', /position:\s*fixed/.test(styles) && /positionShenShaTooltip/.test(app)],
  ['demo uses text trigger without icon', /class="shensha-info-trigger/.test(app) && !/shensha-info-button|ⓘ/.test(app + styles)],
  ['demo uses compact evidence icon', /class="evidence-icon"/.test(app + styles)],
  ['demo avoids full-screen ShenSha dialog', !/shensha-info-panel|shensha-info-dialog/.test(app + styles)],
  ['demo styles include responsive media query', /@media/.test(styles)],
  ['demo mobile form stacks without overflow', /@media \(max-width: 1100px\)[\s\S]*#bazi-form\s*\{[\s\S]*display:\s*block/.test(styles) && /@container bazi-input \(max-width: 700px\)[\s\S]*#time-mode-control\s*\{[\s\S]*display:\s*grid/.test(styles)],
  ['public demo does not expose internal sample filename', !/sample1/i.test(html + app + styles)]
];
let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`);
  if (!ok) failed++;
}
process.exit(failed ? 1 : 0);
