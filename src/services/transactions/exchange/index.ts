import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { ExchangeTxsRepo } from './repo/types';
import { ExchangeTxsService } from './types';
import { modifyDecimals } from './modifyDecimals';

export default (
  repo: ExchangeTxsRepo,
  assetsService: AssetsService
): ExchangeTxsService =>
  withDecimalsProcessing(modifyDecimals(assetsService), createService(repo));
