import * as Koa from 'koa';

const merge = require('merge-descriptors');
const qs = require('qs');

export function koaQs<A, B>(app: Koa<A, B>): Koa<A, B> {
  merge(app.request, {
    /**
     * Get parsed query-string.
     *
     * @return {Object}
     * @api public
     */

    get query() {
      var str = this.querystring;
      if (!str) return {};

      var c = (this._querycache = this._querycache || {});
      var query = c[str];
      if (!query) {
        c[str] = query = qs.parse(str);
      }
      return query;
    },

    /**
     * Set query-string as an object.
     *
     * @param {Object} obj
     * @api public
     */

    set query(obj) {
      this.querystring = qs.stringify(obj);
    },
  });

  return app;
}
