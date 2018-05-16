const { BigNumber } = require('@waves/data-entities');
const Joi = require('joi');

const output = Joi.object().keys({
  asset_id: Joi.string().required(),
  asset_name: Joi.string().required(),
  description: Joi.string().allow(''),
  sender: Joi.string()
    .allow('')
    .required(),
  issue_height: Joi.number().required(),
  total_quantity: Joi.object().type(BigNumber),
  decimals: Joi.number().required(),
  reissuable: Joi.boolean().required(),
  ticker: Joi.string()
    .required()
    .allow(null),
  issue_timestamp: Joi.object()
    .type(Date)
    .required(),
});

module.exports = { output };
