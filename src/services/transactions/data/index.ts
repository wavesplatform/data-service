import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyFeeDecimals } from '../_common/modifyFeeDecimals';
import { DataTxsRepo } from './repo/types';
import { DataTxsService } from './types';

export default (
  repo: DataTxsRepo,
  assetsService: AssetsService
): DataTxsService =>
  withDecimalsProcessing(modifyFeeDecimals(assetsService), createService(repo));
