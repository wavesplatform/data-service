const { select } = require('../utils/selectors');
const { parseBool } = require('../utils/parseBool');
const { captureErrors } = require('../../utils/captureErrors');
const createService = require('../../services/aliases');

const resolver = async ctx => {
  const { address, showBrokenString } = select(ctx).query;
  const showBroken = parseBool(showBrokenString);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: 'aliases',
  });
  const service = createService({
    drivers: ctx.state.drivers,
    emitEvent: ctx.eventBus.emit,
  });

  const aliases = await service
    .search({ address, showBroken })
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