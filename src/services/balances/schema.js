const Joi = require('../../utils/validation/joi');

const inputSearch = Joi.object()
  .keys({
    address: Joi.string(),
    asset_id: Joi.string(),
    height: Joi.number(),
    timestamp: Joi.date(),
    transaction_id: Joi.string(),
  })
  .required();

const output = Joi.object().keys({
  address: Joi.string()
    .required()
    .allow(null),
  alias: Joi.string().required(),
  duplicates: Joi.object().bignumber(),
});

module.exports = { inputSearch, output };
