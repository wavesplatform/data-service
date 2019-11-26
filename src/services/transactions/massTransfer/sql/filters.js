const { where } = require('../../../../utils/db/knex');
const { selectIdsWhereRecipient } = require('./query');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const byAssetId = assetId =>
  where('asset_uid', function() {
    this.select('uid')
      .from('assets')
      .where('asset_id', assetId)
      .limit(1);
  });

const byRecipient = rec => q =>
  q.clone().where('tx_uid', selectIdsWhereRecipient(rec));

module.exports = {
  filters: {
    ...commonFilters,
    assetId: byAssetId,
    recipient: byRecipient,
  },
  filtersOrder: [...commonFiltersOrder, 'assetId', 'recipient'],
};
