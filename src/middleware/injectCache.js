const LRU = require('lru-cache');
const cache = new LRU(100000);

module.exports = async (ctx, next) => {
  ctx.cache = cache;

  await next();
};
