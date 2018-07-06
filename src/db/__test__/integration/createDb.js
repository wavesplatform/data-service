const loadConfig = require('../../../loadConfig');
const { createDriver, createAdapter } = require('../../index');
module.exports = () => createAdapter(createDriver(loadConfig()));
