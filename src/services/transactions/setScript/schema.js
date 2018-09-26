const Joi = require('../../../utils/validation/joi');

const commonFields = require('../common/commonFieldsSchemas');

const result = Joi.object().keys({
  ...commonFields,

  script: Joi.string()
    .required()
    .allow(null),
});

module.exports = { result };
