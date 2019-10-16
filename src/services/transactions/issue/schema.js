const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas').default;

const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string()
    .assetId()
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
  script: Joi.string().base64().allow(null),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    script: Joi.string().base64(),
    assetId: Joi.string().assetId(),
  })
  .required();

module.exports = {
  result,
  inputSearch,
};
