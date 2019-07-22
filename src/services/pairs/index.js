import { getByIdPreset } from '../presets/pg/getById';
import { searchPreset } from '../presets/pg/search';
import { pair } from '../../types';

import mget from './mget';
import { inputGet, inputSearch, result as resultSchema } from './schema';
import { transformResult, transformResultSearch } from './transformResult';
import * as sql from './sql';

module.exports = ({ drivers, emitEvent }) => {
  return {
    get: getByIdPreset({
      name: 'pairs.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema,
      transformResult: transformResult,
      resultTypeFactory: pair,
    })({ pg: drivers.pg, emitEvent }),
    mget: mget({
      name: 'pairs.mget',
      sql: sql.mget,
      transformResult: transformResult,
      typeFactory: pair,
    })({ pg: drivers.pg, emitEvent }),
    search: searchPreset({
      name: 'pairs.search',
      sql: sql.search,
      inputSchema: inputSearch,
      resultSchema,
      transformResult: transformResultSearch,
    })({ pg: drivers.pg, emitEvent }),
  };
};
