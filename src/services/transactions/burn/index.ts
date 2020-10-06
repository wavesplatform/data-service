import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { modifyDecimals } from './modifyDecimals';
import { BurnTxsRepo } from './repo/types';
import { BurnTxsService } from './types';

export default (
  repo: BurnTxsRepo,
  assetsService: AssetsService
): BurnTxsService =>
  withDecimalsTransformation(
    modifyDecimals(assetsService),
    createService(repo)
  );
