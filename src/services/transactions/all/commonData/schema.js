const Joi = require('../../../../utils/validation/joi');

const commonFilters = require('../../_common/commonFilterSchemas').default;

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
  })
  .xor('sender', 'senders');

const result = Joi.object().keys({
  tx_type: Joi.number()
    .min(1)
    .max(16)
    .required(),
  time_stamp: Joi.date().required(),
  id: Joi.string()
    .base58()
    .required(),
});

module.exports = { result, inputSearch };
