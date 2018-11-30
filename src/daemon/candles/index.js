const createDaemon = require('./create');

const { compose, map, prop, has, and, gt, lt, propEq } = require('ramda');
const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');
const tap = require('../../utils/tap');

// logger
const logger = require('../presets/chulkLogger');
// const { timeStart, timeEnd } = require('../../utils/time');

// pg
const { createPgDriver } = require('../../db');
const loadConfig = require('../../loadConfig');
const options = loadConfig();
const pgDriver = createPgDriver(options);

const { daemon: runDaemon } = require('../presets/daemon');

runDaemon(createDaemon({ logger, pg: pgDriver }, options)
  options,
  options.candlesUpdateInterval,
  options.candlesUpdateTimeout,
  logger
);
