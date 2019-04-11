const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
import commonFilterSchemas from '../../presets/pg/searchWithPagination/commonFilterSchemas';

const result = Joi.object().keys({
  ...commonFields,
  alias: Joi.string().required(),
});

module.exports = {
  result,
  inputSearch: commonFilterSchemas,
};
