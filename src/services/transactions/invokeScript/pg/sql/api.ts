const { compose, defaultTo, merge, pick, pipe, tap } = require('ramda');

const { select, fSelect } = require('./query');
const { pickBindFilters } = require('../../../../../utils/db');

// get — get by id
// mget/search — apply filters
export const createApi = ({ filters: F }: { filters: any }) => ({
  get: (id: string): string => pipe(F.id(id), select, String)(fSelect('desc')),

  mget: (ids: string[]): string =>
    pipe(F.ids(ids), select, String)(fSelect('desc')),

  search: (fValues: Record<string, any> = {}): string => {
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
      // limit
      'limit',
    ];

    // { [fName]: fValue }
    const withDefaults = compose(pick(fNames), merge(defaultValues))(fValues);
    console.log('fValues ', fValues);
    const fs = pickBindFilters(F, fNames, withDefaults);
    const fQuery = pipe(...fs)(
      fSelect(defaultTo(defaultValues.sort, fValues['sort']))
    );

    return pipe(select, String, tap(console.log))(fQuery);
  },
});
