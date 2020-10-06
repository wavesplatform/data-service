import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { modifyDecimals } from './modifyDecimals';
import { LeaseTxsRepo } from './repo/types';
import { LeaseTxsService } from './types';

export default (
  repo: LeaseTxsRepo,
  assetsService: AssetsService
): LeaseTxsService =>
  withDecimalsTransformation(
    modifyDecimals(assetsService),
    createService(repo)
  );
