const { loadConfig } = require('./loadConfig');
const options = loadConfig();

// logger
const createLogger = require('../../logger/winston');
const logger = createLogger({
  logLevel: 'info',
});

// pg
const { createPgDriver } = require('../../db');
const { withStatementTimeout } = require('../../db/driver');
const pgDriver = withStatementTimeout(
  createPgDriver(options),
  options.candlesUpdateTimeout,
  0 // 0 - unset statement timeout
);

const { daemon: runDaemon } = require('../presets/daemon');
const createDaemon = require('./create');

runDaemon(
  createDaemon(
    {
      logger: logger,
      pg: pgDriver,
    },
    options
  ),
  options,
  options.candlesUpdateInterval,
  options.candlesUpdateTimeout,
  logger
);
