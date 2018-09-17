const { pipe, compose, map, pick, filter, has, __ } = require('ramda');

const F = require('./filters');
const commonQuery = require('./query');

// one — get by id
// many — apply filters
module.exports = {
  get: id =>
    pipe(
      q => q.clone(),
      F.id(id),
      String
    )(commonQuery),
  search: fValues => {
    const order = [
      'id',
      'sender',
      'recipient',
      'after',
      'timeStart',
      'timeEnd',
      'sort',
      'limit',
    ];

    const fValuesPicked = pick(order, fValues);

    const appliedFs = compose(
      map(x => F[x](fValuesPicked[x])),
      filter(has(__, fValuesPicked))
    )(order);
    return pipe(
      q => q.clone(),
      ...appliedFs,
      String
    )(commonQuery);
  },
};
