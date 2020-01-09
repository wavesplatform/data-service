import { RequestHeaders } from '../../types';
import { ValuesOf } from 'types/generic';

export type HttpRequest<Params extends string[] = any> = {
  params?: { [K in ValuesOf<Params>]: string };
  query?: Record<string, string>;
  headers: RequestHeaders;
};

export type HttpResponseDto<T = any> = {
  status: number;
  body?: T;
  headers?: { [key: string]: string };
};

export type HttpResponse = {
  status: number;
  body?: string;
  headers?: { [key: string]: string };
};
