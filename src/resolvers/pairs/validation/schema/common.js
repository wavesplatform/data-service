const Joi = require('joi');
const { BigNumber } = require('@waves/data-entities');

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
  amount_asset: Joi.string().required(),
  price_asset: Joi.string().required(),
});

const assetsIdRegex = /[0-9A-Za-z]+\/[0-9A-Za-z]+/;
module.exports = { output, assetsIdRegex };
