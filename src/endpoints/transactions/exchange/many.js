const {
  many: createResolver,
} = require('../../../resolvers/transactions/exchange');
const { captureErrors } = require('../../../utils/captureErrors');
const { select } = require('../../utils/selectors');
const { selectFilters } = require('./utils');

const exchangeTxsEndpointMany = async ctx => {
  const { query } = select(ctx);
  const filters = selectFilters(query);

  // Get params from user
  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'txsExchangeMany',
  });
  const resolver = createResolver({
    db: ctx.state.db,
    emitEvent: ctx.eventBus.emit,
  });

  const txs = await resolver(filters)
    .run()
    .promise();

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: txs,
  });

  ctx.state.returnValue = txs;
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
module.exports = captureErrors(handleError)(exchangeTxsEndpointMany);
