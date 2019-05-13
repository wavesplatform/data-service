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

type ServiceConfig = {
  host: string;
  port: number;
};

export type BalancesServiceConfig = { balancesService: ServiceConfig };

export type DataEntriesServiceConfig = { dataEntriesService: ServiceConfig };

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
    balancesService: {
      host: process.env.BALANCES_SERVICE_HOST || 'localhost',
      port: process.env.BALANCES_SERVICE_PORT
        ? parseInt(process.env.BALANCES_SERVICE_PORT)
        : 3001,
    },
    dataEntriesService: {
      host: process.env.DATA_ENTRIES_SERVICE_HOST || 'localhost',
      port: process.env.DATA_ENTRIES_SERVICE_PORT
        ? parseInt(process.env.DATA_ENTRIES_SERVICE_PORT)
        : 3002,
    },
  };
};

export const loadConfig = memoizeWith(always('config'), load);
