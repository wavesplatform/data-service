const createDb = require('../db');

module.exports = options => async (ctx, next) => {
  ctx.state.db = createDb({ ...options, log: ctx.log });
  await next();
};
