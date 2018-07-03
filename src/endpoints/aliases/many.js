const { many: createResolver } = require('../../resolvers/aliases');
const { select } = require('../utils/selectors');
const { captureErrors } = require('../../utils/captureErrors');

const resolver = async ctx => {
  const { address, showBroken } = select(ctx).query;

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'aliases',
  });
  const resolver = createResolver({
    db: ctx.state.db,
    emitEvent: ctx.eventBus.emit,
  });

  const aliases = await resolver({ address, showBroken })
    .run()
    .promise();

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: aliases,
  });
  ctx.state.returnValue = aliases;
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
      ctx.body = 'Error resolving /aliases';
    },
    Validation: () => {
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });
};
module.exports = captureErrors(handleError)(resolver);
