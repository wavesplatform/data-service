import { renameKeys } from 'ramda-adjunct';

import { CommonTransactionInfo } from '../../../../types';

export const transformTxInfo = renameKeys<CommonTransactionInfo>({
  uid: 'txUid',
  tx_type: 'type',
  time_stamp: 'timestamp',
});
