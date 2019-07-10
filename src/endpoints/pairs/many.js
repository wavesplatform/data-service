const createService = require('../../services/pairs');
const Maybe = require('folktale/maybe');

const createManyMiddleware = require('../_common/many');

const { parseArrayQuery } = require('../utils/parseArrayQuery');
const { parseBool } = require('../utils/parseBool');
const { limit, query } = require('../_common/filters');

const { defaultTo, map, split, zipObj, compose } = require('ramda');

const { loadConfig } = require('../../loadConfig');

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

/**
 * Endpoint
 * @name /pairs?pairs[]‌="{asset_id_1}/{asset_id_2}"&pairs[]="{asset_id_1}/{asset_id_2}" ...other params
 */
const pairsMany = createManyMiddleware(
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
      matcher: compose(
        query,
        defaultTo(options.defaultMatcher)
      ),
      limit,
    },
    mgetFilterName: 'pairs',
  },
  '/pairs',
  createService
);

module.exports = pairsMany;
