// 輸入校驗模組（Validation Engine）
// 嚴格檢驗所有輸入參數，保證 1900-01-01 ~ 2100-12-31 邊界

import { BaziValidationError, BaziRangeError } from '../errors/index.js';
import { BRANCH_INDEX } from '../constants/branches.js';

export const YEAR_BOUNDARY_VALUES = Object.freeze(['lichun', 'lunar_new_year']);
export const MONTH_BOUNDARY_VALUES = Object.freeze(['jie', 'lunar_month']);
export const DAY_BOUNDARY_VALUES = Object.freeze(['23:00', '00:00']);
export const SHENSHA_PRESET_VALUES = Object.freeze(['minimal', 'classical', 'full']);

export function parseTimezoneOffset(timezone = '+08:00') {
  if (typeof timezone !== 'string') {
    throw new BaziValidationError('timezone 必須是字串，例如 "+08:00" 或 "-05:00"', 'timezone');
  }

  const match = timezone.match(/^([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!match) {
    throw new BaziValidationError('timezone 格式不正確，例如 "+08:00" 或 "-05:00"', 'timezone');
  }

  const hours = Number(match[2]);
  const minutes = Number(match[3] || 0);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || minutes > 59 || hours > 14 || (hours === 14 && minutes !== 0)) {
    throw new BaziValidationError('timezone 超出支援範圍，必須介於 UTC-14:00 至 UTC+14:00', 'timezone', {
      allowedRange: ['-14:00', '+14:00']
    });
  }

  const sign = match[1] === '-' ? -1 : 1;
  return sign * (hours + minutes / 60);
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function validateInput(input) {
  if (!input || typeof input !== 'object') {
    throw new BaziValidationError('輸入參數必須為物件', 'input');
  }

  // 1. birthDate 必要性與格式
  if (!input.birthDate || typeof input.birthDate !== 'string') {
    throw new BaziValidationError('birthDate 為必填字串，格式為 YYYY-MM-DD', 'birthDate');
  }

  const dateMatch = input.birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateMatch) {
    throw new BaziValidationError('birthDate 格式不正確，應為 YYYY-MM-DD', 'birthDate');
  }

  const [_, yStr, mStr, dStr] = dateMatch;
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr, 10);
  const day = parseInt(dStr, 10);

  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    throw new BaziValidationError('birthDate 包含無效的月份或日期數值', 'birthDate');
  }

  // 範圍保證：1900-01-01 ~ 2100-12-31
  if (year < 1900 || year > 2100) {
    throw new BaziRangeError(
      `出生日期年份 (${year}) 超出 SDK 保證範圍，必須介於 1900-01-01 至 2100-12-31`,
      'birthDate',
      { providedYear: year, allowedRange: ['1900-01-01', '2100-12-31'] }
    );
  }

  // 2. gender
  if (!input.gender || (input.gender !== 'male' && input.gender !== 'female')) {
    throw new BaziValidationError('gender 為必填欄位，且必須為 "male" 或 "female"', 'gender');
  }

  // 3. birthTimeMode
  const mode = input.birthTimeMode || (input.birthTime ? 'exact' : 'unknown');
  if (!['exact', 'branch', 'unknown'].includes(mode)) {
    throw new BaziValidationError('birthTimeMode 必須為 "exact"、"branch" 或 "unknown"', 'birthTimeMode');
  }

  // 若 exact 模式
  if (mode === 'exact') {
    if (typeof input.birthTime !== 'string' || !input.birthTime) {
      throw new BaziValidationError('birthTimeMode 為 "exact" 時必須提供 birthTime (HH:mm)', 'birthTime');
    }
    const timeMatch = input.birthTime.match(/^(\d{1,2}):(\d{2})$/);
    if (!timeMatch) {
      throw new BaziValidationError('birthTime 格式不正確，應為 HH:mm', 'birthTime');
    }
    const h = parseInt(timeMatch[1], 10);
    const m = parseInt(timeMatch[2], 10);
    if (h < 0 || h > 23 || m < 0 || m > 59) {
      throw new BaziValidationError('birthTime 包含無效之小時 (0-23) 或分鐘 (0-59)', 'birthTime');
    }
  }

  // 若 branch 模式
  if (mode === 'branch') {
    if (!input.birthHourBranch || BRANCH_INDEX[input.birthHourBranch] === undefined) {
      throw new BaziValidationError('birthTimeMode 為 "branch" 時必須提供有效的地支 birthHourBranch (如 "午")', 'birthHourBranch');
    }
  }

  // 4. 時區格式與數值範圍
  const timezone = input.timezone || '+08:00';
  parseTimezoneOffset(timezone);

  // 5. 規則選擇必須明確，避免拼字錯誤時靜默退回另一套規則。
  if (input.yearBoundary !== undefined && !YEAR_BOUNDARY_VALUES.includes(input.yearBoundary)) {
    throw new BaziValidationError('yearBoundary 必須為 "lichun" 或 "lunar_new_year"', 'yearBoundary');
  }
  if (input.monthBoundary !== undefined && !MONTH_BOUNDARY_VALUES.includes(input.monthBoundary)) {
    throw new BaziValidationError('monthBoundary 必須為 "jie" 或 "lunar_month"', 'monthBoundary');
  }
  if (input.dayBoundary !== undefined && !DAY_BOUNDARY_VALUES.includes(input.dayBoundary)) {
    throw new BaziValidationError('dayBoundary 必須為 "23:00" 或 "00:00"', 'dayBoundary');
  }
  if (input.shenshaPreset !== undefined && !SHENSHA_PRESET_VALUES.includes(input.shenshaPreset)) {
    throw new BaziValidationError('shenshaPreset 必須為 "minimal"、"classical" 或 "full"', 'shenshaPreset');
  }
  if (input.shenShaPreset !== undefined && !SHENSHA_PRESET_VALUES.includes(input.shenShaPreset)) {
    throw new BaziValidationError('shenShaPreset 必須為 "minimal"、"classical" 或 "full"', 'shenShaPreset');
  }

  if (input.trueSolarTime !== undefined && typeof input.trueSolarTime !== 'boolean') {
    throw new BaziValidationError('trueSolarTime 必須是 boolean', 'trueSolarTime');
  }

  if (input.location !== undefined) {
    if (!input.location || typeof input.location !== 'object' || Array.isArray(input.location)) {
      throw new BaziValidationError('location 必須是物件', 'location');
    }
    if (input.location.longitude !== undefined &&
      (!Number.isFinite(input.location.longitude) || input.location.longitude < -180 || input.location.longitude > 180)) {
      throw new BaziValidationError('location.longitude 必須介於 -180 至 180', 'location.longitude');
    }
    if (input.location.latitude !== undefined &&
      (!Number.isFinite(input.location.latitude) || input.location.latitude < -90 || input.location.latitude > 90)) {
      throw new BaziValidationError('location.latitude 必須介於 -90 至 90', 'location.latitude');
    }
  }

  return true;
}
