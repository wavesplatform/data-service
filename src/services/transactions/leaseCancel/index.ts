import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyFeeDecimals } from '../_common/modifyFeeDecimals';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { LeaseCancelTxsRepo } from './repo/types';
import { LeaseCancelTxsService } from './types';

export default (
  repo: LeaseCancelTxsRepo,
  assetsService: AssetsService
): LeaseCancelTxsService =>
  withDecimalsTransformation(
    modifyFeeDecimals(assetsService),
    createService(repo)
  );
