import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
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
    SponsorshipTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<SponsorshipTx>
  >;
  mget: Service<
    SponsorshipTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<SponsorshipTx>[]
  >;
  search: Service<
    SponsorshipTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<SponsorshipTx>
  >;
};
