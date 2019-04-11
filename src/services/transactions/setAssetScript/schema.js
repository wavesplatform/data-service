const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
import commonFilters from '../../presets/pg/searchWithPagination/commonFilterSchemas';

const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string().base58().required(),
  script: Joi.string()
    .required()
    .allow(null),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
    sender: Joi.string(),
    assetId: Joi.string().base58(),
    script: Joi.string(),
  })
  .required();

module.exports = { result, inputSearch };
