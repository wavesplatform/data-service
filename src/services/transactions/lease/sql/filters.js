const { where } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const byRecipient = recipient =>
  where('recipient_uid', function() {
    this.select('uid')
      .from('addresses_map')
      .where('address', recipient);
  });

module.exports = {
  filters: {
    ...commonFilters,
    recipient: byRecipient,
  },
  filtersOrder: [...commonFiltersOrder, 'recipient'],
};
