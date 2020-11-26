import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyFeeDecimals } from '../_common/modifyFeeDecimals';
import { AliasTxsRepo } from './repo/types';
import { AliasTxsService } from './types';

export default (
  repo: AliasTxsRepo,
  assetsService: AssetsService
): AliasTxsService =>
  withDecimalsProcessing(modifyFeeDecimals(assetsService), createService(repo));
