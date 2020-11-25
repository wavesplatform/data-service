import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
import {
  GenesisTx,
  GenesisTxsGetRequest,
  GenesisTxsMgetRequest,
  GenesisTxsSearchRequest,
} from './repo/types';

type GenesisTxsServiceGetRequest = ServiceGetRequest<GenesisTxsGetRequest>;
type GenesisTxsServiceMgetRequest = ServiceMgetRequest<GenesisTxsMgetRequest>;
type GenesisTxsServiceSearchRequest = GenesisTxsSearchRequest;

export type GenesisTxsService = {
  get: Service<
    GenesisTxsServiceGetRequest & WithMoneyFormat,
    Maybe<GenesisTx>
  >;
  mget: Service<
    GenesisTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<GenesisTx>[]
  >;
  search: Service<
    GenesisTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<GenesisTx>
  >;
};
