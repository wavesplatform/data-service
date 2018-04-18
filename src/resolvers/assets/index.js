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

const getResults = async ({ ids, api }) => {
  let result;
  try {
    result = await api.assets(ids);
    return Either.Right(result);
  } catch (e) {
    return Either.Left(AssetsResolverError(`Error from api: ${e.message}`));
  }
};
const logger = label => a => {
  console.log(label, a);
  return a;
};
const assetsResolver = async (options = {}) =>
  validateInput(options)
    .map(logger(1))
    .map(getResults)
    .map(logger(2))
    .map(p => p.then(e => e.map(logger(3)).map(validateResult)));

module.exports = assetsResolver;
