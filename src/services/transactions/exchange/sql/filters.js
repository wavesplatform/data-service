const { curryN } = require('ramda');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

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
    sortOuter: s => q => q.clone().orderBy('tx_uid', s),
  },
  filtersOrder: [
    ...commonFiltersOrder,
    'matcher',
    'amountAsset',
    'priceAsset',
    'orderId',
    'sortOuter',
  ],
};
