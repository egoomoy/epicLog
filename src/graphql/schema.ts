import { gql, makeExecutableSchema } from 'apollo-server-koa';
import * as emailAuth from './EmailAuth';
import * as user from './User';

const typeDef = gql`
  type Query {
    _version: String
  }
  type Mutation {
    _test: String
  }
`;

const resolvers = {
  Query: {
    _version: () => '1.0'
  },
  Mutation: {}
};

const shcema = makeExecutableSchema({
  typeDefs: [typeDef, user.typeDefs, emailAuth.typeDefs],
  resolvers: [resolvers, user.resolvers, emailAuth.resolvers]
});

export default shcema;
