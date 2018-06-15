const Joi = require('joi');

const output = Joi.object().keys({
  address: Joi.string().required(),
  alias: Joi.string().required(),
});

module.exports = { output };
