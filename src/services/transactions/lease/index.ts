import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyDecimals } from './modifyDecimals';
import { LeaseTxsRepo } from './repo/types';
import { LeaseTxsService } from './types';

export default (
  repo: LeaseTxsRepo,
  assetsService: AssetsService
): LeaseTxsService =>
  withDecimalsProcessing(modifyDecimals(assetsService), createService(repo));
