const { inputSchema, outputSchema } = require('./schema');
const { AppError } = require('../../errorHandling');
const validate = require('../../utils/validate');

// validateInput :: Options -> Boolean
const validateInput = validate(inputSchema, (error, value) =>
  AppError.Resolver('Input validation failed', {
    resolving: 'assets',
    error,
    value,
  })
);

// validateResult :: Result -> Boolean
const validateResult = validate(outputSchema, (error, value) =>
  AppError.Resolver('Result validation failed', {
    resolving: 'assets',
    value,
    error,
  })
);

module.exports = {
  validateInput,
  validateResult,
};
