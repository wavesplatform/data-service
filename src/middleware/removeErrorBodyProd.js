const isAllowedStatus = x => [200, 400].includes(x);

module.exports = async (ctx, next) => {
  await next();
  if (process.env.NODE_ENV !== 'development' && !isAllowedStatus(ctx.status)) {
    // Need to save headers, otherwise - cors problems
    ctx.throw(ctx.status, undefined, {
      headers: {
        ...ctx.response.headers,
        // @hack remove when statusCodes for errors will be ready
        ['Content-Type']: 'text/plain; charset=utf-8',
      },
    });
  }
};
