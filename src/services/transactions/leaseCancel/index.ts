import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyFeeDecimals } from '../_common/modifyFeeDecimals';
import { LeaseCancelTxsRepo } from './repo/types';
import { LeaseCancelTxsService } from './types';

export default (
  repo: LeaseCancelTxsRepo,
  assetsService: AssetsService
): LeaseCancelTxsService =>
  withDecimalsProcessing(modifyFeeDecimals(assetsService), createService(repo));
