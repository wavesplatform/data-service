const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas').default;

const result = Joi.object().keys({
  ...commonFields,

  script: Joi.string()
    .required()
    .base64()
    .allow(null),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
    sender: Joi.string().base58(),
    script: Joi.string().base64(),
  })
  .required();

module.exports = { result, inputSearch };
