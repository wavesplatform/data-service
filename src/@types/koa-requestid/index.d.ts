declare module 'koa-requestid' {
  import { Middleware } from 'koa';

  // a hack to support 'import * as ...' syntax
  namespace requestId {
    type Options = {
      expose?: string | boolean;
      header?: string | boolean;
      query?: string | boolean;
    };
  }

  function requestId(options?: requestId.Options): Middleware;

  export = requestId;
}
