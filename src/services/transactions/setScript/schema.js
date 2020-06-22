const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../_common/commonFilterSchemas').default;

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
    
    script: Joi.string().base64Prefixed(),
  })
  .nand('sender', 'senders');

const result = Joi.object().keys({
  ...commonFields,

  script: Joi.string()
    .required()
    .allow(null),
});

module.exports = { result, inputSearch };
