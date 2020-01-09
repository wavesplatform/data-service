import { Result, Error as error, Ok as ok } from 'folktale/result';
import { has } from 'ramda';
import * as Router from 'koa-router';

import { ParseError, DEFAULT_NOT_FOUND_MESSAGE } from '../../errorHandling';
import { ServiceMesh } from '../../services';
import { WithSortOrder, WithLimit } from '../../services/_common';
import {
  transaction,
  list,
  ServiceMgetRequest,
  ServiceGetRequest,
} from '../../types';
import { stringify } from '../../utils/json';

import { createHttpHandler } from '../_common';
import { HttpRequest } from '../_common/types';
import { parseFilterValues } from '../_common/filters';
import { Parser } from '../_common/filters/types';
import { defaultStringify } from '../_common/utils';
import * as postToGet from '../utils/postToGet';

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
  customParsers: Record<string, Parser<any>>
) => ({
  query,
}: HttpRequest): Result<ParseError, ServiceMgetRequest | SearchRequest> => {
  if (!query) {
    return error(new ParseError(new Error('Query is empty')));
  }

  return parseFilterValues(customParsers)(query).map(fValues => {
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
    get: (req: HttpRequest) => Result<ParseError, ServiceGetRequest>;
    mgetOrSearch: (
      req: HttpRequest
    ) => Result<ParseError, ServiceMgetRequest | SearchRequest>;
  }
) => {
  const mgetOrSearchHandler = createHttpHandler(
    (req, lsnFormat) =>
      isMgetRequest(req)
        ? service.mget(req).map(ms => ({
            status: 200,
            body: stringify(lsnFormat)(
              list(
                ms.map(maybe =>
                  maybe.matchWith({
                    Just: ({ value }) => transaction(value),
                    Nothing: () => transaction(null),
                  })
                )
              )
            ),
          }))
        : service.search(req).map(data => ({
            status: 200,
            body: stringify(lsnFormat)(
              list(
                data.items.map(a => transaction(a)),
                {
                  isLastPage: data.isLastPage,
                  lastCursor: data.lastCursor,
                }
              )
            ),
          })),
    parseRequest.mgetOrSearch
  );

  return router
    .get(
      `${prefix}/:id`,
      createHttpHandler(
        (req, lsnFormat) =>
          service.get(req).map(m =>
            m.matchWith({
              Just: ({ value }) => ({
                status: 200,
                body: stringify(lsnFormat)(transaction(value)),
              }),
              Nothing: () => ({
                status: 404,
                body: defaultStringify({
                  message: DEFAULT_NOT_FOUND_MESSAGE,
                }),
              }),
            })
          ),
        parseRequest.get
      )
    )
    .get(prefix, mgetOrSearchHandler)
    .post(prefix, postToGet(mgetOrSearchHandler));
};
