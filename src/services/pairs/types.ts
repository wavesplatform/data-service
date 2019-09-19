import { AssetIdsPair } from '../../types';

export type MgetRequest = {
  pairs: AssetIdsPair[];
  matcher: string;
};
