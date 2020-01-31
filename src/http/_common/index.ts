import { Context } from 'koa';
import { Result, Ok as ok } from 'folktale/result';
import { Task } from 'folktale/concurrency/task';
import { ParseError, AppError, ResolverError } from '../../errorHandling';
import { WithDecimalsFormat } from '../../services/types';
import { resultToTask } from '../../utils/fp';
import { handleError } from '../_common/handleError';
import { LSNFormat } from '../types';
import { HttpRequest, HttpResponse } from './types';
import { parseLSN, parseDecimals, setHttpResponse } from './utils';

export function createHttpHandler<Params extends string[], Request>(
  getResponse: (
    request: WithDecimalsFormat,
    lsnFormat: LSNFormat
  ) => Task<AppError, HttpResponse>
): (ctx: Context) => Promise<void>;
export function createHttpHandler<Params extends string[], Request>(
  getResponse: (
    request: Request & WithDecimalsFormat,
    lsnFormat: LSNFormat
  ) => Task<AppError, HttpResponse>,
  parseRequest: (
    httpRequest: HttpRequest<Params>
  ) => Result<ParseError, Request>
): (ctx: Context) => Promise<void>;
export function createHttpHandler<Params extends string[], Request>(
  getResponse: (
    req: WithDecimalsFormat | (Request & WithDecimalsFormat),
    lsnFormat: LSNFormat
  ) => Task<AppError, HttpResponse>,
  parseRequest?: (
    httpRequest: HttpRequest<Params>
  ) => Result<ParseError, Request>
): (ctx: Context) => Promise<void> {
  return async (ctx: Context): Promise<void> => {
    ctx.eventBus.emit('ENDPOINT_HIT', {
      value: ctx.originalUrl,
    });

    const setResponse = setHttpResponse(ctx);

    const safeParse: (
      httpRequest: HttpRequest<Params>
    ) => Result<ParseError, Request | void> = parseRequest || (() => ok());

    try {
      await resultToTask(
        safeParse({
          params: ctx.params,
          query: ctx.query,
          headers: ctx.headers,
        }).chain(req =>
          parseDecimals(ctx.headers).map(dec => ({
            ...req,
            decimalsFormat: dec,
          }))
        )
      )
        .chain(req =>
          resultToTask(parseLSN(ctx.headers)).chain(lsnFormat =>
            getResponse(req, lsnFormat)
          )
        )
        .mapRejected(e => {
          ctx.eventBus.emit('ERROR', e);

          return handleError(e);
        })
        .run()
        .promise()
        .then(setResponse)
        .catch(setResponse);
    } catch (e) {
      const err = new ResolverError(e);

      ctx.eventBus.emit('ERROR', err);

      setResponse(handleError(err));
    }

    ctx.eventBus.emit('ENDPOINT_RESOLVED', {
      value: ctx.body,
    });
  };
}
