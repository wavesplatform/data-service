const { captureErrors } = require('../../utils/captureErrors');
const { handleError } = require('../../utils/handleError');
const { select } = require('../utils/selectors');

const createGetMiddleware = (url, service) => {
  return captureErrors(handleError)(async ctx => {
    if (!service.get) {
      ctx.status = 404;
      return;
    }

    const { id } = select(ctx);

    ctx.eventBus.emit('ENDPOINT_HIT', {
      url: ctx.originalUrl,
      resolver: `${url}/:id`,
      id,
    });

    const x = await service
      .get(id)
      .run()
      .promise();

    ctx.eventBus.emit('ENDPOINT_RESOLVED', {
      value: x,
    });

    x.matchWith({
      Just: ({ value }) => (ctx.state.returnValue = value),
      Nothing: () => {
        ctx.status = 404;
      },
    });
  });
};

module.exports = createGetMiddleware;
