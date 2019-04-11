const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas').default;

const result = Joi.object().keys({
  ...commonFields,

  amount: Joi.object()
    .bignumber()
    .required(),
  asset_id: Joi.string()
    .base58()
    .required(),
  fee_asset: Joi.string()
    .base58()
    .required(),
  attachment: Joi.string()
    .required()
    .allow(''),
  recipient: Joi.string().required(),
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
