import { compose } from 'ramda';
import { list, balance, Balance } from '../../types';
import { Balance as PBBalance } from '../../protobuf/balances_pb';
import { EmitEvent } from '../_common/createResolver/types';
import { searchPreset } from '../presets/common/search';
import { getBalances } from './data';

import { inputSearch, output } from './schema';
import base58 from '../../utils/base58';

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
          (l: PBBalance.AsObject[]) =>
            l.map(b =>
              balance({
                address: base58.encode(
                  Buffer.from(b.address.toString(), 'base64')
                ),
                amount: b.amount
                  ? b.amount.assetAmount
                    ? {
                        assetAmount: {
                          assetId: base58.encode(
                            Buffer.from(
                              b.amount.assetAmount.assetId.toString(),
                              'base64'
                            )
                          ),
                          amount: b.amount.assetAmount.amount,
                        },
                      }
                    : {
                        wavesAmount: b.amount.wavesAmount,
                      }
                  : null,
              })
            )
        )(res),
    })({ db: drivers.balances, emitEvent: emitEvent }),
  };
};
