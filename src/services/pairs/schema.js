const Joi = require('../../utils/validation/joi');

const limitMaximum = 1000;

const pair = Joi.object().keys({
  amountAsset: Joi.string()
    .base58()
    .required(),
  priceAsset: Joi.string()
    .base58()
    .required(),
});

const inputGet = Joi.object()
  .keys({
    pair,
    matcher: Joi.string().required(),
  })
  .required();

const inputMget = Joi.object().keys({
  pairs: Joi.array().items(pair),
  matcher: Joi.string().required(),
});

const inputSearch = Joi.object()
  .keys({
    search_by_asset: Joi.string(),
    search_by_assets: Joi.array()
      .items(Joi.string(), Joi.string())
      .length(2),
    match_exactly: Joi.array()
      .items(Joi.boolean(), Joi.boolean())
      .max(2),
    matcher: Joi.string(),
    limit: Joi.number()
      .min(1)
      .max(limitMaximum),
  })
  .nand('search_by_asset', 'search_by_assets');

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
  quote_volume: Joi.object()
    .bignumber()
    .required(),
  high: Joi.object()
    .bignumber()
    .required(),
  low: Joi.object()
    .bignumber()
    .required(),
  weighted_average_price: Joi.object()
    .bignumber()
    .required(),
  txs_count: Joi.number().required(),
  volume_waves: Joi.object()
    .bignumber()
    .required()
    .allow(null),
});

module.exports = { inputGet, inputMget, inputSearch, result };
