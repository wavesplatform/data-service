const { createResolver } = require('../../resolvers/candles');
const { select } = require('../utils/selectors');
const { captureErrors } = require('../../utils/captureErrors');
const { selectParamsFromQuery } = require('./utils');

/**
 * Endpoint
 * @name /candles/id1/id2?...params
 */
const candlesOneEndpoint = async ctx => {
  const { fromParams, query } = select(ctx);
  const pair = fromParams(['id1', 'id2']);
  const params = selectParamsFromQuery(query);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'candlesOne',
  });

  // const resolver = createResolver({
  //   db: ctx.state.db,
  //   emitEvent: ctx.eventBus.emit,
  // });

  // const candles = await resolver({ pairs: [pair], ...params })
  //   .run()
  //   .promise();

  // ctx.eventBus.emit('ENDPOINT_RESOLVED', {
  //   value: candles,
  // });

  // if (candles) {
  //   ctx.state.returnValue = candles;
  // } else {
  //   ctx.status = 404;
  //   ctx.body = `Candles for ${id1}/${id2} not found`;
  // }
  ctx.body = 'Invoked candles one endpoint';
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
      ctx.body = 'Error resolving /candles/';
    },
    Validation: () => {
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });
};
module.exports = captureErrors(handleError)(candlesOneEndpoint);
