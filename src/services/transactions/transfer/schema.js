const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../_common/commonFilterSchemas').default;

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
    
    assetId: Joi.string().assetId(),
    recipient: Joi.string().noNullChars(),
  })
  .nand('sender', 'senders');

const result = Joi.object().keys({
  ...commonFields,

  amount: Joi.object()
    .bignumber()
    .required(),
  asset_id: Joi.string()
    .assetId()
    .required(),
  fee_asset: Joi.string()
    .assetId()
    .required(),
  attachment: Joi.string()
    .required()
    .allow(''),
  recipient: Joi.string().required(),
});

module.exports = { result, inputSearch };
