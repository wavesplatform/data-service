import * as Router from 'koa-router';
import { has } from 'ramda';

import { PairsService } from '../../services/pairs';
import {
  PairsSearchRequest,
  PairsMgetRequest,
} from '../../services/pairs/repo/types';
import { createHttpHandler } from '../_common';
import * as postToGet from '../utils/postToGet';
import { get as parseGet, mgetOrSearch as parseMgetOrSearch } from './parse';
import * as serialize from './serialize';

const subrouter = new Router();

const isMgetRequest = (
  req: PairsMgetRequest | PairsSearchRequest
): req is PairsMgetRequest => has('pairs', req);

const mgetOrSearchHttpHandler = (pairsService: PairsService) =>
  createHttpHandler(
    (req, lsnFormat) =>
      isMgetRequest(req)
        ? pairsService.mget(req).map(res => serialize.mget(res, lsnFormat))
        : pairsService.search(req).map(res => serialize.search(res, lsnFormat)),
    parseMgetOrSearch
  );

export default (pairsService: PairsService) =>
  subrouter
    .get(
      '/pairs/:amountAsset/:priceAsset',
      createHttpHandler(
        (req, lsnFormat) =>
          pairsService.get(req).map(res => serialize.get(res, lsnFormat)),
        parseGet
      )
    )
    .get('/pairs', mgetOrSearchHttpHandler(pairsService))
    .post('/pairs', postToGet(mgetOrSearchHttpHandler(pairsService)));
