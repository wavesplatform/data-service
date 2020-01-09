import { Maybe } from 'folktale/maybe';
import { Asset } from '@waves/data-entities';

import { Repo, Service, SearchedItems } from '../../types';

import {
  AssetsGetRequest,
  AssetsMgetRequest,
  AssetsSearchRequest,
} from './repo/types';

export type AssetsServiceGetRequest = {
  id: AssetsGetRequest;
};

export type AssetsServiceMgetRequest = {
  ids: AssetsMgetRequest;
};

export type AssetsServiceSearchRequest = AssetsSearchRequest;

export type AssetsService = {
  get: Service<AssetsServiceGetRequest, Maybe<Asset>>;
  mget: Service<AssetsServiceMgetRequest, Maybe<Asset>[]>;
  search: Service<AssetsServiceSearchRequest, SearchedItems<Asset>>;
};

export default (
  repo: Repo<AssetsGetRequest, AssetsMgetRequest, AssetsSearchRequest, Asset>
): AssetsService => ({
  get: req => repo.get(req.id),
  mget: req => repo.mget(req.ids),
  search: req => repo.search(req),
});
