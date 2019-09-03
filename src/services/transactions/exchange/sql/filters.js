const { curryN } = require('ramda');

const { where } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const byOrderSender = curryN(2, (orderSender, q) =>
  q
    .clone()
    .whereRaw(
      "array[order1->>'sender', order2->>'sender'] @> ?",
      `{${orderSender}}`
    )
);

// adding unneeded sort to force the use of index
// https://stackoverflow.com/questions/21385555/postgresql-query-very-slow-with-limit-1/27237698#27237698
const byOrder = curryN(2, (orderId, q) =>
  q
    .clone()
    .whereRaw("array[order1->>'id', order2->>'id'] @> ?", `{${orderId}}`)
    .orderBy('height')
);

module.exports = {
  filters: {
    ...commonFilters,
    sender: where('t.sender'),
    matcher: where('t.sender'),
    amountAsset: where('t.amount_asset'),
    priceAsset: where('t.price_asset'),
    orderId: byOrder,
    orderSender: byOrderSender,
    sort: s => q =>
      q
        .clone()
        .orderBy('time_stamp', s)
        .orderBy('id', s),
    sortOuter: s => q => q.clone().orderBy('uid', s),
  },
  filtersOrder: [
    ...commonFiltersOrder,
    'matcher',
    'amountAsset',
    'priceAsset',
    'orderId',
    'orderSender',
  ],
};
