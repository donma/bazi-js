// ShenSha vNext P0/P1 擴充規則。
// 不同流派有分歧的規則保留於 variants/researchNotes，不在引擎內靜默合併。

import { isBaseActive } from '../../utils/context.js';

const branches = '子丑寅卯辰巳午未申酉戌亥';
const branchAt = (branch, offset) => branches[(branches.indexOf(branch) + offset + 12) % 12];
const matchMap = (context, baseKey, map) => {
  if (!isBaseActive(context, baseKey)) return false;
  const base = context.bases[baseKey];
  const expected = map[base];
  const values = Array.isArray(expected) ? expected : [expected];
  return values.includes(context.target.branch);
};
const matchStemMap = (context, baseKeys, map) => baseKeys.some((key) => {
  if (!isBaseActive(context, key)) return false;
  const expected = map[context.bases[key]];
  return (Array.isArray(expected) ? expected : [expected]).includes(context.target.branch);
});
const matchPillarSet = (context, baseKey, set) => (
  isBaseActive(context, baseKey) && context.target.pillar === 'day' && set.includes(context.target.ganzhi)
);

const refs = (title, note) => [{ type: 'classical', title, note }];
const rule = (definition) => ({
  aliases: [],
  tags: [],
  schools: ['classical'],
  priority: 50,
  version: '2.0.0',
  ...definition
});

const YANG_REN = { 甲: '卯', 乙: '寅', 丙: '午', 丁: '巳', 戊: '午', 己: '巳', 庚: '酉', 辛: '申', 壬: '子', 癸: '亥' };
const GUO_YIN = { 甲: '戌', 乙: '亥', 丙: '丑', 丁: '寅', 戊: '丑', 己: '寅', 庚: '辰', 辛: '巳', 壬: '未', 癸: '申' };
const XUE_TANG_BY_NAYIN = { 金: '巳', 木: '亥', 水: '申', 火: '寅', 土: '申' };
const CI_GUAN_BY_NAYIN = { 金: '申', 木: '寅', 水: '亥', 火: '巳', 土: '亥' };
const CI_GUAN_COMMON = { 甲: '庚寅', 乙: '辛卯', 丙: '乙巳', 丁: '戊午', 戊: '丁巳', 己: '庚午', 庚: '壬申', 辛: '癸酉', 壬: '癸亥', 癸: '壬戌' };
const XUE_TANG_COMMON = { 甲: '丙寅', 乙: '丁卯', 丙: '戊申', 丁: '己酉', 戊: '庚申', 己: '辛酉', 庚: '壬寅', 辛: '癸卯', 壬: '甲申', 癸: '乙酉' };
const YIN_YANG_CHA_CUO = ['丙子', '丁丑', '戊寅', '辛卯', '壬辰', '癸巳', '丙午', '丁未', '戊申', '辛酉', '壬戌', '癸亥'];
const GU_LUAN = ['乙巳', '丁巳', '辛亥', '戊申', '甲寅'];

const FU_XING = { 甲: ['寅', '子'], 乙: ['卯', '亥'], 丙: ['寅', '子'], 丁: ['酉', '亥'], 戊: ['卯'], 己: ['巳'], 庚: ['午'], 辛: ['申'], 壬: ['辰'], 癸: ['亥'] };
const TIAN_CHU = { 甲: '巳', 乙: '午', 丙: '巳', 丁: '午', 戊: '申', 己: '酉', 庚: '亥', 辛: '子', 壬: '寅', 癸: '卯' };
const TIAN_GUAN = { 甲: '未', 乙: '辰', 丙: '巳', 丁: '酉', 戊: '戌', 己: '卯', 庚: '亥', 辛: '申', 壬: '寅', 癸: '午' };
const TIAN_FU = { 甲: '酉', 乙: '申', 丙: '子', 丁: '亥', 戊: '卯', 己: '寅', 庚: '午', 辛: '巳', 壬: '午', 癸: '巳' };
const ZAI_SHA = { 申: '午', 子: '午', 辰: '午', 寅: '子', 午: '子', 戌: '子', 巳: '卯', 酉: '卯', 丑: '卯', 亥: '酉', 卯: '酉', 未: '酉' };
const BAI_HU = { 申: '戌', 子: '戌', 辰: '戌', 寅: '辰', 午: '辰', 戌: '辰', 巳: '丑', 酉: '丑', 丑: '丑', 亥: '未', 卯: '未', 未: '未' };

