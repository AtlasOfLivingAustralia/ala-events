import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { OccurrenceQuery, OccurrenceQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { MyLink } from '@/components/MyLink';
const Map = React.lazy(() => import('@/components/Map'));

const { load, useTypedLoaderData } = createGraphQLHelpers<
  OccurrenceQuery,
  OccurrenceQueryVariables
>(/* GraphQL */ `
  query Occurrence($key: ID!) {
    occurrence(key: $key) {
      eventDate
      scientificName
      coordinates
      dataset {
        key
        title
      }
    }
  }
`);

export function DetailedOccurrencePage() {
  const { data } = useTypedLoaderData();

  if (data.occurrence == null) throw new Error('404');
  const occurrence = data.occurrence;

  return (
    <>
      <Helmet>
        <title>{occurrence.scientificName}</title>
      </Helmet>

      <h1>{occurrence.scientificName}</h1>
      {occurrence.coordinates && (
        <React.Suspense fallback={<div>Loading map...</div>}>
          <Map coordinates={occurrence.coordinates} />
        </React.Suspense>
      )}

      {occurrence.dataset && (
        <div>
          <p className="font-bold">Dataset: </p>
          <h2>
            <MyLink to={`/dataset/${occurrence.dataset.key}`}>{occurrence.dataset.title}</MyLink>
          </h2>
        </div>
      )}
    </>
  );
}

export async function loader({ request, params, config }: LoaderArgs) {
  const key = params.key;
  if (key == null) throw new Error('No key provided in the url');

  return load({
    endpoint: config.graphqlEndpoint,
    request,
    variables: {
      key,
    },
  });
}
