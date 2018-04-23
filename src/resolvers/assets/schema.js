const Joi = require('joi');

const inputSchema = Joi.array().items(Joi.string());

const outputSchema = Joi.array().items(
  Joi.object()
    .keys({
      asset_id: Joi.string().required(),
      asset_name: Joi.string().required(),
      description: Joi.string().required(),
      sender: Joi.string().required(),
      issue_height: Joi.number().required(),
      total_quantity: Joi.string().required(),
      decimals: Joi.number().required(),
      reissuable: Joi.boolean().required(),
      ticker: Joi.string(),
      issue_timestamp: Joi.object()
        .type(Date)
        .required(),
    })
    .allow(null)
);

module.exports = { inputSchema, outputSchema };
