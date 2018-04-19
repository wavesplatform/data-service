const assetsResolver = require('../resolvers/assets');
const { getIdsFromCtx } = require('../utils/getters');

module.exports = async ctx => {
  const ids = getIdsFromCtx(ctx);
  ctx.logger.log({
    level: 'info',
    message: 'Assets endpoint hit',
  });
  let error, task, res;
  res = assetsResolver({ ids, api: ctx.state.db });
  console.log(res);
  res.cata(e => (error = e), t => (task = t));
  ctx.body = task ? await task.run().promise() : error;
};
