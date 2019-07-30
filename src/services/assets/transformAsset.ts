import { renameKeys } from 'ramda-adjunct';
import { compose } from 'ramda';
import { Asset } from '@waves/data-entities';

export type AssetDbResponse = {
  asset_id: string;
  asset_name: string;
  description: string;
  sender: string;
  issue_height: number;
  total_quantity: string;
  decimals: number;
  reissuable: boolean;
  ticker: string;
  issue_timestamp: Date;
  has_script: boolean;
  min_sponsored_asset_fee: number;
};

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
