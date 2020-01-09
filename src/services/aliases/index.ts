import { Maybe } from 'folktale/maybe';

import { AliasInfo, Repo, Service, SearchedItems } from '../../types';

import {
  AliasesGetRequest,
  AliasesMgetRequest,
  AliasesSearchRequest,
} from './repo';
import { WithDecimalsFormat } from 'services/types';

export type AliasesServiceGetRequest = {
  id: AliasesGetRequest;
};

export type AliasesServiceMgetRequest = {
  ids: AliasesMgetRequest;
};

export type AliasesServiceSearchRequest = AliasesSearchRequest;

export type AliasesService = {
  get: Service<AliasesServiceGetRequest & WithDecimalsFormat, Maybe<AliasInfo>>;
  mget: Service<
    AliasesServiceMgetRequest & WithDecimalsFormat,
    Maybe<AliasInfo>[]
  >;
  search: Service<
    AliasesServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<AliasInfo>
  >;
};

export default (
  repo: Repo<
    AliasesGetRequest,
    AliasesMgetRequest,
    AliasesSearchRequest,
    AliasInfo
  >
): AliasesService => ({
  get: req => repo.get(req.id),
  mget: req => repo.mget(req.ids),
  search: req => repo.search(req),
});
