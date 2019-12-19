import { Context } from 'koa';
import { Task } from 'folktale/concurrency/task';
import { defaultTo } from 'ramda';

import { AppError, ParseError } from '../../errorHandling';
import { Endpoint, DecimalsFormat } from '../../endpoints/types';
import {
  RequestHeaders,
  WITH_DECIMALS_HEADER,
  LSN_FORMAT_HEADER,
} from '../../types';
import { Transform, Serializable } from '../../types/serializable';

import { LSNFormat } from '../types';
import { Result, Ok as okOf, Error as errorOf } from 'folktale/result';
import { resultToTask } from '../../utils/fp';

const { stringify } = require('../utils/json');

export const createHttpHandler = <
  Request,
  EndpointResponse,
  HttpResponse extends Serializable<string, any>
>(
  parse: (ctx: Context) => Result<ParseError, Request>,
  endpoint: Endpoint<Request, EndpointResponse>,
  transform: Transform<EndpointResponse, HttpResponse>
) => (ctx: Context): Task<AppError, string> => {
  // const dec: ApplyDecimals = parseDec(ctx);
  return resultToTask(parse(ctx))
    .chain(req => endpoint(req))
    .map(transform)
    .map(serializeWithLSN(parseLSN(ctx)));
};

const serializeWithLSN = (data: any) => stringify(data);

const parseLSN = (ctx: Context) => {
  const headers: RequestHeaders = ctx.headers;

  if (
    typeof headers[LSN_FORMAT_HEADER] === 'string' &&
    ![LSNFormat.Number, LSNFormat.String].includes(
      headers[LSN_FORMAT_HEADER] as LSNFormat
    )
  ) {
    return errorOf(new ParseError(new Error('Invalid LongFormat')));
  }

  return okOf(defaultTo(LSNFormat.String, headers[LSN_FORMAT_HEADER]));
};

export const withDecimals = (ctx: Context) => {
  const headers: RequestHeaders = ctx.headers;

  if (
    headers[WITH_DECIMALS_HEADER] &&
    ![DecimalsFormat.Float, DecimalsFormat.Long].includes(
      headers[WITH_DECIMALS_HEADER] as DecimalsFormat
    )
  ) {
    return errorOf(new ParseError(new Error('Invalid LongFormat')));
  }

  return okOf(defaultTo(DecimalsFormat.Float, headers[WITH_DECIMALS_HEADER]));
};
