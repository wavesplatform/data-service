import { CommonServiceCreatorDependencies } from '../../middleware/injectServices';
import { searchPreset } from '../presets/pg/search';

import { candle, Candle, CandleInfo, List, ServiceSearch } from '../../types';

import { sql } from './sql';
import { inputSearch, output } from './schema';
import { CandleDbResponse, transformResults } from './transformResults';

export type CandlesSearchRequest = {
  amountAsset: string;
  priceAsset: string;
  params: {
    timeStart: Date;
    timeEnd: Date;
    interval: string;
    matcher: string;
  };
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
      resultTypeFactory: candle,
    })({ pg: drivers.pg, emitEvent: emitEvent }),
  };
};
