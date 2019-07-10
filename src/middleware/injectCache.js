const NodeCache = require('node-cache');
const cache = new NodeCache();

module.exports = async (ctx, next) => {
  ctx.cache = cache;

  await next();
};
