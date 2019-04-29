const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilterSchemas = require('../../presets/pg/searchWithPagination/commonFilterSchemas').default;

const result = Joi.object().keys({
  ...commonFields,
  alias: Joi.string().required(),
});

module.exports = {
  result,
  inputSearch: commonFilterSchemas,
};
