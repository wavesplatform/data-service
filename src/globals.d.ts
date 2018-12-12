declare module 'koa-requestid' {
  import { Middleware } from 'koa';

  function requestId(options?: {
    expose?: string;
    header?: string | boolean;
    query?: string;
  }): Middleware;

  export = requestId;
}
