const Joi = require('joi');
const { BigNumber } = require('@waves/data-entities');

const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas');

const orderTypes = prefix => ({
  [`${prefix}_id`]: Joi.string().required(),
  [`${prefix}_type`]: Joi.string().required(),
  [`${prefix}_sender`]: Joi.string().required(),
  [`${prefix}_sender_public_key`]: Joi.string().required(),
  [`${prefix}_signature`]: Joi.string().required(),
  [`${prefix}_matcher_fee`]: Joi.object()
    .type(BigNumber)
    .required(),
  [`${prefix}_price`]: Joi.object()
    .type(BigNumber)
    .required(),
  [`${prefix}_amount`]: Joi.object()
    .type(BigNumber)
    .required(),
  [`${prefix}_time_stamp`]: Joi.object()
    .type(Date)
    .required(),
  [`${prefix}_expiration`]: Joi.object()
    .type(Date)
    .required(),
});

const result = Joi.object().keys({
  tx_id: Joi.string().required(),
  tx_signature: Joi.string().required(),
  tx_price_asset: Joi.string().required(),
  tx_amount_asset: Joi.string().required(),

  tx_time_stamp: Joi.object()
    .type(Date)
    .required(),

  tx_price: Joi.object()
    .type(BigNumber)
    .required(),
  tx_fee: Joi.object()
    .type(BigNumber)
    .required(),
  tx_amount: Joi.object()
    .type(BigNumber)
    .required(),
  tx_height: Joi.number(),

  tx_sender: Joi.string().required(),
  tx_sender_public_key: Joi.string().required(),
  tx_buy_matcher_fee: Joi.object()
    .type(BigNumber)
    .required(),
  tx_sell_matcher_fee: Joi.object()
    .type(BigNumber)
    .required(),

  ...orderTypes('o1'),
  ...orderTypes('o2'),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
    matcher: Joi.string(),
    sender: Joi.string(),
    amountAsset: Joi.string(),
    priceAsset: Joi.string(),
  })
  .required();

module.exports = { result, inputSearch };
