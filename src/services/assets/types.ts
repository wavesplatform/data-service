import { CacheSync, Service, XOR, Asset } from '../../types';
import { RequestWithCursor } from '../_common/pagination';
import { Cursor } from './cursor';

export type AssetsCache = CacheSync<string, AssetDbResponse>;

export type SearchByTicker = {
  ticker: string;
  limit: number;
};

export type SearchFullText = {
  search: string;
  limit: number;
};

export type AssetsSearchRequest = RequestWithCursor<
  XOR<SearchByTicker, SearchFullText>,
  Cursor
>;

export type AssetsService = Service<
  string,
  string[],
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
