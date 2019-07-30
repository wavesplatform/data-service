const Joi = require('../../utils/validation/joi');

const limitMaximum = 1000;

const JoiWithOrderPair = orderPair =>
  Joi.extend(joi => ({
    base: joi.object(),
    name: 'object',
    language: {
      pair: 'in pair {{amountAsset}}/{{priceAsset}} is incorrect.',
    },
    rules: [
      {
        name: 'valid',
        validate(_, value, state, options) {
          const validAmountAsset = orderPair(
            value.amountAsset,
            value.priceAsset
          )[0];
          if (value.amountAsset !== validAmountAsset) {
            return this.createError(
              'object.pair',
              { amountAsset: value.amountAsset, priceAsset: value.priceAsset },
              state,
              options,
              { label: 'Asset order' }
            );
          }
          return value;
        },
      },
    ],
  }));

const inputGet = orderPair =>
  JoiWithOrderPair(orderPair)
    .object()
    .keys({
      amountAsset: Joi.string()
        .base58()
        .required(),
      priceAsset: Joi.string()
        .base58()
        .required(),
    })
    .valid();

const inputMget = orderPair => Joi.array().items(inputGet(orderPair));

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
