import { RESORUCE_OPTIONS } from "./resource.constants.js";

import gql from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    resource(id: String, alias: String): Resource
  }

  union Resource = ${RESORUCE_OPTIONS.map(option => option.graphQLType).join(' | ')}
`;

export default typeDef;