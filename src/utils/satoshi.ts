import { BigNumber } from '@waves/data-entities';
import { curry } from 'ramda';

export const convertPrice = curry(
  (aDecimals: number, pDecimals: number, price: BigNumber): BigNumber =>
    price.shiftedBy(-8 + aDecimals - pDecimals)
);

export const convertAmount = curry(
  (decimals: number, amount: BigNumber): BigNumber =>
    amount.shiftedBy(-decimals)
);
