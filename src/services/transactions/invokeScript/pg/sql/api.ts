const { compose, defaultTo, merge, pick, pipe } = require('ramda');

const { select, selectFromFiltered } = require('./query');
const { pickBindFilters } = require('../../../../../utils/db');

// get — get by id
// mget/search — apply filters
export const createApi = ({ filters: F }: { filters: any }) => ({
  get: (id: string): string =>
    pipe(F.id(id), selectFromFiltered, String)(select('desc')),

  mget: (ids: string[]): string =>
    pipe(F.ids(ids), selectFromFiltered, String)(select('desc')),

  search: (fValues: Record<string, any> = {}): string => {
    const defaultValues = { limit: 100, sort: 'desc' };

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

    const fs = pickBindFilters(F, fNames, withDefaults);
    const fQuery = pipe(...fs)(
      select(defaultTo(defaultValues.sort, fValues['sort']))
    );

<<<<<<< HEAD
    return pipe(selectFromFiltered, String)(fQuery);
=======
    return pipe(composeQuery, F.sort(withDefaults.sort), String)(fQuery);
>>>>>>> develop
  },
});
