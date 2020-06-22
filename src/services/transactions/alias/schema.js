const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilterSchemas = require('../_common/commonFilterSchemas').default;

const inputSearch = Joi.object().keys({
  ...commonFilterSchemas,
  
}).nand('sender', 'senders');

const result = Joi.object().keys({
  ...commonFields,
  
  alias: Joi.string().required(),
});

module.exports = {
  result,
  inputSearch,
};
