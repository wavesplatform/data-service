var Ajv = require('ajv');
var ajv = new Ajv({ allErrors: true });

const { Either } = require('monet');

const { curry } = require('ramda');

const validate = (schema, errorFactory, value) =>
  ajv.validate(schema, value)
    ? Either.Right(value)
    : Either.Left(errorFactory(value));

module.exports = curry(validate);
