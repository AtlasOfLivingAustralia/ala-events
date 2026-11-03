const DWC_SCIENTIFIC_NAME = 'http://rs.tdwg.org/dwc/terms/scientificName';

const LEAF_TAXON_FIELD = 'leafTaxonKey';

// Last taxonomy entry is the finest identified taxon. Rank is not stored.
// Occurrence docs keep the array at the root; event-occurrence docs nest it under occurrence.
const LEAF_TAXON_SCRIPT = [
  'def tax = params._source.taxonomy;',
  'if ((tax == null || tax.size() == 0) && params._source.occurrence != null) { tax = params._source.occurrence.taxonomy; }',
  'if (tax == null || tax.size() == 0) { return; }',
  'def leaf = tax.get(tax.size() - 1);',
  'if (leaf != null && leaf.taxonKey != null) { emit(leaf.taxonKey); }',
].join(' ');

function classificationFromTaxonomy(taxonomy, verbatimCore) {
  const lineage = Array.isArray(taxonomy)
    ? taxonomy.filter((entry) => entry && (entry.name || entry.taxonKey))
    : [];
  const leaf = lineage.length ? lineage[lineage.length - 1] : null;
  const name = leaf ? leaf.name ?? null : null;
  const key = leaf ? leaf.taxonKey ?? null : null;
  const usage = { key, name, formattedName: name };

  return {
    scientificName: name,
    acceptedScientificName: name,
    taxonKey: key,
    acceptedTaxonKey: key,
    verbatimScientificName: verbatimCore?.[DWC_SCIENTIFIC_NAME] ?? null,
    class: null,
    classKey: null,
    family: null,
    familyKey: null,
    genus: null,
    genusKey: null,
    kingdom: null,
    kingdomKey: null,
    order: null,
    orderKey: null,
    phylum: null,
    phylumKey: null,
    species: null,
    speciesKey: null,
    genericName: null,
    specificEpithet: null,
    subgenus: null,
    subgenusKey: null,
    taxonomicStatus: null,
    taxonRank: null,
    iucnRedListCategory: null,
    gbifClassification: {
      usage,
      acceptedUsage: { key, name, formattedName: name },
      classification: lineage.map((entry) => ({
        key: entry.taxonKey,
        name: entry.name,
      })),
    },
  };
}

function leafTaxonRuntimeMappings() {
  return {
    [LEAF_TAXON_FIELD]: {
      type: 'keyword',
      script: { source: LEAF_TAXON_SCRIPT },
    },
  };
}

function aggsUseLeafTaxon(value) {
  if (!value || typeof value !== 'object') return false;
  if (value.field === LEAF_TAXON_FIELD) return true;
  return Object.entries(value).some(
    ([key, child]) => key === LEAF_TAXON_FIELD || aggsUseLeafTaxon(child),
  );
}

module.exports = {
  LEAF_TAXON_FIELD,
  classificationFromTaxonomy,
  leafTaxonRuntimeMappings,
  aggsUseLeafTaxon,
};
