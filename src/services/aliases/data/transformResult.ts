import { AliasInfo } from '../../../types';

export type AliasDbResponse = {
  alias: string;
  address: string;
  duplicates: number;
};

export const transformDbResponse = (result: AliasDbResponse): AliasInfo => ({
  alias: result.alias,
  address: result.duplicates > 1 ? null : result.address,
});
