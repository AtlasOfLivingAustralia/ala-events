import { jsx, css } from '@emotion/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { KeyChartGenerator } from './KeyChartGenerator';

// a small wrapper to make it easier to add new charts
function getStringChart({ fieldName, title, subtitleKey }) {
  return ({
    predicate,
    detailsRoute,
    currentFilter = {}, //excluding root predicate
    disableOther = false,
    disableUnknown = false,
    title = title ?? <FormattedMessage id={`filters.${fieldName}.name`} defaultMessage={fieldName} />,
    ...props
  }) => {
    return <KeyChartGenerator {...{
      predicate, detailsRoute, currentFilter,
      fieldName: fieldName,
      disableUnknown,
      disableOther,
      facetSize: 10,
      title,
      subtitleKey: "dashboard.numberOfOccurrences",
    }} {...props} />
  }
}

export const InstitutionCodes = getStringChart({
  fieldName: 'institutionCode', 
  title: <FormattedMessage id="filters.institutionCode.name" defaultMessage="Institution code" />
});

export const CollectionCodes = getStringChart({
  fieldName: 'institutionCode', 
  title: <FormattedMessage id="filters.institutionCode.name" defaultMessage="collection code" />
});

export const StateProvince = getStringChart({
  fieldName: 'stateProvince', 
  title: <FormattedMessage id="filters.stateProvince.name" defaultMessage="State province" />
});

export const IdentifiedBy = getStringChart({
  fieldName: 'identifiedBy', 
  title: <FormattedMessage id="filters.identifiedBy.name" defaultMessage="Identified by" />
});

export const RecordedBy = getStringChart({
  fieldName: 'recordedBy', 
  title: <FormattedMessage id="filters.recordedBy.name" defaultMessage="Recorded by" />
});

export const Preparations = getStringChart({
  fieldName: 'preparations'
});

