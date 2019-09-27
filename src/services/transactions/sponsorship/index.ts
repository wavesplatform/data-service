import { propEq, compose } from 'ramda';
import { BigNumber } from '@waves/data-entities';

import { CommonServiceDependencies } from '../..';
import {
  transaction,
  TransactionInfo,
  Transaction,
  Service,
} from '../../../types';
import { WithLimit, WithSortOrder } from '../../_common';
import { RequestWithCursor } from '../../_common/pagination';
import { getByIdPreset } from '../../presets/pg/getById';
import { mgetByIdsPreset } from '../../presets/pg/mgetByIds';
import { searchWithPaginationPreset } from '../../presets/pg/searchWithPagination';
import { inputGet } from '../../presets/pg/getById/inputSchema';
import { inputMget } from '../../presets/pg/mgetByIds/inputSchema';

import { RawTx, CommonFilters } from '../_common/types';

import {
  result as resultSchema,
  inputSearch as inputSearchSchema,
} from './schema';
import * as sql from './sql';
import * as transformTxInfo from './transformTxInfo';

type SponsorshipTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    assetId: String;
  }>;

type SponsorshipTxDbResponse = RawTx & {
  asset_id: string;
  min_sponsored_asset_fee: BigNumber;
};

export type SponsorshipTxsService = Service<
  string,
  string[],
  SponsorshipTxsSearchRequest,
  Transaction
>;

export default ({
  drivers: { pg },
  emitEvent,
}: CommonServiceDependencies): SponsorshipTxsService => {
  return {
    get: getByIdPreset<
      string,
      SponsorshipTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.sponsorship.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset<
      string,
      SponsorshipTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.sponsorship.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: transaction,
      resultSchema,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    search: searchWithPaginationPreset<
      SponsorshipTxsSearchRequest,
      SponsorshipTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.sponsorship.search',
      sql: sql.search,
      inputSchema: inputSearchSchema,
      resultSchema,
      transformResult: compose(
        transaction,
        transformTxInfo
      ),
    })({ pg, emitEvent }),
  };
};
