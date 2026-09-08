// 刑沖會合害破（Interactions）引擎
// 完整計算命盤（四柱之間，或命盤與大運/流年之間）的關係：
// 1. 天干：五合、相沖
// 2. 地支：
//    - 三會局（方局：寅卯辰、巳午未、申酉戌、亥子丑）
//    - 三合局（長生帝旺墓：申子辰、亥卯未、寅午戌、巳酉丑）
//    - 半合（生地半合、旺地半合）
//    - 拱合（拱長生、拱帝旺）
//    - 六合（子丑、寅亥、卯戌、辰酉、巳申、午未）
//    - 六沖（子午、丑未、寅申、卯酉、辰戌、巳亥）
//    - 相刑（三刑：寅巳申、丑戌未；無禮：子卯；自刑：辰辰、午午、酉酉、亥亥）
//    - 六害（子未、丑午、寅巳、卯辰、申亥、酉戌）
//    - 相破（子酉、丑辰、寅亥、卯午、巳申、未戌）

import {
  SIX_COMBINATIONS,
  SIX_CLASHES,
  TRIPLE_COMBINATIONS,
  TRIPLE_MEETINGS,
  SIX_HARMS,
  SIX_DESTRUCTIONS,
  PUNISHMENTS,
  STEM_COMBINATIONS,
  STEM_CLASHES
} from '../core/constants/interactions-data.js';

