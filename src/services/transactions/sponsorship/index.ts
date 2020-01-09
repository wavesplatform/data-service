import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
import {
  SponsorshipTxsRepo,
  SponsorshipTxsGetRequest,
  SponsorshipTxsMgetRequest,
  SponsorshipTxsSearchRequest,
} from './repo/types';
import { TransactionInfo } from '../../../types';

export type SponsorshipTxsServiceGetRequest = ServiceGetRequest<
  SponsorshipTxsGetRequest
>;
export type SponsorshipTxsServiceMgetRequest = ServiceMgetRequest<
  SponsorshipTxsMgetRequest
>;
export type SponsorshipTxsServiceSearchRequest = SponsorshipTxsSearchRequest;

export type SponsorshipTxsService = {
  get: Service<
    SponsorshipTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<TransactionInfo>
  >;
  mget: Service<
    SponsorshipTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<TransactionInfo>[]
  >;
  search: Service<
    SponsorshipTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<TransactionInfo>
  >;
};

export default (repo: SponsorshipTxsRepo): SponsorshipTxsService => ({
  get: req => repo.get(req.id),
  mget: req => repo.mget(req.ids),
  search: req => repo.search(req),
});
