import { GraphQLError } from "graphql";
import { ContentfulService } from "#/helpers/contentful/ContentfulService";
import { Notification } from "#/helpers/contentful/entities/notification";

interface PartialContext {
    dataSources: {
        contentfulService: ContentfulService;
    }
}

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
    Query: {
        notification: async (_: unknown, args: { id: string }, context: PartialContext): Promise<Notification> => {
            const entry = await context.dataSources.contentfulService.getEntityById(args.id);
            if (entry == null) throw new GraphQLError(`There is no notification entry with an id of ${args.id}`);
            if (entry.contentType !== 'notification') throw new GraphQLError(`The entry with an id of ${args.id} is not a notification entry`);
            return entry;
        }
    },
    Notification: {
        id: (src): string => src.id,
        title: (src): string => src.title,
        summary: (src): string | undefined => src.summary,
        body: (src): string | undefined => src.body,
        start: (src): string => src.start.toISOString(),
        end: (src): string => src.end.toISOString(),
        url: (src): string | undefined => src.url,
        notificationType: (src): string => src.notificationType,
        severity: (src): string => src.severity,
    } as Record<string, (src: Notification) => unknown>
}

