import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyDecimals } from './modifyDecimals';
import { PaymentTxsRepo } from './repo/types';
import { PaymentTxsService } from './types';

export default (
  repo: PaymentTxsRepo,
  assetsService: AssetsService
): PaymentTxsService =>
  withDecimalsProcessing(modifyDecimals(assetsService), createService(repo));
