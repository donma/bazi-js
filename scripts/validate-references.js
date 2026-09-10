import Bazi from '../src/index.js';

const result = Bazi.Reference.validateReferenceIndex();
console.log(`${result.valid ? 'PASS' : 'FAIL'} reference index (${result.counts.rules} rules, ${result.counts.concepts} concepts, ${result.counts.sources} sources)`);
if (result.errors.length) console.error(result.errors.join('\n'));
process.exit(result.valid ? 0 : 1);
