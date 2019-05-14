import { compose } from 'ramda';
import {
  list,
  BalanceInfo,
  Balance as BalanceType,
  balance,
} from '../../types';
import { Balance } from '../../protobuf/balances';
import { EmitEvent } from '../_common/createResolver/types';
import { searchPreset } from '../presets/common/search';
import { getBalances } from './data';

import { inputSearch, output } from './schema';
import { transformResult } from './transformResult';
import * as grpc from 'grpc';

export default ({
  drivers,
  emitEvent,
}: {
  drivers: { balances: grpc.Client };
  emitEvent: EmitEvent;
}) => {
  return {
    search: searchPreset({
      name: 'balances.search',
      getData: getBalances(drivers.balances),
      inputSchema: inputSearch,
      resultSchema: output,
      transformResult: (res: Balance[]) =>
        compose(
          l => list<BalanceType>(l),
          (l: BalanceInfo[]) => l.map(d => balance(d)),
          (l: Balance[]) => l.map(d => transformResult(d))
        )(res),
    })({ emitEvent: emitEvent }),
  };
};
