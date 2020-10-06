import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
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
    ExchangeTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<ExchangeTx>
  >;
  mget: Service<
    ExchangeTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<ExchangeTx>[]
  >;
  search: Service<
    ExchangeTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<ExchangeTx>
  >;
};
