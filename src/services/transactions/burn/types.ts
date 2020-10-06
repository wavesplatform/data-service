import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
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
  get: Service<BurnTxsServiceGetRequest & WithDecimalsFormat, Maybe<BurnTx>>;
  mget: Service<
    BurnTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<BurnTx>[]
  >;
  search: Service<
    BurnTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<BurnTx>
  >;
};
