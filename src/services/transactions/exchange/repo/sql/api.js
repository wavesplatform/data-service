const { defaultTo, pick, pipe } = require('ramda');

const { pickBindFilters } = require('../../../../../utils/db');
const defaultValues = require('../../../_common/sql/defaults');
const { select, selectFromFiltered } = require('./query');

// get — get by id
// mget/search — apply filters
const createApi = ({ filters: F }) => ({
  get: id =>
    pipe(
      F.id(id),
      // tips for postgresql to use index
      F.limit(1),
      selectFromFiltered,
      String
    )(select),

  mget: ids =>
    pipe(
      F.ids(ids),
      // tip for postgresql to use index
      F.sort(defaultValues.SORT),
      F.limit(ids.length),
      selectFromFiltered,
      String
    )(select),

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
    const withDefaults = pick(fNames, fValues);

    const sort = defaultTo(defaultValues.SORT, fValues.sort);

    const fs = pickBindFilters(F, fNames, withDefaults);
    const fQuery = pipe(F.sort(sort), ...fs)(select);

    return pipe(selectFromFiltered, F.sort(sort), String)(fQuery);
  },
});

module.exports = { createApi };
