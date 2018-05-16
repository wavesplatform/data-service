const { createResolver } = require('../../resolvers/pairs');
const { select } = require('../utils/selectors');
const { captureErrors } = require('../../utils/captureErrors');

/**
 * Endpoint
 * @name /pairs/id1/id2?...params
 */
const pairsOneEndpoint = async ctx => {
  const { fromParams } = select(ctx);
  const pair = fromParams(['id1', 'id2']);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'pairsOne',
  });

  // const resolver = createResolver({
  //   db: ctx.state.db,
  //   emitEvent: ctx.eventBus.emit,
  // });

  // const pairs = await resolver(pair)
  //   .run()
  //   .promise();

  // ctx.eventBus.emit('ENDPOINT_RESOLVED', {
  //   value: pairs,
  // });

  // if (pairs) {
  //   ctx.state.returnValue = pairs;
  // } else {
  //   ctx.status = 404;
  //   ctx.body = `pairs for ${id1}/${id2} not found`;
  // }
  ctx.body = 'Invoked pairs one endpoint';
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
