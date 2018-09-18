const { compose, merge, pick, pipe, assoc } = require('ramda');

const { select, fSelect, composeQuery } = require('./query');
const { pickBindFilters } = require('../../../../../utils/db');

// one — get by id
// many — apply filters
module.exports = ({ filters: F }) => ({
  get: id =>
    pipe(
      F.id(id),
      F.sortByDataPosition,
      String
    )(select),

  search: (fValues = {}) => {
    const defaultValues = { limit: 100, sort: 'desc' };

    // no `limit` here, will apply it separately
    const fNames = [
      // tx attributes
      'after',
      'timeStart',
      'timeEnd',
      'sender',
      // data attributes
      'key',
      'type',
      'value',
      // sort
      'sort',
      'limit',
    ];

    // { [fName]: fValue }
    const withDefaults = compose(
      pick(fNames),
      merge(defaultValues)
    )(fValues);

    // const limit = fValues.limit || defaultValues.limit;

    const withValueF = withDefaults.value
      ? assoc('value', F.value(withDefaults.type), F)
      : F;

    const fs = pickBindFilters(withValueF, fNames, withDefaults);
    const fQuery = pipe(...fs)(fSelect);

    return pipe(
      composeQuery,
      F.sort(withDefaults.sort),
      F.sortByDataPosition,
      String
    )(fQuery);
  },
});
