import { memoizeWith, always } from 'ramda';
import {
  PostgresConfig,
  LoggerConfig,
  loadDefaultConfig,
} from '../../loadConfig';

export type CandlesConfig = PostgresConfig &
  LoggerConfig & {
    candlesUpdateInterval: number;
    candlesUpdateTimeout: number;
    candlesTruncateTable: boolean;
    candlesTableName: string;
  };

const load = (): CandlesConfig => ({
  ...loadDefaultConfig(),
  candlesUpdateInterval: process.env.CANDLES_UPDATE_INTERVAL
    ? parseInt(process.env.CANDLES_UPDATE_INTERVAL)
    : 2500,
  candlesUpdateTimeout: process.env.CANDLES_UPDATE_TIMEOUT
    ? parseInt(process.env.CANDLES_UPDATE_TIMEOUT)
    : 20000,
  candlesTruncateTable: process.env.RECALCULATE_ALL_CANDLES_ON_START
    ? process.env.RECALCULATE_ALL_CANDLES_ON_START == 'true'
    : false,
  candlesTableName: process.env.CANDLES_TABLE_NAME || 'candles',
});

export const loadConfig = memoizeWith(always('config'), load);
