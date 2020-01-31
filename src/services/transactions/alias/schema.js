const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');

const result = Joi.object().keys({
  ...commonFields,
  alias: Joi.string().required(),
});

module.exports = {
  result,
};
