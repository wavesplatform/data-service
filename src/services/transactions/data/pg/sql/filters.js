const { BigNumber } = require('@waves/data-entities');

const { where } = require('../../../../../utils/db/knex');

const commonFilters = require('../../../_common/sql/filters');

const value = type => val => {
  const v = val instanceof BigNumber ? val.toString() : val;
  return where(`data_value_${type}`, v);
};

module.exports = {
  ...commonFilters,
  key: where('data_key'),
  type: where('data_type'),
  value,
};
