const { pathOr, pipe, pickAll, map } = require('ramda');

const getArrayFromQueryCtx = what =>
  pipe(
    pathOr('', ['query', what]),
    x => x.toString(),
    str => (str === '' ? [] : str.split(','))
  );
const getIdsFromCtx = getArrayFromQueryCtx('ids');
const getPairsFromCtx = pipe(
  getArrayFromQueryCtx('pairs'),
  map(pair => pair.split('/'))
);

const getQueryFromCtx = pathOr({}, ['query']);

// getFromCtxParams:: [] | String -> Ctx{} -> String[] | String
const getFromCtxParams = what =>
  Array.isArray(what)
    ? pipe(
      pathOr({}, ['params']),
      pickAll(what),
      obj => Object.values(obj),
      map(x => x.toString())
    )
    : pipe(pathOr('', ['params', what]), x => x.toString());

const getIdFromCtx = getFromCtxParams('id');
module.exports = {
  getIdsFromCtx,
  getIdFromCtx,
  getFromCtxParams,
  getQueryFromCtx,
  getPairsFromCtx,
};
