const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../_common/commonFilterSchemas').default;

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    recipient: Joi.string().noNullChars(),
  })
  .nand('sender', 'senders');

const result = Joi.object().keys({
  ...commonFields,

  lease_id: Joi.string()
    .base58()
    .required(),
});

module.exports = { result, inputSearch };
