const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../_common/commonFilterSchemas').default;

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
    
    assetId: Joi.string().assetId(),
    script: Joi.string().base64Prefixed(),
  })
  .nand('sender', 'senders');

const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string()
    .assetId()
    .required(),
  script: Joi.string()
    .required()
    .allow(null),
});

module.exports = { result, inputSearch };
