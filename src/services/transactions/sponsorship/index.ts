import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { modifyDecimals } from './modifyDecimals';
import { SponsorshipTxsRepo } from './repo/types';
import { SponsorshipTxsService } from './types';

export default (
  repo: SponsorshipTxsRepo,
  assetsService: AssetsService
): SponsorshipTxsService =>
  withDecimalsTransformation(
    modifyDecimals(assetsService),
    createService(repo)
  );
