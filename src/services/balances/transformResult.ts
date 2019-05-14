import { Balance } from '../../protobuf/balances';
import { BalanceInfo } from '../../types/index';
import base58 from '../../utils/base58';

export const transformResult = (d: Balance): BalanceInfo => {
  return {
    ...d,
    address: base58.encode(d.address),
    amount: d.amount
      ? {
          wavesAmount:
            d.amount.assetAmount === null && d.amount.wavesAmount
              ? d.amount.wavesAmount.toNumber()
              : undefined,
          assetAmount:
            d.amount.assetAmount &&
            d.amount.assetAmount.amount &&
            d.amount.assetAmount.assetId
              ? {
                  amount: d.amount.assetAmount.amount.toNumber(),
                  amountId: base58.encode(d.amount.assetAmount.assetId),
                }
              : undefined,
        }
      : null,
  };
};
