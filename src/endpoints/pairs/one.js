const createService = require('../../services/pairs');
const { select } = require('../utils/selectors');
const { captureErrors } = require('../../utils/captureErrors');

/**
 * Endpoint
 * @name /pairs/id1/id2?...params
 */
const pairsOneEndpoint = async ctx => {
  const { fromParams } = select(ctx);
  const [id1, id2] = fromParams(['id1', 'id2']);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'pairsOne',
  });

  const service = createService({
    drivers: ctx.state.drivers,
    emitEvent: ctx.eventBus.emit,
  });

  const pairs = await service
    .get({
      amountAsset: id1,
      priceAsset: id2,
    })
    .run()
    .promise();

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: pairs,
  });

  if (pairs) {
    ctx.state.returnValue = pairs;
  } else {
    ctx.status = 404;
    ctx.body = `pairs for ${id1}/${id2} not found`;
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
      ctx.body = 'Error resolving /pairs/';
    },
    Validation: () => {
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });
};
module.exports = captureErrors(handleError)(pairsOneEndpoint);
