import { AssetsService } from '../../assets';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { TransferTxsRepo } from './repo/types';
import { TransferTxsService } from './types';
import { createService } from '../_common/createService';
import { modifyDecimals } from './modifyDecimals';

export default (
  repo: TransferTxsRepo,
  assetsService: AssetsService
): TransferTxsService =>
  withDecimalsTransformation(
    modifyDecimals(assetsService),
    createService(repo)
  );
