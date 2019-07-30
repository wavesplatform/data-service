import { searchPreset } from '../presets/pg/search';

import { Candle, CandleInfo, List, ServiceSearch } from '../../types';

import { CommonServiceCreatorDependencies } from '..';

import { sql } from './sql';
import { inputSearch, output } from './schema';
import { CandleDbResponse, transformResults } from './transformResults';

export type CandlesSearchRequest = {
  amountAsset: string;
  priceAsset: string;
  timeStart: Date;
  timeEnd: Date;
  interval: string;
  matcher: string;
};

export type CandlesService = ServiceSearch<CandlesSearchRequest, Candle>;

export default ({
  drivers,
  emitEvent,
}: CommonServiceCreatorDependencies): CandlesService => {
  return {
    search: searchPreset<
      CandlesSearchRequest,
      CandleDbResponse,
      CandleInfo,
      List<Candle>
    >({
      name: 'candles.search',
      sql,
      inputSchema: inputSearch,
      resultSchema: output,
      transformResult: transformResults,
    })({ pg: drivers.pg, emitEvent: emitEvent }),
  };
};
