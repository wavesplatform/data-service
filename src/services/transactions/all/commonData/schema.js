const Joi = require('../../../../utils/validation/joi');

const commonFilters = require('../../_common/commonFilterSchemas').default;

const result = Joi.object().keys({
  tx_uid: Joi.object()
    .bignumber()
    .required(),
  tx_type: Joi.number()
    .min(1)
    .max(16)
    .required(),
  time_stamp: Joi.date().required(),
  id: Joi.string()
    .base58()
    .required(),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
  })
  .required();

module.exports = { result, inputSearch };
