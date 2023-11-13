import { MyLink } from '@/components/MyLink';
import { PublisherQuery, PublisherQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/types';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { cn } from '@/utils/shadcn';
import { Helmet } from 'react-helmet-async';
import { Outlet, NavLink } from 'react-router-dom';

const { load, useTypedLoaderData } = createGraphQLHelpers<
  PublisherQuery,
  PublisherQueryVariables
>(/* GraphQL */ `
  query Publisher($key: ID!) {
    publisher: organization(key: $key) {
      title
    }
  }
`);

export function PublisherPage() {
  const { data } = useTypedLoaderData();

  if (data.publisher == null) throw new Error('404');
  const publisher = data.publisher;

  return (
    <>
      <Helmet>
        <title>{publisher.title}</title>
      </Helmet>

      <h1 className="text-3xl">{publisher.title}</h1>

      <div className="text-red-500 mt-4 mb-4">
        <p>
          TODO have tabs that are accessible and can be used as either state push, href links or not
          url linkable tabs (simple react state only) For the dataset page the tabs would have state
          in the url and work as state push
        </p>
        <p>Notice that occurrence search lives in one of the tabs.</p>
      </div>
      <ul className="border-b border-slate-200 space-x-6 flex whitespace-nowrap dark:border-slate-200/5 mb-px">
        <li>
          <h2>
            <TabLink to=".">About</TabLink>
          </h2>
        </li>
        <li>
          <h2>
            <TabLink to="occurrences">Occurrences</TabLink>
          </h2>
        </li>
      </ul>
      <div>
        <Outlet />
      </div>
    </>
  );
}

export async function publisherLoader({ request, params, config }: LoaderArgs) {
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

function TabLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <MyLink
      end
      as={NavLink}
      className={({ isActive }) =>
        cn('flex text-sm leading-6 font-semibold pt-3 pb-2.5 border-b-2 -mb-px', {
          'text-sky-500 border-current': isActive,
          'text-slate-900 border-transparent hover:border-slate-300 dark:text-slate-200 dark:hover:border-slate-700':
            !isActive,
        })
      }
      to={to}
    >
      {children}
    </MyLink>
  );
}
