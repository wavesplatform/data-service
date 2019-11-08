// configuration
import { loadConfig } from './loadConfig';
const configuration = loadConfig();

// logger
import * as createLogger from '../../logger/winston';
const logger = createLogger({
  logLevel: 'info',
});

// pg driver
import { createPgDriver } from '../../db';
const pgDriver = createPgDriver(configuration);

const { daemon: runDaemon } = require('../presets/daemon');
const createDaemon = require('./create');

runDaemon(
  createDaemon(
    {
      logger,
      pg: pgDriver,
      tableName: 'pairs',
    },
    configuration
  ),
  configuration,
  configuration.pairsUpdateInterval,
  configuration.pairsUpdateTimeout,
  logger
);
