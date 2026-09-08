// 輸入校驗模組（Validation Engine）
// 嚴格檢驗所有輸入參數，保證 1900-01-01 ~ 2100-12-31 邊界

import { BaziValidationError, BaziRangeError } from '../errors/index.js';
import { BRANCH_INDEX } from '../constants/branches.js';

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

  if (month < 1 || month > 12 || day < 1 || day > 31) {
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
    if (!input.birthTime) {
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
    if (!input.birthHourBranch || !BRANCH_INDEX[input.birthHourBranch] === undefined) {
      throw new BaziValidationError('birthTimeMode 為 "branch" 時必須提供有效的地支 birthHourBranch (如 "午")', 'birthHourBranch');
    }
  }

  // 4. 時區格式
  const timezone = input.timezone || '+08:00';
  const tzMatch = timezone.match(/^([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!tzMatch) {
    throw new BaziValidationError('timezone 格式不正確，例如 "+08:00" 或 "-05:00"', 'timezone');
  }

  return true;
}
