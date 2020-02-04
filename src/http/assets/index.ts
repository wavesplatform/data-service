import * as Router from 'koa-router';
import { AssetsServiceMgetRequest } from '../../services/assets';
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

const isMgetRequest = (req: unknown): req is AssetsServiceMgetRequest =>
  typeof req === 'object' && req !== null && req.hasOwnProperty('ids');

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
