
import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import SiteContext from '../../dataManagement/SiteContext';
import { useQuery } from '../../dataManagement/api';
import { DatasetPresentation } from './DatasetPresentation';

import { MemoryRouter, useRouteMatch } from 'react-router-dom';

function EnsureRouter({children}) {
  let hasRouter;
  try {
    const forTestOnly = useRouteMatch();
    hasRouter = true;
  } catch(err) {
    console.log('No router context found, so creating a MemoryRouter for the component');
    hasRouter = false;
  }
  return hasRouter ? <>{children}</> : <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
}

export function Dataset({
  id,
  ...props
}) {
  const { data, error, loading, load } = useQuery(DATASET, { lazyLoad: true });
  const theme = useContext(ThemeContext);
  const siteContext = useContext(SiteContext);
  const sitePredicate = siteContext?.occurrence?.rootPredicate;

  useEffect(() => {
    if (typeof id !== 'undefined') {
      const datasetPredicate = {
        type: "equals",
        key: "datasetKey",
        value: id
      };
      // we also want to know how many of those occurrences are included on the present site
      const predicates = [datasetPredicate];
      if (sitePredicate) predicates.push(sitePredicate);
      load({
        variables: {
          key: id,
          predicate: datasetPredicate,
          sitePredicate: {
            type: 'and',
            predicates
          }
        }
      });
    }
  }, [id]);

  return <EnsureRouter>
    <DatasetPresentation {...{ data, error, loading: loading || !data, id }} />
  </EnsureRouter>
};

const DATASET = `
query dataset($key: ID!, $predicate: Predicate, $sitePredicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
  }
  siteOccurrences: occurrenceSearch(predicate: $sitePredicate) {
    documents(size: 0) {
      total
    }
  }
  literatureSearch(gbifDatasetKey: [$key]) {
    documents {
      count
    }
  }
  taxonSearch(datasetKey: [$key], origin: [SOURCE], status: [ACCEPTED]){
    count
  }
  dataset(key: $key) {
    key
    type
    title
    created
    description
    purpose
    temporalCoverages
    logoUrl
    publishingOrganizationKey
    publishingOrganizationTitle
    homepage
    additionalInfo
    volatileContributors {
      key
      firstName
      lastName
      position
      organization
      address
      userId
      email
      phone
      type
      _highlighted
      roles
    }
    contactsCitation {
      key
      abbreviatedName
      firstName
      lastName
      userId
      roles
    }
    geographicCoverages {
      description
      boundingBox {
        minLatitude
        maxLatitude
        minLongitude
        maxLongitude
        globalCoverage
      }
    }
    taxonomicCoverages {
      description
      coverages {
        scientificName
        commonName
        rank {
          interpreted
        }
      }
    }
    bibliographicCitations {
      identifier
      text
    }
    samplingDescription {
      studyExtent
      sampling
      qualityControl
      methodSteps
    } 
    citation {
      text
    }
    license
    project {
      title
      abstract
      studyAreaDescription
      designDescription
      funding
      contacts {
        firstName
        lastName

        organization
        position
        roles
        type

        address
        city
        postalCode
        province
        country
        
        homepage
        email
        phone
        userId
      }
      identifier
    }
  }
}
`;

