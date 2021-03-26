import { fromNullable, Maybe } from 'folktale/maybe';
import { head, propEq } from 'ramda';

import { addMeta } from '../../../../../errorHandling';
import { PgDriver } from '../../../../../db/driver';
import { matchRequestsResults } from '../../../../../utils/db';
import { Cursor } from '../../../_common/cursor';

import { MassTransferTxsSearchRequest, RawMassTransferTx } from '../types';
import sql from './sql';
import { transformResult } from './transformResult';
import { DbRawMassTransferTx } from './types';

export default {
  get: (pg: PgDriver) => (id: string) =>
    pg
      .any<DbRawMassTransferTx>(sql.get(id))
      .map(transformResult)
      .map<RawMassTransferTx>(head)
      .map(fromNullable)
      .mapRejected(
        addMeta({
          request: 'transactions.invokeScript.get',
          params: id,
        })
      ),

  mget: (pg: PgDriver) => (ids: string[]) =>
    pg
      .any<DbRawMassTransferTx>(sql.mget(ids))
      .map(transformResult)
      .map<Maybe<RawMassTransferTx>[]>(matchRequestsResults(propEq('id'), ids))
      .mapRejected(
        addMeta({
          request: 'transactions.invokeScript.mget',
          params: ids,
        })
      ),

  search: (pg: PgDriver) => (filters: MassTransferTxsSearchRequest<Cursor>) =>
    pg
      .any<DbRawMassTransferTx>(sql.search(filters))
      .map(transformResult)
      .mapRejected(
        addMeta({
          request: 'transactions.massTransfer.search',
          params: filters,
        })
      ),
};
