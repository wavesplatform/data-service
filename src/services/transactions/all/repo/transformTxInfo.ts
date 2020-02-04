import { renameKeys } from 'ramda-adjunct';

import { TransactionInfo } from '../../../../types';

export const transformTxInfo = renameKeys<TransactionInfo>({
  tx_type: 'type',
  time_stamp: 'timestamp',
});
