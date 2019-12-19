import { pickAll, values, pathOr, compose } from 'ramda';

import { parseArrayQuery } from './parseArrayQuery';
import { Context } from 'koa';

const selectArrayFromQuery = (
  ctx: Context,
  what: string
): string[] | undefined =>
  compose(
    parseArrayQuery,
    pathOr('', [what]),
    selectQuery
  )(ctx);

const selectParams = (ctx: Context): Record<string, string> => ctx.params || {};
const selectQuery = (ctx: Context): Record<string, string> => ctx.query || {};

function selectFromParams(ctx: Context, what: string[]): string[];
function selectFromParams(ctx: Context, what: string): string;
function selectFromParams(
  ctx: Context,
  what: string | string[]
): string | string[] {
  if (Array.isArray(what)) {
    return compose(
      values,
      pickAll(what),
      selectParams
    )(ctx);
  } else {
    return compose(
      String,
      pathOr('', [what]),
      selectParams
    )(ctx);
  }
}

type Select = {
  id: string;
  ids: string[] | undefined;
  pairs: string[] | undefined;
  query: Record<string, string>;
  params: Record<string, string>;
  fromParams(what: string): string;
  fromParams(what: string[]): string[];
};

export const select = (ctx: Context): Select => ({
  get id() {
    return selectFromParams(ctx, 'id');
  },
  get ids() {
    return selectArrayFromQuery(ctx, 'ids');
  },
  get pairs() {
    return selectArrayFromQuery(ctx, 'pairs');
  },
  get query() {
    return selectQuery(ctx);
  },
  get params() {
    return selectParams(ctx);
  },
  fromParams(what: any): any {
    return selectFromParams(ctx, what);
  },
});
