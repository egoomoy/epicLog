import { gql, IResolvers } from 'apollo-server-koa';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { ApolloContext } from '../app';
import { Profile } from '../entities/Profile';

export const typeDefs = gql`
  extend type Query {
    user(username: String!): String
  }
  extend type Mutation {
    emailSignUpUser(
      email: String!
      password: String!
      shortBio: String
      name: String!
    ): emailSignUpUserResponse!
  }
  type emailSignUpUserResponse {
    ok: Boolean!
    error: String
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
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
      const { email, password, shortBio, name } = args;

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
          const user = await userRepo.create({ email, password }).save();
          await profileRepo
            .create({
              fk_user_id: user.id,
              shortBio,
              name
            })
            .save();

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
