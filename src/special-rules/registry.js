import { SPECIAL_RULE_VERSION } from '../rules/versions.js';
import { SEASON_BRANCHES } from './context.js';

const CLASSICAL_ZIPING = 'classical-ziping';
const DAY_PILLAR = 'day-pillar-special';
const HOUR_PILLAR = 'hour-pillar-special';
const SEASONAL_DAY = 'seasonal-day-special';

const refs = (...references) => references.map(([title, locator, url, note]) => ({
  type: 'classical', title, locator, url, ...(note ? { note } : {})
}));

const pillarGanzhi = (context, pillar) => context.pillars[pillar] && context.pillars[pillar].ganzhi;

function fixedEvidence(context, pillar, values, originalBasis, notes = []) {
  const value = pillarGanzhi(context, pillar);
  return {
    matched: values.includes(value),
    basedOn: [`${pillar}Pillar`],
    targetPillar: pillar,
    targetValue: value,
    originalBasis,
    notes
  };
}

function seasonalEvidence(context, values, originalBasis, notes = []) {
  const dayPillar = pillarGanzhi(context, 'day');
  const validBranches = context.season ? SEASON_BRANCHES[context.season] : [];
  const matched = Boolean(context.season && values[context.season] && values[context.season].includes(dayPillar));
  return {
    matched,
    basedOn: ['monthBranch', 'dayPillar'],
    season: context.season,
    seasonSource: context.seasonSource,
    monthBranch: context.monthBranch,
    seasonBranches: validBranches,
    targetPillar: 'day',
    targetValue: dayPillar,
    originalBasis,
    notes
  };
}

const KUI_GANG = Object.freeze(['庚辰', '壬辰', '戊戌', '庚戌']);
const SHI_E_DA_BAI = Object.freeze(['甲辰', '乙巳', '丙申', '丁亥', '戊戌', '己丑', '庚辰', '辛巳', '壬申', '癸亥']);
const RI_GUI = Object.freeze(['丁酉', '丁亥', '癸巳', '癸卯']);
const RI_DE = Object.freeze(['甲寅', '丙辰', '戊辰', '庚辰', '壬戌']);
const BA_ZHUAN = Object.freeze(['甲寅', '乙卯', '己未', '丁未', '庚申', '辛酉', '戊戌', '癸丑']);
const JIU_CHOU = Object.freeze(['戊子', '戊午', '己卯', '己酉', '辛卯', '辛酉', '壬子', '壬午', '丁酉', '乙卯']);
const GU_LUAN = Object.freeze(['乙巳', '丁巳', '辛亥', '戊申', '甲寅', '丙午', '戊午', '壬子']);
const YIN_YANG_CHA_CUO = Object.freeze(['丙子', '丁丑', '戊寅', '辛卯', '壬辰', '癸巳', '丙午', '丁未', '戊申', '辛酉', '壬戌', '癸亥']);
const JIN_SHEN = Object.freeze(['癸酉', '己巳', '乙丑']);

