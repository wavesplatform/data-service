import { compose, isNil, reject } from 'ramda';
import { renameKeys } from 'ramda-adjunct';
import * as transformTxInfo from '../_common/transformTxInfo';

export default compose(
  transformTxInfo,
  renameKeys({
    dapp: 'dApp',
  }),
  reject(isNil)
);
