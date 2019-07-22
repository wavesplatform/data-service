const createService = require('../../services/pairs');
const { select } = require('../utils/selectors');
const { captureErrors } = require('../../utils/captureErrors');
const { parseFilterValues } = require('../_common/filters');
const { query: parseQuery } = require('../_common/filters/parsers');

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

const handleError = ({ ctx, error }) => {
  ctx.eventBus.emit('ERROR', error);
  error.matchWith({
    Db: () => {
      ctx.status = 500;
      ctx.body = 'Database Error';
    },
    Resolver: () => {
      ctx.status = 500;
      ctx.body = 'Error resolving /pairs/:id1/:id2';
    },
    Validation: () => {
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });
};
module.exports = captureErrors(handleError)(pairsOneEndpoint);
