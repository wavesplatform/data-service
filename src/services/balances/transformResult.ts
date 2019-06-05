import { Balance } from '../../protobuf/balances';
import { BalanceInfo } from '../../types/index';
import base58 from '../../utils/base58';

export const transformResult = (d: Balance): BalanceInfo => {
  return {
    ...d,
    address: base58.encode(d.address),
    amount:
      d.amount && d.amount.amount
        ? {
            wavesAmount:
              d.amount.assetId === null
                ? d.amount.amount.toNumber()
                : undefined,
            assetAmount:
              d.amount.assetId && d.amount.assetId.issuedAsset
                ? {
                    amount: d.amount.amount.toNumber(),
                    assetId: base58.encode(d.amount.assetId.issuedAsset),
                  }
                : undefined,
          }
        : null,
  };
};
