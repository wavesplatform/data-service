import * as Router from 'koa-router';
import { has } from 'ramda';
import {
  AssetsServiceMgetRequest,
  AssetsServiceSearchRequest,
} from '../../services/assets';
import { AssetsService } from '../../services/assets';
import { asset } from '../../types';
import { createHttpHandler } from '../_common';
import {
  get as serializeGet,
  mget as serializeMget,
  search as serializeSearch,
} from '../_common/serialize';
import { get as parseGet, mgetOrSearch as parseMgetOrSearch } from './parse';

const subrouter: Router = new Router();

const isMgetRequest = (
  req: AssetsServiceMgetRequest | AssetsServiceSearchRequest
): req is AssetsServiceMgetRequest => has('ids', req);

export default ({ get, mget, search }: AssetsService): Router => {
  return subrouter
    .get(
      '/assets/:id',
      createHttpHandler(
        (req, lsnFormat) => get(req).map(serializeGet(asset, lsnFormat)),
        parseGet
      )
    )
    .get(
      '/assets',
      createHttpHandler(
        (req, lsnFormat) =>
          isMgetRequest(req)
            ? mget(req).map(serializeMget(asset, lsnFormat))
            : search(req).map(serializeSearch(asset, lsnFormat)),
        parseMgetOrSearch
      )
    );
};
