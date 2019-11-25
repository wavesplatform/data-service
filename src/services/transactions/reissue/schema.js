const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');
const commonFilters = require('../_common/commonFilterSchemas').default;
const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string()
    .assetId()
    .required(),
  quantity: Joi.object()
    .bignumber()
    .required(),
  reissuable: Joi.boolean().required(),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    assetId: Joi.string().assetId(),
  })
  .required();

module.exports = {
  result,
  inputSearch,
};
