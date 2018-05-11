const checkEnv = require('check-env');

const { memoizeWith, always } = require('ramda');

const loadConfig = () => {
  // assert all necessary env vars are set
  checkEnv([
    'POSTGRES_HOST',
    'POSTGRES_DATABASE',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
  ]);

  return {
    logsDirectory: process.env.LOGS_DIRECTORY || 'log',
    postgresHost: process.env.POSTGRES_HOST,
    postgresPort: process.env.POSTGRES_PORT || 5432,
    postgresDatabase: process.env.POSTGRES_DATABASE,
    postgresUser: process.env.POSTGRES_USER,
    postgresPassword: process.env.POSTGRES_PASSWORD,
    postgresPoolSize: process.env.POSTGRES_POOL_SIZE || 70,
  };
};

module.exports = memoizeWith(always('config'), loadConfig);
