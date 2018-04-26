const { assocPath } = require('ramda');

module.exports = (path, value) => async (ctx, next) => {
  ctx.state = assocPath(path, value, ctx.state);
  await next();
};
