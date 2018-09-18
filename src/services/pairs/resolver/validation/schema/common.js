const Joi = require('joi');
const { BigNumber } = require('@waves/data-entities');

const { base58 } = require('../../../../../utils/regex');

const pairInput = Joi.object().keys({
  amountAsset: Joi.string()
    .regex(base58)
    .required(),
  priceAsset: Joi.string()
    .regex(base58)
    .required(),
});

const output = Joi.object().keys({
  first_price: Joi.object()
    .type(BigNumber)
    .required(),
  last_price: Joi.object()
    .type(BigNumber)
    .required(),
  volume: Joi.object()
    .type(BigNumber)
    .required(),
  volume_waves: Joi.object()
    .type(BigNumber)
    .required()
    .allow(null),
});

module.exports = { output, pairInput };
