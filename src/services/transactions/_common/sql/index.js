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
const pg = require('knex')({ client: 'pg' });

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
    get: (id) =>
      compose(
        String,
        (q) => queryAfterFiltersWithDefaults.get(q, id),
        // tip for postgresql to use index
        filters.limit(1),
        filters.id(id)
      )(query),

    mget: (ids) =>
      compose(
        String,
        (q) => queryAfterFiltersWithDefaults.mget(q, ids),
        // tip for postgresql to use index
        filters.sort(defaultValues.SORT),
        // tip for postgresql to use index
        filters.limit(ids.length),
        filters.ids(ids)
      )(query),

    search: (fValues) => {
      const fValuesPicked = pick(filtersOrder, fValues);
      const appliedFs = compose(
        map((x) => filters[x](fValuesPicked[x])),
        filter(has(__, fValuesPicked)),
        reverse
      )(filtersOrder);

      return compose(
        String,
        (q) => queryAfterFiltersWithDefaults.search(q, fValuesPicked),
        ...appliedFs,
        (q) => q.clone()
      )(query);
    },
  };
};

const createByTimeStamp = (t) => (comparator) => (ts) => (q) =>
  q
    .clone()
    .where(
      't.uid',
      comparator,
      pg(t)
        .select('uid')
        .where('time_stamp', comparator, ts.toISOString())
        .orderByRaw(`time_stamp <-> '${ts.toISOString()}'::timestamptz`)
        .limit(1)
    );

const createByBlockTimeStamp = (t) => (comparator) => (ts) => (q) =>
  q.clone().where(
    't.uid',
    comparator,
    pg(t)
      .select('uid')
      .where(
        'height',
        comparator,
        pg('blocks')
          .select('height')
          .where('time_stamp', comparator, ts.toISOString())
          .orderByRaw(`time_stamp <-> '${ts.toISOString()}'::timestamptz`)
          .limit(1)
      )
      .orderBy('height', comparator == '>=' ? 'asc' : 'desc')
      .limit(1)
  );

module.exports = { defaultValues, createSql, createByTimeStamp, createByBlockTimeStamp };
