const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas').default;

const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string()
    .base58()
    .required(),
  amount: Joi.object()
    .bignumber()
    .required(),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    assetId: Joi.string().base58()
  })
  .required();

module.exports = {
  result,
  inputSearch
};
