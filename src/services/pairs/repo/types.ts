import { PairInfo, AssetIdsPair, Repo, XOR } from '../../../types';
import { WithLimit, WithSortOrder, WithMatcher } from '../../_common';

export type PairsGetRequest = {
  pair: AssetIdsPair;
} & WithMatcher;

export type PairsMgetRequest = { pairs: AssetIdsPair[] } & WithMatcher;

export type SearchCommonRequest = WithSortOrder & WithLimit & WithMatcher;

export type SearchByAssetRequest = SearchCommonRequest & {
  search_by_asset: string;
  match_exactly: [boolean];
};

export type SearchByAssetsRequest = SearchCommonRequest & {
  search_by_assets: [string, string];
  match_exactly: [boolean] | [boolean, boolean];
};

export type PairsSearchRequest =
  | SearchCommonRequest
  | XOR<SearchByAssetRequest, SearchByAssetsRequest>;

export type PairsRepo = Repo<
  PairsGetRequest,
  PairsMgetRequest,
  PairsSearchRequest,
  PairInfo & AssetIdsPair
>;
