const postToGet = routeMiddleware => async (ctx, next) => {
  ctx.method = 'GET';
  ctx.query = ctx.request.body;
  await routeMiddleware(ctx, next);
  next();
};

module.exports = postToGet;
