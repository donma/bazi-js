export function matchPillarSet(context, set, pillar = 'day') {
  return context.target.pillar === pillar && set.includes(context.target.ganzhi);
}
