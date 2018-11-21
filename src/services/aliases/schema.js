const Joi = require('../../utils/validation/joi');

const inputGet = Joi.string().required();

const inputSearch = Joi.object()
  .keys({
    address: Joi.string().required(),
    showBroken: Joi.boolean(),
  })
  .required();

const output = Joi.object().keys({
  address: Joi.string()
    .required()
    .allow(null),
  alias: Joi.string().required(),
  duplicates: Joi.object().bignumber(),
});

module.exports = { inputGet, inputSearch, output };
