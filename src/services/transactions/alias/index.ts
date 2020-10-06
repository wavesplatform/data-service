import { AssetsService } from 'services/assets';
import { createService } from '../_common/createService';
import { modifyFeeDecimals } from '../_common/modifyFeeDecimals';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { AliasTxsRepo } from './repo/types';
import { AliasTxsService } from './types';

export default (
  repo: AliasTxsRepo,
  assetsService: AssetsService
): AliasTxsService =>
  withDecimalsTransformation(
    modifyFeeDecimals(assetsService),
    createService(repo)
  );
