import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { ReissueTxsRepo } from './repo/types';
import { ReissueTxsService } from './types';
import { modifyDecimals } from './modifyDecimals';

export default (
  repo: ReissueTxsRepo,
  assetsService: AssetsService
): ReissueTxsService =>
  withDecimalsTransformation(
    modifyDecimals(assetsService),
    createService(repo)
  );
