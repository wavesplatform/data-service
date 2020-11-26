import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyDecimals } from './modifyDecimals';
import { IssueTxsRepo } from './repo/types';
import { IssueTxsService } from './types';

export default (
  repo: IssueTxsRepo,
  assetsService: AssetsService
): IssueTxsService =>
  withDecimalsProcessing(modifyDecimals(assetsService), createService(repo));
