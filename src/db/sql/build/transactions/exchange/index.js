const createApi = require('./api');
const filters = require('./filters');
const query = require('./query');

module.exports = createApi({ query, filters });
