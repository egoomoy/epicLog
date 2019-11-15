import { gql } from 'apollo-server-koa';
import { ApolloContext } from '../app';

export const typeDefs = gql`
  type Query {
    hello: String
  }
`;

export const resolvers = {
  Query: {
    hello: (_prent: any, _: any, context: ApolloContext, _info: any) => {
      const { id, ip }: ApolloContext = context;
      return `${ip} ${id} hello`;
    }
  }
};
