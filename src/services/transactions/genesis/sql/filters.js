const { without, omit } = require('ramda');

const { where } = require('../../../../utils/db/knex');
const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

const byRecipient = r =>
  where('recipient_address_uid', function() {
    this.select('uid')
      .from('addresses')
      .where('address', r)
      .limit(1);
  });

module.exports = {
  filters: omit(['sender'], {
    ...commonFilters,
    recipient: byRecipient,
  }),

  filtersOrder: without('sender', [...commonFiltersOrder, 'recipient']),
};
