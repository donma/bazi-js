export function matchBranchMap(context, baseKeys, map) {
  return baseKeys.some((key) => {
    if (context.activeBase && context.activeBase !== key) return false;
    const value = map[context.bases[key]];
    return (Array.isArray(value) ? value : [value]).includes(context.target.branch);
  });
}
