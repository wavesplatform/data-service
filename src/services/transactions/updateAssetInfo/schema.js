const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../_common/commonFilterSchemas').default;

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    assetId: Joi.string().assetId(),
  })
  .nand('sender', 'senders');

const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string()
    .assetId()
    .required(),
  asset_name: Joi.string().required(),
  description: Joi.string()
    .required()
    .allow(''),
});

module.exports = {
  result,
  inputSearch,
};