const PILLAR_RULES = [
  {
    id: 'kui_gang', name: '魁罡', displayName: '魁罡', aliases: ['魁罡貴人'],
    tradition: CLASSICAL_ZIPING, conceptType: 'special-pillar', ruleFamily: DAY_PILLAR,
    baseOn: ['dayPillar'], scope: 'natal', category: 'neutral', confidence: 'classical',
    ruleId: 'SP_KUIGANG_001', version: SPECIAL_RULE_VERSION, tier: 'core', priority: 10,
    tags: ['special-day'], schools: ['classical-ziping'],
    references: refs(
      ['《三命通會》卷六', '魁罡', 'https://zh.wikisource.org/zh-hant/三命通會/卷六'],
      ['《淵海子平》', '魁罡', 'https://zh.wikisource.org/zh-hant/淵海子平']
    ),
    description: '日柱為庚辰、壬辰、戊戌、庚戌之一，即以魁罡特殊日柱條件記錄；不在此處推斷魁罡格成格。',
    variants: [{ id: 'four-day-core', description: '四柱固定日例：庚辰、壬辰、戊戌、庚戌。' }],
    researchNotes: { migratedFrom: 'SS_KUIGANG_017', note: '舊版將固定日柱誤掛在 ShenSha Catalog；本版只作 SpecialPillar 識別。' },
    match: (context) => KUI_GANG.includes(pillarGanzhi(context, 'day')),
    evidence: (context) => fixedEvidence(context, 'day', KUI_GANG, '固定日柱四日：庚辰、壬辰、戊戌、庚戌。')
  },
  {
    id: 'shi_e_da_bai', name: '十惡大敗日', displayName: '十惡大敗日', aliases: ['十惡大敗'],
    tradition: CLASSICAL_ZIPING, conceptType: 'special-pillar', ruleFamily: DAY_PILLAR,
    baseOn: ['dayPillar'], scope: 'natal', category: 'inauspicious', confidence: 'classical',
    ruleId: 'SP_SHIEDABAI_002', version: SPECIAL_RULE_VERSION, tier: 'core', priority: 11,
    tags: ['special-day'], schools: ['classical-ziping'],
    references: refs(
      ['《三命通會》卷五', '十惡大敗日', 'https://zh.wikisource.org/zh-hant/三命通會/卷五'],
      ['《淵海子平》', '十惡大敗', 'https://zh.wikisource.org/zh-hant/淵海子平']
    ),
    description: '日柱落在十惡大敗十日之一；這是日柱條件，不等同於整局必然凶敗。',
    variants: [{ id: 'ten-day-list', description: '甲辰、乙巳、丙申、丁亥、戊戌、己丑、庚辰、辛巳、壬申、癸亥。' }],
    researchNotes: { migratedFrom: 'SS_SHIEDABAI_022', note: '舊版將固定日柱誤掛在 ShenSha Catalog；本版移至 SpecialPillar。' },
    match: (context) => SHI_E_DA_BAI.includes(pillarGanzhi(context, 'day')),
    evidence: (context) => fixedEvidence(context, 'day', SHI_E_DA_BAI, '固定日柱十日：甲辰、乙巳、丙申、丁亥、戊戌、己丑、庚辰、辛巳、壬申、癸亥。')
  },
  {
    id: 'ri_gui', name: '日貴', displayName: '日貴', aliases: ['日貴格'],
    tradition: CLASSICAL_ZIPING, conceptType: 'special-pillar', ruleFamily: DAY_PILLAR,
    baseOn: ['dayPillar'], scope: 'natal', category: 'auspicious', confidence: 'classical',
    ruleId: 'SP_RIGUI_003', version: SPECIAL_RULE_VERSION, tier: 'core', priority: 12,
    tags: ['special-day', 'noble'], schools: ['classical-ziping'],
    references: refs(
      ['《三命通會》卷六', '日貴', 'https://zh.wikisource.org/zh-hant/三命通會/卷六'],
      ['《淵海子平》', '日貴', 'https://zh.wikisource.org/zh-hant/淵海子平']
    ),
    description: '日柱為丁酉、丁亥、癸巳、癸卯之一；日貴晝夜分例屬後續取用差異，本識別只標記日柱。',
    variants: [
      { id: 'day-night', description: '丁亥、癸卯常列晝貴；丁酉、癸巳常列夜貴，實際分配依版本。' }
    ],
    researchNotes: { note: '不以出生時刻替古籍日貴晝夜分例做單一化裁決，避免把日柱識別誤當完整格局。' },
    match: (context) => RI_GUI.includes(pillarGanzhi(context, 'day')),
    evidence: (context) => fixedEvidence(context, 'day', RI_GUI, '固定日柱四日：丁酉、丁亥、癸巳、癸卯。', ['晝貴/夜貴分配存版本差異。'])
  },
  {
    id: 'ri_de', name: '日德', displayName: '日德', aliases: ['日德格'],
    tradition: CLASSICAL_ZIPING, conceptType: 'special-pillar', ruleFamily: DAY_PILLAR,
    baseOn: ['dayPillar'], scope: 'natal', category: 'auspicious', confidence: 'classical',
    ruleId: 'SP_RIDE_004', version: SPECIAL_RULE_VERSION, tier: 'core', priority: 13,
    tags: ['special-day'], schools: ['classical-ziping'],
    references: refs(
      ['《三命通會》卷六', '日德', 'https://zh.wikisource.org/zh-hant/三命通會/卷六'],
      ['《淵海子平》', '日德', 'https://zh.wikisource.org/zh-hant/淵海子平']
    ),
    description: '日柱為甲寅、丙辰、戊辰、庚辰、壬戌之一；僅標記日德日例，完整日德格仍須考察整局。',
    variants: [{ id: 'five-day-list', description: '甲寅、丙辰、戊辰、庚辰、壬戌。' }],
    researchNotes: { note: '日德在古籍中常與格局取用並論；本規則不代替整局成格判斷。' },
    match: (context) => RI_DE.includes(pillarGanzhi(context, 'day')),
    evidence: (context) => fixedEvidence(context, 'day', RI_DE, '固定日柱五日：甲寅、丙辰、戊辰、庚辰、壬戌。')
  },
  {
    id: 'ba_zhuan', name: '八專', displayName: '八專', aliases: ['八專日'],
    tradition: CLASSICAL_ZIPING, conceptType: 'special-pillar', ruleFamily: DAY_PILLAR,
    baseOn: ['dayPillar'], scope: 'natal', category: 'neutral', confidence: 'classical',
    ruleId: 'SP_BAZHUAN_005', version: SPECIAL_RULE_VERSION, tier: 'core', priority: 14,
    tags: ['special-day'], schools: ['classical-ziping'],
    references: refs(
      ['《三命通會》卷六', '八專祿旺', 'https://zh.wikisource.org/zh-hant/三命通會/卷六'],
      ['《淵海子平》', '八專', 'https://zh.wikisource.org/zh-hant/淵海子平']
    ),
    description: '依《三命通會》八專日例，以甲寅、乙卯、己未、丁未、庚申、辛酉、戊戌、癸丑作固定日柱識別。',
    variants: [
      { id: 'four-day-core', description: '部分傳本或註家只取甲寅、乙卯、庚申、辛酉四日，稱八專祿旺核心。' },
      { id: 'eight-day-list', description: '本版保留卷六常見八日表，並於 evidence 記錄四日核心差異。' }
    ],
    researchNotes: { conflict: true, note: '八專有四日核心與八日擴展兩種用法；未把差異靜默合併成唯一格局。' },
    match: (context) => BA_ZHUAN.includes(pillarGanzhi(context, 'day')),
    evidence: (context) => fixedEvidence(context, 'day', BA_ZHUAN, '固定日柱八日表：甲寅、乙卯、己未、丁未、庚申、辛酉、戊戌、癸丑。', ['另有四日核心 variant。'])
  },
  {
    id: 'jiu_chou', name: '九醜', displayName: '九醜', aliases: ['九醜日'],
    tradition: CLASSICAL_ZIPING, conceptType: 'special-pillar', ruleFamily: DAY_PILLAR,
    baseOn: ['dayPillar'], scope: 'natal', category: 'inauspicious', confidence: 'classical',
    ruleId: 'SP_JIUCHOU_006', version: SPECIAL_RULE_VERSION, tier: 'core', priority: 15,
    tags: ['special-day'], schools: ['classical-ziping'],
    references: refs(
      ['《三命通會》卷三', '九醜日', 'https://zh.wikisource.org/zh-hant/三命通會_(四庫全書本)/卷03'],
      ['《欽定古今圖書集成》藝術典第728卷', '九醜', 'https://zh.wikisource.org/wiki/欽定古今圖書集成/博物彙編/藝術典/第728卷']
    ),
    description: '依《三命通會》原文所列十個干支日例識別；名稱為九醜，但原文列數與後世九日表存在衝突。',
    variants: [
      { id: 'sanming-ten-day-text', description: '戊子、戊午、己卯、己酉、辛卯、辛酉、壬子、壬午、丁酉、乙卯，共十日。', source: '《三命通會》卷三' },
      { id: 'later-nine-day-list', description: '後世常見九日表會刪減或改列，僅作研究 variant，不作本版預設。' }
    ],
    researchNotes: { conflict: true, note: '九醜的「九」與古籍原文十日列法不一致；預設採可逐字核對的卷三十日表。' },
    match: (context) => JIU_CHOU.includes(pillarGanzhi(context, 'day')),
    evidence: (context) => fixedEvidence(context, 'day', JIU_CHOU, '《三命通會》卷三所列十日，名稱與列數有文獻衝突。', ['採十日 variant；未假裝只有唯一九日表。'])
  },
  {
    id: 'gu_luan', name: '孤鸞', displayName: '孤鸞', aliases: ['孤鸞煞', '孤鸞日'],
    tradition: CLASSICAL_ZIPING, conceptType: 'special-pillar', ruleFamily: DAY_PILLAR,
    baseOn: ['dayPillar'], scope: 'natal', category: 'inauspicious', confidence: 'classical',
    ruleId: 'SP_GULUAN_007', version: SPECIAL_RULE_VERSION, tier: 'core', priority: 16,
    tags: ['special-day', 'marriage'], schools: ['classical-ziping'],
    references: refs(
      ['《三命通會》卷三', '孤鸞煞', 'https://zh.wikisource.org/zh-hant/三命通會_(四庫全書本)/卷03'],
      ['《三命通會》卷六', '孤鸞', 'https://zh.wikisource.org/zh-hant/三命通會/卷六']
    ),
    description: '依《三命通會》卷三所列八日作孤鸞特殊日柱識別，不把婚姻吉凶直接從單一日柱推定。',
    variants: [
      { id: 'sanming-eight-day-list', description: '乙巳、丁巳、辛亥、戊申、甲寅、丙午、戊午、壬子。', source: '《三命通會》卷三' },
      { id: 'legacy-conservative-five', description: '舊 BaziJS vNext 曾採乙巳、丁巳、辛亥、戊申、甲寅五柱。', source: 'BaziJS vNext legacy' }
    ],
    researchNotes: { conflict: true, migratedFrom: 'SS_GULUAN_043', note: '原典八日、舊版五日及後世增減並存；本版預設原典八日，保留五日差異。' },
    match: (context) => GU_LUAN.includes(pillarGanzhi(context, 'day')),
    evidence: (context) => fixedEvidence(context, 'day', GU_LUAN, '《三命通會》卷三所列八日：乙巳、丁巳、辛亥、戊申、甲寅、丙午、戊午、壬子。', ['與舊版五柱清單存在差異。'])
  },
  {
    id: 'yin_yang_cha_cuo', name: '陰陽差錯', displayName: '陰陽差錯', aliases: ['陰陽差錯日'],
    tradition: CLASSICAL_ZIPING, conceptType: 'special-pillar', ruleFamily: DAY_PILLAR,
    baseOn: ['dayPillar'], scope: 'natal', category: 'inauspicious', confidence: 'classical',
    ruleId: 'SP_YYCC_008', version: SPECIAL_RULE_VERSION, tier: 'core', priority: 17,
    tags: ['special-day', 'marriage'], schools: ['classical-ziping'],
    references: refs(
      ['《三命通會》卷三', '陰陽差錯', 'https://zh.wikisource.org/zh-hant/三命通會_(四庫全書本)/卷03'],
      ['《淵海子平》', '陰陽差錯', 'https://zh.wikisource.org/zh-hant/淵海子平']
    ),
    description: '日柱落在丙子、丁丑、戊寅、辛卯、壬辰、癸巳、丙午、丁未、戊申、辛酉、壬戌、癸亥十二日之一。',
    variants: [{ id: 'twelve-day-list', description: '固定日柱十二日表。' }],
    researchNotes: { migratedFrom: 'SS_YYCC_044', note: '舊版擺在 ShenSha extended；本版移至 SpecialPillar。' },
    match: (context) => YIN_YANG_CHA_CUO.includes(pillarGanzhi(context, 'day')),
    evidence: (context) => fixedEvidence(context, 'day', YIN_YANG_CHA_CUO, '固定日柱十二日表：丙子、丁丑、戊寅、辛卯、壬辰、癸巳、丙午、丁未、戊申、辛酉、壬戌、癸亥。')
  },
  {
    id: 'jin_shen', name: '金神', displayName: '金神', aliases: ['金神時'],
    tradition: CLASSICAL_ZIPING, conceptType: 'special-pillar', ruleFamily: HOUR_PILLAR,
    baseOn: ['hourPillar'], scope: 'natal', category: 'neutral', confidence: 'classical',
    ruleId: 'SP_JINSHEN_009', version: SPECIAL_RULE_VERSION, tier: 'core', priority: 18,
    tags: ['special-hour'], schools: ['classical-ziping'],
    references: refs(
      ['《淵海子平》', '金神', 'https://zh.wikisource.org/zh-hant/淵海子平'],
      ['《三命通會》卷六', '金神', 'https://zh.wikisource.org/zh-hant/三命通會/卷六']
    ),
    description: '時柱為癸酉、己巳、乙丑之一，即記錄金神時；火制、月令及全局取用屬後續格局判斷，並未在此單柱識別中硬判。',
    variants: [{ id: 'three-hour-list', description: '癸酉時、己巳時、乙丑時。' }],
    researchNotes: { note: '古籍對金神後續喜忌另有全局條件；本規則刻意只做 hour-pillar-special 偵測。' },
    match: (context) => JIN_SHEN.includes(pillarGanzhi(context, 'hour')),
    evidence: (context) => fixedEvidence(context, 'hour', JIN_SHEN, '固定時柱三例：癸酉、己巳、乙丑。', ['完整金神格取用不由單一時柱決定。'])
  }
];

