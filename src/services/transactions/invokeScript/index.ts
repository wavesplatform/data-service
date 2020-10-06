import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { modifyDecimals } from './modifyDecimals';
import { InvokeScriptTxsRepo } from './repo/types';
import { InvokeScriptTxsService } from './types';

export default (
  repo: InvokeScriptTxsRepo,
  assetsService: AssetsService
): InvokeScriptTxsService =>
  withDecimalsTransformation(
    modifyDecimals(assetsService),
    createService(repo)
  );
