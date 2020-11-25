import { Context } from 'koa';
import { Result, Error as error, Ok as ok } from 'folktale/result';
import { IncomingHttpHeaders } from 'http';

import { ParseError } from '../../errorHandling';
import { stringify } from '../../utils/json';
import { WithMatcher } from '../../services/_common';
import { MoneyFormat as MoneyFormat } from '../../services/types';
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

export const MONEY_FORMAT_KEY = 'money-format';
export const DEFAULT_MONEY_FORMAT = MoneyFormat.Float;

export const parseLSNFormat = (
  httpHeaders: IncomingHttpHeaders
): Result<ParseError, LSNFormat> => {
  const acceptHeader = httpHeaders['accept'];

  if (
    typeof acceptHeader === 'string' &&
    acceptHeader.includes(LSN_FORMAT_KEY)
  ) {
    // lsn format param assuredly is string
    const lsnFormatParam = acceptHeader
      .split(';')
      .map((param) => param.trim())
      .find((param) => param.startsWith(LSN_FORMAT_KEY)) as string;
    const lsnFormat = lsnFormatParam.substr(
      LSN_FORMAT_KEY.length + 1 // + 1 cause the equal sign
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

export const parseMoneyFormat = (
  httpHeaders: IncomingHttpHeaders
): Result<ParseError, MoneyFormat> => {
  const acceptHeader = httpHeaders['accept'];

  if (
    typeof acceptHeader === 'string' &&
    acceptHeader.includes(MONEY_FORMAT_KEY)
  ) {
    // money format param assuredly is string
    const moneyFormatParam = acceptHeader
      .split(';')
      .map((param) => param.trim())
      .find((param) => param.startsWith(MONEY_FORMAT_KEY)) as string;

    const moneyFormat = moneyFormatParam.substr(
      MONEY_FORMAT_KEY.length + 1 // + 1 cause the equal sign
    ) as MoneyFormat;

    if (![MoneyFormat.Float, MoneyFormat.Long].includes(moneyFormat)) {
      return error(new ParseError(new Error('Invalid Money Format')));
    } else {
      return ok(moneyFormat);
    }
  } else {
    return ok(DEFAULT_MONEY_FORMAT);
  }
};

export const contentTypeWithMoneyFormat = (
  moneyFormat: MoneyFormat,
  contentType: string = 'application/json; charset=utf-8'
) =>
  `${contentType}${
    moneyFormat === MoneyFormat.Long
      ? `; ${MONEY_FORMAT_KEY}=${MoneyFormat.Long}`
      : ''
  }`;

export const withMatcher = (req: any): req is WithMatcher =>
  'matcher' in req && typeof req.matcher === 'string';
