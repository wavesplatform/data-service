const { compose, merge, pick, pipe, assoc } = require('ramda');

const { select, fSelect, composeQuery } = require('./query');
const { pickBindFilters } = require('../../../../../utils/db');

// one — get by id
// many — apply filters
module.exports = ({ filters: F }) => ({
  get: id =>
    pipe(
      F.id(id),
      String
    )(select),

  mget: ids =>
    pipe(
      F.ids(ids),
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
      'senders',
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

    const withValueF =
      withDefaults.value !== undefined
        ? assoc('value', F.value(withDefaults.type), F)
        : F;

    const fs = pickBindFilters(withValueF, fNames, withDefaults);
    const fQuery = pipe(...fs)(fSelect);

    return pipe(
      composeQuery,
      F.sort(withDefaults.sort),
      String
    )(fQuery);
  },
});
