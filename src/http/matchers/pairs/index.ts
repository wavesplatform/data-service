import * as Router from 'koa-router';

import { PairsService } from '../../../services/pairs';
import { PairInfo, AssetIdsPair, Pair } from '../../../types';
import { createHttpHandler } from '../../_common';
import {
  get as getSerializer,
  mget as mgetSerializer,
  search as searchSerializer,
} from '../../_common/serialize';
import { pairWithData, isMgetRequest } from '../../pairs';
import { get as parseGet, mgetOrSearch as parseMgetOrSearch } from './parse';
import { postToGet } from '../../_common/postToGet';

const subrouter = new Router();

const mgetOrSearchHttpHandler = (pairsService: PairsService) =>
  createHttpHandler(
    (req, lsnFormat) =>
      isMgetRequest(req)
        ? pairsService
            .mget(req)
            .map(
              mgetSerializer<PairInfo & AssetIdsPair, Pair, PairInfo>(
                pairWithData,
                lsnFormat
              )
            )
        : pairsService
            .search(req)
            .map(
              searchSerializer<PairInfo & AssetIdsPair, Pair, PairInfo>(
                pairWithData,
                lsnFormat
              )
            ),
    parseMgetOrSearch
  );

export default (pairsService: PairsService) =>
  subrouter
    .get(
      '/pairs/:amountAsset/:priceAsset',
      createHttpHandler(
        (req, lsnFormat) =>
          pairsService
            .get(req)
            .map(
              getSerializer<PairInfo & AssetIdsPair, Pair, PairInfo>(
                pairWithData,
                lsnFormat
              )
            ),
        parseGet
      )
    )
    .get('/pairs', mgetOrSearchHttpHandler(pairsService))
    .post('/pairs', postToGet(mgetOrSearchHttpHandler(pairsService)));
