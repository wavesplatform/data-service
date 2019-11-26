const { compose, defaultTo, merge, pick, pipe } = require('ramda');

const { blank, selectOnFiltered } = require('./query');
const { pickBindFilters } = require('../../../../../utils/db');

// get — get by id
// mget/search — apply filters
export const createApi = ({ filters: F }: { filters: any }) => ({
  get: (id: string): string =>
    pipe(F.id(id), selectOnFiltered, String)(blank('desc')),

  mget: (ids: string[]): string =>
    pipe(F.ids(ids), selectOnFiltered, String)(blank('desc')),

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
      blank(defaultTo(defaultValues.sort, fValues['sort']))
    );

    return pipe(selectOnFiltered, String)(fQuery);
  },
});
