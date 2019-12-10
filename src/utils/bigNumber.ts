import { BigNumber } from '@waves/data-entities';
export const toBigNumber = (x: BigNumber.Value): BigNumber => new BigNumber(x);
