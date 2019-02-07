import * as checkEnv from 'check-env';
import { memoizeWith, always } from 'ramda';

export type Configuration = {
  postgresHost: string;
  postgresPort: number;
  postgresDatabase: string;
  postgresUser: string;
  postgresPassword: string;
  postgresPoolSize: number;
  logLevel: string;
  pairsUpdateInterval: number;
  pairsUpdateTimeout: number;
};

const envVariables = ['PGHOST', 'PGDATABASE', 'PGUSER', 'PGPASSWORD'];

const loadConfig = (): Configuration => {
  // assert all necessary env vars are set
  checkEnv(envVariables);

  return {
    postgresHost: process.env.PGHOST || '',
    postgresPort: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
    postgresDatabase: process.env.PGDATABASE || 'mainnet',
    postgresUser: process.env.PGUSER || 'postgres',
    postgresPassword: process.env.PGPASSWORD || 'postgres',
    postgresPoolSize: process.env.PGPOOLSIZE
      ? parseInt(process.env.PGPOOLSIZE)
      : 20,
    logLevel: process.env.LOG_LEVEL || 'info',
    pairsUpdateInterval: process.env.PAIRS_UPDATE_INTERVAL ? parseInt(process.env.PAIRS_UPDATE_INTERVAL) : 2500,
    pairsUpdateTimeout: process.env.PAIRS_UPDATE_TIMEOUT ? parseInt(process.env.PAIRS_UPDATE_TIMEOUT) : 20000,
  };
};

export default memoizeWith(always('config'), loadConfig);
