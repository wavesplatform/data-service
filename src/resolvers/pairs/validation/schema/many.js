const Joi = require('joi');

const { output, assetsIdRegex } = require('./common');

const input = Joi.array().items(
  Joi.string()
    .regex(assetsIdRegex)
    .required()
);

module.exports = { input, output };
