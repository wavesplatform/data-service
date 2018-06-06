const { compose, map, merge, pick, filter, has, __, pipe } = require('ramda');

const { select, withDecimals, withOrders, renameFields } = require('./query');

// one — get by id
// many — apply filters
module.exports = ({ filters: F }) => ({
  one: id => withDecimals(F.id(id, select)).toString(),
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
      withOrders,
      renameFields,
      withDecimals,
      F.sortOuter(withDefaults.sort),
      String
    )(select);
  },
});
