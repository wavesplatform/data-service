import { compose } from 'ramda';
import { renameKeys } from 'ramda-adjunct';

import { transformTxInfo } from '../_common/transformTxInfo';

export default compose(
  transformTxInfo,
  renameKeys({
    asset_id: 'assetId',
  })
);
