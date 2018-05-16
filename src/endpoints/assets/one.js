const { one: createResolver } = require('../../resolvers/assets');
const { select } = require('../utils/selectors');
const { captureErrors } = require('../../utils/captureErrors');

const assetResolver = async ctx => {
  const { id } = select(ctx);
  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'assets',
  });
  const resolver = createResolver({
    db: ctx.state.db,
    emitEvent: ctx.eventBus.emit,
  });

  const asset = await resolver(id)
    .run()
    .promise();

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: asset,
  });

  if (asset) {
    ctx.state.returnValue = asset;
  } else {
    ctx.status = 404;
    ctx.body = `Asset ${id} not found`;
  }
};

const handleError = ({ ctx, error }) => {
  ctx.eventBus.emit('ERROR', error);
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
