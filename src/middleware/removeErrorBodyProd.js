const isAllowedStatus = x => [200, 400].includes(x);

module.exports = async (ctx, next) => {
  await next();
  if (process.env.NODE_ENV !== 'development' && !isAllowedStatus(ctx.status)) {
    ctx.throw(ctx.status);
  }
};
