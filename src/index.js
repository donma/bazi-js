// 主入口 exports 匯總

import { calculate, calculateSafe, Chart } from './chart/index.js';
import * as Calendar from './calendar/solar-terms.js';
import * as TenGods from './tengods/index.js';
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
import * as Auxiliary from './auxiliary/index.js';
import * as Summary from './summary/index.js';
import * as Analysis from './analysis/index.js';
import * as Luck from './luck/index.js';
import * as Transit from './transit/index.js';
import * as AI from './ai/index.js';
import * as InputValidation from './core/utils/validation.js';
import * as ValidationData from './validation/index.js';
import * as Errors from './core/errors/index.js';
import * as Reference from './reference/index.js';
import * as Constants from './core/constants/stems.js';
import * as PillarMetadata from './core/constants/pillar-metadata.js';
import { Renderer } from './renderer/index.js';
import { VERSIONS } from './rules/versions.js';

const Validation = Object.freeze({ ...InputValidation, ...ValidationData });

export {
  calculate,
  calculateSafe,
  Chart,
  Calendar,
  TenGods,
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
  Auxiliary,
  Summary,
  Analysis,
  Luck,
  Transit,
  AI,
  Renderer,
  Validation,
  ValidationData,
  Errors,
  Reference,
  Constants,
  PillarMetadata,
  VERSIONS
};

const Bazi = {
  version: VERSIONS.engineVersion,
  rules: {
    version: VERSIONS.ruleSetVersion,
    shenSha: { version: VERSIONS.shenShaRuleVersion },
    tenGod: { version: VERSIONS.tenGodRuleVersion },
    hiddenStem: { version: VERSIONS.hiddenStemRuleVersion },
    specialRules: { version: VERSIONS.specialRuleVersion },
    patterns: { version: VERSIONS.patternRuleVersion, regularVersion: VERSIONS.regularPatternRuleVersion },
    strength: { version: VERSIONS.strengthRuleVersion, qiLayerVersion: VERSIONS.strengthQiLayerVersion, fiveCategoryVersion: VERSIONS.fiveCategoryRuleVersion },
    auxiliary: { version: VERSIONS.auxiliaryRuleVersion },
    classicalSummary: { version: VERSIONS.classicalSummaryRuleVersion },
    analysis: { version: VERSIONS.analysisRuleVersion },
    luck: { version: VERSIONS.luckRuleVersion },
    interactions: { version: VERSIONS.interactionRuleVersion },
    transit: { version: VERSIONS.transitGraphVersion },
    useGod: { version: VERSIONS.useGodResolverVersion },
    reference: {
      taxonomyVersion: VERSIONS.referenceTaxonomyVersion,
      indexVersion: VERSIONS.referenceIndexVersion,
      coverageVersion: VERSIONS.referenceCoverageVersion
    }
  },
  calculate,
  calculateSafe,
  Chart,
  Calendar,
  TenGods,
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
  Auxiliary,
  Summary,
  Analysis,
  Luck,
  Transit,
  AI,
  Renderer,
  Validation,
  ValidationData,
  Errors,
  Reference,
  Constants,
  PillarMetadata
};

export default Bazi;
