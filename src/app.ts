import { ApolloServer } from 'apollo-server-koa';
import Koa, { Context } from 'koa';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import { resolvers, typeDefs } from './graphql/hello'; // have to do make schema!
import routes from './routes';

const app = new Koa();
app.use(bodyparser());
app.use(routes.routes()).use(routes.allowedMethods());
if (process.env.NODE_ENV === 'development') {
  app.use(logger());
}

export type ApolloContext = {
  id: string;
  ip: string;
};

const context = async ({ ctx }: { ctx: Context }) => {
  try {
    // await consumeUser(ctx);
    // console.log(ctx.state);
    return {
      id: 'user01',
      ip: ctx.request.ip
    };
  } catch (e) {
    return {};
  }
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context
});
apolloServer.applyMiddleware({ app });
console.log(`🚀 apolloServer ready at ${apolloServer.graphqlPath}`);

export default app;
