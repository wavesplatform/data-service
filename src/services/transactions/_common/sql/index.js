const {
  compose,
  map,
  pick,
  filter,
  has,
  __,
  identity,
  reverse,
  merge,
} = require('ramda');

const commonFiltersOrder = require('./filtersOrder');
const commonFilters = require('./filters');

const createSql = ({
  query,
  filters = commonFilters,
  filtersOrder = commonFiltersOrder,
  queryAfterFilters = {},
}) => {
  const queryAfterFiltersWithDefaults = merge(
    {
      get: identity,
      mget: identity,
      search: identity,
    },
    queryAfterFilters
  );

  return {
    get: id =>
      compose(
        String,
        q => queryAfterFiltersWithDefaults.get(q, id),
        filters.id(id)
      )(query),

    mget: ids =>
      compose(
        String,
        q => queryAfterFiltersWithDefaults.mget(q, ids),
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
        q => queryAfterFiltersWithDefaults.search(q, fValuesPicked),
        ...appliedFs,
        q => q.clone()
      )(query);
    },
  };
};

module.exports = createSql;
