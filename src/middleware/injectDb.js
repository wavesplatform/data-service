const createDb = require('../db');

module.exports = options => async (ctx, next) => {
  ctx.state.db = createDb(options);
  await next();
};
