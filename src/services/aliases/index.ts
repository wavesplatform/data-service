import { Maybe } from 'folktale/maybe';

import { AliasInfo, Service, SearchedItems } from '../../types';

import {
  AliasesGetRequest,
  AliasesMgetRequest,
  AliasesSearchRequest,
  AliasesRepo,
} from './repo';
import { WithDecimalsFormat } from '../types';
export { WithAddress, WithAddresses, WithQueries } from './repo';

export type AliasesServiceGetRequest = {
  id: AliasesGetRequest;
};

export type AliasesServiceMgetRequest = {
  aliases: AliasesMgetRequest;
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

export default (repo: AliasesRepo): AliasesService => ({
  get: (req) => repo.get(req.id),
  mget: (req) => repo.mget(req.aliases),
  search: (req) => repo.search(req),
});
