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

/**
 * Escapes query for SQL condition with to_tsquery function
 * @param {string} query
 * @returns {string}
 */
const escapeForTsQuery = query => {
  return query
    .trim()
    .replace(/[^\w\s]|_/g, '')
    .split(' ')
    .join(' & ');
};

/**
 * Escapes query for SQL condition with like operator
 * @param {string} query
 * @returns {string}
 */
const escapeForLike = query => query.replace(/%/g, '\\%');

/**
 * Prepares query for SQL condition with like operator
 * @param {string} query
 * @param {object} params
 * @returns {string}
 */
const prepareForLike = (query, params = { matchExactly: false }) =>
  compose(
    query => (params.matchExactly ? query : `${query}%`),
    escapeForLike
  )(query);

module.exports = {
  matchRequestsResults,
  pickBindFilters,
  escapeForTsQuery,
  escapeForLike,
  prepareForLike,
};
