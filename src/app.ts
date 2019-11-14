import { ApolloServer, gql } from 'apollo-server-koa';
import Koa from 'koa';

import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';

import routes from './routes';

const app = new Koa();

app.use(bodyparser());
app.use(routes.routes()).use(routes.allowedMethods());
if (process.env.NODE_ENV === 'development') {
  app.use(logger());
}

const typeDefs = gql`
  type Query {
    hello: String
  }
`;
const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  }
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });
apolloServer.applyMiddleware({ app });
console.log(`🚀 apolloServer ready at ${apolloServer.graphqlPath}`);

export default app;
