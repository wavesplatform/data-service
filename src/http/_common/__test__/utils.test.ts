import { Ok as ok, Error as error } from 'folktale/result';
import { AppError } from '../../../errorHandling';
import { DecimalsFormat } from '../../../services/types';
import { WITH_DECIMALS_HEADER } from '../../../types';
import { LSNFormat } from '../../types';
import {
  DEFAULT_LSN_FORMAT,
  LSN_FORMAT_KEY,
  DEFAULT_DECIMALS_FORMAT,
  setHttpResponse,
  contentTypeWithLSN,
  parseDecimals,
  parseLSN,
  defaultStringify,
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

describe('parseDecimals', () => {
  it('should return default decimals format, when decimals is not presented in headers', () => {
    expect(parseDecimals({})).toEqual(ok(DEFAULT_DECIMALS_FORMAT));
  });

  it('should parse decimals-format from headers', () => {
    expect(
      parseDecimals({
        [WITH_DECIMALS_HEADER]: DecimalsFormat.Float,
      })
    ).toEqual(ok(DecimalsFormat.Float));

    expect(
      parseDecimals({
        [WITH_DECIMALS_HEADER]: DecimalsFormat.Long,
      })
    ).toEqual(ok(DecimalsFormat.Long));
  });

  it('should return error on invalid decimals-header in headers', () => {
    expect(
      parseDecimals({
        [WITH_DECIMALS_HEADER]: 'wrong' as DecimalsFormat,
      })
    ).toEqual(error(AppError.Parse('Invalid DecimalsFormat')));
  });
});

describe('parseLSN', () => {
  it('should return default lsn format, when lsn is not presented in headers', () => {
    expect(parseLSN({})).toEqual(ok(DEFAULT_LSN_FORMAT));
  });

  it('should parse lsn-format from headers', () => {
    expect(
      parseLSN({
        accept: `${LSN_FORMAT_KEY}=${LSNFormat.Number}`,
      })
    ).toEqual(ok(LSNFormat.Number));

    expect(
      parseLSN({
        accept: `${LSN_FORMAT_KEY}=${LSNFormat.String}`,
      })
    ).toEqual(ok(LSNFormat.String));
  });

  it('should return error on invalid decimals-format in headers', () => {
    expect(
      parseLSN({
        accept: `${LSN_FORMAT_KEY}=bad lsn`,
      })
    ).toEqual(error(AppError.Parse('Invalid Large significand format')));
  });
});
