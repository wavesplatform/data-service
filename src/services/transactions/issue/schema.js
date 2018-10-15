const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');

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

module.exports = {
  result,
  inputSearch: require('../../presets/pg/searchWithPagination/commonFilterSchemas'),
};
