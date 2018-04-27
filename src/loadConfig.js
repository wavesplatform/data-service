const checkEnv = require('check-env');

const { memoizeWith, always } = require('ramda');

const loadConfig = () => {
  // assert all necessary env vars are set
  checkEnv([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_DATABASE',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
  ]);

  return {
    postgresHost: process.env.POSTGRES_HOST,
    postgresPort: process.env.POSTGRES_PORT,
    postgresDatabase: process.env.POSTGRES_DATABASE,
    postgresUser: process.env.POSTGRES_USER,
    postgresPassword: process.env.POSTGRES_PASSWORD,
  };
};

module.exports = memoizeWith(always('config'), loadConfig);
