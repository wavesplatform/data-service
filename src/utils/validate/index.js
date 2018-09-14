const { validate: validateSchema } = require('joi');

const Result = require('folktale/result');

const { curry } = require('ramda');

/** validate :: JoiSchema -> (ValidationError v -> AppError) -> v -> Either v AppError */
const validate = curry((schema, errorFactory, value) => {
  const { error } = validateSchema(value, schema, { convert: false });
  return error ? Result.Error(errorFactory(error, value)) : Result.Ok(value);
});

module.exports = validate;
