import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
import {
  SponsorshipTxsGetRequest,
  SponsorshipTxsMgetRequest,
  SponsorshipTxsSearchRequest,
  SponsorshipTx,
} from './repo/types';

type SponsorshipTxsServiceGetRequest = ServiceGetRequest<
  SponsorshipTxsGetRequest
>;
type SponsorshipTxsServiceMgetRequest = ServiceMgetRequest<
  SponsorshipTxsMgetRequest
>;
type SponsorshipTxsServiceSearchRequest = SponsorshipTxsSearchRequest;

export type SponsorshipTxsService = {
  get: Service<
    SponsorshipTxsServiceGetRequest & WithMoneyFormat,
    Maybe<SponsorshipTx>
  >;
  mget: Service<
    SponsorshipTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<SponsorshipTx>[]
  >;
  search: Service<
    SponsorshipTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<SponsorshipTx>
  >;
};
