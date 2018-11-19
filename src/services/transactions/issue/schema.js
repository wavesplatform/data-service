const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas');

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
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    assetId: Joi.string().base58(),
  })
  .required();

module.exports = {
  result,
  inputSearch,
};
