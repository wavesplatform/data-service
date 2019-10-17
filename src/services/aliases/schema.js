const Joi = require('../../utils/validation/joi');

const inputGet = Joi.string().noControlChars().required();

const inputMGet = Joi.array().items(Joi.string().noControlChars()).required();

const inputSearch = Joi.object()
  .keys({
    address: Joi.string().base58().required(),
    showBroken: Joi.boolean(),
  })
  .required();

const output = Joi.object().keys({
  address: Joi.string()
    .noControlChars()
    .required()
    .allow(null),
  alias: Joi.string().noControlChars().required(),
  duplicates: Joi.object().bignumber(),
});

module.exports = { inputGet, inputMGet, inputSearch, output };
