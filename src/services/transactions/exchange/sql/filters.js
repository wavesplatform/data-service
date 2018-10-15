const { curryN } = require('ramda');

const { where } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const bySender = curryN(2, (sender, q) =>
  q
    .clone()
    .whereRaw("array[order1->>'sender', order2->>'sender'] @> ?", `{${sender}}`)
);

module.exports = {
  filters: {
    ...commonFilters,
    matcher: where('t.sender'),
    amountAsset: where('t.amount_asset'),
    priceAsset: where('t.price_asset'),
    sender: bySender,
    sortOuter: s => q =>
      q
        .clone()
        .orderBy('time_stamp', s)
        .orderBy('id', s),
  },
  filtersOrder: [...commonFiltersOrder, 'matcher', 'amountAsset', 'priceAsset'],
};
