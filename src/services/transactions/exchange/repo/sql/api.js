const { compose, defaultTo, merge, pick, pipe } = require('ramda');

const { pickBindFilters } = require('../../../../../utils/db');
const defaultValues = require('../../../_common/sql/defaults');
const {
  getOrMget,
  getOrMgetPrepareForSelectFromFiltered,
  search,
  searchPrepareForSelectFromFiltered,
  selectFromFiltered,
} = require('./query');

// get — get by id
// mget/search — apply filters
const createApi = ({ filters: F }) => ({
  get: id =>
    pipe(
      F.id(id),
      getOrMgetPrepareForSelectFromFiltered,
      selectFromFiltered,
      String
    )(getOrMget),

  mget: ids =>
    pipe(
      F.ids(ids),
      getOrMgetPrepareForSelectFromFiltered,
      selectFromFiltered,
      String
    )(getOrMget),

  search: fValues => {
    const fNames = [
      // tx attributes
      'timeStart',
      'timeEnd',
      'sender',
      // specific attributes
      'matcher',
      'orderId',
      'amountAsset',
      'priceAsset',
      // common
      'after',
      'limit',
    ];

    // { [fName]: fValue }
    const withDefaults = compose(
      pick(fNames),
      merge({
        ...defaultValues,
        limit: defaultValues.LIMIT * 2, // hack for filtering in txs_7_orders - there are 2 rows on each tx
      })
    )({ ...fValues, limit: fValues.limit * 2 });

    const sort = defaultTo(defaultValues.SORT, fValues.sort);

    const fs = pickBindFilters(F, fNames, withDefaults);
    const fQuery = pipe(F.sort(sort), ...fs)(search);

    return pipe(
      searchPrepareForSelectFromFiltered,
      selectFromFiltered,
      F.sort(sort),
      String
    )(fQuery);
  },
});

module.exports = { createApi };
