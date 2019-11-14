import Router from 'koa-router';
const v2 = new Router();

v2.get('/', ctx => {
  ctx.body = 'v2 api';
});

export default v2;
