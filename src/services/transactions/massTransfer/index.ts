import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyDecimals } from './modifyDecimals';
import { MassTransferTxsRepo } from './repo/types';
import { MassTransferTxsService } from './types';

export default (
  repo: MassTransferTxsRepo,
  assetsService: AssetsService
): MassTransferTxsService =>
  withDecimalsProcessing(modifyDecimals(assetsService), createService(repo));
