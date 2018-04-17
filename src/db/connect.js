const pgp = require('./pgp');

let db;

module.exports = options => {
  if (!db) {
    db = pgp({
      host: options.postgresHost,
      port: options.postgresPort,
      database: options.postgresDatabase,
      user: options.postgresUser,
      password: options.postgresPassword,
    });
  }

  return db;
};
