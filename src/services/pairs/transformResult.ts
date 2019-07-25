import { compose, pick, map, repeat, zipObj } from 'ramda';
import { renameKeys } from 'ramda-adjunct';
import { BigNumber } from '@waves/data-entities';
import { list, pair } from '../../types';

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
const pickPairFields = pick(pairDataFields);

/** renamePairFields :: Object -> Object */
const renamePairFields = renameKeys({
  first_price: 'firstPrice',
  last_price: 'lastPrice',
  volume_waves: 'volumeWaves',
  weighted_average_price: 'weightedAveragePrice',
  quote_volume: 'quoteVolume',
  txs_count: 'txsCount',
});

/** transformResult :: Object -> Object */
export const transformResult = compose(
  pickPairFields,
  renamePairFields
);

/** transformResultSearch :: Array -> Object */
export const transformResultSearch = compose(
  list,
  map((p: PairDbResponse) =>
    compose(
      pairObject => ({
        ...pairObject,
        amountAsset: p.amount_asset_id,
        priceAsset: p.price_asset_id,
      }),
      pair,
      transformResult
    )(p)
  )
);

export const createEmptyPair = () =>
  pair(zipObj(pairDataFields, repeat(null, pairDataFields.length)));
