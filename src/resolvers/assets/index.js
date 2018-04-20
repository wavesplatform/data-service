const createResolver = require('./createResolver');
const { validateInput, validateResult } = require('./validation');

module.exports = createResolver({ validateInput, validateResult });
