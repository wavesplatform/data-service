const { inputSchema, outputSchema } = require('./schema');
const { AppError } = require('../../errorHandling');
const validate = require('../../utils/validate');

// validateInput :: Options -> Boolean
const validateInput = validate(inputSchema, opts =>
  AppError.Resolver(`Wrong arguments: ${JSON.stringify(opts)}`, {
    resolving: 'assets',
  })
);

// validateResult :: Result -> Boolean
const validateResult = validate(outputSchema, res =>
  AppError.Resolver(`Wrong result shape: ${JSON.stringify(res)}`, {
    resolving: 'assets',
  })
);

module.exports = {
  validateInput,
  validateResult,
};
