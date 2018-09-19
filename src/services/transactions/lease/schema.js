const Joi = require('../../../utils/validation/joi');

const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas');

const result = Joi.object().keys({
  height: Joi.number().required(),
  tx_type: Joi.number().required(),
  tx_version: Joi.number()
    .required()
    .allow(null),
  fee: Joi.object()
    .bignumber()
    .required(),
  amount: Joi.object()
    .bignumber()
    .required(),
  time_stamp: Joi.date().required(),
  signature: Joi.string()
    .required()
    .allow(''),
  proofs: Joi.when('signature', {
    is: '',
    then: Joi.array().min(1),
    otherwise: Joi.array().length(0),
  }).required(),
  id: Joi.string()
    .base58()
    .required(),
  sender: Joi.string().required(),
  sender_public_key: Joi.string().required(),
  recipient: Joi.string().required(),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
    sender: Joi.string(),
    recipient: Joi.string(),
  })
  .required();

module.exports = { result, inputSearch };
