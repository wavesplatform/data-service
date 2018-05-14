const { createResolver } = require('../../resolvers/candles');
const { getFromCtxParams, getQueryFromCtx } = require('../../utils/getters');
const { captureErrors } = require('../../utils/captureErrors');
const { getParamsFromQuery } = require('./utils');

const getId1Id2FromCtx = getFromCtxParams(['id1', 'id2']);

/**
 * Endpoint
 * @name /candles/id1/id2?...params
 */
const candlesOneEndpoint = async ctx => {
  const [id1, id2] = getId1Id2FromCtx(ctx);
  const params = getParamsFromQuery(getQueryFromCtx(ctx));

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'candlesOne',
  });

  // const resolver = createResolver({
  //   db: ctx.state.db,
  //   emitEvent: ctx.eventBus.emit,
  // });

  // const candles = await resolver(id1, id2, params)
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
