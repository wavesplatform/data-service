const { has, defaultTo, map, split, zipObj, compose } = require('ramda');
const Maybe = require('folktale/maybe');

const { loadConfig } = require('../../loadConfig');
const { captureErrors } = require('../../utils/captureErrors');
const { handleError } = require('../../utils/handleError');

const { select } = require('../utils/selectors');
const { parseArrayQuery } = require('../utils/parseArrayQuery');
const { parseBool } = require('../utils/parseBool');
const {
  parseFilterValues,
  limit,
  query: queryFilter,
} = require('../_common/filters');

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
    defaultTo(options.matcher.defaultMatcherAddress)
  ),
  limit,
};

/**
 * Endpoint
 * @name /pairs?pairs[]‌="{asset_id_1}/{asset_id_2}"&pairs[]="{asset_id_1}/{asset_id_2}" ...other params
 */
const pairsManyEndpoint = service => async ctx => {
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
    if (service.mget) {
      results = await service
        .mget({ pairs: fValues.pairs, matcher: fValues.matcher })
        .run()
        .promise();
    } else {
      ctx.status = 404;
      return;
    }
  } else {
    // search hit
    if (service.search) {
      results = await service
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

module.exports = service =>
  captureErrors(handleError)(pairsManyEndpoint(service));
