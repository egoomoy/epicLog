import { gql } from 'apollo-server-koa';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

export const typeDefs = gql`
  extend type Query {
    user(username: String!): String
  }
  extend type Mutation {
    emailSignUpUser(email: String!, password: String!): emailSignUpUserResponse!
  }
  type emailSignUpUserResponse {
    ok: Boolean!
    error: String
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
  },
  Mutation: {
    emailSignUpUser: async (_parent: any, args: any, _context: any, _info: any) => {
      const { email, password } = args;
      const userRepo = getRepository(User);
      try {
        const existUser = await userRepo.findOne({ email });
        if (existUser) {
          return {
            ok: false,
            error: 'instead log in'
          };
        } else {
          await User.create({ email, password }).save();
          return {
            ok: true,
            error: null
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message
        };
      }
    }
  }
};
