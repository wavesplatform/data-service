const Joi = require('joi');

const { output, hashRegex } = require('./common');

const input = Joi.string()
  .regex(hashRegex)
  .required();

module.exports = { input, output };
