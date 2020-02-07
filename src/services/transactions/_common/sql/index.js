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
const defaultValues = require('./defaults');

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
        filters.limit(1),
        filters.id(id),
        filters.sort(defaultValues.SORT)
      )(query),

    mget: ids =>
      compose(
        String,
        q => queryAfterFiltersWithDefaults.mget(q, ids),
        filters.limit(ids.length),
        filters.ids(ids),
        filters.sort(defaultValues.SORT)
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

module.exports = { defaultValues, createSql };
