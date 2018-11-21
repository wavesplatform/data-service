const Joi = require('../../utils/validation/joi');

const outputSearch = Joi.object().keys({
  time_stamp: Joi.date().required(),
  open: Joi.number().required(),
  high: Joi.number().required(),
  low: Joi.number().required(),
  close: Joi.number().required(),
  volume: Joi.number().required(),
  txs_count: Joi.number().required(),
});

module.exports = { outputSearch };
