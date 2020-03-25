import { gql, IResolvers } from 'apollo-server-koa';
import { getRepository } from 'typeorm';
import { ApolloContext } from '../app';
<<<<<<< HEAD
import { User } from '../entity/User';
import { setTokenCookie } from '../lib/token';
=======
import { Profile } from '../entities/Profile';
import { User } from '../entities/User';
>>>>>>> cc8c9a8a42f59209febe00759c4220a42b417b86

export const typeDefs = gql`
  extend type Query {
    me: String
  }
  extend type Mutation {
<<<<<<< HEAD
    signUp(email: String!, password: String!): mutationResponse!
    signIn(email: String!, password: String!): mutationResponse!
=======
    emailSignUpUser(
      email: String!
      password: String!
      name: String!
      shortBio: String
    ): emailSignUpUserResponse!
>>>>>>> cc8c9a8a42f59209febe00759c4220a42b417b86
  }
  type mutationResponse {
    ok: Boolean!
    error: String
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  Query: {
    me: async (_parent: any, _args: any, _context: ApolloContext, _info: any) => {
<<<<<<< HEAD
      try {
        return 'test user';
=======
      const repo = getRepository(User);
      try {
        const user = await repo.findOne({
          where: {
            id: _context.user_id
          }
        });
        if (user) return user.id;
>>>>>>> cc8c9a8a42f59209febe00759c4220a42b417b86
      } catch (e) {
        console.log(e);
      }
    }
  },
  Mutation: {
<<<<<<< HEAD
    signUp: async (_parent: any, args: any, _context: any, _info: any) => {
      const { email, password } = args;
=======
    emailSignUpUser: async (_parent: any, args: any, _context: any, _info: any) => {
      const { email, password, name, shortBio } = args;

>>>>>>> cc8c9a8a42f59209febe00759c4220a42b417b86
      const userRepo = getRepository(User);
      const profileRepo = getRepository(Profile);
      try {
        const existUser = await userRepo.findOne({ email });
        if (existUser) {
          return {
            ok: false,
            error: '로그인하세요.'
          };
<<<<<<< HEAD
        }
        try {
          await userRepo.create({ email, password }).save();
=======
        } else {
          try {
            const user = await userRepo.create({ email, password }).save();
            await profileRepo
              .create({
                shortBio,
                name,
                fk_user_id: user.id
              })
              .save();
          } catch (error) {
            return {
              ok: false,
              error: error.message
            };
          }
>>>>>>> cc8c9a8a42f59209febe00759c4220a42b417b86
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
