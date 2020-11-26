const Joi = require('../../../utils/validation/joi');

const result = Joi.object().keys({
  amount_asset_id: Joi.string()
    .assetId()
    .required(),
  price_asset_id: Joi.string()
    .assetId()
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

module.exports = { result };
