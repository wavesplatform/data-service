import * as createParser from '@waves/parse-json-bignumber';
import { BigNumber } from '@waves/data-entities';
import { toBigNumber } from './bigNumber';

const parser = createParser<BigNumber>({
  strict: false,
  isInstance: (bn: any): bn is BigNumber => BigNumber.isBigNumber(bn),
  stringify: (bn: BigNumber) => bn.toFixed(),
  parse: toBigNumber,
});

export const parse = parser.parse;
export const stringify = parser.stringify;
