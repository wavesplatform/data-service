const { validate: validateSchema } = require('joi');

const { Either } = require('monet');

const { curry } = require('ramda');

/** validate :: JoiSchema -> (ValidationError v -> AppError) -> v -> Either v AppError */
const validate = curry((schema, errorFactory, value) => {
  const { error } = validateSchema(value, schema);
  return error ? Either.Left(errorFactory(error, value)) : Either.Right(value);
});

module.exports = validate;
