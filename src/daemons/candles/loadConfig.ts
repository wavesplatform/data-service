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
  candlesUpdateInterval: number;
  candlesUpdateTimeout: number;
  candlesTruncateTable: boolean;
  candlesTableName: string;
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
    candlesUpdateInterval: process.env.CANDLES_UPDATE_INTERVAL
      ? parseInt(process.env.CANDLES_UPDATE_INTERVAL)
      : 2500,
    candlesUpdateTimeout: process.env.CANDLES_UPDATE_TIMEOUT
      ? parseInt(process.env.CANDLES_UPDATE_TIMEOUT)
      : 20000,
    candlesTruncateTable: process.env.RECALCULATE_ALL_CANDLES_ON_START
      ? true
      : false,
    candlesTableName: process.env.CANDLES_TABLE_NAME || 'candles',
  };
};

export default memoizeWith(always('config'), loadConfig);
