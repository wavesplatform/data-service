import { renameKeys } from 'ramda-adjunct';
import { BigNumber } from '@waves/data-entities';
import { PairInfo, AssetIdsPair } from '../../../types';

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

/** renamePairFields :: Object -> Object */
const renamePairFields = renameKeys<PairInfo & AssetIdsPair>({
  amount_asset_id: 'amountAsset',
  price_asset_id: 'priceAsset',
  first_price: 'firstPrice',
  last_price: 'lastPrice',
  volume_waves: 'volumeWaves',
  weighted_average_price: 'weightedAveragePrice',
  quote_volume: 'quoteVolume',
  txs_count: 'txsCount',
});

/** transformResult :: Object -> Object */
export const transformResult = renamePairFields;
