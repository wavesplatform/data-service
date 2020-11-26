import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyDecimals } from './modifyDecimals';
import { InvokeScriptTxsRepo } from './repo/types';
import { InvokeScriptTxsService } from './types';

export default (
  repo: InvokeScriptTxsRepo,
  assetsService: AssetsService
): InvokeScriptTxsService =>
  withDecimalsProcessing(modifyDecimals(assetsService), createService(repo));
