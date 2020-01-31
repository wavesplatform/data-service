import { RequestHeaders } from '../../types';
import { ValuesOf } from 'types/generic';

export type HttpRequest<Params extends string[] = string[]> = {
  params?: { [K in ValuesOf<Params>]: string };
  query?: Record<string, string>;
  headers: RequestHeaders;
};

export type HttpResponse = {
  status: number;
  body?: string;
  headers?: { [key: string]: string };
};
