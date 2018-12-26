const checkEnv = require('check-env');

const { memoizeWith, always } = require('ramda');

const loadConfig = () => {
  // assert all necessary env vars are set
  checkEnv(['PGHOST', 'PGDATABASE', 'PGUSER', 'PGPASSWORD']);

  return {
    postgresHost: process.env.PGHOST,
    postgresPort: parseInt(process.env.PGPORT) || 5432,
    postgresDatabase: process.env.PGDATABASE,
    postgresUser: process.env.PGUSER,
    postgresPassword: process.env.PGPASSWORD,
    postgresPoolSize: parseInt(process.env.PGPOOLSIZE) || 20,

    logLevel: process.env.LOG_LEVEL || 'info',

    pairsUpdateInterval: process.env.PAIRS_UPDATE_INTERVAL || 2500,
    pairsUpdateTimeout: process.env.PAIRS_UPDATE_TIMEOUT || 20000,
  };
};

module.exports = memoizeWith(always('config'), loadConfig);
