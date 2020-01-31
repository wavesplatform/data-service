import * as Router from 'koa-router';
import { has } from 'ramda';

import { PairsService } from '../../../services/pairs';
import {
  PairsSearchRequest,
  PairsMgetRequest,
} from '../../../services/pairs/repo/types';
import { createHttpHandler } from '../../_common';
import {
  get as getSerializer,
  mget as mgetSerializer,
  search as searchSerializer,
} from '../../_common/serialize';
import { pairWithoutData } from '../../pairs';
import {
  get as parseGet,
  mgetOrSearch as parseMgetOrSearch,
} from '../../pairs/parse';
import { postToGet } from '../../_common/postToGet';

const subrouter = new Router();

const isMgetRequest = (
  req: PairsMgetRequest | PairsSearchRequest
): req is PairsMgetRequest => has('pairs', req);

const mgetOrSearchHttpHandler = (pairsService: PairsService) =>
  createHttpHandler(
    (req, lsnFormat) =>
      isMgetRequest(req)
        ? pairsService.mget(req).map(mgetSerializer(pairWithoutData, lsnFormat))
        : pairsService
            .search(req)
            .map(searchSerializer(pairWithoutData, lsnFormat)),
    parseMgetOrSearch
  );

export default (pairsService: PairsService) =>
  subrouter
    .get(
      '/pairs/:amountAsset/:priceAsset',
      createHttpHandler(
        (req, lsnFormat) =>
          pairsService.get(req).map(getSerializer(pairWithoutData, lsnFormat)),
        parseGet
      )
    )
    .get('/pairs', mgetOrSearchHttpHandler(pairsService))
    .post('/pairs', postToGet(mgetOrSearchHttpHandler(pairsService)));
