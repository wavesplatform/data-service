const { pathOr, __ } = require('ramda');

const logRedisError = emitEvent => err => {
  const pathInErr = pathOr('', __, err);

  return emitEvent('CACHE_ERROR', {
    level: 'error',
    error: {
      type: pathInErr(['type']),
      request: pathInErr(['meta', 'request']),
      command: pathInErr(['error', 'command']),
      code: pathInErr(['error', 'code']),
    },
  });
};

module.exports = logRedisError;
