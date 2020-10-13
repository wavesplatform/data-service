import { propEq } from 'ramda';

import { AliasInfo, Repo, XOR } from '../../../types';

import { CommonRepoDependencies } from '../..';
import { WithLimit, WithSortOrder } from '../../_common';
import { RequestWithCursor } from '../../_common/pagination';
import { getByIdPreset } from '../../_common/presets/pg/getById';
import { mgetByIdsPreset } from '../../_common/presets/pg/mgetByIds';
import { searchPreset } from '../../_common/presets/pg/search';

import { serialize, deserialize, Cursor } from './cursor';
import sql from './data/sql';
import { transformDbResponse, AliasDbResponse } from './data/transformResult';
import { output } from './schema';

export type AliasesGetRequest = string;
export type AliasesMgetRequest = string[];

export type WithAddress = { address: string };
export type WithAddresses = { addresses: string[] };
export type WithQueries = { queries: string[] };

export type AliasesSearchRequest = RequestWithCursor<
  WithSortOrder &
    WithLimit &
    XOR<XOR<WithAddress, WithAddresses>, WithQueries> & {
      showBroken: boolean;
    },
  string
>;

export type AliasesRepo = Repo<
  AliasesGetRequest,
  AliasesMgetRequest,
  AliasesSearchRequest,
  AliasInfo
>;

export default ({
  drivers,
  emitEvent,
}: CommonRepoDependencies): AliasesRepo => {
  return {
    get: getByIdPreset({
      name: 'aliases.get',
      sql: sql.get,
      resultSchema: output,
      transformResult: transformDbResponse,
    })({
      pg: drivers.pg,
      emitEvent: emitEvent,
    }),

    mget: mgetByIdsPreset({
      name: 'aliases.mget',
      sql: sql.mget,
      resultSchema: output,
      transformResult: transformDbResponse,
      matchRequestResult: propEq('alias'),
    })({
      pg: drivers.pg,
      emitEvent: emitEvent,
    }),

    search: searchPreset<
      Cursor,
      AliasesSearchRequest,
      AliasDbResponse,
      AliasInfo
    >({
      name: 'aliases.search',
      sql: sql.search,
      resultSchema: output,
      transformResult: transformDbResponse,
      cursorSerialization: {
        serialize,
        deserialize,
      },
    })({
      pg: drivers.pg,
      emitEvent: emitEvent,
    }),
  };
};
