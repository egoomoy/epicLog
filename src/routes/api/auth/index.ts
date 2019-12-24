import Router from 'koa-router';
import { getRepository } from 'typeorm';
import { User } from '../../../entities/User';
import { setTokenCookie } from '../../../utilities/token';

const auth = new Router();

auth.get('/', ctx => {
  ctx.body = 'auth api';
});

auth.post('/signIn', async ctx => {
  type requestBody = {
    email: string;
    password: string;
  };
  const { email, password }: requestBody = ctx.request.body;
  const userRepo = await getRepository(User);
  try {
    const user = await userRepo.findOne({
      email
    });
    if (user) {
      if (await user.comparePassword(password)) {
        const tokens = await user.createUserToken();
        setTokenCookie(ctx, tokens);
        ctx.body = {
          user,
          tokens: {
            access_Token: tokens.accessToken,
            refresh_Token: tokens.refreshToken
          }
        };
      } else {
        ctx.throw(404, 'invalid password');
      }
    } else {
      ctx.throw(404, 'invalid user');
    }
  } catch (error) {
    ctx.throw(500, error);
  }
});

export default auth;
