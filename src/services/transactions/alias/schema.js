const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilterSchemas = require('../_common/commonFilterSchemas').default;

const result = Joi.object().keys({
  ...commonFields,
  alias: Joi.string().required(),
});

const inputSearch = Joi.object().keys({
  ...commonFilterSchemas,
  alias: Joi.string(),
});

module.exports = {
  result,
  inputSearch,
};
