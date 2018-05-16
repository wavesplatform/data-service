const Joi = require('joi');

const output = Joi.object().keys({
  open: Joi.date(),
  close: Joi.date(),
  high: Joi.number(),
  low: Joi.number(),
  volume: Joi.number(),
  txsCount: Joi.number(),
  timeStamp: Joi.date(),
});

module.exports = output;
