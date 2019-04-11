const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
import commonFilters from '../../presets/pg/searchWithPagination/commonFilterSchemas';

const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string()
    .base58()
    .required(),
  min_sponsored_asset_fee: Joi.object()
    .bignumber()
    .required()
    .allow(null),
});

module.exports = {
  result,
  inputSearch: commonFilters,
};
