const { pipe, compose, map, pick, filter, has, __ } = require('ramda');

const F = require('./filters');
const { select, withDecimals } = require('./query');

module.exports = {
  get: id =>
    pipe(
      F.id(id),
      withDecimals,
      String
    )(select),

  mget: ids =>
    pipe(
      F.ids(ids),
      withDecimals,
      String
    )(select),

  search: fValues => {
    const order = [
      'id',
      'assetId',
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
      withDecimals,
      F.sort(fValues.sort),
      String
    )(select);
  },
};
