import { renameKeys } from 'ramda-adjunct';
import { compose } from 'ramda';
import { Asset } from '@waves/data-entities';
import { AssetDbResponse } from './types';

export const transformDbResponse = (raw: AssetDbResponse): Asset =>
  compose(
    (obj: any) => new Asset(obj),
    renameKeys({
      asset_id: 'id',
      asset_name: 'name',
      issue_height: 'height',
      issue_timestamp: 'timestamp',
      total_quantity: 'quantity',
      decimals: 'precision',
      has_script: 'hasScript',
      min_sponsored_asset_fee: 'minSponsoredFee',
    })
  )(raw);
