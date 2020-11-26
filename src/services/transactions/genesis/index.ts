import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyDecimals } from './modifyDecimals';
import { GenesisTxsRepo } from './repo/types';
import { GenesisTxsService } from './types';

export default (
  repo: GenesisTxsRepo,
  assetsService: AssetsService
): GenesisTxsService =>
  withDecimalsProcessing(modifyDecimals(assetsService), createService(repo));
