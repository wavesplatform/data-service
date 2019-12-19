import { Context } from 'koa';
import * as Router from 'koa-router';
import { identity, has } from 'ramda';

import { alias, Alias, List, list } from '../types/';

import {
  AliasEndpoint,
  AliasesEndpoint,
  AliasEndpointRequest,
  AliasEndpointResponse,
  AliasesEndpointRequest,
  AliasesEndpointResponse,
} from '../endpoints/aliases';

import { createHttpHandler } from './_common';
import { parseFilterValues } from './_common/filters';
const { parseBool } = require('./utils/parseBool');
import { parseArrayQuery } from './utils/parseArrayQuery';
import { select } from './utils/selectors';

export default ({
  one,
  many,
}: {
  one: AliasEndpoint;
  many: AliasesEndpoint;
}): Router => {
  return new Router()
    .get(
      '/aliases/:id',
      createHttpHandler<
        AliasEndpointRequest['payload'],
        AliasEndpointResponse,
        Alias
      >(
        (ctx: Context) => {
          const { id } = select(ctx);
          return id;
        },
        one,
        alias
      )
    )
    .get(
      '/aliases',
      createHttpHandler<
        AliasesEndpointRequest['payload'],
        AliasesEndpointResponse,
        List<Alias>
      >(
        (ctx: Context) => {
          const { query } = select(ctx);

          return parseFilterValues(
            has('aliases', query)
              ? {
                  aliases: parseArrayQuery,
                }
              : {
                  address: identity,
                  showBroken: parseBool,
                }
          )(query) as AliasesEndpointRequest['payload'];
        },
        many,
        res => list(res.map(alias))
      )
    );
};
