const { compose, defaultTo, merge, pick, pipe } = require('ramda');

const { pickBindFilters } = require('../../../../../utils/db');
const { defaultValues } = require('../../../_common/sql');
const { filters } = require('./filters');
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
      F.limit(1),
      getOrMgetPrepareForSelectFromFiltered,
      selectFromFiltered,
      String
    )(getOrMget(defaultValues.sort)),

  mget: ids =>
    pipe(
      F.ids(ids),
      F.limit(ids.length),
      getOrMgetPrepareForSelectFromFiltered,
      selectFromFiltered,
      String
    )(getOrMget(defaultValues.sort)),

  search: fValues => {
    const fNames = [
      // tx attributes
      'after',
      'timeStart',
      'timeEnd',
      'sender',
      // specific attributes
      'matcher',
      'orderId',
      'amountAsset',
      'priceAsset',
      // common
      'limit',
    ];

    // { [fName]: fValue }
    const withDefaults = compose(pick(fNames), merge(defaultValues))(fValues);

    const sort = defaultTo(defaultValues.sort, fValues.sort);

    const fs = pickBindFilters(F, fNames, withDefaults);
    const fQuery = pipe(...fs)(search(sort));

    return pipe(
      searchPrepareForSelectFromFiltered,
      selectFromFiltered,
      filters.outerSort(sort),
      String
    )(fQuery);
  },
});

module.exports = { createApi };
