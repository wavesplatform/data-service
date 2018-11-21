const Joi = require('../../utils/validation/joi');

const inputSearch = Joi.object({
  timeStart: Joi.number().integer(),
  timeEnd: Joi.number().integer(),
  interval: Joi.string(),
});

module.exports = { inputSearch };
