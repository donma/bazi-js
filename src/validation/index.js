// 驗證資料 manifest 與統計工具。
// 完整 fixture 留在 validation/，SDK 只提供小型、可版本化的索引，避免把
// 大量外部 observation 打進瀏覽器 bundle；Lab 或使用端可再 fetch fixture。

const VALIDATION_MANIFEST = {
  schemaVersion: '1.0.0',
  manifestId: 'bazi-js-validation-manifest',
  manifestVersion: '1.0.0',
  generatedAt: '2026-09-10',
  datasets: [
    {
      datasetId: 'bazi-js-independent-boundary-round-03',
      label: '第一輪跨邊界交叉驗證',
      capturedAt: '2026-09-10',
      fixture: 'validation/external/round-03-boundary-samples.json',
      report: 'validation/reports/round-03-boundary-cross-validation.md',
      sourceIds: ['openfate-bazi-engine'],
      scope: ['pillars', 'solar-term-boundary', 'timezone', 'zi-hour', 'true-solar-time'],
      cases: 34,
      classifications: { match: 28, difference: 6, undetermined: 0 },
      canonicalChangeRequired: 0,
      status: 'pinned-observation'
    },
    {
      datasetId: 'bazi-js-independent-second-engine-round-04',
      label: '第二獨立引擎交叉驗證',
      capturedAt: '2026-09-10',
      fixture: 'validation/external/round-04-second-engine.json',
      report: 'validation/reports/round-04-second-engine.md',
      sourceIds: ['baziflow-core'],
      scope: ['pillars', 'true-solar-time'],
      cases: 16,
      classifications: { match: 16, difference: 0, undetermined: 0 },
      canonicalChangeRequired: 0,
      status: 'pinned-observation'
    }
  ],
  totals: {
    cases: 50,
    classifications: { match: 44, difference: 6, undetermined: 0 },
    sources: 2
  }
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function increment(target, key) {
  target[key] = (target[key] || 0) + 1;
}

/**
 * Return the small, versioned index of external validation datasets.
 * Full fixture content is intentionally not bundled into the runtime SDK.
 */
export function getValidationManifest() {
  return clone(VALIDATION_MANIFEST);
}

/**
 * Summarize a loaded validation fixture without treating it as canonical truth.
 * Case classification follows adjudication; observation counts are reported
 * separately so multi-source fixtures cannot be mistaken for case counts.
 */
export function summarizeValidationDataset(dataset) {
  const cases = Array.isArray(dataset?.cases) ? dataset.cases : [];
  const classifications = { match: 0, difference: 0, undetermined: 0 };
  const groups = {};
  const sourceIds = new Set();
  let observations = 0;

  for (const item of cases) {
    const classification = item?.adjudication?.classification;
    if (Object.prototype.hasOwnProperty.call(classifications, classification)) increment(classifications, classification);
    increment(groups, item?.group || 'ungrouped');
    for (const observation of Array.isArray(item?.observations) ? item.observations : []) {
      observations++;
      if (observation.sourceId) sourceIds.add(observation.sourceId);
    }
  }

  return {
    datasetId: dataset?.datasetId || null,
    capturedAt: dataset?.capturedAt || null,
    totalCases: cases.length,
    observations,
    classifications,
    groups,
    sourceIds: Array.from(sourceIds).sort()
  };
}

/**
 * Combine summaries from multiple independently captured fixtures.
 */
export function summarizeValidationDatasets(datasets) {
  const list = Array.isArray(datasets) ? datasets.map(summarizeValidationDataset) : [];
  const total = {
    cases: 0,
    observations: 0,
    classifications: { match: 0, difference: 0, undetermined: 0 },
    groups: {},
    sourceIds: new Set()
  };

  for (const item of list) {
    total.cases += item.totalCases;
    total.observations += item.observations;
    for (const key of Object.keys(total.classifications)) total.classifications[key] += item.classifications[key] || 0;
    for (const [group, count] of Object.entries(item.groups)) total.groups[group] = (total.groups[group] || 0) + count;
    item.sourceIds.forEach((sourceId) => total.sourceIds.add(sourceId));
  }

  return {
    datasets: list,
    totalCases: total.cases,
    totalObservations: total.observations,
    classifications: total.classifications,
    groups: total.groups,
    sourceIds: Array.from(total.sourceIds).sort()
  };
}

export const VALIDATION_MANIFEST_VERSION = VALIDATION_MANIFEST.manifestVersion;
