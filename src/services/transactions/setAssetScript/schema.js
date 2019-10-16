const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas')
  .default;

const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string()
    .assetId()
    .required(),
  script: Joi.string()
    .base64()
    .required()
    .allow(null),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
    assetId: Joi.string().assetId(),
    script: Joi.string().base64(),
  })
  .required();

module.exports = { result, inputSearch };
