const assetsResolver = require('../resolvers/assets');
const { getIdsFromCtx } = require('../utils/getters');

module.exports = async ctx => {
  const ids = getIdsFromCtx(ctx);
  ctx.logger.log({
    level: 'info',
    message: 'Assets endpoint hit',
  });
  try {
    const res = await assetsResolver({ ids, db: ctx.db });
    ctx.logger.log({
      level: 'info',
      message: res,
    });
  } catch (e) {
    ctx.logger.log({
      level: 'error',
      message: JSON.stringify(e),
    });
  }
};
