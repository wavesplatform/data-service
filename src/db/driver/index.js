// Module transforms pg-promise into pg-task
const pgpConnect = require('pg-promise')({ capSQL: true });

const { fromPromised } = require('folktale/concurrency/task');
const { map, evolve } = require('ramda');

let taskedDb;
let db;

module.exports = (options, connect = pgpConnect) => {
  if (!taskedDb) {
    // Create db driver
    db = connect({
      host: options.postgresHost,
      port: options.postgresPort,
      database: options.postgresDatabase,
      user: options.postgresUser,
      password: options.postgresPassword,
    });
    // Evolve db driver to return Task
    taskedDb = evolve({ many: fromPromised, none: fromPromised })(db);
  }

  return taskedDb;
};
