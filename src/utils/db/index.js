const { compose, map, filter, has, __, curryN } = require('ramda');

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
  pickBindFilters,
};
