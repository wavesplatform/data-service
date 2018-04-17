const { pathOr, pipe } = require('ramda');

const getIdsFromCtx = pipe(
  pathOr('', ['request', 'query', 'ids']),
  x => x.toString(),
  str => str.split(',')
);

module.exports = { getIdsFromCtx };
