import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyDecimals } from './modifyDecimals';
import { BurnTxsRepo } from './repo/types';
import { BurnTxsService } from './types';

export default (
  repo: BurnTxsRepo,
  assetsService: AssetsService
): BurnTxsService =>
  withDecimalsProcessing(modifyDecimals(assetsService), createService(repo));
