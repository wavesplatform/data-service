const { pipe, compose, map, pick, filter, has, __, merge } = require('ramda');

const F = require('./filters');
const { baseQuery, withAllThings } = require('./query');

// one — get by id
// search — apply filters
module.exports = {
  one: id =>
    pipe(
      q => q.clone(),
      F.id(id),
      withAllThings,
      String
    )(baseQuery),
  search: fValues => {
    const defaultValues = { limit: 100, sort: 'desc' };
    // { [fName]: fValue }

    const order = [
      'recipient',
      'sort',
      'assetId',
      'after',
      'sender',
      'timeStart',
      'timeEnd',
      'limit',
    ];
    const fValuesPicked = compose(
      pick(order),
      merge(defaultValues)
    )(fValues);

    const appliedFs = compose(
      map(x => F[x](fValuesPicked[x])),
      filter(has(__, fValuesPicked))
    )(order);
    return pipe(
      q => q.clone(),
      ...appliedFs,
      withAllThings,
      F.sort(fValuesPicked.sort),
      String
    )(baseQuery);
  },
};
