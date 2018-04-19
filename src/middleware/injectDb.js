const createDb = require('../db');

module.exports = options => async (ctx, next) => {
  ctx.db = createDb(options);
  await next();
};
