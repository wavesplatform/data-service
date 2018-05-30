const { version } = require('../../package.json');

module.exports = async ctx => {
  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
  });
  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: version,
  });
  ctx.state.returnValue = { version };
};
