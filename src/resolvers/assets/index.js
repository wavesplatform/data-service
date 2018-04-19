// RORO
const { ResolverError } = require('../../utils/error');
var Ajv = require('ajv');
var ajv = new Ajv({ allErrors: true });
const { inputSchema, outputSchema } = require('./schema');

const { Either } = require('monet');

const AssetsResolverError = message => new ResolverError('assets', message);

const validateInput = options =>
  ajv.validate(inputSchema, options)
    ? Either.Right(options)
    : Either.Left(
        AssetsResolverError(`Wrong arguments: ${JSON.stringify(options)}`)
      );

const validateResult = result =>
  ajv.validate(outputSchema, result)
    ? Either.Right(result)
    : Either.Left(
        AssetsResolverError(`Wrong result shape: ${JSON.stringify(result)}`)
      );

const getResults = ({ ids, api }) => {
  return api.assets(ids);
};
// assetsResolver :: Options {} -> Task
const assetsResolver = (options = {}) =>
  Either.Right(options)
    .chain(validateInput) // Either
    .chain(getResults); // Task

// .chain(validateResult);

module.exports = assetsResolver;
