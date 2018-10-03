const Joi = require('../../../../utils/validation/joi');

const input = Joi.string()
  .base58()
  .required();

module.exports = { input };
