const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../_common/commonFilterSchemas').default;

const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string()
    .base58()
    .required(),
  min_sponsored_asset_fee: Joi.object()
    .bignumber()
    .required()
    .allow(null),
});

const inputSearch = {
  ...commonFilters,

  assetId: Joi.string().base58(),
};

module.exports = {
  result,
  inputSearch,
};
