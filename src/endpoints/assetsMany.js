const { many: createResolver } = require('../resolvers/assets');
const { getIdsFromCtx } = require('../utils/getters');
const { captureErrors } = require('../utils/captureErrors');

const assetsResolver = async ctx => {
  const ids = getIdsFromCtx(ctx);
  ctx.state.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'assets',
  });
  const resolver = createResolver({
    db: ctx.state.db,
    emitEvent: ctx.state.eventBus.emit,
  });

  const assets = await resolver(ids)
    .run()
    .promise();

  ctx.state.eventBus.emit('ENDPOINT_RESOLVED', {
    value: assets,
  });
  ctx.state.returnValue = assets;
};

const handleError = ({ ctx, error }) => {
  ctx.state.eventBus.emit('ERROR', error);
  error.matchWith({
    Db: () => {
      ctx.status = 500;
      ctx.body = 'Database Error';
    },
    Resolver: () => {
      ctx.status = 500;
      ctx.body = 'Error resolving /assets';
    },
    Validation: () => {
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });
};
module.exports = captureErrors(handleError)(assetsResolver);
