const { whereIn } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const bySender = sender =>
  whereIn('tuid', function() {
    this.select('tuid')
      .from('txs_4')
      .whereIn('sender_uid', function() {
        this.select('uid')
          .from('addresses_map')
          .where('address', sender)
          .limit(1);
      });
  });

const byAssetId = assetId =>
  whereIn('tuid', function() {
    this.select('tuid')
      .from('txs_4')
      .whereIn('asset_uid', function() {
        this.select('uid')
          .from('assets_map')
          .where('asset_id', assetId)
          .limit(1);
      });
  });

const byRecipient = recipient =>
  whereIn('tuid', function() {
    this.select('tuid')
      .from('txs_4')
      .whereIn('recipient_uid', function() {
        this.select('uid')
          .from('addresses_map')
          .where('address', recipient)
          .limit(1);
      });
  });

module.exports = {
  filters: {
    ...commonFilters,
    sender: bySender,
    assetId: byAssetId,
    recipient: byRecipient,
  },
  filtersOrder: [...commonFiltersOrder, 'assetId', 'recipient'],
};
