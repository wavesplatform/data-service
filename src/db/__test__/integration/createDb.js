const { compose } = require('ramda');

const loadConfig = require('../../../loadConfig');
const { createDriver, createAdapter } = require('../../index');
module.exports = compose(
  createAdapter,
  createDriver,
  loadConfig
);
