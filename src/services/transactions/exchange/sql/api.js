const { compose, map, pick, filter, has, __, pipe } = require('ramda');

const { select, withDecimals, withOrders, renameFields } = require('./query');

const commonQuery = pipe(
  withOrders,
  renameFields,
  withDecimals
);

module.exports = ({ filters: F }) => ({
  get: id =>
    pipe(
      F.id(id),
      commonQuery,
      String
    )(select),

  mget: ids =>
    pipe(
      F.ids(ids),
      commonQuery,
      String
    )(select),

  search: fValues => {
    const order = [
      'limit',
      'after',
      'timeStart',
      'timeEnd',
      'amountAsset',
      'priceAsset',
      'matcher',
      'sender',
      'sort',
    ];

    const fValuesPicked = pick(order, fValues);

    const appliedFs = compose(
      map(x => F[x](fValuesPicked[x])),
      filter(has(__, fValuesPicked))
    )(order);
    return pipe(
      ...appliedFs,
      commonQuery,
      F.sortOuter(fValuesPicked.sort),
      String
    )(select);
  },
});
