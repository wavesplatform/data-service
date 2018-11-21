const { compose } = require('ramda');

const loadConfig = require('../../../loadConfig');
const { createPgDriver } = require('../../index');
module.exports = compose(
  createPgDriver,
  loadConfig
);
