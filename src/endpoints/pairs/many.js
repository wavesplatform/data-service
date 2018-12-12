const createService = require('../../services/pairs');

const createManyMiddleware = require('../_common/many');

const { parseArrayQuery } = require('../utils/parseArrayQuery');
const { parseFilterValues } = require('../_common/filters');

const { defaultLimit } = require('../../services/pairs/schema');

const {
  map,
  split,
  zipObj,
  compose,
  defaultTo,
  ifElse,
  has,
} = require('ramda');

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
    parseFiltersFn: ifElse(
      has('pairs'),
      parseFilterValues({
        pairs: compose(
          parsePairs,
          parseArrayQuery
        ),
      }),
      parseFilterValues({
        limit: compose(
          parseInt,
          defaultTo(defaultLimit)
        ),
      })
    ),
    mgetFilterName: 'pairs',
  },
  '/pairs',
  createService
);

module.exports = pairsMany;
