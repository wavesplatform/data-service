const { compose, defaultTo, merge, pick, pipe } = require('ramda');

const { pickBindFilters } = require('../../../../../../utils/db');
const defaultValues = require('../../../../_common/sql/defaults');
const { select, selectFromFiltered } = require('./query');

// get — get by id
// mget/search — apply filters
const createApi = ({ filters: F }) => ({
  get: (id) =>
    pipe(
      F.id(id),
      // tip for postgresql to use index
      F.limit(1),
      selectFromFiltered,
      String
    )(select(defaultValues.SORT)),

  mget: (ids) =>
    pipe(
      F.ids(ids),
      // tip for postgresql to use index
      F.limit(ids.length),
      selectFromFiltered,
      String
    )(select(defaultValues.SORT)),

  search: (fValues) => {
    const fNames = [
      // tx attributes
      'after',
      'timeStart',
      'timeEnd',
      'blockTimeStart',
      'blockTimeEnd',
      'sender',
      'senders',
      // specific attributes
      'dapp',
      'function',
      // limit
      'limit',
    ];

    // { [fName]: fValue }
    const withDefaults = compose(pick(fNames), merge(defaultValues))(fValues);

    const sort = defaultTo(defaultValues.SORT, fValues.sort);

    const fs = pickBindFilters(F, fNames, withDefaults);

    return pipe(...fs, selectFromFiltered, F.sort(sort), String)(select(sort));
  },
});

module.exports = { createApi };
