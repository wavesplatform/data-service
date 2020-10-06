import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
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
    GenesisTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<GenesisTx>
  >;
  mget: Service<
    GenesisTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<GenesisTx>[]
  >;
  search: Service<
    GenesisTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<GenesisTx>
  >;
};
