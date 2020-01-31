import {
  DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
  DEFAULT_TIMEOUT_OCCURRED_MESSAGE,
  DEFAULT_NOT_FOUND_MESSAGE,
} from '../../errorHandling';
import { RequestHeaders } from '../../types';
import { ValuesOf } from '../../types/generic';
import { defaultStringify } from './utils';

export type HttpRequest<Params extends string[] = string[]> = {
  params?: Record<ValuesOf<Params>, string>;
  query?: Record<string, string>;
  headers: RequestHeaders;
};

export class HttpResponse {
  readonly status: number;
  readonly body?: string;
  readonly headers?: Record<string, string>;

  private constructor(
    status: number,
    body?: string,
    headers?: Record<string, string>
  ) {
    this.status = status;
    this.body = body;
    this.headers = headers;
  }

  public static Ok(body?: string, headers?: Record<string, string>) {
    return new HttpResponse(200, body, headers);
  }

  public static BadRequest(body?: string, headers?: Record<string, string>) {
    return new HttpResponse(400, body, headers);
  }

  public static NotFound(headers?: Record<string, string>) {
    return new HttpResponse(
      404,
      defaultStringify({
        message: DEFAULT_NOT_FOUND_MESSAGE,
      }),
      headers
    );
  }

  public static InternalServerError(headers?: Record<string, string>) {
    return new HttpResponse(
      500,
      defaultStringify({
        message: DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
      }),
      headers
    );
  }

  public static TimeoutOccured(headers?: Record<string, string>) {
    return new HttpResponse(
      504,
      defaultStringify({
        message: DEFAULT_TIMEOUT_OCCURRED_MESSAGE,
      }),
      headers
    );
  }

  withHeaders(headers: Record<string, string>): HttpResponse {
    return new HttpResponse(this.status, this.body, headers);
  }
}
