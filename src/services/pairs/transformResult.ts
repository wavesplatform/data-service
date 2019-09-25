import { compose, pick, map } from 'ramda';
import { renameKeys } from 'ramda-adjunct';
import { BigNumber } from '@waves/data-entities';
import { list, List, pair, Pair, PairInfo } from '../../types';

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
export const transformResult = compose<object, object, PairInfo>(
  pickPairFields as any,
  renamePairFields
);

/** transformResultSearch :: Array -> Object */
export const transformResultSearch = (a: PairDbResponse[]): List<Pair> =>
  compose(
    (l: Pair[]) => list(l),
    map<PairDbResponse, Pair>((p: PairDbResponse) =>
      compose(
        pairObject => pair(pairObject, { amountAsset: p.amount_asset_id, priceAsset: p.price_asset_id }),
        (p: PairDbResponse): any => transformResult(p)
      )(p)
    )
  )(a);
