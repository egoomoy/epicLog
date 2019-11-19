import { gql } from 'apollo-server-koa';
import { getRepository } from 'typeorm';
import EmailAuth from '../entities/EmailAuth';

export const typeDefs = gql`
  type Query {
    user(username: String!): String
  }
`;

export const resolvers = {
  Query: {
    emailAuth: {}
  }
};
