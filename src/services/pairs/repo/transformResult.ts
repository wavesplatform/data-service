import { pick } from 'ramda';
import { renameKeys } from 'ramda-adjunct';
import { BigNumber } from '@waves/data-entities';

export type PairDbResponse = {
  amount_asset_id: string;
  price_asset_id: string;
  first_price: BigNumber;
  last_price: BigNumber;
  volume: BigNumber;
  quote_volume: BigNumber;
  high: BigNumber;
  low: BigNumber;
  weighted_average_price: BigNumber;
  txs_count: number;
  volume_waves: BigNumber;
};

export type PairResponse = {
  amountAssetId: string;
  priceAssetId: string;
  firstPrice: BigNumber;
  lastPrice: BigNumber;
  volume: BigNumber;
  quoteVolume: BigNumber;
  high: BigNumber;
  low: BigNumber;
  weightedAveragePrice: BigNumber;
  txsCount: number;
  volumeWaves: BigNumber;
};

/** renamePairFields :: Object -> Object */
const renamePairFields = renameKeys({
  amount_asset_id: 'amountAssetId',
  price_asset_id: 'priceAssetId',
  first_price: 'firstPrice',
  last_price: 'lastPrice',
  volume_waves: 'volumeWaves',
  weighted_average_price: 'weightedAveragePrice',
  quote_volume: 'quoteVolume',
  txs_count: 'txsCount',
});

const pairDataFields = [
  'firstPrice',
  'lastPrice',
  'low',
  'high',
  'weightedAveragePrice',
  'volume',
  'quoteVolume',
  'volumeWaves',
  'txsCount',
];

/** pickPairFields :: Object -> Object */
export const toPairInfo = pick(pairDataFields);

/** transformResult :: Object -> Object */
export const transformResult = renamePairFields;
