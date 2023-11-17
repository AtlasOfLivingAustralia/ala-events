import { Outlet } from 'react-router-dom';
import { GbifRootLayout } from '@/components/GbifRootLayout';
import { SourceRouteObject } from '@/types';
import { configureRoutes } from '@/utils/configureRoutes';
import { HomePage } from '@/routes/HomePage';
import { NotFound } from '@/routes/NotFound';
import { RootErrorPage } from '@/routes/RootErrorPage';
import {
  DetailedOccurrencePage,
  DetailedOccurrencePageLoading,
  loader as detailedOccurrenceLoader,
} from '@/routes/occurrence/key/DetailedOccurrencePage';
import {
  OccurrenceSearchPage,
  loader as occurrenceSearchLoader,
} from '@/routes/occurrence/search/OccurrenceSearchPage';
import { Config } from '@/contexts/config';
import { DatasetPage, datasetLoader } from '@/routes/dataset/key/DatasetPage';
import { PublisherPage, publisherLoader } from '@/routes/publisher/key/PublisherPage';
import { News, newsLoader } from '@/routes/resource/key/news/news';
import { PublisherAboutTab } from '@/routes/publisher/key/AboutTab';
import { PublisherOccurrencesTab } from '@/routes/publisher/key/OccurrencesTab';
import { DatasetAboutTab } from '@/routes/dataset/key/AboutTab';
import { DatasetDashboardTab } from '@/routes/dataset/key/DashboardTab';
import { DatasetOccurrencesTab } from '@/routes/dataset/key/OccurrencesTab';
import { DatasetDownloadTab } from '@/routes/dataset/key/DownloadTab';

const baseRoutes: SourceRouteObject[] = [
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
            key: 'occurrence-search-page',
            path: 'occurrence/search',
            loader: occurrenceSearchLoader,
            element: <OccurrenceSearchPage />,
          },
          {
            key: 'occurrence-page',
            path: 'occurrence/:key',
            loader: detailedOccurrenceLoader,
            element: <DetailedOccurrencePage />,
            loadingElement: <DetailedOccurrencePageLoading />,
          },
          {
            key: 'dataset-page',
            gbifRedirect: (params) => {
              if (typeof params.key !== 'string') throw new Error('Invalid key');
              return `https://www.gbif.org/dataset/${params.key}`;
            },
            path: 'dataset/:key',
            loader: datasetLoader,
            element: <DatasetPage />,
            children: [
              {
                index: true,
                element: <DatasetAboutTab />,
              },
              {
                path: 'dashboard',
                element: <DatasetDashboardTab />,
              },
              {
                path: 'occurrences',
                element: <DatasetOccurrencesTab />,
              },
              {
                path: 'download',
                element: <DatasetDownloadTab />,
              },
            ],
          },
          {
            key: 'publisher-page',
            gbifRedirect: (params) => {
              if (typeof params.key !== 'string') throw new Error('Invalid key');
              return `https://www.gbif.org/publisher/${params.key}`;
            },
            path: 'publisher/:key',
            loader: publisherLoader,
            element: <PublisherPage />,
            children: [
              {
                index: true,
                element: <PublisherAboutTab />,
              },
              {
                path: 'occurrences',
                element: <PublisherOccurrencesTab />,
              },
            ],
          },
          {
            path: 'resource/:key',
            loader: newsLoader,
            element: <News />,
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
