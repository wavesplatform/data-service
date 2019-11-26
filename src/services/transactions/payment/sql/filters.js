const { where } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

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
    recipient: byRecipient,
  },
  filtersOrder: [...commonFiltersOrder, 'recipient'],
};
