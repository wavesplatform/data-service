const { curryN } = require('ramda');
const knex = require('knex');
const pg = knex({ client: 'pg' });

const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

const byOrderSender = curryN(2, (orderSender, q) =>
  // uses index gin array[order1_sender_uid, order2_sender_uid]
  q.whereRaw(
    `array[t.order1_sender_uid, t.order2_sender_uid] @> array[(${pg('addresses')
      .select('uid')
      .where('address', orderSender)
      .limit(1)})]`
  )
);

const byOrder = curryN(2, (orderId, q) =>
  // uses index gin array[order1->>'id', order2->>'id']
  q
    .whereRaw(`array[t.order1->>'id', t.order2->>'id'] @> array[${orderId}]`)
    .limit(1)
);

const byAsset = assetType =>
  curryN(2, (assetId, q) =>
    assetId === 'WAVES'
      ? q.whereNull(`t.${assetType}_asset_uid`)
      : q.where(`t.${assetType}_asset_uid`, function() {
        this.select('uid')
          .from('assets_data')
          .where('asset_id', assetId)
          .limit(1);
      })
  );

module.exports = {
  filters: {
    ...commonFilters,
    matcher: commonFilters.sender,
    sender: byOrderSender,
    amountAsset: byAsset('amount'),
    priceAsset: byAsset('price'),
    orderId: byOrder,
  },
  filtersOrder: [
    ...commonFiltersOrder,
    'matcher',
    'amountAsset',
    'priceAsset',
    'orderId',
  ],
};
