const assetsResolver = require('../resolvers/assets');
const { getIdsFromCtx } = require('../utils/getters');

module.exports = async (ctx, next) => {
  const ids = getIdsFromCtx(ctx);
  ctx.logger.log({
    level: 'info',
    message: 'Assets endpoint hit',
  });
  const task = assetsResolver({ ids, api: ctx.state.db, logger: ctx.logger });
  await task
    .run()
    .promise()
    .then(assets => {
      ctx.logger.log({
        level: 'info',
        message: 'Resolved:' + JSON.stringify(assets),
      });
      ctx.body = assets;
    })
    .catch(err => {
      ctx.logger.log({
        level: 'info',
        message: 'Rejected',
      });
      ctx.body = err;
    });
  await next();
};
