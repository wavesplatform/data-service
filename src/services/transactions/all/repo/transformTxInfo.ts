import { renameKeys } from 'ramda-adjunct';

import { TransactionInfo } from '../../../../types';
import { TxDbResponse } from './types';

export const transformTxInfo = (renameKeys({
  tx_type: 'type',
  time_stamp: 'timestamp',
}) as any) as (raw: TxDbResponse) => TransactionInfo;
