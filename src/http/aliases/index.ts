import * as Router from 'koa-router';
import { has } from 'ramda';
import { AliasesService } from '../../services/aliases';
import {
  AliasesServiceMgetRequest,
  AliasesServiceSearchRequest,
} from '../../services/aliases';
import { alias } from '../../types';
import { createHttpHandler } from '../_common';
import {
  get as getSerializer,
  mget as mgetSerializer,
  search as searchSerializer,
} from '../_common/serialize';
import { get as parseGet, mgetOrSearch as parseMgetOrSearch } from './parse';

const subrouter: Router = new Router();

const isMgetRequest = (
  req: AliasesServiceMgetRequest | AliasesServiceSearchRequest
): req is AliasesServiceMgetRequest => has('ids', req);

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
