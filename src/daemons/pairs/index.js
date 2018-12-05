// configuration
const loadConfig = require('./loadConfig');
const configuration = loadConfig();

// logger
const createLogger = require('../../logger/winston');

// pg driver
const { createPgDriver } = require('../../db');
const pgDriver = createPgDriver(configuration);

const { daemon: runDaemon } = require('../presets/daemon');
const createDaemon = require('./create');
const logger = createLogger({
  logLevel: 'info',
});

runDaemon(
  createDaemon({ logger, pg: pgDriver, tableName: 'pairs' }, configuration),
  configuration,
  configuration.pairsUpdateInterval,
  configuration.pairsUpdateTimeout,
  logger
);
