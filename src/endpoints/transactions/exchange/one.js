const {
  one: createResolver,
} = require('../../../resolvers/transactions/exchange');
const { captureErrors } = require('../../../utils/captureErrors');
const { select } = require('../../utils/selectors');
const exchangeTxsEndpointOne = async ctx => {
  const { id } = select(ctx);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'assets',
  });
  const resolver = createResolver({
    db: ctx.state.db,
    emitEvent: ctx.eventBus.emit,
  });

  // Run resolver with params
  const tx = await resolver(id)
    .run()
    .promise();

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: tx,
  });
  ctx.state.returnValue = tx;
  // ctx.body = 'Exchange one transactions result';
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
module.exports = captureErrors(handleError)(exchangeTxsEndpointOne);
