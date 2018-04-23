const createResolver = require('./createResolver');
const { validateInput, validateResult } = require('./validation');
const transformResult = require('./transformResult');

module.exports = createResolver({
  validateInput,
  validateResult,
  transformResult,
});
