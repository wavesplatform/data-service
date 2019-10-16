const Joi = require('../../utils/validation/joi');

const inputGet = Joi.string().required();

const inputMGet = Joi.array().items(Joi.string()).required();

const inputSearch = Joi.object()
  .keys({
    address: Joi.string().base58().required(),
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

module.exports = { inputGet, inputMGet, inputSearch, output };
