import * as grpc from 'grpc';

import { Task, waitAll } from 'folktale/concurrency/task';
import { Maybe, of } from 'folktale/maybe';
import { DbError } from '../../errorHandling';
import { StateUpdate } from '../../types';
import { getBalances, BalancesRequest } from '../balances';
import { getDataEntries, DataEntriesRequest } from '../data-entries';
import { Balance } from '../../protobuf/balances';
import { DataEntryResponse } from '../../protobuf/data-entries';

export const getStateUpdates = ({
  balances,
  dataEntries,
}: {
  balances: grpc.Client;
  dataEntries: grpc.Client;
}) => (id: string): Task<DbError, Maybe<StateUpdate>> => {
  // balances request
  const balancesRequest: BalancesRequest = {
    transaction_id: id,
    limit: 100,
  };

  // data-entries request
  const dataEntriesRequest: DataEntriesRequest = {
    transaction_id: id,
    limit: 100,
  };

  return waitAll<DbError, Balance[], DbError, DataEntryResponse[]>([
    getBalances(balances)(balancesRequest),
    getDataEntries(dataEntries)(dataEntriesRequest),
  ]).map(([bs, des]) => of({ balances: bs, dataEntries: des }));
};

export const mgetStateUpdates = ({
  balances,
  dataEntries,
}: {
  balances: grpc.Client;
  dataEntries: grpc.Client;
}) => (ids: string[]): Task<DbError, Maybe<StateUpdate>[]> => {
  return waitAll(ids.map(id => getStateUpdates({ balances, dataEntries })(id)));
};
