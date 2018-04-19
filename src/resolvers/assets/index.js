// RORO
const { ResolverError } = require('../../utils/error');
var Ajv = require('ajv');
var ajv = new Ajv({ allErrors: true });
const { inputSchema, outputSchema } = require('./schema');
const Task = require('folktale/concurrency/task');
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

const getResults = optionsOrError => {
  const { value, isRight } = optionsOrError;
  if (!isRight) return Task.rejected(optionsOrError);
  const { api, ids } = value;
  return api.assets(ids);
};

// assetsResolver :: Options {} -> Task
const assetsResolver = (options = {}) =>
  Task.of(options)

    .map(validateInput) // Task -> Either

    .chain(getResults); // Either -> Task

// .chain(validateResult);

module.exports = assetsResolver;
