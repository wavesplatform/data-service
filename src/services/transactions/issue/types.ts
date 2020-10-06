import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
import {
  IssueTx,
  IssueTxsGetRequest,
  IssueTxsMgetRequest,
  IssueTxsSearchRequest,
} from './repo/types';

type IssueTxsServiceGetRequest = ServiceGetRequest<IssueTxsGetRequest>;
type IssueTxsServiceMgetRequest = ServiceMgetRequest<IssueTxsMgetRequest>;
type IssueTxsServiceSearchRequest = IssueTxsSearchRequest;

export type IssueTxsService = {
  get: Service<IssueTxsServiceGetRequest & WithDecimalsFormat, Maybe<IssueTx>>;
  mget: Service<
    IssueTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<IssueTx>[]
  >;
  search: Service<
    IssueTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<IssueTx>
  >;
};
