import * as Maybe from 'folktale/maybe';
import { head, propEq } from 'ramda';
import { PgDriver } from '../../../../../db/driver';
import { addMeta } from '../../../../../errorHandling';
import { matchRequestsResults } from '../../../../../utils/db/index';
import { Cursor } from '../../../_common/cursor';
import {
  DataTxsGetRequest,
  DataTxsMgetRequest,
  DataTxsSearchRequest,
  DataTxDbResponse,
} from '../types';
import * as transformResult from './transformResult';
import sql from './sql';

export const pg = {
  get: (pg: PgDriver) => (id: DataTxsGetRequest) =>
    pg
      .any(sql.get(id))
      .map(transformResult)
      .map<DataTxDbResponse>(head)
      .map(Maybe.fromNullable)
      .mapRejected(addMeta({ request: 'transactions.data.get', params: id })),

  mget: (pg: PgDriver) => (ids: DataTxsMgetRequest) =>
    pg
      .any(sql.mget(ids))
      .map(transformResult)
      .map<Maybe.Maybe<DataTxDbResponse>[]>(
        matchRequestsResults(propEq('id'), ids)
      )
      .mapRejected(addMeta({ request: 'transactions.data.mget', params: ids })),

  search: (pg: PgDriver) => (filters: DataTxsSearchRequest<Cursor>) =>
    pg
      .any(sql.search(filters))
      .map<DataTxDbResponse[]>(transformResult)
      .mapRejected(
        addMeta({
          request: 'transactions.data.search',
          params: filters,
        })
      ),
};
