import { gql, IResolvers } from 'apollo-server-koa';
import { getRepository } from 'typeorm';
import { ApolloContext } from '../app';
import { Profile } from '../entities/Profile';
import { User } from '../entities/User';

export const typeDefs = gql`
  extend type Query {
    me: String
  }
  extend type Mutation {
    emailSignUpUser(
      email: String!
      password: String!
      name: String!
      shortBio: String
    ): emailSignUpUserResponse!
  }
  type emailSignUpUserResponse {
    ok: Boolean!
    error: String
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  Query: {
    me: async (_parent: any, _args: any, _context: ApolloContext, _info: any) => {
      const repo = getRepository(User);
      try {
        const user = await repo.findOne({
          where: {
            id: _context.user_id
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
      const { email, password, name, shortBio } = args;

      const userRepo = getRepository(User);
      const profileRepo = getRepository(Profile);
      try {
        const existUser = await userRepo.findOne({ email });
        if (existUser) {
          return {
            ok: false,
            error: 'instead log in'
          };
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
