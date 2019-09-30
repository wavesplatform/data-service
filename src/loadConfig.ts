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

export type MatcherConfig = {
  matcher: {
    settingsURL: string;
    defaultMatcherAddress: string;
  };
};

export type DefaultConfig = PostgresConfig & ServerConfig & LoggerConfig;

export type DataServiceConfig = PostgresConfig &
  ServerConfig &
  LoggerConfig &
  MatcherConfig;

const commonEnvVariables = ['PGHOST', 'PGDATABASE', 'PGUSER', 'PGPASSWORD'];

export const loadDefaultConfig = (): DefaultConfig => {
  // assert common env vars are set
  checkEnv(commonEnvVariables);

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
  };
};

const envVariables = ['DEFAULT_MATCHER'];

const load = (): DataServiceConfig => {
  // assert all necessary env vars are set
  checkEnv(envVariables);

  return {
    ...loadDefaultConfig(),
    matcher: {
      settingsURL:
        process.env.MATCHER_SETTINGS_URL ||
        'https://matcher.wavesplatform.com/matcher/settings',
      defaultMatcherAddress: process.env.DEFAULT_MATCHER || '',
    },
  };
};

export const loadConfig = memoizeWith(always('config'), load);
