const Joi = require('../../../../utils/validation/joi');

const input = Joi.array()
  .items(Joi.string().base58())
  .required();

module.exports = { input };
