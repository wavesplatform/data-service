import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { modifyDecimals } from './modifyDecimals';
import { MassTransferTxsRepo } from './repo/types';
import { MassTransferTxsService } from './types';

export default (
  repo: MassTransferTxsRepo,
  assetsService: AssetsService
): MassTransferTxsService =>
  withDecimalsTransformation(
    modifyDecimals(assetsService),
    createService(repo)
  );
