const Joi = require('joi');

const { output } = require('./common');

const input = Joi.object()
  .keys({
    address: Joi.string().required(),
  })
  .required();

module.exports = { input, output };
