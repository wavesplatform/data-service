const createService = require('../../services/pairs');
const Maybe = require('folktale/maybe');

const createManyMiddleware = require('../_common/many');

const { parseArrayQuery } = require('../utils/parseArrayQuery');
const { limit } = require('../_common/filters');

const { map, split, zipObj, compose } = require('ramda');

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
      pairs: x =>
        compose(
          m => m.getOrElse(null),
          map(parsePairs),
          Maybe.fromNullable,
          parseArrayQuery
        )(x),
      limit,
    },
    mgetFilterName: 'pairs',
  },
  '/pairs',
  createService
);

module.exports = pairsMany;
