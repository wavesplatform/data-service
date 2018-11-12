const Joi = require('joi');

const output = Joi.object().keys({
  address: Joi.string()
    .required()
    .allow(null),
  alias: Joi.string().required(),
  duplicates: Joi.string(),
});

module.exports = { output };
