import { Maybe } from 'folktale/maybe';
import { Result, Error as error, Ok as ok } from 'folktale/result';
import { has } from 'ramda';
import * as Router from 'koa-router';

import { ParseError } from '../../errorHandling';
import { ServiceMesh } from '../../services';
import { WithSortOrder, WithLimit } from '../../services/_common';
import {
  transaction,
  list,
  ServiceMgetRequest,
  ServiceGetRequest,
  TransactionInfo,
  SearchedItems,
} from '../../types';
import { stringify } from '../../utils/json';

import { createHttpHandler } from '../_common';
import { HttpRequest, HttpResponse } from '../_common/types';
import { parseFilterValues } from '../_common/filters';
import { Parser } from '../_common/filters/types';
import { postToGet } from '../_common/postToGet';
import { LSNFormat } from '../types';

const serializeGet = (lsnFormat: LSNFormat) => (m: Maybe<TransactionInfo>) =>
  m.matchWith({
    Just: ({ value }) =>
      HttpResponse.Ok(stringify(lsnFormat)(transaction(value))),
    Nothing: () => HttpResponse.NotFound(),
  });

const serializeMget = (lsnFormat: LSNFormat) => (
  ms: Maybe<TransactionInfo>[]
) =>
  HttpResponse.Ok(
    stringify(lsnFormat)(
      list(
        ms.map(maybe =>
          maybe.matchWith({
            Just: ({ value }) => transaction(value),
            Nothing: () => transaction(null),
          })
        )
      )
    )
  );

const serializeSearch = (lsnFormat: LSNFormat) => (
  data: SearchedItems<TransactionInfo>
) =>
  HttpResponse.Ok(
    stringify(lsnFormat)(
      list(
        data.items.map(a => transaction(a)),
        {
          isLastPage: data.isLastPage,
          lastCursor: data.lastCursor,
        }
      )
    )
  );

export const isMgetRequest = <SearchRequest>(
  req: ServiceMgetRequest | SearchRequest
): req is ServiceMgetRequest => has('ids', req);

export const parseGet = ({
  params,
}: HttpRequest<['id']>): Result<ParseError, ServiceGetRequest> => {
  if (params && params.id) {
    return ok({
      id: params.id,
    });
  } else {
    return error(new ParseError(new Error('Transaction id is not set')));
  }
};

export const parseMgetOrSearch = <SearchRequest>(
  customFilters: Record<string, Parser<any>>
) => ({
  query,
}: HttpRequest): Result<ParseError, ServiceMgetRequest | SearchRequest> => {
  if (!query) {
    return error(new ParseError(new Error('Query is empty')));
  }

  return parseFilterValues(customFilters)(query).map(fValues => {
    if (isMgetRequest(fValues)) {
      return { ids: fValues.ids };
    } else {
      return fValues as SearchRequest;
    }
  });
};

export const createTransactionHttpHandlers = <
  SearchRequest extends WithSortOrder & WithLimit
>(
  router: Router,
  prefix: string,
  service: ServiceMesh['transactions'][keyof ServiceMesh['transactions']],
  parseRequest: {
    get: (req: HttpRequest<['id']>) => Result<ParseError, ServiceGetRequest>;
    mgetOrSearch: (
      req: HttpRequest<string[]>
    ) => Result<ParseError, ServiceMgetRequest | SearchRequest>;
  }
) => {
  const mgetOrSearchHandler = createHttpHandler(
    (req, lsnFormat) =>
      isMgetRequest(req)
        ? service.mget(req).map(serializeMget(lsnFormat))
        : service.search(req).map(serializeSearch(lsnFormat)),
    parseRequest.mgetOrSearch
  );

  return router
    .get(
      `${prefix}/:id`,
      createHttpHandler(
        (req, lsnFormat) => service.get(req).map(serializeGet(lsnFormat)),
        parseRequest.get
      )
    )
    .get(prefix, mgetOrSearchHandler)
    .post(prefix, postToGet(mgetOrSearchHandler));
};
