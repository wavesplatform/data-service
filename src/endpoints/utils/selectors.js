const {
  pipe,
  pickAll,
  ifElse,
  values,
  always,
  split,
  pathOr,
  equals,
} = require('ramda');

const isEmptyString = equals('');

const selectArrayFromQuery = what =>
  pipe(
    selectQuery,
    pathOr('', [what]),
    String,
    ifElse(isEmptyString, always([]), split(','))
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
