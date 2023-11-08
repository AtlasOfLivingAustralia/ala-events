import { Outlet } from 'react-router-dom';
import { GbifRootLayout } from '@/components/GbifRootLayout';
import { MyRouteObject } from '@/types';
import { configureRoutes } from '@/utils/configureRoutes';
import { HomePage } from '@/routes/HomePage';
import { NotFound } from '@/routes/NotFound';
import { RootErrorPage } from '@/routes/RootErrorPage';
import {
  DetailedOccurrencePage,
  loader as detailedOccurrenceLoader,
} from '@/routes/occurrence/key/DetailedOccurrencePage';
import {
  OccurrenceSearchPage,
  loader as occurrenceSearchLoader,
} from '@/routes/occurrence/search/OccurrenceSearchPage';
import { Config } from '@/contexts/config';

const baseRoutes: MyRouteObject[] = [
  {
    element: <GbifRootLayout children={<Outlet />} />,
    children: [
      {
        errorElement: <RootErrorPage />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'occurrence/search',
            loader: occurrenceSearchLoader,
            element: <OccurrenceSearchPage />,
          },
          {
            path: 'occurrence/:key',
            loader: detailedOccurrenceLoader,
            element: <DetailedOccurrencePage />,
          },
          {
            path: '*',
            element: <NotFound />,
          },
        ],
      },
    ],
  },
];

export const configureGbifRoutes = (gbifConfig: Config) => configureRoutes(baseRoutes, gbifConfig);