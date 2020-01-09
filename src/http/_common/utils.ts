import { Context } from 'koa';
import { Result, Error as error, Ok as ok } from 'folktale/result';
import { defaultTo } from 'ramda';

import { ParseError } from '../../errorHandling';
import { stringify } from '../../utils/json';
import {
  RequestHeaders,
  LSN_FORMAT_HEADER,
  WITH_DECIMALS_HEADER,
} from '../../types';
import { DecimalsFormat } from '../../services/types';
import { LSNFormat } from '../types';
import { HttpResponse, HttpResponseDto } from './types';

export const defaultStringify = stringify(LSNFormat.String);

export const toHttpResponse = (res: HttpResponseDto): HttpResponse => ({
  status: res.status,
  body: defaultStringify(res.body),
});

export const setHttpResponse = (ctx: Context) => (
  httpResponse: HttpResponse
) => {
  ctx.body = httpResponse.body;
  ctx.status = httpResponse.status;

  if (httpResponse.headers) {
    ctx.set(httpResponse.headers);
  }
};

export const parseLSN = (
  httpHeaders: RequestHeaders
): Result<ParseError, LSNFormat> => {
  if (
    typeof httpHeaders[LSN_FORMAT_HEADER] === 'string' &&
    ![LSNFormat.Number, LSNFormat.String].includes(
      httpHeaders[LSN_FORMAT_HEADER] as LSNFormat
    )
  ) {
    return error(new ParseError(new Error('Invalid LongFormat')));
  }

  return ok(
    defaultTo(LSNFormat.String, httpHeaders[LSN_FORMAT_HEADER] as LSNFormat)
  );
};

export const parseDecimals = (
  httpHeaders: RequestHeaders
): Result<ParseError, DecimalsFormat> => {
  if (
    httpHeaders[WITH_DECIMALS_HEADER] &&
    ![DecimalsFormat.Float, DecimalsFormat.Long].includes(
      httpHeaders[WITH_DECIMALS_HEADER] as DecimalsFormat
    )
  ) {
    return error(new ParseError(new Error('Invalid DecimalsFormat')));
  }

  return ok(
    defaultTo(
      DecimalsFormat.Float,
      httpHeaders[WITH_DECIMALS_HEADER] as DecimalsFormat
    )
  );
};
