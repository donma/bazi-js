// 官方預設 Profile: canonical
// 集中定義 canonical 流派各項規則配置

export const CANONICAL_PROFILE = {
  id: 'canonical',
  name: '官方正統（子平術規範）',
  description: '立春切年、十二節切月、23:00 子初換日、陰陽年與性別順逆大運、節氣差除以三起運',
  version: '1.0.0',

  rules: {
    // 年柱切界：'lichun' (立春) | 'lunar_new_year' (正月初一)
    yearBoundary: {
      value: 'lichun',
      ruleId: 'YEAR_BOUNDARY_LICHUN',
      version: '1.0.0'
    },

    // 月柱切界：'jie' (十二節切月) | 'lunar_month' (農曆初一換月)
    monthBoundary: {
      value: 'jie',
      ruleId: 'MONTH_BOUNDARY_JIE',
      version: '1.0.0'
    },

    // 日柱換日界線：'23:00' (子初換日) | '00:00' (民用午夜換日)
    dayBoundary: {
      value: '23:00',
      ruleId: 'DAY_BOUNDARY_ZISHI_2300',
      version: '1.0.0'
    },

    // 真太陽時：預設關閉
    trueSolarTime: {
      value: false,
      ruleId: 'TRUE_SOLAR_TIME_DISABLED',
      version: '1.0.0'
    },

    // 大運配置
    luckCycle: {
      directionRule: {
        value: 'gender-year-yinyang',
        ruleId: 'LUCK_DIR_GENDER_YINYANG',
        version: '1.0.0'
      },
      startAgeMethod: {
        value: 'jieqi-diff-divide-3',
        ruleId: 'LUCK_START_DIFF_DIV_3',
        version: '1.0.0'
      }
    },

    // 強弱引擎配置
    strength: {
      deLingWeight: 40,
      deDiWeight: 30,
      deShiWeight: 30,
      ruleId: 'STR_CANONICAL_DEFAULT',
      version: '1.0.0'
    }
  }
};
