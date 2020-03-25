import cors from '@koa/cors';
import { ApolloServer } from 'apollo-server-koa';
import Koa, { Context } from 'koa';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import { createConnection } from 'typeorm';
import schema from './graphql/schema';
import { tokenCheckMiddleware } from './lib/token';

const app = new Koa();

app.use(bodyparser());
if (process.env.NODE_ENV === 'development') {
  app.use(logger());
}
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);
app.use(tokenCheckMiddleware);

export type ApolloContext = {
  id: string;
  ctx: Context;
};

const context = async ({ ctx }: { ctx: Context }) => {
  try {
    return {
      ctx,
      id: 'user01'
    };
  } catch (e) {
    return {};
  }
};

const apolloServer = new ApolloServer({
  schema,
  context
});
apolloServer.applyMiddleware({ app, cors: false });
console.log(`🚀 apolloServer ready at ${apolloServer.graphqlPath}`);

/**
 * initial tasks except Koa middlewares
 */
async function initialize() {
  try {
    await createConnection();
    console.log('Postgres RDBMS connection is established');
  } catch (e) {
    console.log(e);
  }
}

initialize();

export default app;
