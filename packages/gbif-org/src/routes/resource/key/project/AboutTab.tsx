import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { ProjectAboutQuery, ProjectAboutQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { ArticleBanner } from '@/routes/resource/key/components/ArticleBanner';
import { ArticleTitle } from '../components/ArticleTitle';
import { ArticleIntro } from '../components/ArticleIntro';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleBody } from '../components/ArticleBody';
import { ArticleTags } from '../components/ArticleTags';
import { ArticleAuxiliary } from '../components/ArticleAuxiliary';

import { SecondaryLinks } from '../components/SecondaryLinks';
import { Documents } from '../components/Documents';
import { ArticlePreTitle } from '../components/ArticlePreTitle';
import { Tabs } from '@/components/Tabs';
import { Outlet } from 'react-router-dom';
import { KeyValuePair } from '../components/KeyValuePair';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { DynamicLink } from '@/components/DynamicLink';

const { load, useTypedLoaderData } = createGraphQLHelpers<
  ProjectAboutQuery,
  ProjectAboutQueryVariables
>(/* GraphQL */ `
  query ProjectAbout($key: String!) {
    gbifProject(id: $key) {
      summary
      body
      fundsAllocated
      matchingFunds
      grantType
      start
      end
      programme {
        id
        title
      }
      projectId
      primaryImage {
        file {
          url
          normal: thumbor(width: 1200, height: 500)
          mobile: thumbor(width: 800, height: 400)
        }
        description
        title
      }
      secondaryLinks {
        label
        url
      }
      documents {
        file {
          url
          fileName
          contentType
          volatile_documentType
          details {
            size
          }
        }
        title
      }
      purposes
      status
      createdAt
    }
  }
`);

export function AboutTab() {
  const { data } = useTypedLoaderData();

  if (data.gbifProject == null) throw new Error('404');
  const resource = data.gbifProject;

  return (
    <>
      <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage ?? null} />

      <ArticleTextContainer>
        {resource.body && (
          <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
        )}

        <hr className="mt-8" />

        <KeyValuePair
          label={<FormattedMessage id="project.funding" />}
          value={resource.fundsAllocated}
        />
        <KeyValuePair
          label={<FormattedMessage id="project.coFunding" />}
          value={resource.matchingFunds}
        />
        <KeyValuePair
          label={<FormattedMessage id="project.typeOfGrant" />}
          value={resource.grantType}
        />

        {/* if start and end dates are the same, only show one date */}
        {resource.start === resource.end ? (
          <KeyValuePair
            label={<FormattedMessage id="project.projectStart" />}
            value={
              <span>
                <FormattedDate value={resource.start} year="numeric" month="long" day="numeric" />
              </span>
            }
          />
        ) : (
          <KeyValuePair
            label={<FormattedMessage id="project.duration" />}
            value={
              <span>
                <FormattedDate value={resource.start} year="numeric" month="long" day="numeric" /> -{' '}
                <FormattedDate value={resource.end} year="numeric" month="long" day="numeric" />
              </span>
            }
          />
        )}

        {resource.programme && (
          <KeyValuePair
            label={<FormattedMessage id="project.programme" />}
            value={
              <DynamicLink to={`/programme/${resource.programme?.id}`}>
                {resource.programme?.title}
              </DynamicLink>
            }
          />
        )}
        <KeyValuePair
          label={<FormattedMessage id="project.projectIdentifier" />}
          value={resource.projectId}
        />

        {resource.secondaryLinks && (
          <ArticleAuxiliary>
            <SecondaryLinks links={resource.secondaryLinks} className="mt-8" />
          </ArticleAuxiliary>
        )}

        {resource.documents && (
          <ArticleAuxiliary>
            <Documents documents={resource.documents} className="mt-8" />
          </ArticleAuxiliary>
        )}

        <ArticleTags resource={resource} className="mt-8" />
      </ArticleTextContainer>
    </>
  );
}

export async function projectAboutLoader({ request, params, config, locale }: LoaderArgs) {
  const key = params.key;
  if (key == null) throw new Error('No key provided in the url');

  return load({
    endpoint: config.graphqlEndpoint,
    signal: request.signal,
    variables: {
      key,
    },
    locale: locale.cmsLocale || locale.code,
  });
}
