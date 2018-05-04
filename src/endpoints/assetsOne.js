const { one: createResolver } = require('../resolvers/assets');
const { getIdFromCtx } = require('../utils/getters');
const { captureErrors } = require('../utils/captureErrors');
const JSONbig = require('@waves/json-bigint');

const assetResolver = async (ctx, next) => {
  const id = getIdFromCtx(ctx);
  ctx.state.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'assets',
  });
  const resolver = createResolver({
    db: ctx.state.db,
    emitEvent: ctx.state.eventBus.emit,
  });

  const asset = await resolver(id)
    .run()
    .promise();

  ctx.state.eventBus.emit('ENDPOINT_RESOLVED', {
    value: asset,
  });
  ctx.body = JSONbig.stringify(asset);
  await next();
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
      ctx.body = 'Error resolving /asset';
    },
    Validation: () => {
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });
};
module.exports = captureErrors(handleError)(assetResolver);
