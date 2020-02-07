const { curryN } = require('ramda');

const { limit } = require('../../../../../utils/db/knex');
const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

const byOrderSender = curryN(2, (orderSender, q) =>
  q.where('t.order_sender_uid', function() {
    this.select('uid')
      .from('addresses')
      .where('address', orderSender)
      .limit(1);
  })
);

const byOrder = curryN(2, (orderId, q) =>
  q
    .where('t.order_uid', function() {
      this.select('uid')
        .from('orders')
        .where('id', orderId)
        .limit(1);
    })
    .limit(1)
);

const byAsset = assetType =>
  curryN(2, (assetId, q) =>
    q.where(`t.${assetType}_asset_uid`, function() {
      this.select('uid')
        .from('assets')
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
    outerSort: s => q => q.clone().orderBy('tx_uid', s),
    limit: l => limit(l * 2), // hack for filtering in txs_7_orders - there are 2 rows on each tx
  },
  filtersOrder: [
    ...commonFiltersOrder,
    'matcher',
    'amountAsset',
    'priceAsset',
    'orderId',
    'outerSort',
  ],
};
