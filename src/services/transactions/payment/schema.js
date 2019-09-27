const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas')
  .default;

const result = Joi.object().keys({
  ...commonFields,

  amount: Joi.object()
    .bignumber()
    .required(),
  recipient: Joi.string().required(),
});

const inputSearch = Joi.object().keys({
  ...commonFilters,
  recipient: Joi.string(),
});

module.exports = {
  result,
  inputSearch,
};
