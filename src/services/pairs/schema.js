const Joi = require('../../utils/validation/joi');

const inputPair = Joi.object().keys({
  amountAsset: Joi.string()
    .base58()
    .required(),
  priceAsset: Joi.string()
    .base58()
    .required(),
});

const inputPairs = Joi.array().items(inputPair);

const result = Joi.object().keys({
  amount_asset_id: Joi.string()
    .base58()
    .required(),
  price_asset_id: Joi.string()
    .base58()
    .required(),
  first_price: Joi.object()
    .bignumber()
    .required(),
  last_price: Joi.object()
    .bignumber()
    .required(),
  volume: Joi.object()
    .bignumber()
    .required(),
  volume_waves: Joi.object()
    .bignumber()
    .required()
    .allow(null),
});

module.exports = { inputPair, inputPairs, result };
