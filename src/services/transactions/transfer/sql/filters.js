const { where } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const bySender = sender =>
  where('sender_uid', function() {
    this.select('uid')
      .from('addresses')
      .where('address', sender)
      .limit(1);
  });

const byAssetId = assetId =>
  where('asset_uid', function() {
    this.select('uid')
      .from('assets')
      .where('asset_id', assetId)
      .limit(1);
  });

const byRecipient = recipient =>
  where('recipient_address_uid', function() {
    this.select('uid')
      .from('addresses')
      .where('address', recipient)
      .limit(1);
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
