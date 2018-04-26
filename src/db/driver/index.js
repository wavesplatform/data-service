// Module transforms pg-promise into pg-task
const pgpConnect = require('./pgp');

const { fromPromised } = require('folktale/concurrency/task');
const { evolve, compose, memoizeWith, always } = require('ramda');

const createTaskedDriver = (options, connect = pgpConnect) => {
  const createDriver = compose(
    evolve({ many: fromPromised, none: fromPromised, any: fromPromised }),
    connect
  );

  return createDriver({
    host: options.postgresHost,
    port: options.postgresPort,
    database: options.postgresDatabase,
    user: options.postgresUser,
    password: options.postgresPassword,
  });
};

module.exports = memoizeWith(always('taskedDb'), createTaskedDriver);
