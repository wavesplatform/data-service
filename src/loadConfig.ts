import * as checkEnv from 'check-env';
import { memoizeWith, always } from 'ramda';

export type PostgresConfig = {
  postgresHost: string;
  postgresPort: number;
  postgresDatabase: string;
  postgresUser: string;
  postgresPassword: string;
  postgresPoolSize: number;
};

export type LoggerConfig = {
  logLevel: string;
};

export type ServerConfig = {
  port: number;
};

export type BalancesServiceConfig = {
  balancesServiceHost: string;
};

export type DataEntriesServiceConfig = {
  dataEntriesServiceHost: string;
  dataEntriesServicePort: number;
};

export type DataServiceConfig = PostgresConfig &
  ServerConfig &
  LoggerConfig &
  BalancesServiceConfig &
  DataEntriesServiceConfig;

const envVariables = ['PGHOST', 'PGDATABASE', 'PGUSER', 'PGPASSWORD'];

const load = (): DataServiceConfig => {
  // assert all necessary env vars are set
  checkEnv(envVariables);

  return {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    postgresHost: process.env.PGHOST || '',
    postgresPort: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
    postgresDatabase: process.env.PGDATABASE || 'mainnet',
    postgresUser: process.env.PGUSER || 'postgres',
    postgresPassword: process.env.PGPASSWORD || 'postgres',
    postgresPoolSize: process.env.PGPOOLSIZE
      ? parseInt(process.env.PGPOOLSIZE)
      : 20,
    logLevel: process.env.LOG_LEVEL || 'info',
    balancesServiceHost: process.env.BALANCES_SERVICE_HOST || 'localhost:3001',
    dataEntriesServiceHost:
      process.env.DATA_ENTRIES_SERVICE_HOST || 'localhost',
    dataEntriesServicePort: process.env.DATA_ENTRIES_SERVICE_PORT
      ? parseInt(process.env.DATA_ENTRIES_SERVICE_PORT)
      : 3002,
  };
};

export const loadConfig = memoizeWith(always('config'), load);
