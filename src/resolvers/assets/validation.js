const { inputSchema, outputSchema } = require('./schema');
const { AppError } = require('../../errorHandling');
const validate = require('../../utils/validate');

// validateInput :: Options -> Boolean
const validateInput = validate(inputSchema, (error, value) =>
  AppError.Validation('Input validation failed', {
    resolver: 'assets',
    error,
    value,
  })
);

// validateResult :: Result -> Boolean
const validateResult = validate(outputSchema, (error, value) =>
  AppError.Validation('Result validation failed', {
    resolver: 'assets',
    value,
    error,
  })
);

module.exports = {
  validateInput,
  validateResult,
};