const SEASONAL_RULES = [
  {
    id: 'tian_she', name: '天赦', displayName: '天赦', aliases: ['天赦日'],
    tradition: CLASSICAL_ZIPING, conceptType: 'seasonal-special', ruleFamily: SEASONAL_DAY,
    baseOn: ['monthBranch', 'dayPillar'], scope: 'natal', category: 'auspicious', confidence: 'classical',
    ruleId: 'SE_TIANSHE_001', version: SPECIAL_RULE_VERSION, tier: 'core', priority: 20,
    tags: ['seasonal', 'special-day'], schools: ['classical-ziping'],
    references: refs(
      ['《淵海子平》', '天赦', 'https://zh.wikisource.org/zh-hant/淵海子平'],
      ['《欽定協紀辨方書》卷五', '天赦', 'https://zh.wikisource.org/wiki/欽定協紀辨方書_(四庫全書本)/卷05']
    ),
    description: '天赦不是單一日柱神煞：春戊寅、夏甲午、秋戊申、冬甲子，須先依節令月支判定季節，再比對日柱。',
    variants: [{ id: 'four-season-day-list', description: '本版採春戊寅、夏甲午、秋戊申、冬甲子；其他曆書異文保留於 researchNotes。' }],
    researchNotes: { conflict: true, note: '天赦的季節邊界依節令而非國曆月份；日例在不同曆書有異文，本版沿用子平四季表並把季節 evidence 完整輸出。' },
    match: (context) => {
      const values = { spring: '戊寅', summer: '甲午', autumn: '戊申', winter: '甲子' };
      return Boolean(context.season && values[context.season] === pillarGanzhi(context, 'day'));
    },
    evidence: (context) => seasonalEvidence(context, { spring: ['戊寅'], summer: ['甲午'], autumn: ['戊申'], winter: ['甲子'] }, '春戊寅、夏甲午、秋戊申、冬甲子；以節令月支分季。', ['異本季節日例需以 references 逐版本核對。'])
  },
  {
    id: 'si_fei', name: '四廢', displayName: '四廢', aliases: ['四廢日'],
    tradition: CLASSICAL_ZIPING, conceptType: 'seasonal-special', ruleFamily: SEASONAL_DAY,
    baseOn: ['monthBranch', 'dayPillar'], scope: 'natal', category: 'inauspicious', confidence: 'classical',
    ruleId: 'SE_SIFEI_002', version: SPECIAL_RULE_VERSION, tier: 'core', priority: 21,
    tags: ['seasonal', 'special-day'], schools: ['classical-ziping'],
    references: refs(
      ['《三命通會》卷六', '四廢日例', 'https://zh.wikisource.org/zh-hant/三命通會/卷六'],
      ['《淵海子平》', '四廢', 'https://zh.wikisource.org/zh-hant/淵海子平']
    ),
    description: '春庚申辛酉、夏壬子癸亥、秋甲寅乙卯、冬丙午丁巳；必須同時符合季節（月令）與日柱。',
    variants: [{ id: 'four-season-day-list', description: '春庚申辛酉、夏壬子癸亥、秋甲寅乙卯、冬丙午丁巳。' }],
    researchNotes: { conflict: true, migratedFrom: 'SS_SIFEI_045', note: '舊版雖有 monthBranch 條件，仍混在 ShenSha；本版將 season/month evidence 獨立輸出。' },
    match: (context) => {
      const values = { spring: ['庚申', '辛酉'], summer: ['壬子', '癸亥'], autumn: ['甲寅', '乙卯'], winter: ['丙午', '丁巳'] };
      return Boolean(context.season && values[context.season] && values[context.season].includes(pillarGanzhi(context, 'day')));
    },
    evidence: (context) => seasonalEvidence(context, { spring: ['庚申', '辛酉'], summer: ['壬子', '癸亥'], autumn: ['甲寅', '乙卯'], winter: ['丙午', '丁巳'] }, '春庚申辛酉、夏壬子癸亥、秋甲寅乙卯、冬丙午丁巳。', ['季節以月支寅卯辰、巳午未、申酉戌、亥子丑歸類。'])
  }
];

export const SPECIAL_PILLAR_RULES = Object.freeze(PILLAR_RULES);
export const SEASONAL_SPECIAL_RULES = Object.freeze(SEASONAL_RULES);
export const SPECIAL_RULE_REGISTRY = Object.freeze([...PILLAR_RULES, ...SEASONAL_RULES]);

export { KUI_GANG, SHI_E_DA_BAI, RI_GUI, RI_DE, BA_ZHUAN, JIU_CHOU, GU_LUAN, YIN_YANG_CHA_CUO, JIN_SHEN };
