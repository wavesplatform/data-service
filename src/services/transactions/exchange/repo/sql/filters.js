const pg = require('knex')({ client: 'pg' });
const { curryN } = require('ramda');

const { createByTimeStamp, createByBlockTimeStamp } = require('../../../_common/sql');
const commonFilters = require('../../../_common/sql/filters');

const byOrderSender = curryN(2, (orderSender, q) =>
  pg.union(
    [
      q.clone().whereRaw(`t.order1->>'sender' = '${orderSender}'`),
      q.clone().whereRaw(`t.order2->>'sender' = '${orderSender}'`),
    ],
    true
  )
);

const byOrderSenders = curryN(2, (senders, q) =>
  q
    .clone()
    .whereRaw(
      `array[order1->>'sender', order2->>'sender'] && ?`,
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

const byTimeStamp = createByTimeStamp('txs_7');

const byBlockTimeStamp = createByBlockTimeStamp('txs_7');

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
    blockTimeStart: byBlockTimeStamp('>='),
    blockTimeEnd: byBlockTimeStamp('<='),
    orderId: byOrder,
  },
};
