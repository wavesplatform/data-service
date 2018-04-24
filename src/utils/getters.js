const { pathOr, pipe } = require('ramda');

const getIdsFromCtx = pipe(
  pathOr('', ['query', 'ids']),
  x => x.toString(),
  str => (str === '' ? null : str.split(','))
);
const getIdFromCtx = pipe(
  pathOr('', ['params', 'id']),
  x => x.toString(),
  str => (str === '' ? null : str.split(','))
);

module.exports = { getIdsFromCtx, getIdFromCtx };
