import { gql, IResolvers } from 'apollo-server-koa';
import { getRepository } from 'typeorm';
import EmailAuth from '../entities/emailAuth';
import { User } from '../entities/User';
import { sendWelcomeEmail } from '../utilities/sendEmail';
import { ApolloContext } from './../app';

export const typeDefs = gql`
  extend type Mutation {
    sendAuthEmail(email: String!): sendAuthEmailResponse!
    codeAuth(email: String!, code: String!): sendAuthEmailResponse!
  }
  type sendAuthEmailResponse {
    ok: Boolean!
    error: String
  }
  type codeAuthResponse {
    ok: Boolean!
    error: String
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  Mutation: {
    sendAuthEmail: async (_parent, _args, _ctx, _info) => {
      try {
        const { email } = _args;
        const sentEmail = await getRepository(EmailAuth)
          .createQueryBuilder('email_auth')
          .where('email = :email', { email })
          .andWhere('logged = false')
          .getOne();
        if (sentEmail) {
          return {
            ok: true,
            error: 'aleady send email'
          };
        } else {
          const user = await getRepository(User)
            .createQueryBuilder('user')
            .where('email = :email', { email });

          if (!user) {
            const welcomeEmail = await EmailAuth.create({ email }).save();
            sendWelcomeEmail(email, welcomeEmail.code);
          } else {
            const welcomeEmail = await EmailAuth.create({ email }).save();
            sendWelcomeEmail(email, welcomeEmail.code);
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
    },
    codeAuth: async (_parent, _args, _ctx, _info) => {
      try {
        const { code, email } = _args;
        const sentEmail = await getRepository(EmailAuth)
          .createQueryBuilder('email_auth')
          .where('email = :email', { email })
          .andWhere('code = :code', { code })
          .andWhere('logged = false')
          .getOne();
        if (sentEmail) {
          sentEmail.logged = true;
          sentEmail.save();
          const existUser = await User.findOne({ email });
          if (!existUser) {
            const newbee = await User.create({ email }).save();
            newbee.createUserToken();
            return {
              ok: true,
              error: null
            };
          } else {
            existUser.createUserToken();
            return {
              ok: true,
              error: null
            };
          }
        } else {
          return {
            ok: false,
            error: 'please your code and email or retry email Auth'
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
