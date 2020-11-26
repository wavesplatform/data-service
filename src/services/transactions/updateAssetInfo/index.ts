import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { modifyFeeDecimals } from '../_common/modifyFeeDecimals';
import { UpdateAssetInfoTxsRepo } from './repo/types';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { UpdateAssetInfoTxsService } from './types';

export default (
  repo: UpdateAssetInfoTxsRepo,
  assetsService: AssetsService
): UpdateAssetInfoTxsService =>
  withDecimalsProcessing(modifyFeeDecimals(assetsService), createService(repo));
