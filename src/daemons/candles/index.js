const createDaemon = require('./create');

// logger
const createLogger = require('../../logger/winston');

// pg
const { createPgDriver } = require('../../db');
const { loadConfig } = require('./loadConfig');
const options = loadConfig();
const pgDriver = createPgDriver(options);
const logger = createLogger({
  logLevel: 'info',
});

const { daemon: runDaemon } = require('../presets/daemon');

runDaemon(
  createDaemon({ logger: logger, pg: pgDriver }, options),
  options,
  options.candlesUpdateInterval,
  options.candlesUpdateTimeout,
  logger
);
