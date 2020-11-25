import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
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
  get: Service<IssueTxsServiceGetRequest & WithMoneyFormat, Maybe<IssueTx>>;
  mget: Service<
    IssueTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<IssueTx>[]
  >;
  search: Service<
    IssueTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<IssueTx>
  >;
};
