const pg = require('knex')({ client: 'pg' });
const { curryN } = require('ramda');

const commonFilters = require('../../../_common/sql/filters');

const byOrderSender = curryN(2, (orderSender, q) =>
  q
    .clone()
    .whereRaw(`array[t.order1->>'sender', t.order2->>'sender'] @> '{${orderSender}}'`)
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
  curryN(2, (assetId, q) => q.clone().where(`t.${assetType}_asset_id`, assetId));

const byTimeStamp = (comparator) => (ts) => (q) =>
  q
    .clone()
    .where(
      't.uid',
      comparator,
      pg('txs_7')
        .select('uid')
        .where('time_stamp', comparator, ts.toISOString())
        .orderByRaw(`time_stamp <-> '${ts.toISOString()}'::timestamptz`)
        .limit(1)
    );

module.exports = {
  filters: {
    ...commonFilters,

    matcher: commonFilters.sender,
    sender: byOrderSender,
    senders: byOrderSenders,
    amountAsset: byAsset('amount'),
    priceAsset: byAsset('price'),
    timeStart: byTimeStamp('>='),
    timeEnd: byTimeStamp('<='),
    orderId: byOrder,
  },
};
