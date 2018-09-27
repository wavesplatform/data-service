const Maybe = require('folktale/maybe');
const { compose, map, filter, has, __, curryN, find } = require('ramda');

/**
 * matchFn :: (Request, Result) -> Boolean
 *
 * matchRequestsResults ::
 *  matchFn ->
 *  Request[] ->
 *  Result[] ->
 *  (Maybe Result)[]
 * */
const matchRequestsResults = curryN(3, (matchFn, requests, results) => {
  const findResult = compose(
    Maybe.fromNullable,
    req => find(res => matchFn(req, res), results)
  );
  return map(findResult, requests);
});

/**
 * filter :: Query -> QueryWithFilter
 *
 * pickBindFilters ::
 *    { [fName]: fValue -> filter } ->
 *    fName[] ->
 *    { [fName]: fValue } ->
 *    filter[]
 * */
const pickBindFilters = curryN(3, (F, fsToApply, fValues) =>
  compose(
    map(x => F[x](fValues[x])),
    filter(has(__, fValues))
  )(fsToApply)
);

module.exports = {
  matchRequestsResults,
  pickBindFilters,
};
