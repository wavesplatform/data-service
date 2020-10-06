import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
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
  get: Service<AliasTxsServiceGetRequest & WithDecimalsFormat, Maybe<AliasTx>>;
  mget: Service<
    AliasTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<AliasTx>[]
  >;
  search: Service<
    AliasTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<AliasTx>
  >;
};
