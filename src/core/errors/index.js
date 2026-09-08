// BaziJS 錯誤型別定義

export class BaziError extends Error {
  constructor(message, code = 'BAZI_ERROR', details = {}) {
    super(message);
    this.name = 'BaziError';
    this.code = code;
    this.details = details;
  }
}

export class BaziValidationError extends BaziError {
  constructor(message, field = null, details = {}) {
    super(message, 'BAZI_VALIDATION_ERROR', { field, ...details });
    this.name = 'BaziValidationError';
    this.field = field;
  }
}

export class BaziRangeError extends BaziError {
  constructor(message, field = null, details = {}) {
    super(message, 'BIRTH_DATE_OUT_OF_RANGE', { field, ...details });
    this.name = 'BaziRangeError';
    this.field = field;
  }
}

export class BaziCalendarError extends BaziError {
  constructor(message, details = {}) {
    super(message, 'BAZI_CALENDAR_ERROR', details);
    this.name = 'BaziCalendarError';
  }
}

export class BaziRuleError extends BaziError {
  constructor(message, ruleId = null, details = {}) {
    super(message, 'BAZI_RULE_ERROR', { ruleId, ...details });
    this.name = 'BaziRuleError';
    this.ruleId = ruleId;
  }
}

export class BaziRenderError extends BaziError {
  constructor(message, details = {}) {
    super(message, 'BAZI_RENDER_ERROR', details);
    this.name = 'BaziRenderError';
  }
}
