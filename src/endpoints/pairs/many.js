const Maybe = require('folktale/maybe');
const { map, split, zipObj, compose } = require('ramda');

const { DEFAULT_NOT_FOUND_MESSAGE } = require('../../errorHandling');
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

const createService = require('../../services/pairs');

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

/**
 * Endpoint
 * @name /pairs?pairs[]‌="{asset_id_1}/{asset_id_2}"&pairs[]="{asset_id_1}/{asset_id_2}" ...other params
 */
const pairsMany = pairsService =>
  createManyMiddleware(
    {
      filterParsers: {
        pairs: compose(
          m => m.getOrElse(null),
          map(parsePairs),
          Maybe.fromNullable,
          parseArrayQuery
        ),
        search_by_asset: query,
        search_by_assets: parseArrayQuery,
        match_exactly: compose(
          m => m.getOrElse(undefined),
          map(map(parseBool)),
          Maybe.fromNullable,
          parseArrayQuery
        ),
        limit,
      },
      mgetFilterName: 'pairs',
    },
    '/pairs',
    pairsService
  );

module.exports = pairsService => pairsMany(pairsService);
