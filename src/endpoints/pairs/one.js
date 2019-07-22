const createService = require('../../services/pairs');
const { select } = require('../utils/selectors');
const { captureErrors } = require('../../utils/captureErrors');
const { parseFilterValues } = require('../_common/filters');
const { query: parseQuery } = require('../_common/filters/parsers');
const { handleError } = require('../../utils/handleError');

/**
 * Endpoint
 * @name /pairs/id1/id2?...params
 */
const pairsOneEndpoint = async ctx => {
  const { fromParams, query } = select(ctx);
  const [id1, id2] = fromParams(['id1', 'id2']);
  const { matcher } = parseFilterValues({ matcher: parseQuery })(query);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: '/pairs/:id1/:id2',
  });

  const service = createService({
    drivers: ctx.state.drivers,
    emitEvent: ctx.eventBus.emit,
  });

  const pair = await service
    .get({
      amountAsset: id1,
      priceAsset: id2,
      matcher: matcher || ctx.state.config.defaultMatcher,
    })
    .run()
    .promise();

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: pair,
  });

  pair.matchWith({
    Just: ({ value }) => (ctx.state.returnValue = value),
    Nothing: () => (ctx.status = 404),
  });
};

module.exports = captureErrors(handleError)(pairsOneEndpoint);
