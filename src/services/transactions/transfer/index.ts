import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { TransferTxsRepo } from './repo/types';
import { TransferTxsService } from './types';
import { createService } from '../_common/createService';
import { modifyDecimals } from './modifyDecimals';

export default (
  repo: TransferTxsRepo,
  assetsService: AssetsService
): TransferTxsService =>
  withDecimalsProcessing(modifyDecimals(assetsService), createService(repo));
