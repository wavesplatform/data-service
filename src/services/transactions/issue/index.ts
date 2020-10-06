import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { modifyDecimals } from './modifyDecimals';
import { IssueTxsRepo } from './repo/types';
import { IssueTxsService } from './types';

export default (
  repo: IssueTxsRepo,
  assetsService: AssetsService
): IssueTxsService =>
  withDecimalsTransformation(
    modifyDecimals(assetsService),
    createService(repo)
  );
