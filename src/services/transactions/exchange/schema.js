const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas')
  .default;

const orderTypes = prefix => ({
  [`${prefix}_id`]: Joi.string().required(),
  [`${prefix}_version`]: Joi.string().required().allow(null),
  [`${prefix}_type`]: Joi.string().required(),
  [`${prefix}_sender`]: Joi.string().required(),
  [`${prefix}_sender_public_key`]: Joi.string().required(),
  [`${prefix}_signature`]: Joi.string().required(),
  [`${prefix}_matcher_fee`]: Joi.object()
    .bignumber()
    .required(),
  [`${prefix}_price`]: Joi.object()
    .bignumber()
    .required(),
  [`${prefix}_amount`]: Joi.object()
    .bignumber()
    .required(),
  [`${prefix}_time_stamp`]: Joi.object()
    .type(Date)
    .required(),
  [`${prefix}_expiration`]: Joi.object()
    .type(Date)
    .required(),
  [`${prefix}_matcher_fee_asset_id`]: Joi.string().allow(null),
});

const result = Joi.object().keys({
  ...commonFields,

  price_asset: Joi.string().required(),
  amount_asset: Joi.string().required(),
  price: Joi.object()
    .bignumber()
    .required(),
  amount: Joi.object()
    .bignumber()
    .required(),
  buy_matcher_fee: Joi.object()
    .bignumber()
    .required(),
  sell_matcher_fee: Joi.object()
    .bignumber()
    .required(),

  ...orderTypes('o1'),
  ...orderTypes('o2'),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    matcher: Joi.string(),
    orderId: Joi.string(),
    amountAsset: Joi.string().base58(),
    priceAsset: Joi.string().base58(),
  })
  .required();

module.exports = { result, inputSearch };
