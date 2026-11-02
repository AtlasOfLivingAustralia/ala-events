// shortcut: a lineage key matches every rank in taxonomy, until the index stores taxonomy.rank
const LINEAGE_KEY_NAMES = [
  'taxonKey',
  'kingdomKey',
  'phylumKey',
  'classKey',
  'orderKey',
  'familyKey',
  'genusKey',
  'speciesKey',
];

function lineageKey(key, path) {
  return {
    type: 'flatNested',
    field: path,
    config: {
      prefix: path,
      options: {
        [key]: {
          type: 'keyword',
          field: 'taxonKey',
        },
      },
    },
  };
}

function lineageKeyOptions(path, extraKeys = []) {
  return Object.fromEntries(
    [...LINEAGE_KEY_NAMES, ...extraKeys].map((key) => [key, lineageKey(key, path)]),
  );
}

function joinedLineageKeyOptions(path) {
  return Object.fromEntries(
    LINEAGE_KEY_NAMES.map((key) => [
      key,
      {
        join: 'occurrence',
        config: {
          options: {
            [key]: lineageKey(key, path),
          },
        },
      },
    ]),
  );
}

module.exports = {
  lineageKey,
  lineageKeyOptions,
  joinedLineageKeyOptions,
};
