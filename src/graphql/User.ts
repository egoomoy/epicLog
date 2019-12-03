import { gql } from 'apollo-server-koa';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

export const typeDefs = gql`
  extend type Query {
    user(username: String!): String
  }
`;

export const resolvers = {
  Query: {
    user: async (_parent: any, args: any, _context: any, _info: any) => {
      const { username } = args;
      const repo = getRepository(User);
      try {
        const user = await repo.findOne({
          where: {
            username
          }
        });
        if (user) return user.id;
      } catch (e) {
        console.log(e);
      }
    }
  }
};
