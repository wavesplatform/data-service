const Joi = require('../../utils/validation/joi');

const inputSearch = Joi.object().keys({
  amountAsset: Joi.string().base58().required(),
  priceAsset: Joi.string().base58().required(),
  params: Joi.object().keys({
    timeStart: Joi.date(),
    timeEnd: Joi.date(),
    interval: Joi.string().period().accepted(['m', 'h', 'd']).min('1m').max('1d'),
  })
}).required();

const output = Joi.object().keys({
  time_start: Joi.date().required(),
  amount_asset_id: Joi.string().base58(),
  price_asset_id: Joi.string().base58(),
  max_height: Joi.number().integer(),
  open: Joi.object().bignumber().required(),
  high: Joi.object().bignumber().required(),
  low: Joi.object().bignumber().required(),
  close: Joi.object().bignumber().required(),
  volume: Joi.object().bignumber().required(),
  price_volume: Joi.object().bignumber().required(),
  weighted_average_price: Joi.object().bignumber().required(),
  txs_count: Joi.number().required(),
});

module.exports = { inputSearch, output };
