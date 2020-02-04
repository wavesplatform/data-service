import * as Router from 'koa-router';
import { AliasesService } from '../../services/aliases';
import { AliasesServiceMgetRequest } from '../../services/aliases';
import { alias } from '../../types';
import { createHttpHandler } from '../_common';
import {
  get as getSerializer,
  mget as mgetSerializer,
  search as searchSerializer,
} from '../_common/serialize';
import { get as parseGet, mgetOrSearch as parseMgetOrSearch } from './parse';

const subrouter: Router = new Router();

const isMgetRequest = (req: unknown): req is AliasesServiceMgetRequest =>
  typeof req === 'object' && req !== null && req.hasOwnProperty('ids');

export default ({ get, mget, search }: AliasesService): Router => {
  return subrouter
    .get(
      '/aliases/:id',
      createHttpHandler(req => get(req).map(getSerializer(alias)), parseGet)
    )
    .get(
      '/aliases',
      createHttpHandler(
        req =>
          isMgetRequest(req)
            ? mget(req).map(mgetSerializer(alias))
            : search(req).map(searchSerializer(alias)),
        parseMgetOrSearch
      )
    );
};
