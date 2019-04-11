const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas').default;

const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string()
    .base58()
    .required(),
  asset_name: Joi.string().required(),
  description: Joi.string()
    .required()
    .allow(''),
  quantity: Joi.object()
    .bignumber()
    .required(),
  decimals: Joi.number().required(),
  reissuable: Joi.boolean().required(),
  script: Joi.string().allow(null),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    script: Joi.string(),
    assetId: Joi.string().base58(),
  })
  .required();

module.exports = {
  result,
  inputSearch,
};
