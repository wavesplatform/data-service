import { stringify } from 'qs';
import { Middleware } from 'koa';

type PostToGet = (routeMiddleWare: Middleware) => Middleware;

export const postToGet: PostToGet = routeMiddleware => async (ctx, next) => {
  ctx.method = 'GET';
  // @hack, can't rely on koa-qs in this one
  // Need to explicitly call with { indices: false }
  // Otherwise your array with >20 elems [0..21] will become { 0: 0, 1: 1, ... 21: 21 }
  ctx.request.querystring = stringify(ctx.request.body, { indices: false });
  await routeMiddleware(ctx, next);
  next();
};
