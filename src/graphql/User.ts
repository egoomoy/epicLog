import { gql, IResolvers } from 'apollo-server-koa';
import { getRepository } from 'typeorm';
import { ApolloContext } from '../app';
import { User } from '../entity/User';
import { setTokenCookie } from '../lib/token';

export const typeDefs = gql`
  extend type Query {
    me: String
  }
  extend type Mutation {
    signUp(email: String!, password: String!): mutationResponse!
    signIn(email: String!, password: String!): mutationResponse!
  }
  type mutationResponse {
    ok: Boolean!
    error: String
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  Query: {
    me: async (_parent: any, _args: any, _context: ApolloContext, _info: any) => {
      try {
        return 'test user';
      } catch (e) {
        console.log(e);
      }
    }
  },
  Mutation: {
    signUp: async (_parent: any, args: any, _context: any, _info: any) => {
      const { email, password } = args;
      const userRepo = getRepository(User);
      try {
        const existUser = await userRepo.findOne({ email });
        if (existUser) {
          return {
            ok: false,
            error: '로그인하세요.'
          };
        }
        try {
          await userRepo.create({ email, password }).save();
          return {
            ok: true,
            error: null
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message
        };
      }
    },
    signIn: async (_parent: any, _args: any, _context: any, _info: any) => {
      const { email, password } = _args;
      const ctx = _context.ctx;
      console.log(ctx);

      const userRepo = getRepository(User);
      try {
        const user = await userRepo.findOne({ email });
        if (user) {
          if (await user.comparePassword(password)) {
            const token = await user.createUserToken();
            setTokenCookie(ctx, token);
            return {
              ok: true,
              error: null
            };
          }
          return {
            ok: false,
            error: '비밀번호가 일치하지 않습니다.'
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