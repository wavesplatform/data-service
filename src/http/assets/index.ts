import * as Router from 'koa-router';
import {
  AssetsServiceMgetRequest,
  AssetsServiceSearchRequest,
} from '../../services/assets';
import { AssetsService } from '../../services/assets';
import { asset } from '../../types';
import { createHttpHandler } from '../_common';
import { postToGet } from '../_common/postToGet';
import {
  get as serializeGet,
  mget as serializeMget,
  search as serializeSearch,
} from '../_common/serialize';
import { get as parseGet, mgetOrSearch as parseMgetOrSearch } from './parse';

const subrouter: Router = new Router();

const isMgetRequest = (
  req: AssetsServiceMgetRequest | AssetsServiceSearchRequest
): req is AssetsServiceMgetRequest => 'ids' in req && Array.isArray(req.ids);

const mgetOrSearchHandler = (assetsService: AssetsService) =>
  createHttpHandler(
    (req, lsnFormat) =>
      isMgetRequest(req)
        ? assetsService.mget(req).map(serializeMget(asset, lsnFormat))
        : assetsService.search(req).map(serializeSearch(asset, lsnFormat)),
    parseMgetOrSearch
  );

export default (assetsService: AssetsService): Router => {
  return subrouter
    .get(
      '/assets/:id',
      createHttpHandler(
        (req, lsnFormat) =>
          assetsService.get(req).map(serializeGet(asset, lsnFormat)),
        parseGet
      )
    )
    .get('/assets', mgetOrSearchHandler(assetsService))
    .post('/assets', postToGet(mgetOrSearchHandler(assetsService)));
};
