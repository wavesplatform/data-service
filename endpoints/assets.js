const { assets: assetsResolver } = require('../resolvers/assets');
const { getIdsFromCtx } = require('../utils/getters');

module.exports = async ctx => {
  const ids = getIdsFromCtx(ctx);
  ctx.body = await assetsResolver({ ids, api: ctx.api });
};
