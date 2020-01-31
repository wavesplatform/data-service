const { compose, defaultTo, merge, pick, pipe } = require('ramda');

const filters = require('./filters').default;
const { select, selectFromFiltered } = require('./query');
const { pickBindFilters } = require('../../../../../../utils/db');

const defaultValues = { limit: 100, sort: 'desc' };

// get — get by id
// mget/search — apply filters
const createApi = ({ filters: F }) => ({
  get: id =>
    pipe(F.id(id), selectFromFiltered, String)(select(defaultValues.sort)),

  mget: ids =>
    pipe(F.ids(ids), selectFromFiltered, String)(select(defaultValues.sort)),

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

    const sort = defaultTo(defaultValues.sort, fValues.sort);

    const fs = pickBindFilters(F, fNames, withDefaults);
    const fQuery = pipe(...fs)(select(sort));

    return pipe(selectFromFiltered, filters.outerSort(sort), String)(fQuery);
  },
});

module.exports = { createApi };
