/** 
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
*/
module.exports = {
  Query: {
    nodeSearch: (parent, args, { dataSources }) =>
      dataSources.nodeAPI.searchNodes({query: args}),
    node: (parent, { key }, { dataSources }) =>
      dataSources.nodeAPI.getNodeByKey({ key })
  },
  Node: {
    organization: ({ key }, args, { dataSources }) => {
      return dataSources.nodeAPI.getEndorsedOrganizations({ key, query: args });
    },
    pendingEndorsement: ({ key }, args, { dataSources }) => {
      return dataSources.nodeAPI.getOrganizationsPendingEndorsement({ key, query: args });
    },
    dataset: ({ key }, args, { dataSources }) => {
      return dataSources.nodeAPI.getDatasets({ key, query: args });
    },
    installation: ({ key }, args, { dataSources }) => {
      return dataSources.nodeAPI.getInstallations({ key, query: args });
    },
  }
};