const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../_common/commonFilterSchemas').default;

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    assetId: Joi.string().assetId(),
    recipient: Joi.string().noNullChars(),
  })
  .xor('sender', 'senders');

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
  recipients: Joi.array().items(Joi.string()),
  amounts: Joi.array().items(
    Joi.object()
      .bignumber()
      .required()
  ),
});

module.exports = { result, inputSearch };
