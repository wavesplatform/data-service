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

export type DefaultMatcherConfig = {
  defaultMatcher: string;
}

export type DataServiceConfig = PostgresConfig & ServerConfig & LoggerConfig & DefaultMatcherConfig;

const envVariables = ['PGHOST', 'PGDATABASE', 'PGUSER', 'PGPASSWORD'];

const guard = <T>(name: string, val?: T): T => {
  if (typeof val === 'undefined') {
    throw new Error('config value ' + name + ' should be defined');
  }

  return val;
}

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

    defaultMatcher: guard('DEFAULT_MATCHER', process.env.DEFAULT_MATCHER),
  };
};

export const loadConfig = memoizeWith(always('config'), load);