export const EXTENDED_SHENSHA = [
  rule({ id: 'fei_ren', name: '飛刃', displayName: '飛刃', category: 'inauspicious', tags: ['blade'], tier: 'extended', priority: 25, confidence: 'traditional', baseOn: ['dayStem'], target: 'branch', ruleId: 'SS_FEIREN_023', references: refs('《三命通會》', '以羊刃對沖位論飛刃'), description: '以日干羊刃之對沖支判定。', match: (c) => matchStemMap(c, ['dayStem'], Object.fromEntries(Object.entries(YANG_REN).map(([k, v]) => [k, branchAt(v, 6)]))) }),
  rule({ id: 'liu_jia_kong_wang', name: '空亡', displayName: '空亡（六甲空亡）', aliases: ['旬空', '六甲空亡'], category: 'neutral', tags: ['xunkong'], tier: 'extended', priority: 20, confidence: 'classical', baseOn: ['dayPillar'], target: 'branch', ruleId: 'SS_XUNKONG_024', references: refs('《三命通會》', '六甲旬中空亡兩支'), description: '以日柱所在旬計算兩個空亡地支。', match: (c) => isBaseActive(c, 'dayPillar') && c.dayXunKong.emptyBranches.includes(c.target.branch) }),
  rule({ id: 'ci_guan', name: '詞館', displayName: '詞館', aliases: ['學館詞館'], category: 'auspicious', tags: ['nayin', 'literary'], tier: 'extended', priority: 34, confidence: 'school-specific', baseOn: ['dayStem', 'yearPillar'], target: 'branch', ruleId: 'SS_CIGUAN_025', references: refs('《三命通會》相關詞館訣', '納音派與干支定柱法並存'), variants: [{ id: 'nayin', description: '以年柱納音五行取詞館支。' }, { id: 'stem-pillar', description: '以日干取固定詞館干支。' }], researchNotes: { conflict: true, note: '詞館各書取法不一，保留兩種比對證據。' }, description: '同時保留納音派與固定干支派，避免覆蓋流派差異。', match: (c) => {
    if (c.target.pillar === 'year') return false;
    if (isBaseActive(c, 'yearPillar') && CI_GUAN_BY_NAYIN[c.bases.yearPillar.nayin && c.bases.yearPillar.nayin.slice(-1)] === c.target.branch) return true;
    if (isBaseActive(c, 'dayStem') && CI_GUAN_COMMON[c.bases.dayStem] === c.target.ganzhi) return true;
    return false;
  } }),
  rule({ id: 'guo_yin_gui_ren', name: '國印貴人', displayName: '國印貴人', category: 'auspicious', tags: ['noble'], tier: 'extended', priority: 35, confidence: 'traditional', baseOn: ['dayStem', 'yearStem'], target: 'branch', ruleId: 'SS_GYGR_026', references: refs('《三命通會》', '以日干或年干查國印貴人'), description: '以日干、年干查國印貴人支。', match: (c) => matchStemMap(c, ['dayStem', 'yearStem'], GUO_YIN) }),
  rule({ id: 'xue_tang', name: '學堂', displayName: '學堂', category: 'auspicious', tags: ['nayin', 'literary'], tier: 'extended', priority: 36, confidence: 'school-specific', baseOn: ['dayStem', 'yearPillar'], target: 'branch', ruleId: 'SS_XUETANG_027', references: refs('《三命通會》相關學堂訣', '納音派與固定干支法並存'), variants: [{ id: 'nayin', description: '以年柱納音五行取學堂支。' }, { id: 'stem-pillar', description: '以日干取固定學堂干支。' }], researchNotes: { conflict: true, note: '學堂各家有納音、干支兩套常用法。' }, description: '同時支援納音派與固定干支派。', match: (c) => {
    if (isBaseActive(c, 'yearPillar') && XUE_TANG_BY_NAYIN[c.bases.yearPillar.nayin && c.bases.yearPillar.nayin.slice(-1)] === c.target.branch) return true;
    return isBaseActive(c, 'dayStem') && XUE_TANG_COMMON[c.bases.dayStem] === c.target.ganzhi;
  } }),
  rule({ id: 'pi_ma', name: '披麻', displayName: '披麻', category: 'inauspicious', tags: ['mourning'], tier: 'extended', priority: 38, confidence: 'traditional', baseOn: ['yearBranch', 'dayBranch'], target: 'branch', ruleId: 'SS_PIMA_028', references: refs('《三命通會》', '披麻以年支或日支三合局取法'), description: '以年支、日支取披麻支。', match: (c) => matchMap(c, 'yearBranch', { 子: '酉', 丑: '戌', 寅: '亥', 卯: '子', 辰: '丑', 巳: '寅', 午: '卯', 未: '辰', 申: '巳', 酉: '午', 戌: '未', 亥: '申' }) || matchMap(c, 'dayBranch', { 子: '酉', 丑: '戌', 寅: '亥', 卯: '子', 辰: '丑', 巳: '寅', 午: '卯', 未: '辰', 申: '巳', 酉: '午', 戌: '未', 亥: '申' }) }),
  rule({ id: 'xue_ren', name: '血刃', displayName: '血刃', category: 'inauspicious', tags: ['injury'], tier: 'extended', priority: 39, confidence: 'traditional', baseOn: ['dayStem', 'monthBranch'], target: 'branch', ruleId: 'SS_XUEREN_029', references: refs('《三命通會》相關血刃訣', '日干、月令兩種常見取法並列'), researchNotes: { conflict: true, note: '血刃常見按日干或按月支起例，兩者不互相覆蓋。' }, match: (c) => matchStemMap(c, ['dayStem'], { 甲: '卯', 乙: '辰', 丙: '午', 丁: '未', 戊: '午', 己: '未', 庚: '酉', 辛: '戌', 壬: '子', 癸: '丑' }) || matchMap(c, 'monthBranch', { 寅: '丑', 卯: '未', 辰: '寅', 巳: '申', 午: '卯', 未: '酉', 申: '辰', 酉: '戌', 戌: '巳', 亥: '亥', 子: '午', 丑: '子' }) }),
  rule({ id: 'fu_xing_gui_ren', name: '福星貴人', displayName: '福星貴人', category: 'auspicious', tags: ['noble'], tier: 'extended', priority: 45, confidence: 'traditional', baseOn: ['dayStem', 'yearStem'], target: 'branch', ruleId: 'SS_FXGR_030', references: refs('《三命通會》福星貴人訣', '甲丙寅子、乙癸卯亥等取法'), match: (c) => matchStemMap(c, ['dayStem', 'yearStem'], FU_XING) }),
  rule({ id: 'tian_chu_gui_ren', name: '天廚貴人', displayName: '天廚貴人', category: 'auspicious', tags: ['noble'], tier: 'extended', priority: 46, confidence: 'traditional', baseOn: ['dayStem', 'yearStem'], target: 'branch', ruleId: 'SS_TCGR_031', references: refs('《三命通會》天廚貴人訣', '以日干、年干查天廚'), match: (c) => matchStemMap(c, ['dayStem', 'yearStem'], TIAN_CHU) }),
  rule({ id: 'tian_guan_gui_ren', name: '天官貴人', displayName: '天官貴人', category: 'auspicious', tags: ['noble'], tier: 'extended', priority: 47, confidence: 'traditional', baseOn: ['dayStem', 'yearStem'], target: 'branch', ruleId: 'SS_TGGR_032', references: refs('《三命通會》天官貴人訣', '甲未乙辰丙巳丁酉等取法'), match: (c) => matchStemMap(c, ['dayStem', 'yearStem'], TIAN_GUAN) }),
  rule({ id: 'tian_fu_gui_ren', name: '天福貴人', displayName: '天福貴人', category: 'auspicious', tags: ['noble'], tier: 'extended', priority: 48, confidence: 'traditional', baseOn: ['dayStem', 'yearStem'], target: 'branch', ruleId: 'SS_TFGR_033', references: refs('《三命通會》天福貴人訣', '以正官所臨祿位取法'), match: (c) => matchStemMap(c, ['dayStem', 'yearStem'], TIAN_FU) }),
  rule({ id: 'zai_sha', name: '災煞', displayName: '災煞', category: 'inauspicious', tags: ['sha'], tier: 'extended', priority: 52, confidence: 'traditional', baseOn: ['yearBranch', 'dayBranch'], target: 'branch', ruleId: 'SS_ZAISHA_034', references: refs('《三命通會》神煞三合局訣', '三合局對沖位取災煞'), match: (c) => matchMap(c, 'yearBranch', ZAI_SHA) || matchMap(c, 'dayBranch', ZAI_SHA) }),
  rule({ id: 'yuan_chen', name: '元辰', displayName: '元辰', category: 'inauspicious', tags: ['sha', 'gender-dependent'], tier: 'extended', priority: 53, confidence: 'traditional', baseOn: ['yearBranch'], target: 'branch', ruleId: 'SS_YUANCHEN_035', references: refs('《三命通會》元辰訣', '陰陽男女分順逆取元辰'), researchNotes: { conflict: true, note: '元辰順逆與男女、年干陰陽綁定；本版保留明確男女分支。' }, match: (c) => {
    if (!isBaseActive(c, 'yearBranch')) return false;
    const offset = (c.yearStemYinYang === 'yang') === (c.gender === 'male') ? 7 : 5;
    return c.target.branch === branchAt(c.bases.yearBranch, offset);
  } }),
  rule({ id: 'gou_shen', name: '勾神', displayName: '勾神', category: 'inauspicious', tags: ['sha'], tier: 'extended', priority: 54, confidence: 'traditional', baseOn: ['yearBranch'], target: 'branch', ruleId: 'SS_GOUSHEN_036', references: refs('《三命通會》勾神絞煞訣', '年支順數三位'), match: (c) => isBaseActive(c, 'yearBranch') && c.target.branch === branchAt(c.bases.yearBranch, 3) }),
  rule({ id: 'jiao_sha', name: '絞煞', displayName: '絞煞', category: 'inauspicious', tags: ['sha'], tier: 'extended', priority: 55, confidence: 'traditional', baseOn: ['yearBranch'], target: 'branch', ruleId: 'SS_JIAOSHA_037', references: refs('《三命通會》勾神絞煞訣', '年支順數五位'), match: (c) => isBaseActive(c, 'yearBranch') && c.target.branch === branchAt(c.bases.yearBranch, 5) }),
  rule({ id: 'sang_men', name: '喪門', displayName: '喪門', category: 'inauspicious', tags: ['mourning'], tier: 'extended', priority: 56, confidence: 'traditional', baseOn: ['yearBranch'], target: 'branch', ruleId: 'SS_SANGMEN_038', references: refs('《三命通會》歲煞訣', '年支順數二位'), match: (c) => isBaseActive(c, 'yearBranch') && c.target.branch === branchAt(c.bases.yearBranch, 2) }),
  rule({ id: 'diao_ke', name: '吊客', displayName: '吊客', category: 'inauspicious', tags: ['mourning'], tier: 'extended', priority: 57, confidence: 'traditional', baseOn: ['yearBranch'], target: 'branch', ruleId: 'SS_DIAOKE_039', references: refs('《三命通會》歲煞訣', '年支逆數二位'), match: (c) => isBaseActive(c, 'yearBranch') && c.target.branch === branchAt(c.bases.yearBranch, 10) }),
  rule({ id: 'bai_hu', name: '白虎', displayName: '白虎', category: 'inauspicious', tags: ['sha'], tier: 'extended', priority: 58, confidence: 'traditional', baseOn: ['yearBranch'], target: 'branch', ruleId: 'SS_BAIHU_040', references: refs('《三命通會》白虎歲煞訣', '三合局取白虎位'), match: (c) => matchMap(c, 'yearBranch', BAI_HU) }),
  rule({ id: 'tian_luo', name: '天羅', displayName: '天羅', category: 'inauspicious', tags: ['net'], tier: 'extended', priority: 59, confidence: 'traditional', baseOn: ['dayStem'], target: 'branch', ruleId: 'SS_TIANLUO_041', references: refs('《三命通會》天羅地網訣', '火命戌亥為天羅'), description: '火日主見戌、亥為天羅。', match: (c) => isBaseActive(c, 'dayStem') && ['丙', '丁'].includes(c.bases.dayStem) && ['戌', '亥'].includes(c.target.branch) }),
  rule({ id: 'di_wang', name: '地網', displayName: '地網', category: 'inauspicious', tags: ['net'], tier: 'extended', priority: 60, confidence: 'traditional', baseOn: ['dayStem'], target: 'branch', ruleId: 'SS_DIWANG_042', references: refs('《三命通會》天羅地網訣', '水命辰巳為地網'), description: '水日主見辰、巳為地網。', match: (c) => isBaseActive(c, 'dayStem') && ['壬', '癸'].includes(c.bases.dayStem) && ['辰', '巳'].includes(c.target.branch) }),
  rule({ id: 'gu_luan', name: '孤鸞', displayName: '孤鸞', category: 'inauspicious', tags: ['marriage'], tier: 'extended', priority: 61, confidence: 'school-specific', baseOn: ['dayPillar'], target: 'pillar', ruleId: 'SS_GULUAN_043', references: refs('《三命通會》孤鸞煞日例', '固定日柱清單各家略有差異'), researchNotes: { conflict: true, note: '固定日柱清單存在增減，本版採保守常見五柱。' }, match: (c) => matchPillarSet(c, 'dayPillar', GU_LUAN) }),
  rule({ id: 'yin_yang_cha_cuo', name: '陰陽差錯', displayName: '陰陽差錯', category: 'inauspicious', tags: ['marriage'], tier: 'extended', priority: 62, confidence: 'traditional', baseOn: ['dayPillar'], target: 'pillar', ruleId: 'SS_YYCC_044', references: refs('《三命通會》陰陽差錯日例', '固定日柱清單'), match: (c) => matchPillarSet(c, 'dayPillar', YIN_YANG_CHA_CUO) }),
  rule({ id: 'si_fei', name: '四廢', displayName: '四廢', category: 'inauspicious', tags: ['seasonal'], tier: 'extended', priority: 63, confidence: 'traditional', baseOn: ['monthBranch', 'dayPillar'], target: 'pillar', ruleId: 'SS_SIFEI_045', references: refs('《三命通會》四廢日例', '按春夏秋冬月令取四廢日'), match: (c) => {
    if (!isBaseActive(c, 'dayPillar') || c.target.pillar !== 'day' || !c.target.ganzhi) return false;
    const sets = {
      spring: ['庚申', '辛酉'], summer: ['壬子', '癸亥'], autumn: ['甲寅', '乙卯'], winter: ['丙午', '丁巳']
    };
    const season = ['寅', '卯', '辰'].includes(c.bases.monthBranch) ? 'spring' : ['巳', '午', '未'].includes(c.bases.monthBranch) ? 'summer' : ['申', '酉', '戌'].includes(c.bases.monthBranch) ? 'autumn' : 'winter';
    return sets[season].includes(c.target.ganzhi);
  } })
];
