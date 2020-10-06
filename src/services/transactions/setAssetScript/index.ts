import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyFeeDecimals } from '../_common/modifyFeeDecimals';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { SetAssetScriptTxsRepo } from './repo/types';
import { SetAssetScriptTxsService } from './types';

export default (
  repo: SetAssetScriptTxsRepo,
  assetsService: AssetsService
): SetAssetScriptTxsService =>
  withDecimalsTransformation(
    modifyFeeDecimals(assetsService),
    createService(repo)
  );
