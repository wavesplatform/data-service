const Joi = require('../../utils/validation/joi');

const defaultLimit = 1000;

const inputGet = Joi.object().keys({
  amountAsset: Joi.string()
    .base58()
    .required(),
  priceAsset: Joi.string()
    .base58()
    .required(),
});

const inputMget = Joi.array().items(inputGet);

const inputSearch = Joi.object().keys({
  limit: Joi.number()
    .min(1)
    .max(defaultLimit)
    .required(),
});

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

module.exports = { inputGet, inputMget, inputSearch, result, defaultLimit };
