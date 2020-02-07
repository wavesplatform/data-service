import { renameKeys } from 'ramda-adjunct';

import { CommonTransactionInfo } from '../../../../types';

export const transformTxInfo = renameKeys<CommonTransactionInfo>({
  tx_type: 'type',
  time_stamp: 'timestamp',
});
