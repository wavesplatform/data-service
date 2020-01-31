import * as createParser from '@waves/parse-json-bignumber';
import { BigNumber } from '@waves/data-entities';
import { toBigNumber } from './bigNumber';
import { LSNFormat } from '../http/types';

const parser = createParser<BigNumber>({
  strict: false,
  isInstance: (bn: any): bn is BigNumber => BigNumber.isBigNumber(bn),
  stringify: (bn: BigNumber) => bn.toFixed(),
  parse: toBigNumber,
});

export const parse = parser.parse;
export const stringify = (lsnFormat: LSNFormat) =>
  createParser<BigNumber>({
    strict: false,
    isInstance: (bn: any): bn is BigNumber => BigNumber.isBigNumber(bn),
    stringify: (bn: BigNumber) =>
      lsnFormat === LSNFormat.Number ? bn.toFixed() : `"${bn.toString()}"`,
    parse: toBigNumber,
  }).stringify as (data: any) => string | undefined;
