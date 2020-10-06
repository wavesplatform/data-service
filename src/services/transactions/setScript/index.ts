import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyFeeDecimals } from '../_common/modifyFeeDecimals';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { SetScriptTxsRepo } from './repo/types';
import { SetScriptTxsService } from './types';

export default (
  repo: SetScriptTxsRepo,
  assetsService: AssetsService
): SetScriptTxsService =>
  withDecimalsTransformation(
    modifyFeeDecimals(assetsService),
    createService(repo)
  );
