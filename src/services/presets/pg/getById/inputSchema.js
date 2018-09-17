const Joi = require('joi');

const { base58 } = require('../../../../utils/regex');

const input = Joi.string()
  .regex(base58)
  .required();

module.exports = { input };
