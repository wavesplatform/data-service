const {
  compose,
  map,
  pick,
  filter,
  has,
  __,
  identity,
  reverse,
} = require('ramda');

const commonFiltersOrder = require('./filtersOrder');
const commonFilters = require('./filters');

const createSql = ({
  query,
  filters = commonFilters,
  filtersOrder = commonFiltersOrder,
  queryAfterFilters = identity,
}) => ({
  get: id =>
    compose(
      String,
      queryAfterFilters,
      filters.id(id)
    )(query),

  mget: ids =>
    compose(
      String,
      queryAfterFilters,
      filters.ids(ids)
    )(query),

  search: fValues => {
    const fValuesPicked = pick(filtersOrder, fValues);

    const appliedFs = compose(
      map(x => filters[x](fValuesPicked[x])),
      filter(has(__, fValuesPicked)),
      reverse
    )(filtersOrder);

    return compose(
      String,
      queryAfterFilters,
      ...appliedFs,
      q => q.clone()
    )(query);
  },
});

module.exports = createSql;
