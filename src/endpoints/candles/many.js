const { createResolver } = require('../../resolvers/candles');
const { select } = require('../utils/selectors');
const { captureErrors } = require('../../utils/captureErrors');
const { selectParamsFromQuery } = require('./utils');
/**
 * Endpoint
 * @name /candles?pairs[]‌="{asset_id_1}/{asset_id_2}"&pairs[]="{asset_id_1}/{asset_id_2}" ...other params
 */
const candlesManyEndpoint = async ctx => {
  const { pairs, query } = select(ctx);
  const params = selectParamsFromQuery(query);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'candlesMany',
  });

  // const resolver = createResolver({
  //   db: ctx.state.db,
  //   emitEvent: ctx.eventBus.emit,
  // });

  // const candles = await resolver({ pairs, ...params })
  //   .run()
  //   .promise();

  // ctx.eventBus.emit('ENDPOINT_RESOLVED', {
  //   value: candles,
  // });

  // ctx.state.returnValue = candles;
  ctx.body = 'Invoked candles many endpoint';
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
      ctx.body = 'Error resolving /candles';
    },
    Validation: () => {
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });
};
module.exports = captureErrors(handleError)(candlesManyEndpoint);
