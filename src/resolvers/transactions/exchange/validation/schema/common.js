const { BigNumber } = require('@waves/data-entities');
const Joi = require('joi');
const orderTypes = prefix => ({
  [`${prefix}_id`]: Joi.string().required(),
  [`${prefix}_type`]: Joi.string().required(),
  [`${prefix}_sender`]: Joi.string().required(),
  [`${prefix}_sender_key`]: Joi.string().required(),
  [`${prefix}_signature`]: Joi.string().required(),
  [`${prefix}_price`]: Joi.object()
    .type(BigNumber)
    .required(),
  [`${prefix}_amount`]: Joi.object()
    .type(BigNumber)
    .required(),
  [`${prefix}_timestamp`]: Joi.object()
    .type(Date)
    .required(),
  [`${prefix}_expiration`]: Joi.object()
    .type(Date)
    .required(),
});

const output = Joi.object().keys({
  tx_id: Joi.string().required(),
  tx_signature: Joi.string().required(),
  tx_price_asset: Joi.string().required(),
  tx_amount_asset: Joi.string().required(),

  tx_timestamp: Joi.object()
    .type(Date)
    .required(),

  tx_price: Joi.object()
    .type(BigNumber)
    .required(),
  tx_amount: Joi.object()
    .type(BigNumber)
    .required(),
  tx_height: Joi.object()
    .type(BigNumber)
    .required(),

  matcher_addr: Joi.string().required(),
  matcher_key: Joi.string().required(),
  matcher_fee: Joi.object()
    .type(BigNumber)
    .required(),

  ...orderTypes('o1'),
  ...orderTypes('o2'),
});

module.exports = { output };
