const { compose, merge, pick, pipe } = require('ramda');

const { select, fSelect, composeQuery } = require('./query');
const { pickBindFilters } = require('../../../../../utils/db');

// get — get by id
// mget/search — apply filters
export const createApi = ({ filters: F }: { filters: any }) => ({
  get: (id: string): string =>
    pipe(
      F.id(id),
      String
    )(select),

  mget: (ids: string[]): string =>
    pipe(
      F.ids(ids),
      String
    )(select),

  search: (fValues = {}): string => {
    const defaultValues = { limit: 100, sort: 'desc' };

    // no `limit` here, will apply it separately
    const fNames = [
      // tx attributes
      'after',
      'timeStart',
      'timeEnd',
      'sender',
      // specific attributes
      'dapp',
      'function',
      // sort
      'sort',
      'limit',
    ];

    // { [fName]: fValue }
    const withDefaults = compose(
      pick(fNames),
      merge(defaultValues)
    )(fValues);

    const fs = pickBindFilters(F, fNames, withDefaults);
    const fQuery = pipe(...fs)(fSelect);

    return pipe(
      composeQuery,
      F.sort(withDefaults.sort),
      String
    )(fQuery);
  },
});
