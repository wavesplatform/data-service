const { AppError } = require('../../errorHandling');
const validate = require('../../utils/validate');

// validateInput :: Options -> Boolean
const validateInput = (schema, name) =>
  validate(schema, (error, value) =>
    AppError.Validation('Input validation failed', {
      resolver: name,
      error,
      value,
    })
  );

// validateResult :: Result -> Boolean
const validateResult = (schema, name) =>
  validate(schema, (error, value) =>
    AppError.Resolver('Result validation failed', {
      resolver: name,
      value,
      error,
    })
  );

module.exports = {
  validateInput,
  validateResult,
};
