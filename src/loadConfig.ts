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
    default: string;
  };
};

export type DataServiceConfig = PostgresConfig &
  ServerConfig &
  LoggerConfig &
  MatcherConfig;

const envVariables = [
  'PGHOST',
  'PGDATABASE',
  'PGUSER',
  'PGPASSWORD',
  'DEFAULT_MATCHER',
];

export const loadDefaultConfig = (): DefaultConfig => {
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

    matcher: {
      settingsURL:
        process.env.MATCHER_SETTINGS_URL ||
        'https://matcher.wavesplatform.com/matcher/settings',
      default: process.env.DEFAULT_MATCHER || '',
    },
  };
};

const load = (): DataServiceConfig => ({
  ...loadDefaultConfig(),
  defaultMatcher: guard('DEFAULT_MATCHER', process.env.DEFAULT_MATCHER),
});

export const loadConfig = memoizeWith(always('config'), load);
