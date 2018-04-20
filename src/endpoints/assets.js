const createAssetsResolver = require('../resolvers/assets');
const { getIdsFromCtx } = require('../utils/getters');

module.exports = async (ctx, next) => {
  const ids = getIdsFromCtx(ctx);
  ctx.logger.log({
    level: 'info',
    message: 'Assets endpoint hit',
  });
  const resolver = createAssetsResolver({ db: ctx.state.db });

  await resolver(ids)
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
