// Module transforms pg-promise into pg-task
const pgpConnect = require('./pgp');

const { fromPromised } = require('folktale/concurrency/task');
const { evolve, compose } = require('ramda');

let taskedDb;

module.exports = (options, connect = pgpConnect) => {
  const createDriver = compose(
    evolve({ many: fromPromised, none: fromPromised }),
    connect
  );

  if (!taskedDb) {
    // Evolve db driver to return Task
    taskedDb = createDriver({
      host: options.postgresHost,
      port: options.postgresPort,
      database: options.postgresDatabase,
      user: options.postgresUser,
      password: options.postgresPassword,
    });
  }

  return taskedDb;
};
