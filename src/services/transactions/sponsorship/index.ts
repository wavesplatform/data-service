import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyDecimals } from './modifyDecimals';
import { SponsorshipTxsRepo } from './repo/types';
import { SponsorshipTxsService } from './types';

export default (
  repo: SponsorshipTxsRepo,
  assetsService: AssetsService
): SponsorshipTxsService =>
  withDecimalsProcessing(modifyDecimals(assetsService), createService(repo));
