import { compose, evolve } from 'ramda';
import { renameKeys } from 'ramda-adjunct';
import { transformTxInfo } from '../../_common/transformTxInfo';
import { EthereumLikeTxPayload } from './types';

const functionNameToPayload = (functionName: string | null): EthereumLikeTxPayload =>
  functionName === null
    ? { type: 'transfer' }
    : {
        type: 'invocation',
        call: {
          function: functionName,
        },
      };

const bufferToETHHex = (b: Buffer) => '0x' + b.toString('hex');

export default compose(
  transformTxInfo,
  evolve({
    payload: functionNameToPayload,
    bytes: bufferToETHHex,
  }) as any,
  renameKeys({ function_name: 'payload' })
);
