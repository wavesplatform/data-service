import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyFeeDecimals } from '../_common/modifyFeeDecimals';
import { SetAssetScriptTxsRepo } from './repo/types';
import { SetAssetScriptTxsService } from './types';

export default (
  repo: SetAssetScriptTxsRepo,
  assetsService: AssetsService
): SetAssetScriptTxsService =>
  withDecimalsProcessing(modifyFeeDecimals(assetsService), createService(repo));
