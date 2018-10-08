const { pipe, pickAll, ifElse, values, pathOr } = require('ramda');

const { parseArrayQuery } = require('./parseArrayQuery');

const selectArrayFromQuery = what =>
  pipe(
    selectQuery,
    pathOr('', [what]),
    parseArrayQuery
  );

const selectParams = pathOr({}, ['params']);
const selectQuery = pathOr({}, ['query']);

const selectFromParams = what =>
  ifElse(
    () => Array.isArray(what),
    pipe(
      selectParams,
      pickAll(what),
      values
    ),
    pipe(
      selectParams,
      pathOr('', [what]),
      String
    )
  );

const selectId = selectFromParams('id');
const selectIds = selectArrayFromQuery('ids');
const selectPairs = selectArrayFromQuery('pairs');

const select = ctx => ({
  get id() {
    return selectId(ctx);
  },
  get ids() {
    return selectIds(ctx);
  },
  get pairs() {
    return selectPairs(ctx);
  },
  get query() {
    return selectQuery(ctx);
  },
  get params() {
    return selectParams(ctx);
  },
  fromParams(what) {
    return selectFromParams(what)(ctx);
  },
});

module.exports = {
  select,
};
