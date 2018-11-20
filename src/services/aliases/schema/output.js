const Joi = require('../../../utils/validation/joi');

const output = Joi.object().keys({
  address: Joi.string()
    .required()
    .allow(null),
  alias: Joi.string().required(),
  duplicates: Joi.object().bignumber(),
});

module.exports = output;
