const { curryN } = require('ramda');

const commonFilters = require('../../../_common/sql/filters');

const byOrderSender = curryN(2, (orderSender, q) =>
  q
    .clone()
    .whereRaw(
      `array[t.order1->>'sender', t.order2->>'sender'] @> '{${orderSender}}'`
    )
);

const byOrder = curryN(2, (orderId, q) =>
  q
    .whereRaw(`array[t.order1->>'id', t.order2->>'id'] @> array['${orderId}']`)
    .limit(1)
);

const byAsset = (assetType) =>
  curryN(2, (assetId, q) => q.where(`t.${assetType}_asset_id`, assetId));

module.exports = {
  filters: {
    ...commonFilters,

    matcher: commonFilters.sender,
    sender: byOrderSender,
    amountAsset: byAsset('amount'),
    priceAsset: byAsset('price'),
    orderId: byOrder,
  },
};
