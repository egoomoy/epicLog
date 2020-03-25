import { gql, makeExecutableSchema } from 'apollo-server-koa';
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
    _version: () => 'TESTING 0.44 alpha'
  },
  Mutation: {
    _test: () => {
      console.log('on');
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs: [typeDef, user.typeDefs],
  resolvers: [resolvers, user.resolvers]
});

export default schema;
