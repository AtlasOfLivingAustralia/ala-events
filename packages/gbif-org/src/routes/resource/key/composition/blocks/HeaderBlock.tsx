import { HeaderBlockDetailsFragment } from '@/gql/graphql';
import { ArticleBanner } from '../../components/ArticleBanner';
import { ArticleContainer } from '../../components/ArticleContainer';
import { ArticleIntro } from '../../components/ArticleIntro';
import { ArticlePreTitle } from '../../components/ArticlePreTitle';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';
import { ArticleTitle } from '../../components/ArticleTitle';
import { fragmentManager } from '@/services/FragmentManager';

fragmentManager.register(/* GraphQL */ `
  fragment HeaderBlockDetails on HeaderBlock {
    __typename
    title
    type
    summary
    primaryImage {
      ...ArticleBanner
    }
  }
`);

type Props = {
  resource: HeaderBlockDetailsFragment;
};

export function HeaderBlock({ resource }: Props) {
  return (
    <ArticleContainer>
      <ArticleTextContainer>
        {resource.type && <ArticlePreTitle>{resource.type} - needs translating</ArticlePreTitle>}

        <ArticleTitle>{resource.title}</ArticleTitle>

        {resource.summary && (
          <ArticleIntro dangerouslySetInnerHTML={{ __html: resource.summary }} className="mt-2" />
        )}
      </ArticleTextContainer>

      <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage} />
    </ArticleContainer>
  );
}
