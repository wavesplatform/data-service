const { curryN } = require('ramda');

const commonFilters = require('../../../_common/sql/filters');

const byOrderSender = curryN(2, (orderSender, q) =>
  q
    .clone()
    .whereRaw(
      `array[t.order1->>'sender', t.order2->>'sender'] @> '{${orderSender}}'`
    )
);

const byOrderSenders = curryN(2, (senders, q) =>
  q
    .clone()
    .whereRaw(
      "array[order1->>'sender', order2->>'sender'] && ?",
      `{${senders.join(',')}}`
    )
);

const byOrder = curryN(2, (orderId, q) =>
  q
    .clone()
    .whereRaw(`array[t.order1->>'id', t.order2->>'id'] @> array['${orderId}']`)
    .limit(1)
);

const byAsset = (assetType) =>
  curryN(2, (assetId, q) =>
    q.clone().where(`t.${assetType}_asset_id`, assetId)
  );

module.exports = {
  filters: {
    ...commonFilters,

    matcher: commonFilters.sender,
    sender: byOrderSender,
    senders: byOrderSenders,
    amountAsset: byAsset('amount'),
    priceAsset: byAsset('price'),
    orderId: byOrder,
  },
};
