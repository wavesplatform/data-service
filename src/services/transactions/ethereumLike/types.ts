import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
import {
  EthereumLikeTxsGetRequest,
  EthereumLikeTxsMgetRequest,
  EthereumLikeTxsSearchRequest,
  EthereumLikeTx,
} from './repo/types';

type EthereumLikeTxsServiceGetRequest = ServiceGetRequest<EthereumLikeTxsGetRequest>;
type EthereumLikeTxsServiceMgetRequest = ServiceMgetRequest<EthereumLikeTxsMgetRequest>;
type EthereumLikeTxsServiceSearchRequest = EthereumLikeTxsSearchRequest;

export type EthereumLikeTxsService = {
  get: Service<EthereumLikeTxsServiceGetRequest & WithMoneyFormat, Maybe<EthereumLikeTx>>;
  mget: Service<
    EthereumLikeTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<EthereumLikeTx>[]
  >;
  search: Service<
    EthereumLikeTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<EthereumLikeTx>
  >;
};
