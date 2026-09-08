// BaziJS 繁體中文語系集中定義 (zh-TW)
// 所有 UI 標籤、名詞與提示文字皆置於此，核心引擎邏輯不得以文字比對

export const zhTW = {
  // 基本欄位
  date: '日期',
  time: '時間',
  gender: {
    male: '男（乾造）',
    female: '女（坤造）'
  },
  pillars: {
    year: '年柱',
    month: '月柱',
    day: '日柱',
    hour: '時柱'
  },
  stem: '天干',
  branch: '地支',
  hiddenStems: '藏干',
  tenGod: '十神',
  nayin: '納音',
  twelveStages: '十二長生',
  kongWang: '旬空（空亡）',
  favorable: '喜用神',
  unfavorable: '忌神',
  dayMaster: '日主',
  strength: '日主強弱',
  score: '強弱得分',

  // 輔助神煞 / 胎宮
  auxiliary: {
    taiYuan: '胎元',
    taiXi: '胎息',
    mingGong: '命宮',
    shenGong: '身宮'
  },

  // 強弱級別
  strengthLevels: {
    extremelyStrong: '極強（從強）',
    strong: '偏強',
    balanced: '中和',
    weak: '偏弱',
    extremelyWeak: '極弱（從弱）'
  },

  // 運勢
  luckCycle: '大運',
  startAge: '起運年齡',
  transit: {
    year: '流年',
    month: '流月',
    day: '流日',
    hour: '流時'
  },

  // 神煞分類
  shenShaCategory: {
    auspicious: '吉神',
    inauspicious: '凶煞',
    neutral: '中性神煞'
  },

  // 錯誤訊息
  errors: {
    BIRTH_DATE_REQUIRED: '出生日期為必填欄位',
    GENDER_REQUIRED: '性別為必填欄位 (male 或 female)',
    BIRTH_DATE_OUT_OF_RANGE: '出生日期必須介於 1900-01-01 至 2100-12-31',
    INVALID_TIME_FORMAT: '出生時間格式不正確，應為 HH:mm',
    INVALID_BRANCH: '無效的時辰地支',
    INVALID_TIMEZONE: '無效的時區格式，例如 +08:00',
    CALENDAR_CONVERSION_FAILED: '公曆與農曆節氣轉換失敗'
  }
};
