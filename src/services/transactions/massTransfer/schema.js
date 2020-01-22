const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../_common/commonFilterSchemas').default;

const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string()
    .assetId()
    .required(),
  attachment: Joi.string()
    .required()
    .allow(''),
  sender: Joi.string()
    .base58()
    .required(),
  sender_public_key: Joi.string()
    .base58()
    .required(),
  recipients: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.array().items(Joi.allow(null).required())
  ),
  amounts: Joi.array().items(Joi.object().bignumber()),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    sender: Joi.string().base58(),
    assetId: Joi.string().assetId(),
    recipient: Joi.string().noNullChars(),
  })
  .required();

module.exports = { result, inputSearch };
