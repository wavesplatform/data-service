import { Context } from 'koa';
import { Result, Error as error, Ok as ok } from 'folktale/result';
import { defaultTo } from 'ramda';

import { ParseError } from '../../errorHandling';
import { stringify } from '../../utils/json';
import { RequestHeaders, WITH_DECIMALS_HEADER } from '../../types';
import { DecimalsFormat } from '../../services/types';
import { LSNFormat } from '../types';
import { HttpResponse } from './types';

export const defaultStringify = stringify(LSNFormat.String);

export const setHttpResponse = (ctx: Context) => (
  httpResponse: HttpResponse
) => {
  ctx.body = httpResponse.body;
  ctx.status = httpResponse.status;

  if (httpResponse.headers) {
    ctx.set(httpResponse.headers);
  }
};

export const LSN_FORMAT_KEY = 'large-significand-format';
export const DEFAULT_LSN_FORMAT = LSNFormat.Number;

export const DEFAULT_DECIMALS_FORMAT = DecimalsFormat.Float;

export const parseLSN = (
  httpHeaders: RequestHeaders
): Result<ParseError, LSNFormat> => {
  const acceptHeader = httpHeaders['accept'];

  if (
    typeof acceptHeader === 'string' &&
    acceptHeader.includes(LSN_FORMAT_KEY)
  ) {
    const lsnFormat = acceptHeader.substr(
      acceptHeader.indexOf(LSN_FORMAT_KEY) + LSN_FORMAT_KEY.length + 1 // + 1 cause the equal sign
    ) as LSNFormat;

    if (![LSNFormat.Number, LSNFormat.String].includes(lsnFormat)) {
      return error(
        new ParseError(new Error('Invalid Large significand format'))
      );
    } else {
      return ok(lsnFormat);
    }
  } else {
    return ok(DEFAULT_LSN_FORMAT);
  }
};

export const contentTypeWithLSN = (
  lsnFormat: LSNFormat,
  contentType: string = 'application/json; charset=utf-8'
) =>
  `${contentType}${
    lsnFormat === LSNFormat.String
      ? `; ${LSN_FORMAT_KEY}=${LSNFormat.String}`
      : ''
  }`;

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
      DEFAULT_DECIMALS_FORMAT,
      httpHeaders[WITH_DECIMALS_HEADER] as DecimalsFormat
    )
  );
};
