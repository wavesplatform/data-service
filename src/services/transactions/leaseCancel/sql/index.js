const { pipe, compose, map, pick, filter, has, __ } = require('ramda');

const F = require('./filters');
const commonQuery = require('./query');

module.exports = {
  get: id =>
    pipe(
      q => q.clone(),
      F.id(id),
      String
    )(commonQuery),

  mget: ids =>
    pipe(
      F.ids(ids),
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
