const Joi = require('joi');

module.exports = {
  limit: Joi.number()
    .min(1)
    .max(100),
  sort: Joi.string().valid('asc', 'desc'),
};
