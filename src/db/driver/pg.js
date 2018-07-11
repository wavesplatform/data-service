// Module transforms pg-promise into pg-task
const pgpConnect = require('./pgp');

const { fromPromised } = require('folktale/concurrency/task');
const { map, pick, compose, memoizeWith, always } = require('ramda');

const createTaskedDriver = (options, connect = pgpConnect) => {
  const driverP = connect({
    host: options.postgresHost,
    port: options.postgresPort,
    database: options.postgresDatabase,
    user: options.postgresUser,
    password: options.postgresPassword,
    max: options.postgresPoolSize, // max connection pool size
  });

  return compose(
    map(fromPromised),
    pick(['none', 'one', 'many', 'any', 'oneOrNone', 'task', 'tx'])
  )(driverP);
};

module.exports = memoizeWith(always('driverT'), createTaskedDriver);
