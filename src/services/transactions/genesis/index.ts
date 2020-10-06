import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { modifyDecimals } from './modifyDecimals';
import { GenesisTxsRepo } from './repo/types';
import { GenesisTxsService } from './types';

export default (
  repo: GenesisTxsRepo,
  assetsService: AssetsService
): GenesisTxsService =>
  withDecimalsTransformation(
    modifyDecimals(assetsService),
    createService(repo)
  );
