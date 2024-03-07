import { Helmet } from 'react-helmet-async';
import { useLoaderData } from 'react-router-dom';
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
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { FormattedMessage } from 'react-intl';
import { ArticleFooterWrapper } from '../components/ArticleFooterWrapper';
import { fragmentManager } from '@/services/FragmentManager';
import { createResourceLoaderWithRedirect } from '../utils';
import { ArticlePageFragment } from '@/gql/graphql';

fragmentManager.register(/* GraphQL */ `
  fragment ArticlePage on Article {
    id
    title
    summary
    body
    primaryImage {
      ...ArticleBanner
    }
    secondaryLinks {
      label
      url
    }
    documents {
      ...DocumentPreview
    }
    topics
    purposes
    audiences
    citation
    createdAt
  }
`);

export const articlePageLoader = createResourceLoaderWithRedirect({
  fragment: 'ArticlePage',
  resourceType: 'Article',
});

export function ArticlePage() {
  const { resource } = useLoaderData() as { resource: ArticlePageFragment };

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer className="mb-10">
          <ArticleTitle>{resource.title}</ArticleTitle>

          {resource.summary && (
            <ArticleIntro dangerouslySetInnerHTML={{ __html: resource.summary }} className="mt-2" />
          )}
        </ArticleTextContainer>

        <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage} />

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
          )}

          <ArticleFooterWrapper>
            {/*
          A list documents and links related to this article can be found below.
          iterature through documents and links and display them as a 2 column grid list. With icons for the corresponding conten types.
          use the title as text and fall back to the filename if no title is provided.
          */}

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

            {resource.citation && (
              <ArticleAuxiliary
                label={<FormattedMessage id="cms.auxiliary.citation" />}
                dangerouslySetInnerHTML={{
                  __html: resource.citation,
                  classNames: 'underlineLinks',
                }}
              />
            )}

            <ArticleTags resource={resource} className="mt-8" />
          </ArticleFooterWrapper>
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}

export function ArticlePageSkeleton() {
  return <ArticleSkeleton />;
}
