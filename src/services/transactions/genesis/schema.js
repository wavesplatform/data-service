const { omit } = require('ramda');

const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../_common/commonFilterSchemas').default;

const inputSearch = Joi.object().keys(
  omit(['sender', 'senders'], { ...commonFilters, recipient: Joi.string() })
);

const result = Joi.object().keys({
  // genesis txs do not have a sender
  ...omit(['sender', 'sender_public_key'], commonFields),

  amount: Joi.object()
    .bignumber()
    .required(),
  recipient: Joi.string().required(),
});

module.exports = { result, inputSearch };
