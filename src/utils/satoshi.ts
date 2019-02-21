import { BigNumber } from '@waves/data-entities';
import { curry } from 'ramda';

export const convertPrice = curry(
  (aDecimals: number, pDecimals: number, price: BigNumber) =>
    price.multipliedBy(new BigNumber(10).pow(-8 + aDecimals - pDecimals))
);

export const convertAmount = curry((decimals: number, amount: BigNumber) =>
  amount.multipliedBy(new BigNumber(10).pow(-decimals))
);