export function calculateInteractions(pillars) {
  const stemItems = [
    { pillar: 'year', char: pillars.year.stem },
    { pillar: 'month', char: pillars.month.stem },
    { pillar: 'day', char: pillars.day.stem },
    ...(pillars.hour.available ? [{ pillar: 'hour', char: pillars.hour.stem }] : [])
  ];

  const branchItems = [
    { pillar: 'year', char: pillars.year.branch },
    { pillar: 'month', char: pillars.month.branch },
    { pillar: 'day', char: pillars.day.branch },
    ...(pillars.hour.available ? [{ pillar: 'hour', char: pillars.hour.branch }] : [])
  ];

  const stemsInteractions = [];
  const branchesInteractions = [];

  // ====================== 1. 天干互動 ======================
  for (let i = 0; i < stemItems.length; i++) {
    for (let j = i + 1; j < stemItems.length; j++) {
      const a = stemItems[i];
      const b = stemItems[j];

      // 五合
      const combo = STEM_COMBINATIONS.find(
        c => (c.pair[0] === a.char && c.pair[1] === b.char) || (c.pair[0] === b.char && c.pair[1] === a.char)
      );
      if (combo) {
        stemsInteractions.push({
          type: 'stem_combine',
          name: combo.name,
          generates: combo.generates,
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }

      // 天干相沖
      const clash = STEM_CLASHES.find(
        c => (c.pair[0] === a.char && c.pair[1] === b.char) || (c.pair[0] === b.char && c.pair[1] === a.char)
      );
      if (clash) {
        stemsInteractions.push({
          type: 'stem_clash',
          name: clash.name,
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }
    }
  }

  // ====================== 2. 地支多支局 (三會、三合、半合、拱合) ======================
  const branchChars = branchItems.map(b => b.char);

  // 三會局
  for (const meet of TRIPLE_MEETINGS) {
    if (meet.branches.every(b => branchChars.includes(b))) {
      const hitPillars = meet.branches.map(b => branchItems.find(item => item.char === b).pillar);
      branchesInteractions.push({
        type: 'triple_meeting',
        name: meet.name,
        element: meet.element,
        direction: meet.direction,
        pillars: hitPillars,
        chars: meet.branches
      });
    }
  }

  // 三合局
  for (const tri of TRIPLE_COMBINATIONS) {
    const present = tri.branches.filter(b => branchChars.includes(b));
    if (present.length === 3) {
      // 完整三合
      const hitPillars = tri.branches.map(b => branchItems.find(item => item.char === b).pillar);
      branchesInteractions.push({
        type: 'triple_combination',
        name: tri.name,
        element: tri.element,
        pillars: hitPillars,
        chars: tri.branches
      });
    } else if (present.length === 2) {
      // 半合或拱合（必須有旺支才算真正半合，無旺支為拱合）
      const hasWang = present.includes(tri.wang);
      const hitPillars = present.map(b => branchItems.find(item => item.char === b).pillar);

      if (hasWang) {
        const other = present.find(b => b !== tri.wang);
        const isShengWang = other === tri.sheng;
        const subName = isShengWang ? `${other}${tri.wang}生地半合${tri.element}` : `${tri.wang}${other}墓地半合${tri.element}`;
        branchesInteractions.push({
          type: 'half_combination',
          name: subName,
          element: tri.element,
          pillars: hitPillars,
          chars: present
        });
      } else {
        // 生與墓兩字都在，缺中神（如申與辰，缺子）-> 拱合
        branchesInteractions.push({
          type: 'arch_combination',
          name: `${present[0]}${present[1]}拱${tri.wang}（拱${tri.element}局）`,
          element: tri.element,
          archTarget: tri.wang,
          pillars: hitPillars,
          chars: present
        });
      }
    }
  }

  // ====================== 3. 地支兩兩互動 (六合、六沖、六害、相破、相刑) ======================
  for (let i = 0; i < branchItems.length; i++) {
    for (let j = i + 1; j < branchItems.length; j++) {
      const a = branchItems[i];
      const b = branchItems[j];

      // 六合
      const sixHe = SIX_COMBINATIONS.find(
        c => (c.branches[0] === a.char && c.branches[1] === b.char) || (c.branches[0] === b.char && c.branches[1] === a.char)
      );
      if (sixHe) {
        branchesInteractions.push({
          type: 'six_combination',
          name: sixHe.name,
          generates: sixHe.generates,
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }

      // 六沖
      const sixChong = SIX_CLASHES.find(
        c => (c.pair[0] === a.char && c.pair[1] === b.char) || (c.pair[0] === b.char && c.pair[1] === a.char)
      );
      if (sixChong) {
        branchesInteractions.push({
          type: 'six_clash',
          name: sixChong.name,
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }

      // 六害
      const harm = SIX_HARMS.find(
        c => (c.pair[0] === a.char && c.pair[1] === b.char) || (c.pair[0] === b.char && c.pair[1] === a.char)
      );
      if (harm) {
        branchesInteractions.push({
          type: 'six_harm',
          name: harm.name,
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }

      // 相破
      const destr = SIX_DESTRUCTIONS.find(
        c => (c.pair[0] === a.char && c.pair[1] === b.char) || (c.pair[0] === b.char && c.pair[1] === a.char)
      );
      if (destr) {
        branchesInteractions.push({
          type: 'six_destruction',
          name: destr.name,
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }

      // 自刑（辰辰、午午、酉酉、亥亥）
      if (a.char === b.char && ['辰', '午', '酉', '亥'].includes(a.char)) {
        branchesInteractions.push({
          type: 'punishment_self',
          name: `${a.char}${b.char}自刑`,
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }

      // 子卯相刑（無禮之刑）
      if ((a.char === '子' && b.char === '卯') || (a.char === '卯' && b.char === '子')) {
        branchesInteractions.push({
          type: 'punishment_uncivil',
          name: '子卯無禮之刑',
          pillars: [a.pillar, b.pillar],
          chars: [a.char, b.char]
        });
      }
    }
  }

  // ====================== 4. 三刑（寅巳申、丑戌未） ======================
  const checkThreeXing = (targetBranches, typeName) => {
    const present = targetBranches.filter(b => branchChars.includes(b));
    if (present.length >= 2) {
      const hitPillars = present.map(b => branchItems.find(item => item.char === b).pillar);
      const isComplete = present.length === 3;
      branchesInteractions.push({
        type: isComplete ? 'punishment_complete' : 'punishment_partial',
        name: isComplete ? `${typeName}全（${targetBranches.join('')}）` : `${typeName}半刑（見 ${present.join('、')}）`,
        pillars: hitPillars,
        chars: present
      });
    }
  };

  checkThreeXing(['寅', '巳', '申'], '無恩之刑');
  checkThreeXing(['丑', '戌', '未'], '恃勢之刑');

  return {
    stems: stemsInteractions,
    branches: branchesInteractions
  };
}
