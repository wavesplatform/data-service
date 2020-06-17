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
  quantity: Joi.object()
    .bignumber()
    .required(),
  reissuable: Joi.boolean().required(),
});

module.exports = {
  result,
  inputSearch,
};
