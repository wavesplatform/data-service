const { version } = require('../../package.json');

module.exports = async ctx => {
  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
  });
  ctx.state.returnValue = {
    version,
    productionUrl: 'https://api.wavesplatform.com/v0',
    docsUrl: 'https://api.wavesplatform.com/v0/docs',
    github: 'https://github.com/wavesplatform/data-service',
  };
  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: ctx.state.returnValue,
  });
};
