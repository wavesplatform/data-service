import { compose, identity } from 'ramda';

import { get, mget, search } from '../../_common/createResolver';

import { inputGet } from '../../presets/pg/getById/inputSchema';
import { inputMget } from '../../presets/pg/mgetByIds/inputSchema';

// validation
import { validateInput, validateResult } from '../../presets/validation';
import {
  result as resultSchema,
  inputSearch as inputSearchSchema,
} from './schema';
import { transaction } from '../../../types';

import pgData from './pg';

import { transformResults as transformResultGet } from '../../presets/pg/getById/transformResult';
import { transformResults as transformResultMget } from '../../presets/pg/mgetByIds/transformResult';
import { transformInput as transformInputSearch } from '../../presets/pg/searchWithPagination/transformInput';
import { transformResults as transformResultSearch } from '../../presets/pg/searchWithPagination/transformResult';
import transformTxInfo from './transformTxInfo';

const createServiceName = type => `transactions.invokeScript.${type}`;

module.exports = ({ drivers: { pg }, emitEvent }) => {
  return {
    get: get({
      transformInput: identity,
      transformResult: transformResultGet(transaction)(transformTxInfo),
      validateInput: validateInput(inputGet, createServiceName('get')),
      validateResult: validateResult(resultSchema, createServiceName('get')),
      dbQuery: pgData.get,
    })({ db: pg, emitEvent }),

    mget: mget({
      transformInput: identity,
      transformResult: transformResultMget(transaction)(transformTxInfo),
      validateInput: validateInput(inputMget, createServiceName('mget')),
      validateResult: validateResult(resultSchema, createServiceName('mget')),
      dbQuery: pgData.mget,
    })({ db: pg, emitEvent }),

    search: search({
      transformInput: transformInputSearch,
      transformResult: transformResultSearch(
        compose(
          transaction,
          transformTxInfo
        )
      ),
      validateInput: validateInput(
        inputSearchSchema,
        createServiceName('search')
      ),
      validateResult: validateResult(resultSchema, createServiceName('search')),
      dbQuery: pgData.search,
    })({ db: pg, emitEvent }),
  };
};
