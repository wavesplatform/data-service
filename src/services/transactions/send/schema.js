const Joi = require('../../../utils/validation/joi');

const commonFields = require('../common/commonFieldsSchemas');

const result = Joi.object().keys({
  ...commonFields,

  amount: Joi.object()
    .bignumber()
    .required(),
  recipient: Joi.string().required(),
});

module.exports = { result };
