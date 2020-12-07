import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
import {
  ExchangeTxsGetRequest,
  ExchangeTxsMgetRequest,
  ExchangeTxsSearchRequest,
  ExchangeTx,
} from './repo/types';

type ExchangeTxsServiceGetRequest = ServiceGetRequest<ExchangeTxsGetRequest>;
type ExchangeTxsServiceMgetRequest = ServiceMgetRequest<ExchangeTxsMgetRequest>;
type ExchangeTxsServiceSearchRequest = ExchangeTxsSearchRequest;

export type ExchangeTxsService = {
  get: Service<
    ExchangeTxsServiceGetRequest & WithMoneyFormat,
    Maybe<ExchangeTx>
  >;
  mget: Service<
    ExchangeTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<ExchangeTx>[]
  >;
  search: Service<
    ExchangeTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<ExchangeTx>
  >;
};
