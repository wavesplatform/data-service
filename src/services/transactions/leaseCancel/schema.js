const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
import commonFilters from '../../presets/pg/searchWithPagination/commonFilterSchemas';

const result = Joi.object().keys({
  ...commonFields,
  lease_id: Joi.string().required(),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
    sender: Joi.string(),
    recipient: Joi.string(),
  })
  .required();

module.exports = { result, inputSearch };
