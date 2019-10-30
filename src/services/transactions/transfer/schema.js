const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas').default;

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

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
    sender: Joi.string().base58(),
    assetId: Joi.string().assetId(),
    recipient: Joi.string().noNullChars(),
  })
  .required();

module.exports = { result, inputSearch };
