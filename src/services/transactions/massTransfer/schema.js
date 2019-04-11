const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas').default;

const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string()
    .base58()
    .required(),
  attachment: Joi.string()
    .required()
    .allow(''),
  sender: Joi.string().required(),
  sender_public_key: Joi.string().required(),
  recipients: Joi.array().items(Joi.string()),
  amounts: Joi.array().items(
    Joi.object()
      .bignumber()
      .required()
  ),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    sender: Joi.string(),
    assetId: Joi.string().base58(),
    recipient: Joi.string(),
  })
  .required();

module.exports = { result, inputSearch };
