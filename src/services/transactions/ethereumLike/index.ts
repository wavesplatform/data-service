import { withDecimalsProcessing } from '../../_common/transformation/withDecimalsProcessing';
import { modifyFeeDecimals } from '../_common/modifyFeeDecimals';
import { EthereumLikeTxsRepo } from './repo/types';
import { AssetsService } from '../../assets';
import { createService } from '../_common/createService';
import { EthereumLikeTxsService } from './types';

export default (
  repo: EthereumLikeTxsRepo,
  assetsService: AssetsService
): EthereumLikeTxsService =>
  withDecimalsProcessing(modifyFeeDecimals(assetsService), createService(repo));
