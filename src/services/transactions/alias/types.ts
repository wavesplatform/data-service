import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
import {
  AliasTxsGetRequest,
  AliasTxsMgetRequest,
  AliasTxsSearchRequest,
  AliasTx,
} from './repo/types';

type AliasTxsServiceGetRequest = ServiceGetRequest<AliasTxsGetRequest>;
type AliasTxsServiceMgetRequest = ServiceMgetRequest<AliasTxsMgetRequest>;
type AliasTxsServiceSearchRequest = AliasTxsSearchRequest;

export type AliasTxsService = {
  get: Service<AliasTxsServiceGetRequest & WithMoneyFormat, Maybe<AliasTx>>;
  mget: Service<
    AliasTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<AliasTx>[]
  >;
  search: Service<
    AliasTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<AliasTx>
  >;
};
