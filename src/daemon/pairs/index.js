// configuration
const loadConfig = require('../../loadConfig');
const configuration = loadConfig();

// logger
const logger = require('../utils/logger');

// pg driver
const { createPgDriver } = require('../../db');
const pgDriver = createPgDriver(configuration);

const { daemon: runDaemon } = require('../presets/daemon');

const createDaemon = require('./create');

runDaemon(
  createDaemon({ logger, pg: pgDriver, tableName: 'pairs' }, configuration),
  configuration,
  configuration.pairsUpdateInterval, 
  configuration.pairsUpdateTimeout,
  logger
);
