const Joi = require('joi');

const { output } = require('./common');

const input = Joi.array().items(Joi.string().required());

module.exports = { input, output };
