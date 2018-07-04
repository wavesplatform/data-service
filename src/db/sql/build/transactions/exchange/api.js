const { compose, map, pick, filter, has, __, pipe } = require('ramda');

const { select, withDecimals, withOrders, renameFields } = require('./query');

const commonQuery = pipe(
  withOrders,
  renameFields,
  withDecimals
);
// one — get by id
// many — apply filters
module.exports = ({ filters: F }) => ({
  one: id =>
    pipe(
      F.id(id),
      commonQuery,
      String
    )(select),
  many: fValues => {
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
