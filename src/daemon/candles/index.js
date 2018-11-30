const createDaemon = require('./create');

// logger
const defaultLogger = require('../utils/logger');

// pg
const { createPgDriver } = require('../../db');
const loadConfig = require('../../loadConfig');
const options = loadConfig();
const pgDriver = createPgDriver(options);

const { daemon: runDaemon } = require('../presets/daemon');

runDaemon(
  createDaemon({ logger: defaultLogger, pg: pgDriver }, options),
  options,
  options.candlesUpdateInterval,
  options.candlesUpdateTimeout,
  defaultLogger
);
