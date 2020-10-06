import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
import {
  PaymentTxsGetRequest,
  PaymentTxsMgetRequest,
  PaymentTxsSearchRequest,
  PaymentTx,
} from './repo/types';

type PaymentTxsServiceGetRequest = ServiceGetRequest<PaymentTxsGetRequest>;
type PaymentTxsServiceMgetRequest = ServiceMgetRequest<PaymentTxsMgetRequest>;
type PaymentTxsServiceSearchRequest = PaymentTxsSearchRequest;

export type PaymentTxsService = {
  get: Service<
    PaymentTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<PaymentTx>
  >;
  mget: Service<
    PaymentTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<PaymentTx>[]
  >;
  search: Service<
    PaymentTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<PaymentTx>
  >;
};
