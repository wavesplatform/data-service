import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyFeeDecimals } from '../_common/modifyFeeDecimals';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { DataTxsRepo } from './repo/types';
import { DataTxsService } from './types';

export default (
  repo: DataTxsRepo,
  assetsService: AssetsService
): DataTxsService =>
  withDecimalsTransformation(
    modifyFeeDecimals(assetsService),
    createService(repo)
  );
