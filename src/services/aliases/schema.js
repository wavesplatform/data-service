const Joi = require('../../utils/validation/joi');

const inputGet = Joi.string().noNullChars().required();

const inputMGet = Joi.array().items(Joi.string().noNullChars()).required();

const inputSearch = Joi.object()
  .keys({
    address: Joi.string().base58(),
    addresses: Joi.array().items(Joi.string().base58()),
    queries: Joi.array().items(Joi.string()),
    showBroken: Joi.boolean(),
  })
  .xor('address', 'addresses', 'queries');

const output = Joi.object().keys({
  address: Joi.string().base58().required().allow(null),
  alias: Joi.string().required(),
  duplicates: Joi.object().bignumber(),
});

module.exports = { inputGet, inputMGet, inputSearch, output };
