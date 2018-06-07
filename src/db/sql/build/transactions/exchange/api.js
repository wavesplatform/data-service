const { compose, map, merge, pick, filter, has, __, pipe } = require('ramda');

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
    const defaultValues = { limit: 100 };
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

    const withDefaults = compose(
      pick(order),
      merge(defaultValues)
    )(fValues);

    const appliedFs = compose(
      map(x => F[x](withDefaults[x])),
      filter(has(__, withDefaults))
    )(order);
    return pipe(
      ...appliedFs,
      commonQuery,
      F.sortOuter(withDefaults.sort),
      String
    )(select);
  },
});
