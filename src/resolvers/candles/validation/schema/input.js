const Joi = require('joi');

const pair = Joi.array()
  .length(2)
  .items(Joi.string());

const input = Joi.object()
  .keys({
    pairs: Joi.array().items(pair),
    interval: Joi.string(),
    timeStart: Joi.date(),
    timeEnd: Joi.date(),
  })
  .required();

module.exports = input;
