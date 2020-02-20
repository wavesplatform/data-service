import { Result, Error as error, Ok as ok } from 'folktale/result';
import * as Router from 'koa-router';

import { ParseError } from '../../errorHandling';
import { ServiceMesh } from '../../services';
import { WithSortOrder, WithLimit } from '../../services/_common';
import {
  transaction,
  ServiceMgetRequest,
  ServiceGetRequest,
  TransactionInfo,
  Transaction,
} from '../../types';

import { createHttpHandler } from '../_common';
import { HttpRequest } from '../_common/types';
import { parseFilterValues } from '../_common/filters';
import { Parser } from '../_common/filters/types';
import {
  get as getSerializer,
  mget as mgetSerializer,
  search as searchSerializer,
} from '../_common/serialize';
import { postToGet } from '../_common/postToGet';

export const isMgetRequest = (req: unknown): req is ServiceMgetRequest =>
  typeof req === 'object' && req !== null && req.hasOwnProperty('ids');

export const parseGet = ({
  params,
}: HttpRequest<['id']>): Result<ParseError, ServiceGetRequest> => {
  if (params && params.id) {
    return ok({
      id: params.id,
    });
  } else {
    return error(new ParseError(new Error('TransactionId is required')));
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
        ? service
            .mget(req)
            .map(
              mgetSerializer<TransactionInfo | null, Transaction>(
                transaction,
                lsnFormat
              )
            )
        : service
            .search(req)
            .map(
              searchSerializer<TransactionInfo | null, Transaction>(
                transaction,
                lsnFormat
              )
            ),
    parseRequest.mgetOrSearch
  );

  return router
    .get(
      `${prefix}/:id`,
      createHttpHandler(
        (req, lsnFormat) =>
          service
            .get(req)
            .map(
              getSerializer<TransactionInfo | null, Transaction>(
                transaction,
                lsnFormat
              )
            ),
        parseRequest.get
      )
    )
    .get(prefix, mgetOrSearchHandler)
    .post(prefix, postToGet(mgetOrSearchHandler));
};
