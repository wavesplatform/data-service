const Joi = require('joi');
const { output, assetsIdRegex } = require('./common');

const input = Joi.string()
  .regex(assetsIdRegex)
  .required();

module.exports = { input, output };
