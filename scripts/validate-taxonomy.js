import Bazi from '../src/index.js';

const result = Bazi.Reference.validateReferenceIndex();
const taxonomy = Bazi.Reference.getTaxonomy();
const requiredTypes = ['shensha', 'special-rule', 'pattern', 'auxiliary', 'profile'];
const missing = requiredTypes.filter((type) => !taxonomy.conceptTypes.includes(type));
if (missing.length) result.errors.push(`taxonomy missing concept types: ${missing.join(', ')}`);

console.log(`${result.valid && result.errors.length === 0 ? 'PASS' : 'FAIL'} taxonomy (${result.counts.rules} rules, ${result.counts.concepts} concepts)`);
if (result.errors.length) console.error(result.errors.join('\n'));
process.exit(result.errors.length ? 1 : 0);
