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
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
  })
  .required();

module.exports = { result, inputSearch };
