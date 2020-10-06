import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { modifyDecimals } from './modifyDecimals';
import { withDecimalsTransformation } from '../_common/withDecimalsTransformation';
import { PaymentTxsRepo } from './repo/types';
import { PaymentTxsService } from './types';

export default (
  repo: PaymentTxsRepo,
  assetsService: AssetsService
): PaymentTxsService =>
  withDecimalsTransformation(
    modifyDecimals(assetsService),
    createService(repo)
  );
