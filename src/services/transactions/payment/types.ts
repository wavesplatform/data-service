import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
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
    PaymentTxsServiceGetRequest & WithMoneyFormat,
    Maybe<PaymentTx>
  >;
  mget: Service<
    PaymentTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<PaymentTx>[]
  >;
  search: Service<
    PaymentTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<PaymentTx>
  >;
};
