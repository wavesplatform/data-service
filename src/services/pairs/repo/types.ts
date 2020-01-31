import { PairInfo, AssetIdsPair, Repo } from '../../../types';
import { WithLimit, WithSortOrder } from '../../_common';

export type PairsGetRequest = {
  pair: AssetIdsPair;
  matcher: string;
};

export type PairsMgetRequest = { pairs: AssetIdsPair[]; matcher: string };

export type SearchCommonRequest = WithSortOrder &
  WithLimit & {
    matcher: string;
  };

export type SearchWithMatchExactly = SearchCommonRequest & {
  match_exactly?: boolean[];
};

export type SearchByAssetRequest = SearchWithMatchExactly & {
  search_by_asset: string;
};

export type SearchByAssetsRequest = SearchWithMatchExactly & {
  search_by_assets: [string, string];
};

export type PairsSearchRequest =
  | SearchCommonRequest
  | SearchByAssetRequest
  | SearchByAssetsRequest;

export type PairsRepo = Repo<
  PairsGetRequest,
  PairsMgetRequest,
  PairsSearchRequest,
  PairInfo
>;
