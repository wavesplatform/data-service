const Joi = require('../../../../utils/validation/joi');

const commonFilters = require('../../../presets/pg/searchWithPagination/commonFilterSchemas')
  .default;

const result = Joi.object().keys({
  tx_type: Joi.number()
    .min(1)
    .max(16)
    .required(),
  time_stamp: Joi.date().required(),
  id: Joi.string()
    .base58()
    .required(),
  generated_id: Joi.number().required(),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    sender: Joi.string(),
  })
  .required();

module.exports = { result, inputSearch };
