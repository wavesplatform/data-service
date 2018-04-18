// RORO
const { ResolverError } = require('../../utils/error');
var Ajv = require('ajv');
var ajv = new Ajv({ allErrors: true });
const { inputSchema, outputSchema } = require('./schema');

const AssetsResolverError = message => new ResolverError('assets', message);

const assetsResolver = async (options = {}) => {
  // Validate input
  const validOptions = ajv.validate(inputSchema, options);
  if (!validOptions)
    throw AssetsResolverError(`Wrong arguments: ${JSON.stringify(options)}`);
  const { ids, api } = options;

  // Get result from API
  let result = await api
    .assets(ids)
    .then(assets => ({ assets }))
    .catch(e => {
      throw AssetsResolverError(`Error from api: ${e.message}`);
    });

  // Validate output
  const validResult = ajv.validate(outputSchema, result);
  if (!validResult)
    throw AssetsResolverError(`Wrong result shape: ${JSON.stringify(result)}`);
  return Promise.resolve(result);
};

module.exports = assetsResolver;
