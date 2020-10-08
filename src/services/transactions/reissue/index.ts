import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { ReissueTxsRepo } from './repo/types';
import { ReissueTxsService } from './types';
import { modifyDecimals } from './modifyDecimals';

export default (
  repo: ReissueTxsRepo,
  assetsService: AssetsService
): ReissueTxsService =>
  withDecimalsProcessing(modifyDecimals(assetsService), createService(repo));
