const { has, defaultTo, map, split, zipObj, compose } = require('ramda');
const Maybe = require('folktale/maybe');

const { loadConfig } = require('../../loadConfig');
const { captureErrors } = require('../../utils/captureErrors');

const { select } = require('../utils/selectors');
const { parseArrayQuery } = require('../utils/parseArrayQuery');
const { parseBool } = require('../utils/parseBool');
const {
  parseFilterValues,
  limit,
  query: queryFilter,
} = require('../_common/filters');

const createService = require('../../services/pairs');

const options = loadConfig();

/**
 * @typedef {object} PairRequest
 * @property {string} amountAsset
 * @property {string} priceAsset
 */

/**
 * @function
 * @param {string[]} pairs {amoutAsset}/{priceAsset}
 * @returns PairRequest[]
 */
const parsePairs = map(
  compose(
    zipObj(['amountAsset', 'priceAsset']),
    split('/')
  )
);

const mgetFilterName = 'pairs';

const filterParsers = {
  pairs: compose(
    m => m.getOrElse(null),
    map(parsePairs),
    Maybe.fromNullable,
    parseArrayQuery
  ),
  search_by_asset: queryFilter,
  search_by_assets: parseArrayQuery,
  match_exactly: compose(
    m => m.getOrElse(undefined),
    map(map(parseBool)),
    Maybe.fromNullable,
    parseArrayQuery
  ),
  matcher: compose(
    queryFilter,
    defaultTo(options.defaultMatcher)
  ),
  limit,
};

const handleError = ({ ctx, error }) => {
  ctx.eventBus.emit('ERROR', error);
  error.matchWith({
    Db: () => {
      ctx.status = 500;
      ctx.body = 'Database Error';
    },
    Resolver: () => {
      ctx.status = 500;
      ctx.body = `Error resolving path`;
    },
    Validation: () => {
      ctx.status = 400;
      ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
    },
  });
};

/**
 * Endpoint
 * @name /pairs?pairs[]‌="{asset_id_1}/{asset_id_2}"&pairs[]="{asset_id_1}/{asset_id_2}" ...other params
 */
const pairsManyEndpoint = async ctx => {
  const s = createService({
    drivers: ctx.state.drivers,
    emitEvent: ctx.eventBus.emit,
  });

  if (!s.mget && !s.search) {
    ctx.status = 404;
    return;
  }

  const { query } = select(ctx);
  const fValues = parseFilterValues(filterParsers)(query);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: '/pairs',
    query,
  });

  let results;
  if (has(mgetFilterName, fValues)) {
    // mget hit
    if (s.mget) {
      results = await s
        .mget({ pairs: fValues.pairs, matcher: fValues.matcher })
        .run()
        .promise();
    } else {
      ctx.status = 404;
      return;
    }
  } else {
    // search hit
    if (s.search) {
      results = await s
        .search(fValues)
        .run()
        .promise();
    } else {
      ctx.status = 404;
      return;
    }
  }

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: results,
  });

  if (results) {
    ctx.state.returnValue = results;
  } else {
    ctx.status = 404;
  }
};

module.exports = captureErrors(handleError)(pairsManyEndpoint);
