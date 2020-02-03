import { Result, Error as error, Ok as ok } from 'folktale/result';
import { compose, defaultTo, isNil } from 'ramda';
import { ParseError } from '../../errorHandling';
import { parseFilterValues } from '../_common/filters';
import { Parser } from '../_common/filters/types';
import commonFilters from '../_common/filters/filters';
import { HttpRequest } from '../_common/types';
import {
  PairsGetRequest,
  PairsMgetRequest,
} from '../../services/pairs/repo/types';
import { PairsServiceSearchRequest } from '../../services/pairs';
import { parseArrayQuery, parseBool, parsePairs } from '../../utils/parsers';

import { loadConfig } from '../../loadConfig';
const options = loadConfig();

const matcherParser: Parser<string | undefined> = compose(
  commonFilters.query,
  defaultTo(options.matcher.defaultMatcherAddress)
);

export const get = ({
  params,
  query,
}: HttpRequest<['amountAsset', 'priceAsset']>): Result<
  ParseError,
  PairsGetRequest
> => {
  if (isNil(params)) {
    return error(new ParseError(new Error('Params is empty')));
  }

  if (isNil(query)) {
    return error(new ParseError(new Error('Query is empty')));
  }

  return parseFilterValues({
    matcher: matcherParser,
  })(query).chain(fValues => {
    if (isNil(fValues.matcher)) {
      return error(new ParseError(new Error('matcher is not set')));
    }

    return ok({
      matcher: fValues.matcher,
      pair: {
        amountAsset: params.amountAsset,
        priceAsset: params.priceAsset,
      },
    });
  });
};

export const mgetOrSearch = ({
  query,
}: HttpRequest): Result<
  ParseError,
  PairsMgetRequest | PairsServiceSearchRequest
> => {
  if (!query) {
    return error(new ParseError(new Error('Query is empty')));
  }

  return parseFilterValues({
    matcher: matcherParser,
    pairs: parsePairs,
    match_exactly: parseBool,
    search_by_asset: commonFilters.query,
    search_by_assets: parseArrayQuery,
  })(query).chain(fValues => {
    if (isNil(fValues.matcher)) {
      return error(new ParseError(new Error('matcher is not set')));
    }

    if (Array.isArray(fValues.pairs)) {
      return ok({ pairs: fValues.pairs, matcher: fValues.matcher });
    } else {
      if (fValues.search_by_asset) {
        return ok({
          matcher: fValues.matcher,
          sort: fValues.sort,
          limit: fValues.limit,
          match_exactly: fValues.match_exactly,
          search_by_asset: fValues.search_by_asset,
        });
      } else if (fValues.search_by_assets) {
        return ok({
          matcher: fValues.matcher,
          sort: fValues.sort,
          limit: fValues.limit,
          match_exactly: fValues.match_exactly,
          search_by_assets: fValues.search_by_assets,
        });
      } else {
        return ok({
          matcher: fValues.matcher,
          sort: fValues.sort,
          limit: fValues.limit,
        });
      }
    }
  });
};
