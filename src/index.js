// 主入口 exports 匯總

import { calculate, calculateSafe, Chart } from './chart/index.js';
import * as Calendar from './calendar/solar-terms.js';
import * as Solar from './calendar/solar.js';
import * as Lunar from './calendar/lunar.js';
import * as Constellation from './calendar/constellation.js';
import * as Zodiac from './calendar/zodiac.js';
import * as Julian from './calendar/julian.js';
import * as TrueSolarTime from './calendar/true-solar-time.js';
import * as Rules from './rules/rule-registry.js';
import * as ShenSha from './shensha/index.js';
import * as SpecialRules from './special-rules/index.js';
import * as Patterns from './patterns/index.js';
import * as Strength from './strength/index.js';
import * as Luck from './luck/index.js';
import * as Transit from './transit/index.js';
import * as AI from './ai/index.js';
import * as Validation from './core/utils/validation.js';
import * as Errors from './core/errors/index.js';
import * as Constants from './core/constants/stems.js';
import { Renderer } from './renderer/index.js';
import { VERSIONS } from './rules/versions.js';

export {
  calculate,
  calculateSafe,
  Chart,
  Calendar,
  Solar,
  Lunar,
  Constellation,
  Zodiac,
  Julian,
  TrueSolarTime,
  Rules,
  ShenSha,
  SpecialRules,
  Patterns,
  Strength,
  Luck,
  Transit,
  AI,
  Renderer,
  Validation,
  Errors,
  Constants,
  VERSIONS
};

const Bazi = {
  version: VERSIONS.engineVersion,
  rules: {
    version: VERSIONS.ruleSetVersion,
    shenSha: { version: VERSIONS.shenShaRuleVersion },
    specialRules: { version: VERSIONS.specialRuleVersion },
    patterns: { version: VERSIONS.patternRuleVersion },
    strength: { version: VERSIONS.strengthRuleVersion }
  },
  calculate,
  calculateSafe,
  Chart,
  Calendar,
  Solar,
  Lunar,
  Constellation,
  Zodiac,
  Julian,
  TrueSolarTime,
  Rules,
  ShenSha,
  SpecialRules,
  Patterns,
  Strength,
  Luck,
  Transit,
  AI,
  Renderer,
  Validation,
  Errors,
  Constants
};

export default Bazi;
