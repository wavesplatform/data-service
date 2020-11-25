import { Ok as ok, Error as error } from 'folktale/result';
import { AppError } from '../../../errorHandling';
import { MoneyFormat as MoneyFormat } from '../../../services/types';
import { LSNFormat } from '../../types';
import {
  DEFAULT_LSN_FORMAT,
  LSN_FORMAT_KEY,
  DEFAULT_MONEY_FORMAT,
  MONEY_FORMAT_KEY,
  setHttpResponse,
  contentTypeWithLSN,
  parseMoneyFormat,
  parseLSNFormat,
  defaultStringify,
  contentTypeWithMoneyFormat,
} from '../utils';
import * as Koa from 'koa';
import { HttpResponse } from '../types';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';

const app = new Koa();
const socket = new Socket();
const i = new IncomingMessage(socket);
const s = new ServerResponse(i);

describe('setHttpResponse', () => {
  it('should mutate ctx - set body', () => {
    const ctx = app.createContext(i, s);

    expect(ctx).toHaveProperty('body', undefined);

    const body = defaultStringify({
      response: 'response',
    });
    setHttpResponse(ctx)(HttpResponse.Ok(body));

    expect(ctx).toHaveProperty('body', body);
  });

  it('should mutate ctx - set status', () => {
    const ctx = app.createContext(i, s);

    expect(ctx).toHaveProperty('status', 200);

    setHttpResponse(ctx)(HttpResponse.BadRequest());

    expect(ctx).toHaveProperty('status', 400);
  });

  it('should mutate ctx - set headers', () => {
    const ctx = app.createContext(i, s);

    expect(ctx).toHaveProperty(['response', 'headers']);

    setHttpResponse(ctx)(
      HttpResponse.Ok(undefined, {
        customHeader: 'customHeaderResponse',
      })
    );

    expect(ctx).toHaveProperty(
      ['response', 'headers', 'customheader'],
      'customHeaderResponse'
    );
  });
});

describe('contentTypeWithLSN', () => {
  it('should return Content-Type with Number LSN Format', () => {
    expect(contentTypeWithLSN(LSNFormat.Number)).toBe(
      'application/json; charset=utf-8'
    );
  });

  it('should return Content-Type with String LSN Format', () => {
    expect(contentTypeWithLSN(LSNFormat.String)).toBe(
      `application/json; charset=utf-8; ${LSN_FORMAT_KEY}=${LSNFormat.String}`
    );
  });
});

describe('contentTypeWithMoneyFormat', () => {
  it('should return Content-Type with Float Money Format', () => {
    expect(contentTypeWithMoneyFormat(MoneyFormat.Float)).toBe(
      'application/json; charset=utf-8'
    );
  });

  it('should return Content-Type with Long Money Format', () => {
    expect(contentTypeWithMoneyFormat(MoneyFormat.Long)).toBe(
      `application/json; charset=utf-8; ${MONEY_FORMAT_KEY}=${MoneyFormat.Long}`
    );
  });
});

describe('contentTypeWithLSNWithMoneyFormat', () => {
  it('should return Content-Type with Number LSN Format and Float Money Format', () => {
    expect(
      contentTypeWithMoneyFormat(
        MoneyFormat.Float,
        contentTypeWithLSN(LSNFormat.Number)
      )
    ).toBe('application/json; charset=utf-8');
  });

  it('should return Content-Type with Number LSN Format and Long Money Format', () => {
    expect(
      contentTypeWithMoneyFormat(
        MoneyFormat.Long,
        contentTypeWithLSN(LSNFormat.Number)
      )
    ).toBe(
      `application/json; charset=utf-8; ${MONEY_FORMAT_KEY}=${MoneyFormat.Long}`
    );
  });

  it('should return Content-Type with String LSN Format and Float Money Format', () => {
    expect(
      contentTypeWithMoneyFormat(
        MoneyFormat.Float,
        contentTypeWithLSN(LSNFormat.String)
      )
    ).toBe(
      `application/json; charset=utf-8; ${LSN_FORMAT_KEY}=${LSNFormat.String}`
    );
  });

  it('should return Content-Type with String LSN Format and Long Money Format', () => {
    expect(
      contentTypeWithMoneyFormat(
        MoneyFormat.Long,
        contentTypeWithLSN(LSNFormat.String)
      )
    ).toBe(
      `application/json; charset=utf-8; ${LSN_FORMAT_KEY}=${LSNFormat.String}; ${MONEY_FORMAT_KEY}=${MoneyFormat.Long}`
    );
  });
});

describe('parseMoney', () => {
  it('should return default money format, when money is not presented in headers', () => {
    expect(parseMoneyFormat({})).toEqual(ok(DEFAULT_MONEY_FORMAT));
  });

  it('should parse money-format from headers', () => {
    expect(
      parseMoneyFormat({
        accept: `${MONEY_FORMAT_KEY}=${MoneyFormat.Float}`,
      })
    ).toEqual(ok(MoneyFormat.Float));

    expect(
      parseMoneyFormat({
        accept: `${MONEY_FORMAT_KEY}=${MoneyFormat.Long}`,
      })
    ).toEqual(ok(MoneyFormat.Long));
  });

  it('should return error on invalid decimals-header in headers', () => {
    expect(
      parseMoneyFormat({
        accept: `${MONEY_FORMAT_KEY}=wrong`,
      })
    ).toEqual(error(AppError.Parse('Invalid Money Format')));
  });
});

describe('parseLSN', () => {
  it('should return default lsn format, when lsn is not presented in headers', () => {
    expect(parseLSNFormat({})).toEqual(ok(DEFAULT_LSN_FORMAT));
  });

  it('should parse lsn-format from headers', () => {
    expect(
      parseLSNFormat({
        accept: `${LSN_FORMAT_KEY}=${LSNFormat.Number}`,
      })
    ).toEqual(ok(LSNFormat.Number));

    expect(
      parseLSNFormat({
        accept: `${LSN_FORMAT_KEY}=${LSNFormat.String}`,
      })
    ).toEqual(ok(LSNFormat.String));
  });

  it('should return error on invalid decimals-format in headers', () => {
    expect(
      parseLSNFormat({
        accept: `${LSN_FORMAT_KEY}=bad lsn`,
      })
    ).toEqual(error(AppError.Parse('Invalid Large significand format')));
  });
});

describe('parseLSN and parseMoneyFormat simultaneously', () => {
  it('should parse lsn-format and money-fornat from headers', () => {
    const acceptHeaderValue = `${LSN_FORMAT_KEY}=${LSNFormat.Number}; ${MONEY_FORMAT_KEY}=${MoneyFormat.Long}`;
    expect(
      parseLSNFormat({
        accept: acceptHeaderValue,
      })
    ).toEqual(ok(LSNFormat.Number));

    expect(
      parseMoneyFormat({
        accept: acceptHeaderValue,
      })
    ).toEqual(ok(MoneyFormat.Long));
  });
});
