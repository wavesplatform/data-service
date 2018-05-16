// const { createResolver } = require('../../resolvers/transactions/exchange');
const { captureErrors } = require('../../../utils/captureErrors');
const { selectors } = require('../../utils/selectors');

const exchangeTxsResolver = async ctx => {
  const { id } = selectors(ctx);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'assets',
  });
  // const resolver = createResolver({
  //   db: ctx.state.db,
  //   emitEvent: ctx.eventBus.emit,
  // });

  // Run resolver with params
  // const asset = await resolver(id)
  //   .run()
  //   .promise();

  // ctx.eventBus.emit('ENDPOINT_RESOLVED', {
  //   value: asset,
  // });

  ctx.body = 'Exchange one transactions result';
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
      ctx.body = 'Error resolving /transactions/exchange';
    },
    Validation: () => {
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });
};
module.exports = captureErrors(handleError)(exchangeTxsResolver);
