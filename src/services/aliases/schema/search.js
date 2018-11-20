const Joi = require('joi');

const common = require('../../presets/pg/search/commonFilterSchemas');

const inputSearch = Joi.object()
  .keys({
    address: Joi.string().required(),
    showBroken: Joi.boolean(),
    ...common,
  })
  .required();

module.exports = inputSearch;
