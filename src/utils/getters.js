const { pathOr, pipe } = require('ramda');

const getIdsFromCtx = pipe(
  pathOr('', ['params', 'ids']),
  x => x.toString(),
  str => (str === '' ? null : str.split(','))
);

module.exports = { getIdsFromCtx };
