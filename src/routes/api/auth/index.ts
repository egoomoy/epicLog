import Router from 'koa-router';
import { getRepository } from 'typeorm';
import { User } from '../../../entities/user';

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
      console.log(await user.comparePassword(password));
    }
  } catch (error) {
    ctx.throw(500, error);
  }
});

export default auth;
