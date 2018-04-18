const assetsResolver = require('../resolvers/assets');
const { getIdsFromCtx } = require('../utils/getters');

module.exports = async ctx => {
  const ids = getIdsFromCtx(ctx);
  ctx.logger.log({
    level: 'info',
    message: 'Assets endpoint hit',
  });
  ctx.body = await assetsResolver({ ids, api: ctx.state.db });
};
