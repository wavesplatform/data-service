const { compose } = require('ramda');

const loadConfig = require('../../../loadConfig');
const { createPgDriver, createAdapter } = require('../../index');
module.exports = compose(
  createAdapter,
  createPgDriver,
  loadConfig
);
