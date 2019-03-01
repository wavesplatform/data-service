const { propEq } = require('ramda');

const { asset } = require('../../types');

// presets
const { getByIdPreset } = require('../presets/pg/getById');
const { mgetByIdsPreset } = require('../presets/pg/mgetByIds');
const searchPreset = require('../presets/pg/search');

// validation
const { inputGet } = require('../presets/pg/getById/inputSchema');
const { inputMget } = require('../presets/pg/mgetByIds/inputSchema');
const {
  result: resultSchema,
  inputSearch: inputSearchSchema,
} = require('./schema');

const transformAsset = require('./transformAsset');
const createTransformResult = require('../presets/pg/search/transformResult');
const sql = require('./sql');

module.exports = ({ drivers: { pg }, emitEvent }) => {
  return {
    get: getByIdPreset({
      name: 'assets.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema,
      transformResult: transformAsset,
      resultTypeFactory: asset,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset({
      name: 'assets.mget',
      matchRequestResult: propEq('asset_id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultSchema,
      transformResult: transformAsset,
      resultTypeFactory: asset,
    })({ pg, emitEvent }),

    search: searchPreset({
      name: 'assets.search',
      sql: sql.search,
      inputSchema: inputSearchSchema,
      resultSchema,
      transformResult: createTransformResult(asset)(transformAsset),
    })({ pg, emitEvent }),
  };
};
