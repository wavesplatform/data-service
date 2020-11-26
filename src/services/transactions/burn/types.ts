import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
import {
  BurnTx,
  BurnTxsGetRequest,
  BurnTxsMgetRequest,
  BurnTxsSearchRequest,
} from './repo/types';

type BurnTxsServiceGetRequest = ServiceGetRequest<BurnTxsGetRequest>;
type BurnTxsServiceMgetRequest = ServiceMgetRequest<BurnTxsMgetRequest>;
type BurnTxsServiceSearchRequest = BurnTxsSearchRequest;

export type BurnTxsService = {
  get: Service<BurnTxsServiceGetRequest & WithMoneyFormat, Maybe<BurnTx>>;
  mget: Service<
    BurnTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<BurnTx>[]
  >;
  search: Service<
    BurnTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<BurnTx>
  >;
};
