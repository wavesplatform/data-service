import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyFeeDecimals } from '../_common/modifyFeeDecimals';
import { SetScriptTxsRepo } from './repo/types';
import { SetScriptTxsService } from './types';

export default (
  repo: SetScriptTxsRepo,
  assetsService: AssetsService
): SetScriptTxsService =>
  withDecimalsProcessing(modifyFeeDecimals(assetsService), createService(repo));
