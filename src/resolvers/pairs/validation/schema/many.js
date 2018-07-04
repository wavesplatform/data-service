const Joi = require('joi');

const { output, pairInput } = require('./common');

const input = Joi.array().items(pairInput);

module.exports = { input, output };
