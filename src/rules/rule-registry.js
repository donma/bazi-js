// Rule Profile 系統與 Rule Registry
// 規範要求：
// 必須可繼承 canonical、可 override 個別規則、可取得 diff、可輸出規則版本、可列出所有 active rules、可追溯 ruleId。

import { CANONICAL_PROFILE } from './profiles/canonical.js';
import { BaziRuleError } from '../core/errors/index.js';

const VALID_YEAR_BOUNDARIES = new Set(['lichun', 'lunar_new_year']);
const VALID_MONTH_BOUNDARIES = new Set(['jie', 'lunar_month']);
const VALID_DAY_BOUNDARIES = new Set(['23:00', '00:00']);

function validateProfile(profile) {
  const errors = [];
  if (!profile || typeof profile !== 'object') errors.push('profile must be an object');
  if (!profile?.id || typeof profile.id !== 'string') errors.push('id is required');
  if (!profile?.rules || typeof profile.rules !== 'object') errors.push('rules is required');
  if (profile?.rules?.yearBoundary && !VALID_YEAR_BOUNDARIES.has(profile.rules.yearBoundary.value)) {
    errors.push('rules.yearBoundary.value is invalid');
  }
  if (profile?.rules?.monthBoundary && !VALID_MONTH_BOUNDARIES.has(profile.rules.monthBoundary.value)) {
    errors.push('rules.monthBoundary.value is invalid');
  }
  if (profile?.rules?.dayBoundary && !VALID_DAY_BOUNDARIES.has(profile.rules.dayBoundary.value)) {
    errors.push('rules.dayBoundary.value is invalid');
  }
  if (profile?.rules?.trueSolarTime && typeof profile.rules.trueSolarTime.value !== 'boolean') {
    errors.push('rules.trueSolarTime.value must be boolean');
  }
  return errors;
}

class ProfileRegistry {
  constructor() {
    this.profiles = new Map();
    // 註冊預設 canonical profile
    this.register(CANONICAL_PROFILE);
  }

  register(profile) {
    const errors = validateProfile(profile);
    if (errors.length) {
      throw new BaziRuleError(`Profile 無效：${errors.join('；')}`, 'PROFILE_SCHEMA_INVALID', { errors });
    }
    if (this.profiles.has(profile.id)) {
      throw new BaziRuleError(`Profile 已存在：${profile.id}`, 'PROFILE_DUPLICATE', { profileId: profile.id });
    }
    this.profiles.set(profile.id, profile);
  }

  get(id = 'canonical') {
    return this.profiles.get(id);
  }

  require(id = 'canonical') {
    const profile = this.get(id);
    if (!profile) {
      throw new BaziRuleError(`找不到規則 Profile：${id}`, 'PROFILE_NOT_FOUND', { profileId: id });
    }
    return profile;
  }

  // 建立自訂 Profile（繼承 base，覆寫 overrides）
  createProfile({ id, name, description, base = 'canonical', overrides = {} }) {
    if (!id || typeof id !== 'string') {
      throw new BaziRuleError('自訂 Profile 必須提供 id', 'PROFILE_ID_REQUIRED');
    }
    const baseProfile = this.require(base);
    if (this.profiles.has(id)) {
      throw new BaziRuleError(`Profile 已存在：${id}`, 'PROFILE_DUPLICATE', { profileId: id });
    }

    // 深度複製 base
    const newProfile = JSON.parse(JSON.stringify(baseProfile));
    newProfile.id = id;
    newProfile.name = name || id;
    newProfile.description = description || `基於 ${base} 覆寫之自訂流派`;
    newProfile.baseId = base;
    newProfile.version = '1.0.0-custom';
    newProfile.diff = {};

    // 覆寫規則
    for (const [key, val] of Object.entries(overrides)) {
      if (key === 'dayBoundary') {
        if (!VALID_DAY_BOUNDARIES.has(val)) throw new BaziRuleError(`無效 dayBoundary：${val}`, 'PROFILE_OVERRIDE_INVALID', { key, value: val });
        newProfile.rules.dayBoundary = {
          value: val,
          ruleId: val === '00:00' ? 'DAY_BOUNDARY_MIDNIGHT_0000' : 'DAY_BOUNDARY_ZISHI_2300',
          version: '1.0.0',
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.dayBoundary.value, to: val };
      } else if (key === 'trueSolarTime') {
        if (typeof val !== 'boolean') throw new BaziRuleError(`trueSolarTime 必須是 boolean`, 'PROFILE_OVERRIDE_INVALID', { key, value: val });
        newProfile.rules.trueSolarTime = {
          value: Boolean(val),
          ruleId: val ? 'TRUE_SOLAR_TIME_ENABLED' : 'TRUE_SOLAR_TIME_DISABLED',
          version: '1.0.0',
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.trueSolarTime.value, to: val };
      } else if (key === 'yearBoundary') {
        if (!VALID_YEAR_BOUNDARIES.has(val)) throw new BaziRuleError(`無效 yearBoundary：${val}`, 'PROFILE_OVERRIDE_INVALID', { key, value: val });
        newProfile.rules.yearBoundary = {
          value: val,
          ruleId: `YEAR_BOUNDARY_${val.toUpperCase()}`,
          version: '1.0.0',
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.yearBoundary.value, to: val };
      } else if (key === 'monthBoundary') {
        if (!VALID_MONTH_BOUNDARIES.has(val)) throw new BaziRuleError(`無效 monthBoundary：${val}`, 'PROFILE_OVERRIDE_INVALID', { key, value: val });
        newProfile.rules.monthBoundary = {
          value: val,
          ruleId: `MONTH_BOUNDARY_${val.toUpperCase()}`,
          version: '1.0.0',
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.monthBoundary.value, to: val };
      } else {
        throw new BaziRuleError(`不支援的 Profile 覆寫欄位：${key}`, 'PROFILE_OVERRIDE_UNSUPPORTED', { key });
      }
    }

    this.register(newProfile);
    return newProfile;
  }

  // 取得 Profile 與 canonical 的 diff
  getDiff(profileId) {
    const p = this.get(profileId);
    if (!p) return null;
    return p.diff || {};
  }

  // 列出所有可用 Profiles
  listProfiles() {
    return Array.from(this.profiles.values()).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      version: p.version
    }));
  }
}

export const RuleRegistry = new ProfileRegistry();
