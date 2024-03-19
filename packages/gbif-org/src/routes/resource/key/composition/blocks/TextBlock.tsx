import { TextBlockDetailsFragment } from '@/gql/graphql';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';
import { ArticleBody } from '../../components/ArticleBody';
import { fragmentManager } from '@/services/FragmentManager';
import { BlockContainer, BlockHeading, backgroundColorMap } from './_shared';

fragmentManager.register(/* GraphQL */ `
  fragment TextBlockDetails on TextBlock {
    title
    body
    hideTitle
    id
    backgroundColour
  }
`);

type Props = {
  resource: TextBlockDetailsFragment;
};

export function TextBlock({ resource }: Props) {
  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];

  return (
    <BlockContainer className={backgroundColor}>
      {!resource.hideTitle && resource.title && (
        <BlockHeading dangerouslySetHeading={{ __html: resource.title }} />
      )}
      {resource.body && (
        <ArticleTextContainer className="mt-2 mb-10">
          <ArticleBody dangerouslySetBody={{ __html: resource.body }} />
        </ArticleTextContainer>
      )}
    </BlockContainer>
  );
}
