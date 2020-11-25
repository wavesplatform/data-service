import { Asset } from '@waves/data-entities';
import { CacheSync, Repo } from '../../../types';
import { WithSortOrder, WithLimit } from '../../_common';
import { RequestWithCursor } from '../../_common/pagination';

export type AssetsCache = CacheSync<string, AssetDbResponse>;

export type AssetsGetRequest = string;
export type AssetsMgetRequest = string[];

export type SearchByTicker = {
  ticker: string;
};

export type FullTextSearch = {
  search: string;
};

export type AssetsSearchRequest = RequestWithCursor<
  (SearchByTicker | FullTextSearch) & WithSortOrder & WithLimit,
  string
>;

export type AssetsRepo = Repo<
  AssetsGetRequest,
  AssetsMgetRequest,
  AssetsSearchRequest,
  Asset
>;

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
