import { compose } from 'ramda';
import { list, balance, Balance } from '../../types';
import { Balance as PBBalance } from '../../protobuf/balances_pb';
import { EmitEvent } from '../_common/createResolver/types';
import { searchPreset } from '../presets/common/search';
import { getBalances } from './data';

import { inputSearch, output } from './schema';

export default ({
  drivers,
  emitEvent,
}: {
  drivers: any;
  emitEvent: EmitEvent;
}) => {
  return {
    search: searchPreset({
      name: 'balances.search',
      getData: getBalances,
      inputSchema: inputSearch,
      resultSchema: output,
      transformResult: res =>
        compose(
          l => list<Balance>(l),
          (l: PBBalance.AsObject[]) => l.map(x => balance(x))
        )(res),
    })({ db: drivers.balances, emitEvent: emitEvent }),
  };
};
