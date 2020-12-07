import { Maybe } from 'folktale/maybe';
import { of as taskOf, rejected, waitAll } from 'folktale/concurrency/task';
import { Asset } from '@waves/data-entities';

import { AppError } from '../../errorHandling';
import { Service, SearchedItems } from '../../types';

import {
  AssetsGetRequest,
  AssetsMgetRequest,
  AssetsSearchRequest,
  AssetsRepo,
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

  precisions: Service<AssetsServiceMgetRequest, number[]>;
};

export default (repo: AssetsRepo): AssetsService => ({
  get: (req) => repo.get(req.id),
  mget: (req) => repo.mget(req.ids),
  search: (req) => repo.search(req),

  precisions: (req) =>
    repo.mget(req.ids).chain((ms) =>
      waitAll<AppError, number>(
        ms.map((ma, idx) =>
          ma.matchWith({
            Just: ({ value: a }) => taskOf(a.precision),
            Nothing: () =>
              rejected(
                AppError.Resolver(`Asset ${req.ids[idx]} precision not found.`)
              ),
          })
        )
      )
    ),
});
