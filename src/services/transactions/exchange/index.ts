import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { ExchangeTxsRepo } from './repo/types';
import { ExchangeTxsService } from './types';
import { modifyDecimals } from './modifyDecimals';

export default (
  repo: ExchangeTxsRepo,
  assetsService: AssetsService
): ExchangeTxsService =>
  withDecimalsTransformation(
    modifyDecimals(assetsService),
    createService(repo)
  );
