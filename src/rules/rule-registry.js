// Rule Profile 系統與 Rule Registry
// 規範要求：
// 必須可繼承 canonical、可 override 個別規則、可取得 diff、可輸出規則版本、可列出所有 active rules、可追溯 ruleId。

import { CANONICAL_PROFILE } from './profiles/canonical.js';

class ProfileRegistry {
  constructor() {
    this.profiles = new Map();
    // 註冊預設 canonical profile
    this.register(CANONICAL_PROFILE);
  }

  register(profile) {
    this.profiles.set(profile.id, profile);
  }

  get(id = 'canonical') {
    return this.profiles.get(id) || this.profiles.get('canonical');
  }

  // 建立自訂 Profile（繼承 base，覆寫 overrides）
  createProfile({ id, name, description, base = 'canonical', overrides = {} }) {
    const baseProfile = this.get(base);
    if (!baseProfile) {
      throw new Error(`找不到基礎 Profile: ${base}`);
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
        newProfile.rules.dayBoundary = {
          value: val,
          ruleId: val === '00:00' ? 'DAY_BOUNDARY_MIDNIGHT_0000' : 'DAY_BOUNDARY_ZISHI_2300',
          version: '1.0.0',
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.dayBoundary.value, to: val };
      } else if (key === 'trueSolarTime') {
        newProfile.rules.trueSolarTime = {
          value: Boolean(val),
          ruleId: val ? 'TRUE_SOLAR_TIME_ENABLED' : 'TRUE_SOLAR_TIME_DISABLED',
          version: '1.0.0',
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.trueSolarTime.value, to: val };
      } else if (key === 'yearBoundary') {
        newProfile.rules.yearBoundary = {
          value: val,
          ruleId: `YEAR_BOUNDARY_${val.toUpperCase()}`,
          version: '1.0.0',
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.yearBoundary.value, to: val };
      } else if (key === 'monthBoundary') {
        newProfile.rules.monthBoundary = {
          value: val,
          ruleId: `MONTH_BOUNDARY_${val.toUpperCase()}`,
          version: '1.0.0',
          overridden: true
        };
        newProfile.diff[key] = { from: baseProfile.rules.monthBoundary.value, to: val };
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
