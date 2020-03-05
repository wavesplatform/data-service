const { compose, defaultTo, merge, pick, pipe } = require('ramda');

const { pickBindFilters } = require('../../../../../../utils/db');
const defaultValues = require('../../../../_common/sql/defaults');
const { getOrMgetSelect, search, selectFromFiltered } = require('./query');

// get — get by id
// mget/search — apply filters
const createApi = ({ filters: F }) => ({
  get: id => pipe(F.id(id), selectFromFiltered, String)(getOrMgetSelect),

  mget: ids => pipe(F.ids(ids), selectFromFiltered, String)(getOrMgetSelect),

  search: fValues => {
    const fNames = [
      // tx attributes
      'after',
      'timeStart',
      'timeEnd',
      'sender',
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
    const fQuery = pipe(...fs)(search(sort));

    return pipe(selectFromFiltered, F.sort(sort), String)(fQuery);
  },
});

module.exports = { createApi };
