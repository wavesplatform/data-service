import * as Router from 'koa-router';
import { has, omit } from 'ramda';

import { PairsService } from '../../services/pairs';
import {
  PairsSearchRequest,
  PairsMgetRequest,
} from '../../services/pairs/repo/types';
import { pair, PairInfo, AssetIdsPair, Pair } from '../../types';
import { createHttpHandler } from '../_common';
import {
  get as getSerializer,
  mget as mgetSerializer,
  search as serachSerializer,
} from '../_common/serialize';
import { postToGet } from '../_common/postToGet';
import { get as parseGet, mgetOrSearch as parseMgetOrSearch } from './parse';

const subrouter = new Router();

const isMgetRequest = (
  req: PairsMgetRequest | PairsSearchRequest
): req is PairsMgetRequest => has('pairs', req);

export const pairWithData = (p: (PairInfo & AssetIdsPair) | null): Pair =>
  p
    ? pair(omit(['amountAsset', 'priceAsset'], p), {
        amountAsset: p.amountAsset,
        priceAsset: p.priceAsset,
      })
    : pair(null, null);

const mgetOrSearchHttpHandler = (pairsService: PairsService) =>
  createHttpHandler(
    (req, lsnFormat) =>
      isMgetRequest(req)
        ? pairsService
            .mget(req)
            .map(
              mgetSerializer<PairInfo & AssetIdsPair, Pair>(
                pairWithData,
                lsnFormat
              )
            )
        : pairsService
            .search(req)
            .map(serachSerializer(pairWithData, lsnFormat)),
    parseMgetOrSearch
  );

export default (pairsService: PairsService) =>
  subrouter
    .get(
      '/pairs/:amountAsset/:priceAsset',
      createHttpHandler(
        (req, lsnFormat) =>
          pairsService.get(req).map(getSerializer(pairWithData, lsnFormat)),
        parseGet
      )
    )
    .get('/pairs', mgetOrSearchHttpHandler(pairsService))
    .post('/pairs', postToGet(mgetOrSearchHttpHandler(pairsService)));
