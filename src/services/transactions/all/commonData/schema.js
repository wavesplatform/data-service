const Joi = require('../../../../utils/validation/joi');

import commonFilters from '../../../presets/pg/searchWithPagination/commonFilterSchemas';

const result = Joi.object().keys({
  tx_type: Joi.number()
    .min(1)
    .max(15)
    .required(),
  time_stamp: Joi.date().required(),
  id: Joi.string()
    .base58()
    .required(),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    sender: Joi.string(),
  })
  .required();

module.exports = { result, inputSearch };
