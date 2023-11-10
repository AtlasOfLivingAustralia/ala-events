import { getHtml, excerpt, trustedTags, createLocalizedGbifHref } from "#/helpers/utils";

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    article: (_, { id, preview }, { dataSources, locale }) =>
      dataSources.resourceAPI.getEntryById({ id, preview, locale })
  },
  Article: {
    title: src => getHtml(src.title, { inline: true }),
    summary: src => getHtml(src.summary),
    body: src => getHtml(src.body, {allowedTags: trustedTags}),
    excerpt: src => excerpt(src),
    gbifHref: (src, _, context) => createLocalizedGbifHref(context.locale, 'article', src.id),
  }
}