const createApi = require('./api');
const filters = require('./filters').default;

module.exports = createApi({ filters });
