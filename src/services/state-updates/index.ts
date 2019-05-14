import { Maybe, of } from 'folktale/maybe';
import * as grpc from 'grpc';
import { EmitEvent } from '../_common/createResolver/types';
import {
  StateUpdate,
  stateUpdate,
  list,
  balance,
  dataEntry,
} from '../../types';
import { getPreset } from '../presets/common/get';
import { mgetPreset } from '../presets/common/mget';
import { inputGet, inputMget, output } from './schema';
import { getStateUpdates, mgetStateUpdates } from './data';
import { transformResult as transformBalanceResult } from '../balances/transformResult';
import { transformResult as transformDataEntriesResult } from '../data-entries/transformResult';

const transformResult = (su: StateUpdate) => ({
  balances: list(su.balances.map(transformBalanceResult).map(balance)),
  dataEntries: list(
    su.dataEntries.map(transformDataEntriesResult).map(dataEntry)
  ),
});

export default ({
  drivers,
  emitEvent,
}: {
  drivers: {
    balances: grpc.Client;
    dataEntries: grpc.Client;
  };
  emitEvent: EmitEvent;
}) => {
  return {
    get: getPreset({
      name: 'dataEntries.get',
      getData: getStateUpdates({
        balances: drivers.balances,
        dataEntries: drivers.dataEntries,
      }),
      inputSchema: inputGet,
      resultSchema: output,
      transformResult: (res: Maybe<StateUpdate>) =>
        of(stateUpdate(res.map(transformResult).getOrElse(null))),
    })({ emitEvent: emitEvent }),
    mget: mgetPreset({
      name: 'dataEntries.mget',
      getData: mgetStateUpdates({
        balances: drivers.balances,
        dataEntries: drivers.dataEntries,
      }),
      inputSchema: inputMget,
      resultSchema: output,
      resultTypeFactory: stateUpdate,
      transformResult,
    })({ emitEvent: emitEvent }),
  };
};
