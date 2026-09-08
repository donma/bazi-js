// AI Context 模組
// 規範要求：
// 提供 Bazi.AI.toContext(result, options)
// 去除 UI layout、SVG、不必要重複欄位與 Renderer metadata。
// 保留：四柱、十神、藏干、五行、強弱、合沖刑害、神煞、大運、流運、ruleId、evidence、profile、version。
// 專供大型語言模型 (LLM) 作為 system prompt 或 context 注入，嚴禁直接讓 LLM 自行猜算八字。

export function toContext(result, options = {}) {
  const {
    compact = true,
    includeRules = true,
    includeEvidence = true,
    includeShenShaEvidence = true,
    includeStrengthEvidence = true,
    includeInteractions = true,
    maxLuckCycles = 6
  } = options;

  const ctx = {
    metadata: {
      engine: 'BaziJS',
      engineVersion: result.meta.engineVersion,
      ruleSetVersion: result.meta.ruleSetVersion,
      profileId: result.meta.profileId
    },

    inputSummary: {
      birthDate: result.input.birthDate,
      birthTime: result.input.birthTime || '未知',
      gender: result.input.gender === 'male' ? '乾造（男）' : '坤造（女）',
      timezone: result.input.timezone,
      trueSolarTimeUsed: result.accuracy.trueSolarTimeUsed
    },

    pillars: {
      year: {
        ganzhi: result.pillars.year.ganzhi,
        stem: result.pillars.year.stem,
        branch: result.pillars.year.branch,
        tenGod: result.tenGods.stems.year ? result.tenGods.stems.year.full : null,
        nayin: result.nayin.year,
        hidden: result.tenGods.hidden.year.map(h => `${h.stem}(${h.tenGod.full})`)
      },
      month: {
        ganzhi: result.pillars.month.ganzhi,
        stem: result.pillars.month.stem,
        branch: result.pillars.month.branch,
        tenGod: result.tenGods.stems.month ? result.tenGods.stems.month.full : null,
        nayin: result.nayin.month,
        hidden: result.tenGods.hidden.month.map(h => `${h.stem}(${h.tenGod.full})`)
      },
      day: {
        ganzhi: result.pillars.day.ganzhi,
        stem: result.pillars.day.stem,
        branch: result.pillars.day.branch,
        tenGod: '日主（元神）',
        nayin: result.nayin.day,
        hidden: result.tenGods.hidden.day.map(h => `${h.stem}(${h.tenGod.full})`)
      },
      hour: result.pillars.hour.available ? {
        ganzhi: result.pillars.hour.ganzhi,
        stem: result.pillars.hour.stem,
        branch: result.pillars.hour.branch,
        tenGod: result.tenGods.stems.hour ? result.tenGods.stems.hour.full : null,
        nayin: result.nayin.hour,
        hidden: result.tenGods.hidden.hour.map(h => `${h.stem}(${h.tenGod.full})`)
      } : { available: false, reason: '時間未知' }
    },

    dayMaster: {
      stem: result.strength.dayMaster,
      elementScore: result.strength.score,
      strengthLevel: result.strength.level,
      favorableElements: result.strength.favorableElements,
      unfavorableElements: result.strength.unfavorableElements,
      ...(includeStrengthEvidence ? { strengthEvidence: result.strength.evidence } : {})
    },

    fiveElementsDistribution: result.strength.distribution,

    kongWang: {
      byDay: result.kongWang.byDay.branches,
      byYear: result.kongWang.byYear.branches
    },

    auxiliary: {
      taiYuan: result.auxiliary.taiYuan ? result.auxiliary.taiYuan.ganzhi : null,
      taiXi: result.auxiliary.taiXi ? result.auxiliary.taiXi.ganzhi : null,
      mingGong: result.auxiliary.mingGong ? result.auxiliary.mingGong.ganzhi : null,
      shenGong: result.auxiliary.shenGong ? result.auxiliary.shenGong.ganzhi : null
    },

    shenShaList: result.shenSha.map(s => ({
      name: s.name,
      category: s.category,
      hitOn: s.hitOn,
      ruleId: includeRules ? s.ruleId : undefined,
      reference: s.reference,
      ...(includeShenShaEvidence ? { evidence: s.evidence } : {})
    })),

    ...(includeInteractions ? {
      interactions: {
        stems: result.interactions.stems.map(s => s.name),
        branches: result.interactions.branches.map(b => b.name)
      }
    } : {}),

    luckCyclesSummary: {
      direction: result.luckCycles.directionText,
      startAge: result.luckCycles.startAge.display,
      startDate: result.luckCycles.startAge.startDate,
      cycles: result.luckCycles.cycles.slice(0, maxLuckCycles).map(c => ({
        step: c.step,
        ganzhi: c.ganzhi,
        ageRange: `${c.fromAge}~${c.toAge}歲`,
        tenGodStem: c.tenGodStem ? c.tenGodStem.full : '',
        nayin: c.nayin
      }))
    }
  };

  if (compact) {
    return JSON.stringify(ctx);
  }
  return ctx;
}
