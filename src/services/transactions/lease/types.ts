import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
import {
  LeaseTxsGetRequest,
  LeaseTxsMgetRequest,
  LeaseTxsSearchRequest,
  LeaseTx,
} from './repo/types';

type LeaseTxsServiceGetRequest = ServiceGetRequest<LeaseTxsGetRequest>;
type LeaseTxsServiceMgetRequest = ServiceMgetRequest<LeaseTxsMgetRequest>;
type LeaseTxsServiceSearchRequest = LeaseTxsSearchRequest & WithDecimalsFormat;

export type LeaseTxsService = {
  get: Service<
    LeaseTxsServiceGetRequest & WithDecimalsFormat & WithDecimalsFormat,
    Maybe<LeaseTx>
  >;
  mget: Service<
    LeaseTxsServiceMgetRequest & WithDecimalsFormat & WithDecimalsFormat,
    Maybe<LeaseTx>[]
  >;
  search: Service<
    LeaseTxsServiceSearchRequest & WithDecimalsFormat & WithDecimalsFormat,
    SearchedItems<LeaseTx>
  >;
};
