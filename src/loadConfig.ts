import * as checkEnv from 'check-env';
import { always, isNil, memoizeWith } from 'ramda';

export type PostgresConfig = {
  postgresHost: string;
  postgresPort: number;
  postgresDatabase: string;
  postgresUser: string;
  postgresPassword: string;
  postgresPoolSize: number;
  postgresStatementTimeout: number | false;
};

export type LoggerConfig = {
  logLevel: string;
};

export type ServerConfig = {
  port: number;
};

export type MatcherConfig = {
  matcher: {
    settingsURL?: string;
    defaultMatcherAddress: string;
  };
};

export type RatesConfig = {
  pairAcceptanceVolumeThreshold: number;
  thresholdAssetId: string;
  rateBaseAssetId: string;
};

export type DefaultConfig = PostgresConfig & ServerConfig & LoggerConfig;

export type DataServiceConfig = PostgresConfig &
  ServerConfig &
  LoggerConfig &
  MatcherConfig &
  RatesConfig;

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
    postgresPoolSize: process.env.PGPOOLSIZE ? parseInt(process.env.PGPOOLSIZE) : 20,
    postgresStatementTimeout:
      isNil(process.env.PGSTATEMENTTIMEOUT) ||
      isNaN(parseInt(process.env.PGSTATEMENTTIMEOUT))
        ? false
        : parseInt(process.env.PGSTATEMENTTIMEOUT),
    logLevel: process.env.LOG_LEVEL || 'info',
  };
};

const envVariables = [
  'DEFAULT_MATCHER',
  'RATE_PAIR_ACCEPTANCE_VOLUME_THRESHOLD',
  'RATE_THRESHOLD_ASSET_ID',
];

const ensurePositiveNumber = (x: number, msg: string) => {
  if (x > 0) {
    return x;
  }

  throw new Error(msg);
};

const load = (): DataServiceConfig => {
  // assert all necessary env vars are set
  checkEnv(envVariables);

  const matcher: MatcherConfig = {
    matcher: {
      defaultMatcherAddress: process.env.DEFAULT_MATCHER as string,
    },
  };

  const volumeThreshold = ensurePositiveNumber(
    parseInt(process.env.RATE_PAIR_ACCEPTANCE_VOLUME_THRESHOLD as string),
    'RATE_PAIR_ACCEPTANCE_VOLUME_THRESHOLD environment variable should be a positive integer'
  );

  const rate: RatesConfig = {
    pairAcceptanceVolumeThreshold: volumeThreshold,
    thresholdAssetId: process.env.RATE_THRESHOLD_ASSET_ID as string,
    rateBaseAssetId: (process.env.RATE_BASE_ASSET_ID as string) || 'WAVES',
  };

  if (
    typeof process.env.MATCHER_SETTINGS_URL !== 'undefined' &&
    process.env.MATCHER_SETTINGS_URL !== ''
  ) {
    matcher.matcher.settingsURL = process.env.MATCHER_SETTINGS_URL;
  }

  return {
    ...loadDefaultConfig(),
    ...matcher,
    ...rate,
  };
};

export const loadConfig = memoizeWith(always('config'), load);
